const axios = require('axios');

exports.handler = async (event) => {
    const apiKey = process.env.API_KEY; // Netlify 환경 변수에서 가져옴
    const userName = event.queryStringParameters.userName;

    try {
        // 캐릭터 OUID 가져오기
        const idUrl = `https://open.api.nexon.com/ca/v1/id?user_name=${encodeURIComponent(userName)}&world_name=해피`;
        const idResponse = await axios.get(idUrl, { headers: { "x-nxopen-api-key": apiKey } });
        const idData = idResponse.data;

        // 기본 정보 가져오기
        const basicUrl = `https://open.api.nexon.com/ca/v1/user/basic?ouid=${idData.ouid}`;
        const basicResponse = await axios.get(basicUrl, { headers: { "x-nxopen-api-key": apiKey } });
        const basicData = basicResponse.data;

        // 장착 아이템 정보 가져오기
        const itemUrl = `https://open.api.nexon.com/ca/v1/user/item-equipment?ouid=${idData.ouid}`;
        const itemResponse = await axios.get(itemUrl, { headers: { "x-nxopen-api-key": apiKey } });
        const itemData = itemResponse.data;

        // 아바타 이미지 URL 추출 (item_equipment에서 아바타 아이템 찾기)
        let avatarUrl = null;
        if (itemData.item_equipment && itemData.item_equipment.length > 0) {
            const avatarItem = itemData.item_equipment.find(item => item.item_equipment_slot_name.includes('아바타'));
            avatarUrl = avatarItem ? avatarItem.item_icon_url : itemData.item_equipment[0].item_icon_url; // 기본값으로 첫 번째 아이템 사용
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ idData, basicData, itemData, avatarUrl }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

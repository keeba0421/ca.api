const axios = require('axios');
const cheerio = require('cheerio');

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
/*
        // 웹페이지에서 아바타와 레벨 이미지 URL 추출
        const profileUrl = `https://ca.nexon.com/MyBlock/Information/${encodeURIComponent(userName)}/0`;
        const profileResponse = await axios.get(profileUrl);
        const $ = cheerio.load(profileResponse.data);

        // 아바타 이미지 URL 추출
        const avatarImgSrc = $('.personal .avatar img').attr('src');

        // 레벨 이미지 URL 추출 (첫 번째 레벨 아이콘)
        const levelImgSrc = $('.personal .level_icon img').first().attr('src');
*/
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                idData, 
                basicData, 
                itemData, 
                avatarUrl: avatarImgSrc, 
                levelImgUrl: levelImgSrc 
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

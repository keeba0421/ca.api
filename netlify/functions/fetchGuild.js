const axios = require('axios');

exports.handler = async (event) => {
    const apiKey = process.env.API_KEY; // Netlify 환경 변수에서 API 키 가져오기
    const userName = event.queryStringParameters.userName;

    if (!userName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: '닉네임을 입력하세요' }),
        };
    }

    try {
        // 1. OUID 가져오기
        const idUrl = `https://open.api.nexon.com/ca/v1/id?user_name=${encodeURIComponent(userName)}&world_name=해피`;
        const idResponse = await axios.get(idUrl, {
            headers: { "x-nxopen-api-key": apiKey }
        });
        const idData = idResponse.data;

        if (!idData.ouid) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: '해당 닉네임을 찾을 수 없습니다' }),
            };
        }

        // 2. 길드 정보 가져오기
        const guildUrl = `https://open.api.nexon.com/ca/v1/user/guild?ouid=${idData.ouid}`;
        const guildResponse = await axios.get(guildUrl, {
            headers: { "x-nxopen-api-key": apiKey }
        });
        const guildData = guildResponse.data;

        // OUID와 길드 ID를 함께 반환
        return {
            statusCode: 200,
            body: JSON.stringify({
                ouid: idData.ouid,
                guild_id: guildData.guild_id
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

// netlify/functions/fetchData_dream.js
const axios = require('axios');

exports.handler = async (event) => {
    const apiKey = process.env.API_KEY; // Netlify 환경 변수에서 가져옴
    const userName = event.queryStringParameters.userName;

    try {
        const idUrl = `https://open.api.nexon.com/ca/v1/id?user_name=${encodeURIComponent(userName)}&world_name=드림`;
        const idResponse = await axios.get(idUrl, { headers: { "x-nxopen-api-key": apiKey } });
        const idData = idResponse.data;

        const basicUrl = `https://open.api.nexon.com/ca/v1/user/basic?ouid=${idData.ouid}`;
        const basicResponse = await axios.get(basicUrl, { headers: { "x-nxopen-api-key": apiKey } });
        const basicData = basicResponse.data;

        const itemUrl = `https://open.api.nexon.com/ca/v1/user/item-equipment?ouid=${idData.ouid}`;
        const itemResponse = await axios.get(itemUrl, { headers: { "x-nxopen-api-key": apiKey } });
        const itemData = itemResponse.data;

        return {
            statusCode: 200,
            body: JSON.stringify({ idData, basicData, itemData }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

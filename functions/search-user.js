const axios = require('axios');

exports.handler = async (event, context) => {
  const { userName } = JSON.parse(event.body);
  const apiKey = process.env.API_KEY;
  const headers = {
    "accept": "application/json",
    "x-nxopen-api-key": apiKey
  };

  try {
    // 1. OUID 가져오기
    const idUrl = `https://open.api.nexon.com/ca/v1/id?user_name=${encodeURIComponent(userName)}&world_name=해피`;
    const idResponse = await axios.get(idUrl, { headers });
    const idData = idResponse.data;

    // 2. 유저 기본 정보 가져오기
    const basicUrl = `https://open.api.nexon.com/ca/v1/user/basic?ouid=${idData.ouid}`;
    const basicResponse = await axios.get(basicUrl, { headers });
    const basicData = basicResponse.data;

    // 3. 장착 아이템 정보 가져오기
    const itemUrl = `https://open.api.nexon.com/ca/v1/user/item-equipment?ouid=${idData.ouid}`;
    const itemResponse = await axios.get(itemUrl, { headers });
    const itemData = itemResponse.data;

    return {
      statusCode: 200,
      body: JSON.stringify({ idData, basicData, itemData })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const nickname = event.queryStringParameters.nickname;
  if (!nickname) {
    return { statusCode: 400, body: '닉네임 필요' };
  }
  const targetUrl = `https://ca.nexon.com/MyBlock/Information/${encodeURIComponent(nickname)}/0`;

  try {
    const res = await fetch(targetUrl);
    const body = await res.text();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: '서버 에러',
    };
  }
};

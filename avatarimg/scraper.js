const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const url = event.queryStringParameters.url;
  
  if (!url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'URL이 필요합니다' }),
    };
  }

  try {
    // 웹페이지 요청
    const response = await fetch(url);
    const html = await response.text();
    
    // HTML 파싱
    const $ = cheerio.load(html);
    
    // 데이터 추출 (예시: 제목과 메타 정보)
    const data = {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content') || '',
      h1: $('h1').first().text().trim(),
      links: [],
    };
    
    // 링크 수집 (최대 10개)
    $('a[href]').slice(0, 10).each((i, element) => {
      const link = {
        text: $(element).text().trim(),
        href: $(element).attr('href'),
      };
      data.links.push(link);
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

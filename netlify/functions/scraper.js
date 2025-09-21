const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const url = event.queryStringParameters.url;
  const mode = event.queryStringParameters.mode || 'parsed'; // 'parsed' 또는 'raw'
  
  if (!url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'URL이 필요합니다' }),
    };
  }

  try {
    // 웹페이지 요청
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = await response.text();
    
    // raw 모드: 전체 HTML 반환
    if (mode === 'raw') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          html: html,
          url: url,
          contentLength: html.length,
          timestamp: new Date().toISOString()
        }),
      };
    }
    
    // parsed 모드: 기존 파싱 방식
    const $ = cheerio.load(html);
    
    const data = {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content') || '',
      h1: $('h1').first().text().trim(),
      links: [],
      html: html, // 전체 HTML도 함께 포함
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

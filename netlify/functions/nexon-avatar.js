const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
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

  const nickname = event.queryStringParameters.nickname;
  
  if (!nickname) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: '닉네임이 필요합니다' }),
    };
  }

  const url = `https://ca.nexon.com/MyBlock/Information/${encodeURIComponent(nickname)}/0`;

  try {
    // 랜덤 지연 시간 (1-2초)
    const delay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Referer': 'https://ca.nexon.com/',
        'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      },
      timeout: 15000
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      switch(response.status) {
        case 403:
          errorMessage += ': 넥슨에서 접근을 차단했습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 404:
          errorMessage += ': 해당 닉네임을 찾을 수 없습니다.';
          break;
        case 429:
          errorMessage += ': 너무 많은 요청입니다. 잠시 후 다시 시도해주세요.';
          break;
        default:
          errorMessage += ': 페이지를 불러올 수 없습니다.';
      }
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: errorMessage,
          nickname: nickname,
          searchedUrl: url
        }),
      };
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // 아바타 이미지 추출 - 여러 선택자 시도
    let avatarUrl = '';
    const avatarSelectors = [
      '.personal .avatar img',
      '.avatar img',
      'img[src*="caavatarimg.nexon.com"]',
      'img[src*="caavatarimg"]',
      '.character-info img',
      '.profile-avatar img',
      '.player-avatar img',
      '.user-avatar img',
      'img[alt*="아바타"]',
      'img[alt*="avatar"]',
      '.profile-image img',
      '.character-image img'
    ];
    
    for (const selector of avatarSelectors) {
      const imgElements = $(selector);
      imgElements.each((index, element) => {
        const src = $(element).attr('src');
        if (src && src.includes('caavatarimg')) {
          // 상대 경로인 경우 절대 경로로 변환
          avatarUrl = src.startsWith('http') ? src : `https:${src}`;
          return false; // break each loop
        }
      });
      
      if (avatarUrl) break;
    }
    
    // 플레이어 이름 추출 (선택사항)
    const playerName = $('.player-name, .nickname, .user-name, h1').first().text().trim();
    
    if (!avatarUrl) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: '아바타 이미지를 찾을 수 없습니다. 해당 닉네임이 존재하는지 확인해주세요.',
          nickname: nickname,
          playerName: playerName || null,
          searchedUrl: url,
          suggestion: '브라우저에서 직접 해당 URL에 접속하여 프로필이 존재하는지 확인해보세요.'
        }),
      };
    }

    const result = {
      success: true,
      nickname: nickname,
      playerName: playerName || nickname,
      avatarUrl: avatarUrl,
      sourceUrl: url,
      timestamp: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
    
  } catch (error) {
    let errorMessage = '아바타 이미지를 가져오는 중 오류가 발생했습니다';
    let suggestion = '잠시 후 다시 시도해주세요.';
    
    if (error.message.includes('timeout')) {
      errorMessage = '요청 시간이 초과되었습니다.';
      suggestion = '넥슨 서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = '넥슨 서버에 연결할 수 없습니다.';
      suggestion = '인터넷 연결을 확인해주세요.';
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: `${errorMessage}: ${error.message}`,
        suggestion: suggestion,
        nickname: nickname,
        searchedUrl: url
      }),
    };
  }
};

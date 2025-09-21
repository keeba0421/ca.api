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
    // 웹페이지 요청 (User-Agent 설정으로 차단 방지)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: 페이지를 불러올 수 없습니다`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // 아바타 이미지 추출
    let avatarUrl = '';
    
    // 여러 가능한 아바타 이미지 위치 시도
    const avatarSelectors = [
      '.personal .avatar img',
      '.avatar img',
      'img[src*="caavatarimg"]',
      '.character-info img',
      '.profile-avatar img'
    ];
    
    for (const selector of avatarSelectors) {
      const imgElement = $(selector);
      if (imgElement.length > 0) {
        avatarUrl = imgElement.attr('src');
        if (avatarUrl && avatarUrl.includes('caavatarimg')) {
          break;
        }
      }
    }
    
    // 승부 기록 추출
    const gameStats = {
      wins: null,
      losses: null,
      draws: null,
      winRate: null
    };
    
    // dl.average에서 승부 기록 추출
    const averageDl = $('dl.average');
    if (averageDl.length > 0) {
      const dtElements = averageDl.find('dt');
      const ddElements = averageDl.find('dd');
      
      dtElements.each((index, element) => {
        const label = $(element).text().trim();
        const value = ddElements.eq(index).text().trim();
        
        switch(label) {
          case '승':
            gameStats.wins = value;
            break;
          case '패':
            gameStats.losses = value;
            break;
          case '무':
            gameStats.draws = value;
            break;
          case '승률':
            gameStats.winRate = value;
            break;
        }
      });
    }
    
    // 추가 정보 추출
    const playerName = $('.player-name, .nickname, h1').first().text().trim() || nickname;
    const level = $('.level, .player-level').text().trim();
    const guild = $('.guild, .guild-name').text().trim();

    const result = {
      success: true,
      nickname: nickname,
      playerName: playerName,
      level: level,
      guild: guild,
      avatarUrl: avatarUrl,
      gameStats: gameStats,
      sourceUrl: url,
      timestamp: new Date().toISOString()
    };
    
    // 데이터 검증
    if (!avatarUrl && !gameStats.wins) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: '해당 닉네임의 프로필을 찾을 수 없습니다. 닉네임을 확인해주세요.',
          searchedUrl: url
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
    
  } catch (error) {
    console.error('Error fetching Nexon profile:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: `프로필을 가져오는 중 오류가 발생했습니다: ${error.message}`,
        searchedUrl: url
      }),
    };
  }
};

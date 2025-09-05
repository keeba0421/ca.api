async function fetchAvatar(nickname) {
  // 서버 프록시 URL (자신의 프록시 서버 주소로 변경 필요)
  const proxyUrl = `https://your-proxy-server.com/proxy/avatar?nickname=${encodeURIComponent(nickname)}`;

  document.getElementById('consoleBox').innerText = `[진행] 프록시 서버에 요청 중...`;

  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) {
      document.getElementById('consoleBox').innerText = `[에러] 프록시 서버 응답 오류: ${res.status}`;
      return null;
    }
    const html = await res.text();
    document.getElementById('consoleBox').innerText = `[진행] HTML 코드 수신, 이미지 추출 중...`;

    // 아바타 GIF 이미지 URL 정규표현식 매칭
    const regex = /https:\/\/caavatarimg\.nexon\.com\/[^\s"']+\.gif/g;
    const matches = html.match(regex);

    if (!matches) {
      document.getElementById('consoleBox').innerText = `[실패] 아바타 이미지 URL을 찾을 수 없습니다.`;
      return null;
    }

    document.getElementById('consoleBox').innerText = `[성공] 이미지 URL 추출 완료: ${matches[0]}`;
    return matches[0];
  } catch (error) {
    document.getElementById('consoleBox').innerText = `[에러] 요청 실패: ${error.message}`;
    return null;
  }
}

document.getElementById('searchForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const nickname = document.getElementById('nickname').value.trim();

  // 초기화 및 로딩 메시지
  document.getElementById('avatarBox').innerHTML = '잠시만 기다려주세요...';
  document.getElementById('urlBox').innerText = '';
  document.getElementById('consoleBox').innerText = '';

  if (!nickname) {
    document.getElementById('consoleBox').innerText = '[에러] 닉네임을 입력하세요.';
    document.getElementById('avatarBox').innerHTML = '';
    return;
  }

  // 아바타 이미지 URL 추출 함수 호출
  const avatarUrl = await fetchAvatar(nickname);

  if (avatarUrl) {
    document.getElementById('avatarBox').innerHTML = `<img src="${avatarUrl}" alt="아바타 이미지" style="max-width: 200px; max-height: 220px;">`;
    document.getElementById('urlBox').innerText = avatarUrl;
  } else {
    document.getElementById('avatarBox').innerHTML = '아바타 이미지를 찾을 수 없습니다.';
    document.getElementById('urlBox').innerText = '';
  }
});

async function fetchAvatar(nickname) {
  const url = `https://ca.nexon.com/MyBlock/Information/${encodeURIComponent(nickname)}/0`;
  document.getElementById('consoleBox').innerText = `[진행] 크아 마이블럭 페이지 요청 중...`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      document.getElementById('consoleBox').innerText = `[에러] HTTP 오류: ${res.status}`;
      return null;
    }
    const html = await res.text();
    document.getElementById('consoleBox').innerText = `[진행] HTML 코드 불러옴, 이미지 추출 중...`;

    // 아바타 GIF 정규표현식 추출
    const regex = /https:\/\/caavatarimg\.nexon\.com\/[^\s"']+\.gif/g;
    const matches = html.match(regex);

    if (!matches) {
      document.getElementById('consoleBox').innerText = `[실패] 아바타 이미지 패턴 없음`;
      return null;
    }
    document.getElementById('consoleBox').innerText = `[성공] 이미지 URL: ${matches[0]}`;
    return matches[0];
  } catch (e) {
    document.getElementById('consoleBox').innerText = `[에러] ${e}`;
    return null;
  }
}

document.getElementById('searchForm').addEventListener('submit', async e => {
  e.preventDefault();
  const nickname = document.getElementById('nickname').value.trim();
  document.getElementById('avatarBox').innerHTML = '잠시만 기다려주세요...';

  const avatarUrl = await fetchAvatar(nickname);

  if (avatarUrl) {
    document.getElementById('avatarBox').innerHTML = `<img src="${avatarUrl}" alt="아바타 이미지" style="max-width:200px; max-height:220px;">`;
  } else {
    document.getElementById('avatarBox').innerHTML = '아바타 이미지를 찾을 수 없습니다.';
  }
});

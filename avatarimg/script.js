// 아바타 이미지를 자동으로 찾는 함수
async function fetchAvatar(nickname) {
  const url = `https://ca.nexon.com/MyBlock/Information/${encodeURIComponent(nickname)}/0`;

  // 이미지를 포함하는 주소 파싱은 서버에서 해야 안전함(보안/크로스도메인 제한 때문)
  // 여기서는 img 태그의 src가 caavatarimg.nexon.com 포함되어 있다고 가정하고 fetch → text → 정규식으로 처리
  const html = await fetch(url)
    .then(res => res.text())
    .catch(() => null);

  if (!html) return null;
  // 아바타 이미지 URL 추출 (정규식)
  const regex = /https:\/\/caavatarimg\.nexon\.com\/[^\s"']+\.gif/g;
  const matches = html.match(regex);
  return matches ? matches : null; // 첫번째 이미지만 사용
}

document.getElementById('searchForm').addEventListener('submit', async e => {
  e.preventDefault();
  const nickname = document.getElementById('nickname').value.trim();
  document.getElementById('result').innerHTML = '검색중...';
  const avatarUrl = await fetchAvatar(nickname);

  if (avatarUrl) {
    document.getElementById('result').innerHTML = `
      <img src="${avatarUrl}" alt="아바타 이미지" style="border:1px solid #555; max-width:200px;">
      <p><a href="${avatarUrl}" target="_blank">${avatarUrl}</a></p>
    `;
  } else {
    document.getElementById('result').innerHTML = '이미지를 찾을 수 없습니다.';
  }
});

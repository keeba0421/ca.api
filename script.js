async function searchUser() {
    // 입력값 가져오기
    const nicknameInput = document.getElementById('nickname');
    let userName = nicknameInput.value.trim();

    // 대문자를 소문자로 변환
    userName = userName.toLowerCase();

    // 결과창 초기화
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // 입력값 검증
    if (userName === '') {
        resultDiv.innerHTML = '<p style="color: red;">오류: 닉네임을 입력하세요.</p>';
        return;
    }

    // API 키 설정 (실제 API 키로 대체 필요)
    const apiKey = "your_api_key_here"; // 여기에 실제 API 키를 입력하세요
    const headers = {
        "accept": "application/json",
        "x-nxopen-api-key": apiKey
    };

    try {
        // API 호출 (Nexon API 예시)
        const url = `https://open.api.nexon.com/ca/v1/id?user_name=${encodeURIComponent(userName)}&world_name=해피`;
        const response = await fetch(url, { headers });

        // 응답 상태 확인
        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
        }

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
    }
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    let html = '<h2>검색 결과</h2>';
    html += `<p>유저 이름: ${data.user_name || '정보 없음'}</p>`;
    resultDiv.innerHTML = html;
}

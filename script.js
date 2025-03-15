// script.js
async function searchUser() {
    const nicknameInput = document.getElementById('nickname');
    let userName = nicknameInput.value.trim();

    // 대문자를 소문자로 변환
    userName = userName.toLowerCase();

    // 결과를 화면에 표시하기 위해 UTF-8 인코딩된 값을 로그로 확인
    console.log(`입력된 유저 닉네임: '${userName}'`);

    // API 호출 예시 (Nexon API를 가정)
    const apiKey = "testapi"; // 실제 API 키로 대체하세요
    const headers = {
        "accept": "application/json",
        "x-nxopen-api-key": "test_c23aa4b3679c9dc52214856752d895edb607ed3d30af633807b946b8e49680ecefe8d04e6d233bd35cf2fabdeb93fb0d"
    };

    try {
        // UTF-8 인코딩으로 URL에 닉네임 포함
        const url = `https://open.api.nexon.com/ca/v1/id?user_name=${encodeURIComponent(userName)}&world_name=해피`;
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
        }

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        document.getElementById('result').innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
    }
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    let html = '<h2>검색 결과</h2>';
    html += `<p>유저 이름: ${data.user_name || '정보 없음'}</p>`;
    resultDiv.innerHTML = html;
}

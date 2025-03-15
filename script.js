// script.js
async function searchUser() {
    const nicknameInput = document.getElementById('nickname');
    let userName = nicknameInput.value.trim();

    // 대문자를 소문자로 변환
    userName = userName.toLowerCase();

    // 결과를 화면에 표시하기 위해 입력값 확인
    console.log(`입력된 유저 닉네임: '${userName}'`);

    // API 키 설정
    const apiKey = "test_c23aa4b3679c9dc52214856752d895edb607ed3d30af633807b946b8e49680ecefe8d04e6d233bd35cf2fabdeb93fb0d";
    const headers = {
        "accept": "application/json",
        "x-nxopen-api-key": apiKey
    };

    try {
        // API 호출 URL (Nexon API 가정)
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

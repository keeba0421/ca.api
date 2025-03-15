async function searchUser() {
    const nicknameInput = document.getElementById('nickname');
    let userName = nicknameInput.value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (userName === '') {
        resultDiv.innerHTML = '<p style="color: red;">오류: 닉네임을 입력하세요.</p>';
        return;
    }

    const apiKey = "test_c23aa4b3679c9dc52214856752d895edb607ed3d30af633807b946b8e49680ecefe8d04e6d233bd35cf2fabdeb93fb0d";
    const headers = {
        "accept": "application/json",
        "x-nxopen-api-key": apiKey
    };

    try {
        const url = `https://open.api.nexon.com/ca/v1/id?user_name=${encodeURIComponent(userName)}&world_name=해피`;
        const response = await fetch(url, { headers });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API 호출 실패: ${response.status} - ${errorText}`);
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
    if (data && data.ocid) {
        html += `<p>유저 이름: ${data.user_name || '정보 없음'}</p>`;
        html += `<p>OCID: ${data.ocid}</p>`;
    } else {
        html += '<p>결과가 없습니다.</p>';
    }
    resultDiv.innerHTML = html;
}

// 버튼에 이벤트 리스너 추가
document.getElementById('searchButton').addEventListener('click', searchUser);

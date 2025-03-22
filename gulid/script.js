document.getElementById('searchButton').addEventListener('click', async () => {
    const nicknameInput = document.getElementById('nickname');
    const userName = nicknameInput.value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (userName === '') {
        resultDiv.innerHTML = '<p style="color: red;">오류: 닉네임을 입력하세요.</p>';
        return;
    }

    try {
        const response = await fetch(`/.netlify/functions/fetchGuild?userName=${encodeURIComponent(userName)}`);
        const data = await response.json();

        if (response.ok) {
            displayResult(data);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('에러 발생:', error);
        resultDiv.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
    }
});

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    let html = '<h2>검색 결과</h2>';

    if (data.guild_id) {
        html += '<h3>길드 정보</h3>';
        html += `<p><strong>길드 ID:</strong> ${data.guild_id}</p>`;
    } else {
        html += '<p>길드 정보가 없습니다.</p>';
    }

    resultDiv.innerHTML = html;
}

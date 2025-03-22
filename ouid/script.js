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

    if (data.ouid) {
        html += '<h3>OUID 정보</h3>';
        html += `<p><strong>OUID:</strong> <span id="ouid-text">${data.ouid}</span> `;
        html += `<button class="copy-button" onclick="copyOuid()">복사</button></p>`;
    } else {
        html += '<p>OUID 정보가 없습니다.</p>';
    }

    resultDiv.innerHTML = html;
}

function copyOuid() {
    const ouidText = document.getElementById('ouid-text').innerText;
    navigator.clipboard.writeText(ouidText)
        .then(() => {
            alert('OUID가 클립보드에 복사되었습니다!');
        })
        .catch((error) => {
            console.error('복사 실패:', error);
            alert('복사에 실패했습니다.');
        });
}

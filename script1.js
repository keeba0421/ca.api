// script1.js
async function searchUser() {
    const nicknameInput = document.getElementById('nickname');
    let userName = nicknameInput.value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (userName === '') {
        resultDiv.innerHTML = '<p style="color: red;">오류: 닉네임을 입력하세요.</p>';
        return;
    }

    try {
        const response = await fetch(`/.netlify/functions/fetchData?userName=${encodeURIComponent(userName)}`);
        const data = await response.json();

        if (response.ok) {
            displayResult(data.idData, data.basicData, data.itemData, userName);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("에러 발생:", error);
        resultDiv.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
    }
}

document.getElementById('searchButton').addEventListener('click', searchUser);

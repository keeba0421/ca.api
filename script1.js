// script1.js
function displayResult(idData, basicData, itemData, userName) {
    console.log('displayResult 호출됨:', { idData, basicData, itemData, userName }); // 디버깅 로그
    const resultDiv = document.getElementById('result');
    if (!resultDiv) {
        console.error('result 요소를 찾을 수 없습니다.');
        return;
    }

    let html = '<h2>검색 결과</h2>';

    if (basicData) {
        html += '<h3>유저 기본 정보</h3>';
        html += `<p><strong>이름:</strong> ${basicData.user_name}</p>`;
        html += `<p><strong>계정 생성일:</strong> ${new Date(basicData.user_date_create).toLocaleString()}</p>`;
        html += `<p><strong>마지막 로그인:</strong> ${new Date(basicData.user_date_last_login).toLocaleString()}</p>`;
        html += `<p><strong>마지막 로그아웃:</strong> ${new Date(basicData.user_date_last_logout).toLocaleString()}</p>`;
        html += `<p><strong>경험치:</strong> ${basicData.user_exp}</p>`;
        html += `<p><strong>레벨:</strong> ${basicData.user_level}</p>`;
        html += `<p><a href="https://ca.nexon.com/MyBlock/Information/${encodeURIComponent(userName)}/0" target="_blank">공식홈페이지 프로필 바로가기</a></p>`;
    }
        //html += '<a href="이동할 웹페이지 url">공식홈페이지 프로필 바로가기</a>';
  else {
        html += '<p>유저 기본 정보가 없습니다.</p>';
    }

    if (itemData && itemData.item_equipment && itemData.item_equipment.length > 0) {
        html += '<h3>장착 아이템</h3>';
        html += '<ul>';
        itemData.item_equipment.forEach(item => {
            html += `<li><strong>${item.item_equipment_slot_name}:</strong> ${item.item_name}</li>`;
        });
        html += '</ul>';
    } else {
        html += '<p>장착 아이템 정보가 없습니다.</p>';
    }

    resultDiv.innerHTML = html;
}

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
        console.log('API 응답:', data); // 디버깅 로그

        if (response.ok) {
            displayResult(data.idData, data.basicData, data.itemData, userName);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('에러 발생:', error);
        resultDiv.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
    }
}

document.getElementById('searchButton').addEventListener('click', searchUser);

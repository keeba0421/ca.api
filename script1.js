function displayResult(idData, basicData, itemData, userName, avatarUrl) {
    console.log('displayResult 호출됨:', { idData, basicData, itemData, userName, avatarUrl });
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
    } else {
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

    // 아바타 이미지 표시
    const avatarDisplay = document.getElementById('avatar-display');
    if (avatarDisplay && avatarUrl) {
        avatarDisplay.style.backgroundImage = `url(${avatarUrl})`;
    } else {
        console.error('avatar-display 요소를 찾을 수 없거나 avatarUrl이 없습니다.');
    }
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
        console.log('API 응답:', data);

        if (response.ok) {
            displayResult(data.idData, data.basicData, data.itemData, userName, data.avatarUrl);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('에러 발생:', error);
        resultDiv.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
    }
}

document.getElementById('searchButton').addEventListener('click', searchUser);

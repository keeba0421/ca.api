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
        // 1. OUID 가져오기
        const idUrl = `https://open.api.nexon.com/ca/v1/id?user_name=${encodeURIComponent(userName)}&world_name=해피`;
        const idResponse = await fetch(idUrl, { headers });
        if (!idResponse.ok) {
            const errorText = await idResponse.text();
            throw new Error(`ID API 호출 실패: ${idResponse.status} - ${errorText}`);
        }
        const idData = await idResponse.json();
        const ouid = idData.ouid;

        // 2. 유저 기본 정보 가져오기
        const basicUrl = `https://open.api.nexon.com/ca/v1/user/basic?ouid=${ouid}`;
        const basicResponse = await fetch(basicUrl, { headers });
        if (!basicResponse.ok) {
            const errorText = await basicResponse.text();
            throw new Error(`기본 정보 API 호출 실패: ${basicResponse.status} - ${errorText}`);
        }
        const basicData = await basicResponse.json();

        // 3. 장착 아이템 정보 가져오기
        const itemUrl = `https://open.api.nexon.com/ca/v1/user/item-equipment?ouid=${ouid}`;
        const itemResponse = await fetch(itemUrl, { headers });
        if (!itemResponse.ok) {
            const errorText = await itemResponse.text();
            throw new Error(`아이템 API 호출 실패: ${itemResponse.status} - ${errorText}`);
        }
        const itemData = await itemResponse.json();

        // 결과 표시
        displayResult(idData, basicData, itemData, userName);
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
    }
}

function displayResult(idData, basicData, itemData, userName) {
    const resultDiv = document.getElementById('result');
    let html = '<h2>검색 결과</h2>';

    // 1. OUID 표시
    if (idData && idData.ouid) {
        html += `<p><strong>OUID:</strong> ${idData.ouid}</p>`;
    } else {
        html += '<p>OUID 정보가 없습니다.</p>';
    }

    // 2. 유저 기본 정보 표시
    if (basicData) {
        html += '<h3>유저 기본 정보</h3>';
        html += `<p><strong>유저 이름:</strong> ${userName} (API에서 제공되지 않음)</p>`;
        html += `<p><strong>계정 생성일:</strong> ${new Date(basicData.user_date_create).toLocaleString()}</p>`;
        html += `<p><strong>마지막 로그인:</strong> ${new Date(basicData.user_date_last_login).toLocaleString()}</p>`;
        html += `<p><strong>마지막 로그아웃:</strong> ${new Date(basicData.user_date_last_logout).toLocaleString()}</p>`;
        html += `<p><strong>경험치:</strong> ${basicData.user_exp}</p>`;
        html += `<p><strong>레벨:</strong> ${basicData.user_level}</p>`;
    } else {
        html += '<p>유저 기본 정보가 없습니다.</p>';
    }

    // 3. 장착 아이템 정보 표시
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

// 버튼에 이벤트 리스너 추가
document.getElementById('searchButton').addEventListener('click', searchUser);

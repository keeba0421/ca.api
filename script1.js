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
        console.log("ID 요청 URL:", idUrl);
        const idResponse = await fetch(idUrl, { headers });
        if (!idResponse.ok) {
            const errorText = await idResponse.text();
            throw new Error(`ID API 호출 실패: ${idResponse.status} - ${errorText}`);
        }
        const idData = await idResponse.json();
        console.log("idData:", idData);

        // 2. 유저 기본 정보 가져오기
        const basicUrl = `https://open.api.nexon.com/ca/v1/user/basic?ouid=${idData.ouid}`;
        console.log("Basic 요청 URL:", basicUrl);
        const basicResponse = await fetch(basicUrl, { headers });
        if (!basicResponse.ok) {
            const errorText = await basicResponse.text();
            throw new Error(`기본 정보 API 호출 실패: ${basicResponse.status} - ${errorText}`);
        }
        const basicData = await basicResponse.json();
        console.log("basicData:", basicData);

        // 3. 장착 아이템 정보 가져오기
        const itemUrl = `https://open.api.nexon.com/ca/v1/user/item-equipment?ouid=${idData.ouid}`;
        console.log("Item 요청 URL:", itemUrl);
        const itemResponse = await fetch(itemUrl, { headers });
        if (!itemResponse.ok) {
            const errorText = await itemResponse.text();
            throw new Error(`아이템 API 호출 실패: ${itemResponse.status} - ${errorText}`);
        }
        const itemData = await itemResponse.json();
        console.log("itemData:", itemData);

        // 결과 표시
        console.log("displayResult 호출 전 데이터:", { idData, basicData, itemData });
        displayResult(idData, basicData, itemData, userName);
    } catch (error) {
        console.error("에러 발생:", error);
        resultDiv.innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
    }
}

function displayResult(idData, basicData, itemData, userName) {
    console.log("displayResult 호출됨");
    const resultDiv = document.getElementById('result');
    let html = '<h2>검색 결과</h2>';

    if (idData && idData.ouid) {
        console.log("ouid 존재:", idData.ouid);
        html += `<p><strong>OUID:</strong> ${idData.ouid}</p>`;
    } else {
        console.log("ouid 없음");
        html += '<p>OUID 정보가 없습니다.</p>';
    }

    if (basicData) {
        console.log("basicData 존재:", basicData);
        html += '<h3>유저 기본 정보</h3>';
        html += `<p><strong>유저 이름:</strong> ${userName} (API에서 제공되지 않음)</p>`;
        html += `<p><strong>계정 생성일:</strong> ${new Date(basicData.user_date_create).toLocaleString()}</p>`;
        html += `<p><strong>마지막 로그인:</strong> ${new Date(basicData.user_date_last_login).toLocaleString()}</p>`;
        html += `<p><strong>마지막 로그아웃:</strong> ${new Date(basicData.user_date_last_logout).toLocaleString()}</p>`;
        html += `<p><strong>경험치:</strong> ${basicData.user_exp}</p>`;
        html += `<p><strong>레벨:</strong> ${basicData.user_level}</p>`;
    } else {
        console.log("basicData 없음");
        html += '<p>유저 기본 정보가 없습니다.</p>';
    }

    if (itemData && itemData.item_equipment && itemData.item_equipment.length > 0) {
        console.log("itemData 존재:", itemData);
        html += '<h3>장착 아이템</h3>';
        html += '<ul>';
        itemData.item_equipment.forEach(item => {
            html += `<li><strong>${item.item_equipment_slot_name}:</strong> ${item.item_name}</li>`;
        });
        html += '</ul>';
    } else {
        console.log("itemData 없음");
        html += '<p>장착 아이템 정보가 없습니다.</p>';
    }

    resultDiv.innerHTML = html;
}

// 버튼에 이벤트 리스너 추가
document.getElementById('searchButton').addEventListener('click', searchUser);

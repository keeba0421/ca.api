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
}

async function fetchAndDisplayUserData(userName) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // 이전 결과 초기화
    
    // URL에 닉네임이 있을 경우 입력창에 닉네임을 채워넣음
    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput && userName) {
        nicknameInput.value = userName;
    }

    if (!userName || userName === '') {
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

function handleSearch() {
    const nicknameInput = document.getElementById('nickname');
    let userName = nicknameInput.value.trim().toLowerCase();
    if (userName) {
        // 닉네임이 있으면 /u/닉네임 경로로 이동
        window.location.href = `/u/${encodeURIComponent(userName)}`;
    } else {
        // 닉네임이 없으면 오류 메시지 표시
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '<p style="color: red;">오류: 닉네임을 입력하세요.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 현재 URL의 경로를 확인
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean); // 빈 문자열 제거
    
    // URL이 /u/닉네임 형식인지 확인
    if (pathSegments.length === 2 && pathSegments[0] === 'u') {
        const userNameFromUrl = decodeURIComponent(pathSegments[1]);
        fetchAndDisplayUserData(userNameFromUrl);
    }

    // 기존 검색 버튼 및 엔터 키 이벤트 리스너 설정
    const nicknameInput = document.getElementById('nickname');
    const searchButton = document.getElementById('searchButton');
    
    if (nicknameInput) {
        nicknameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
});

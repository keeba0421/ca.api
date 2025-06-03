// 크레이지 아케이드 캐릭터 조회 - 개선된 JavaScript

// 전역 변수
let isSearching = false;

// DOM 요소 참조
const nicknameInput = document.getElementById('nickname');
const searchButton = document.getElementById('searchButton');
const resultDiv = document.getElementById('result');

// 로딩 상태 관리 함수
function setLoadingState(isLoading) {
    isSearching = isLoading;
    
    if (isLoading) {
        searchButton.classList.add('loading');
        searchButton.disabled = true;
        searchButton.textContent = '검색 중...';
        nicknameInput.disabled = true;
        
        // 로딩 스피너 표시
        showLoadingSpinner();
    } else {
        searchButton.classList.remove('loading');
        searchButton.disabled = false;
        searchButton.textContent = '검색';
        nicknameInput.disabled = false;
    }
}

// 로딩 스피너 표시
function showLoadingSpinner() {
    resultDiv.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: var(--text-secondary);">캐릭터 정보를 불러오는 중...</p>
        </div>
    `;
}

// 에러 메시지 표시
function showError(message) {
    resultDiv.innerHTML = `
        <div class="error-message">
            <strong>오류 발생:</strong> ${message}
        </div>
    `;
}

// 성공 메시지 표시
function showSuccess(message) {
    resultDiv.innerHTML = `
        <div class="success-message">
            ${message}
        </div>
    `;
}

// 입력값 검증 함수
function validateInput(userName) {
    if (!userName || userName.trim() === '') {
        showError('닉네임을 입력해주세요.');
        return false;
    }
    
    if (userName.length < 2) {
        showError('닉네임은 2글자 이상 입력해주세요.');
        return false;
    }
    
    if (userName.length > 20) {
        showError('닉네임은 20글자 이하로 입력해주세요.');
        return false;
    }
    
    return true;
}

// 개선된 결과 표시 함수
function displayResult(idData, basicData, itemData, userName) {
    let html = '';
    
    // 캐릭터 기본 정보 표시
    if (basicData && basicData.character_name) {
        html += `
            <div class="character-info">
                <h3>🎮 캐릭터 기본 정보</h3>
                <div class="character-details">
                    <div class="detail-item">
                        <span class="detail-label">캐릭터명</span>
                        <span class="detail-value">${basicData.character_name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">레벨</span>
                        <span class="detail-value">${basicData.character_level || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">경험치</span>
                        <span class="detail-value">${basicData.character_exp ? basicData.character_exp.toLocaleString() : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">길드</span>
                        <span class="detail-value">${basicData.character_guild_name || '길드 없음'}</span>
                    </div>
                </div>
                <div style="margin-top: 1rem; text-align: center;">
                    <a href="https://ca.nexon.com/ca/characterinfo/1-happy?name=${encodeURIComponent(basicData.character_name)}" 
                       target="_blank" 
                       class="profile-link">
                        🔗 공식홈페이지 프로필 바로가기
                    </a>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="character-info">
                <h3>❌ 캐릭터 정보</h3>
                <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    유저 기본 정보가 없습니다.<br>
                    닉네임을 다시 확인해주세요.
                </p>
            </div>
        `;
    }
    
    // 장착 아이템 정보 표시
    if (itemData && itemData.item_equipment && itemData.item_equipment.length > 0) {
        html += `
            <div class="character-info equipment-section">
                <h3>⚔️ 장착 아이템 (${itemData.item_equipment.length}개)</h3>
                <div class="equipment-grid">
        `;
        
        itemData.item_equipment.forEach(item => {
            html += `
                <div class="equipment-item">
                    <div class="equipment-slot">${item.item_equipment_slot_name}</div>
                    <div class="equipment-name">${item.item_name}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="character-info equipment-section">
                <h3>⚔️ 장착 아이템</h3>
                <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    장착 아이템 정보가 없습니다.
                </p>
            </div>
        `;
    }
    
    resultDiv.innerHTML = html;
    
    // 결과가 표시된 후 스크롤 이동
    setTimeout(() => {
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// 개선된 사용자 검색 함수
async function searchUser() {
    // 이미 검색 중인 경우 방지
    if (isSearching) {
        return;
    }
    
    const userName = nicknameInput.value.trim().toLowerCase();
    
    // 결과 영역 초기화
    resultDiv.innerHTML = '';
    
    // 입력값 검증
    if (!validateInput(userName)) {
        return;
    }
    
    // 로딩 상태 시작
    setLoadingState(true);
    
    try {
        console.log('🔍 검색 시작:', userName);
        
        // API 요청
        const response = await fetch(`/.netlify/functions/fetchData?userName=${encodeURIComponent(userName)}`);
        
        // 응답 상태 확인
        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📊 API 응답:', data);
        
        // 성공적인 응답 처리
        if (data.error) {
            throw new Error(data.error);
        }
        
        // 결과 표시
        displayResult(data.idData, data.basicData, data.itemData, userName);
        
        console.log('✅ 검색 완료');
        
    } catch (error) {
        console.error('❌ 에러 발생:', error);
        
        // 구체적인 에러 메시지 제공
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage = '네트워크 연결을 확인해주세요.';
        } else if (error.message.includes('서버 응답 오류')) {
            errorMessage = '서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('404')) {
            errorMessage = '해당 닉네임의 캐릭터를 찾을 수 없습니다.';
        } else {
            errorMessage = error.message;
        }
        
        showError(errorMessage);
        
    } finally {
        // 로딩 상태 종료
        setLoadingState(false);
    }
}

// 입력 필드에서 엔터 키 처리
function handleKeyPress(event) {
    if (event.key === 'Enter' && !isSearching) {
        event.preventDefault();
        searchUser();
    }
}

// 입력 필드 실시간 검증
function handleInput(event) {
    const value = event.target.value;
    
    // 특수문자 제거 (선택사항)
    const sanitized = value.replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
    if (sanitized !== value) {
        event.target.value = sanitized;
    }
    
    // 실시간 검증 피드백 (선택사항)
    if (value.length > 0 && value.length < 2) {
        nicknameInput.style.borderColor = 'var(--warning-color)';
    } else {
        nicknameInput.style.borderColor = '#e9ecef';
    }
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    // 검색 버튼 클릭 이벤트
    searchButton.addEventListener('click', searchUser);
    
    // 입력 필드 엔터 키 이벤트
    nicknameInput.addEventListener('keypress', handleKeyPress);
    
    // 입력 필드 실시간 검증 이벤트
    nicknameInput.addEventListener('input', handleInput);
    
    // 폼 제출 방지
    const form = document.querySelector('.search-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!isSearching) {
                searchUser();
            }
        });
    }
    
    // 초기 포커스 설정
    nicknameInput.focus();
    
    console.log('🚀 크레이지 아케이드 캐릭터 조회 시스템 초기화 완료');
});

// 페이지 언로드 시 요청 취소 (선택사항)
window.addEventListener('beforeunload', function() {
    if (isSearching) {
        console.log('🔄 페이지 종료로 인한 검색 취소');
    }
});

// 디버깅용 함수 (개발 시에만 사용)
function debugInfo() {
    console.log('🔧 디버그 정보:', {
        isSearching: isSearching,
        inputValue: nicknameInput.value,
        buttonDisabled: searchButton.disabled
    });
}

// 전역 스코프에 디버깅 함수 노출 (개발 시에만)
window.debugCA = debugInfo;

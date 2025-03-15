const user_name = encodeURIComponent("Example".toLowerCase());
const world_name = "scania"; // API에서 지원하는 값인지 확인
const apiKey = "your-api-key-here"; // 유효한 키로 교체
const url = `https://api.nexon.com/users?user_name=${user_name}&world_name=${world_name}`;
const headers = {
  "x-nxopen-api-key": apiKey
};

console.log("요청 URL:", url); // 디버깅용
console.log("헤더:", headers);

try {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const errorText = await response.text();
    console.log("에러 메시지:", errorText);
    throw new Error(`HTTP 에러: ${response.status}`);
  }
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error("요청 실패:", error);
}

import http from "k6/http";

export const options = {
    vus: 100, // 가상유저수 설정
    duration: "10s", // 테스트 기간 설정
};

export default function () {
    http.get("http://localhost:8000");
}
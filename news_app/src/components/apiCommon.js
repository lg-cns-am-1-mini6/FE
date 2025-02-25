import axios from "axios";

/**
 * API 응답 처리 공통 함수
 * - 성공 시 메시지 출력
 * - 토큰 만료(401) 시 재발급 요청
 *
 * @param {Object} response - axios 응답 객체
 */
export const reissueToken = (response) => {
  // 토큰 만료 시
  axios
    .post(`/auth/reissue`, null, { withCredentials: true })
    .then((res) => console.log("토큰 재발급:", res))
    .catch((err) => console.log("토큰 재발급 에러:", err));
};
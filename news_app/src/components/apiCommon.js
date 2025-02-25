import axios from "axios";

/**
 * 토큰 재발급 공통 함수
 * - 재발급 요청 후 새 토큰을 localStorage에 저장하고 Promise를 반환합니다.
 *
 * @returns {Promise} axios 요청 Promise
 */
export const reissueToken = () => {
  return axios
    .post(`/auth/reissue`, null, { withCredentials: true })
    .then((res) => {
      console.log("토큰 재발급:", res);
      // 응답 데이터에 새 토큰이 있다면 저장
      if (res.data.newToken) {
        localStorage.setItem("accesstoken", res.data.newToken);
      }
      return res;
    })
    .catch((err) => {
      console.log("토큰 재발급 에러:", err);
      throw err;
    });
};

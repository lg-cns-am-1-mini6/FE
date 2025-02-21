export default function LoginHandler() {
  try {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    console.log(code);
  } catch (error) {
    console.log(`로그인 실패: {error}`);
  }
  window.location.href = "/";

  return (
    <>
      <h1>로그인 리다이렉션 중 ... </h1>
    </>
  );
}

import { googleLogin, facebookLogin } from "../services/authService";

export default function SocialLoginButtons() {
  return (
    <div>
      <button onClick={googleLogin}>Login with Google</button>
      <button onClick={facebookLogin}>Login with Facebook</button>
    </div>
  );
}

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";
import { Separator } from "./ui/separator";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { useSearchParams } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const redirectUri = searchParams.get("redirect");
  const auth = searchParams.get("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // **Google Login Handler**
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google login failed.");
      return;
    }

    try {
      const { data } = await axios.post(
        auth + "/api/user/auth/google-login",
        { token: credentialResponse.credential },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(loginSuccess(data.user));
      localStorage.setItem("user", JSON.stringify(data.user));
      setSearchParams("?redirect=" + redirectUri + "&auth=" + auth);
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed.");
    }
  };

  // **Email & Password Login Handler**
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const { data } = await axios.post(
        auth + "/api/user/auth/email-login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(loginSuccess(data.user));
      localStorage.setItem("user", JSON.stringify(data.user));
      setSearchParams("?redirect=" + redirectUri + "&auth=" + auth);
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid credentials.");
    }
  };

  // 🔹 Facebook Login Success Handler
  const handleFacebookSuccess = async (response: any) => {
    try {
      if (!response.accessToken) return setError("Facebook login failed");

      const { data } = await axios.post(
        auth + "/api/user/auth/facebook-login",
        {
          facebookToken: response.accessToken,
        }
      );

      dispatch(loginSuccess(data.user));
      localStorage.setItem("user", JSON.stringify(data.user));
      setSearchParams(
        "?redirect=" + redirectUri + "&provider=facebook" + "&auth=" + auth
      );
    } catch (err: any) {
      setError("Facebook login failed");
    }
  };

  useEffect(() => {
    const checkUser = window.localStorage.getItem("user");
    if (checkUser) {
      window.location.replace(redirectUri as string);
    }
  }, [redirectUri, setSearchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <Card className="max-w-5xl w-full shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome! 👋
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to manage your account.
          </p>
          <div className="w-full mt-4 flex justify-center">
            {error && (
              <Alert
                variant="destructive"
                className="flex flex-col justify-center items-center w-fit"
              >
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardHeader>

        <CardContent className="md:flex md:flex-row flex-col justify-around space-y-6">
          <div className="flex flex-col justify-center md:w-[30%] gap-5">
            {/* Google Login Button */}
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed.")}
            />

            {/* 🔹 Facebook Login */}
            <FacebookLogin
              appId={
                import.meta.env.REACT_APP_FACEBOOK_APP_ID || "1047602349023620"
              }
              autoLoad={false}
              fields="name, email, picture"
              scope="public_profile,email"
              textButton={"Sign in with Facebook"}
              icon={<TiSocialFacebookCircular className="w-7 h-7 mr-2" />} // Icon
              buttonStyle={{
                padding: "0.5rem",
                paddingLeft: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
              cssClass="w-full bg-blue-600 text-white hover:cursor-pointer hover:bg-blue-500 transition border-none rounded-xs"
              callback={handleFacebookSuccess}
              language="en_US"
            />
          </div>

          {/* Divider */}
          <div className="flex md:hidden items-center my-4 space-x-4">
            <Separator className="flex-1" />
            <span className="text-sm text-gray-500">
              or continue with email
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Divider */}
          <div className="hidden md:flex flex-col items-center my-4 space-y-4">
            <Separator orientation="vertical" className="flex-1" />
            <span className="text-sm text-gray-500">
              or continue with email
            </span>
            <Separator orientation="vertical" className="flex-1" />
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 md:w-[40%]">
            <div>
              <Label className="mb-2" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-800 text-white hover:cursor-pointer hover:bg-gray-700 transition"
            >
              Sign in with Email
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {/* Terms & Privacy */}
          <p className="text-xs text-gray-400 text-center">
            By signing in, you agree to our{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Privacy Policy
            </span>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

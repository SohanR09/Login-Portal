import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";

const Logout = () => {
  const [searchParams] = useSearchParams();
  const redirectUri = searchParams.get("redirect");
  const auth = searchParams.get("auth");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("?redirect=" + redirectUri + "&auth=" + auth);
  };

  return (
    <Button
      className="bg-red-500 text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-red-600 transition"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default Logout;

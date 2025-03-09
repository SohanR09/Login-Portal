import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logout from "../components/Logout";
import { RootState } from "../store/store";
import { use } from "react";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const redirectUri = searchParams.get("redirect");
  const provider = searchParams.get("provider");
  const user = useSelector((state: RootState) => state.auth.user);

  function handleRedirect() {
    alert(
      "Application is going to use your login data, redirecting to Application: " +
        redirectUri
    );
    debugger;
    const userData = JSON.parse(window.localStorage.getItem("user") as string);
    window.location.replace(
      (redirectUri +
        "?u=" +
        encodeURIComponent(userData?.name as string) +
        "&m=" +
        encodeURIComponent(userData?.email as string)) as string
    );
    window.localStorage.removeItem("user");
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 shadow-lg rounded-lg w-96 text-center">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 shadow-lg rounded-lg w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Welcome, {user?.name}!
        </h2>
        {user?.avatar ? (
          <img
            src={user?.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mx-auto mt-4"
          />
        ) : (
          <div className="w-24 h-24 flex justify-center items-center rounded-full mx-auto mt-4 bg-gray-200">
            <FaRegUser className="text-gray-400 w-10 h-10" />
          </div>
        )}

        <p className="text-gray-500 mt-2">{user?.email}</p>

        <Button
          variant="link"
          className="my-6 cursor-pointer"
          onClick={handleRedirect}
        >
          Redirect to Application back!
        </Button>

        <div className="mt-4">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

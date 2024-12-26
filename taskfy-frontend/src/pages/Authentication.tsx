import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuthHooks } from "../helper/authenticationHook";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Authentication = ({ login }: { login?: boolean }) => {
  const [obsecure, setObsecure] = useState(true);
  const navigate = useNavigate();
  const primaryButtonClass =
    "bg-primary w-full text-white border-2 shadow-lg hover:shadow-none border-primary font-semibold px-4 py-2 rounded-lg";
  const secondaryButtonClass =
    "border-2 border-secondary w-full hover:bg-primary hover:shadow-lg hover:border-primary hover:text-white transition-colors ease-in-out text-primary font-semibold px-4 py-2 rounded-lg";

  const { loginHook, registerHook, loading, error } = useAuthHooks();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await loginHook(email, password);
  };
  const handleRegister = async () => {
    await registerHook(name, email, password);
  };

  useEffect(() => {
    if (error) {
      console.log(error);
    }
    if (isLoggedIn) {
      console.log("LEGGED IN");

      navigate("/projects");
    }
  }, [isLoggedIn, error, navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-primary">
      <div className="text-primary flex flex-col bg-white text-center rounded-xl px-6 py-4 gap-3">
        <div>
          <div className="text-4xl font-semibold">
            TaskFy {login ? "Login" : "Register"}
          </div>
          <div className="text-primary/55 text-xl font-semibold">
            Resource Management
          </div>
        </div>
        {!login && (
          <input
            type="name"
            name="name"
            id="name"
            placeholder="Name"
            className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        )}
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div className="relative flex items-center">
          <input
            type={obsecure ? "password" : "text"}
            name="password"
            id="password"
            placeholder="Password"
            className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {/* Eye icon */}
          <span
            className="absolute right-3 cursor-pointer text-gray-500"
            onClick={() => setObsecure(!obsecure)}
          >
            {obsecure ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </span>
        </div>
        <div className="text-red-400 text-start">{error}</div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (!login) {
                navigate("/login");
              } else {
                handleLogin();
              }
            }}
            className={login ? primaryButtonClass : secondaryButtonClass}
          >
            {loading && login ? "Loading..." : "Login"}
          </button>
          <button
            onClick={() => {
              if (login) {
                navigate("/register");
              } else {
                handleRegister();
              }
            }}
            className={login ? secondaryButtonClass : primaryButtonClass}
          >
            {loading && !login ? "Loading..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Authentication;

import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { User } from "../model/user";

export const useAuthHooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<User>();
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useDispatch();

  const loginHook = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + "auth/login",
        {
          email,
          password,
        }
      );

      if (response.data["success"]) {
        setData(response.data["user"]);
        setToken(response.data["token"]);

        dispatch(
          login({
            user: response.data.user,
            isLoggedIn: true,
            token: response.data.token,
          })
        );
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  const registerHook = async (
    name: string,
    email: string,
    password: string
  ) => {
    dispatch(
      login({
        user: null,
        isLoggedIn: false,
      })
    );
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + "auth/register",
        {
          name,
          email,
          password,
        }
      );
      if (response.data.success) {
        setData(response.data["user"]);
        dispatch(
          login({
            user: response.data.user,
            isLoggedIn: false,
          })
        );
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred while registering.");
    } finally {
      setLoading(false);
    }
  };

  return { loginHook, registerHook, loading, error, data, token };
};

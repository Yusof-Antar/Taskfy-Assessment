import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { RootState } from "../redux/store";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-[270px] bg-primary h-screen fixed shadow-lg text-center flex flex-col">
      <NavLink
        to="/projects"
        className={({ isActive }) =>
          isActive
            ? "text-secondary font-semibold text-xl underline"
            : "text-white font-semibold text-xl"
        }
      >
        Projects
      </NavLink>
      {user?.role == "MANAGER" && (
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            isActive
              ? "text-secondary font-semibold text-xl underline"
              : "text-white font-semibold text-xl"
          }
        >
          Employees
        </NavLink>
      )}
      {user?.role == "EMPLOYEE" && (
        <NavLink
          to="/availability"
          className={({ isActive }) =>
            isActive
              ? "text-secondary font-semibold text-xl underline"
              : "text-white font-semibold text-xl"
          }
        >
          Availability
        </NavLink>
      )}
      <div
        onClick={() => {
          dispatch(logout());
        }}
        className="text-white font-semibold text-xl cursor-pointer"
      >
        Logout
      </div>
    </div>
  );
};

export default Sidebar;

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className=" w-full bg-primary shadow-lg flex items-center justify-between px-24">
      <div className="text-white text-2xl font-semibold">TaskFy</div>
      <div className="text-white font-semibold text-lg flex flex-col text-center">
        {user?.name}
        <span className="text-sm text-gray-200">{user?.email}</span>
      </div>
    </div>
  );
};

export default Navbar;

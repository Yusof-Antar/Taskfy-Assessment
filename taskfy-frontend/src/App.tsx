import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Projects from "./pages/Projects";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import Employees from "./pages/Employees";
import Availability from "./pages/Availability";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Authentication login />} />
          <Route path="/register" element={<Authentication />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/availability" element={<Availability />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}

const MainLayout = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="pl-[300px] pt-[30px]">
        <Outlet />
      </div>
    </div>
  );
};

export default App;

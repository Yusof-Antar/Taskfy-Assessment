import { useState } from "react";
import { Employee } from "../model/employee";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useEmployeeHook = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { token } = useSelector((state: RootState) => state.auth);

  const getMyEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        import.meta.env.VITE_URL + "user/employee",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data["success"]) {
        setData(response.data["data"]);
      } else {
        setError(response.data["message"]);
      }
    } catch (error) {
      setError("An Error Occured While fetching your Employees");
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (n: string, e: string, p: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + "user/add-employee",
        {
          name: n,
          email: e,
          password: p,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data["success"]) {
        setData((prevData) => [...prevData, response.data["data"]]);
      } else {
        setError(response.data["message"]);
      }
    } catch (error) {
      setError("An Error Occured While Adding an Employee");
    } finally {
      setLoading(false);
    }
  };

  const editEmployee = async (id: string, n: string, e: string, p: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + "user/edit-employee/" + id,
        {
          name: n,
          email: e,
          password: p,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data["success"]) {
        setData((prevData) => {
          // Update the project in the array by replacing the one with the same ID
          return prevData!.map(
            (project) =>
              project.id === parseInt(id)
                ? { ...project, ...response.data["data"] } // Replace the project with updated data
                : project // Keep other projects unchanged
          );
        });
      } else {
        setError(response.data["message"]);
      }
    } catch (error) {
      setError("An Error Occurred While Editing the Project");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        import.meta.env.VITE_URL + "user/delete/" + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      if (response.data["success"]) {
        setData((prevData) =>
          prevData?.filter((data) => data.id != parseInt(id))
        );
      } else {
        setError(response.data["message"]);
      }
    } catch (error) {
      setError("An Error Occured While Deleting the Employee");
    } finally {
      setLoading(false);
    }
  };

  return {
    getMyEmployees,
    addEmployee,
    editEmployee,
    deleteEmployee,
    data,
    loading,
    error,
  };
};

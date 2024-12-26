import { useState } from "react";
import { Project } from "../model/project";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useProjectHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [data, setData] = useState<Project[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);

  const getProjcts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(import.meta.env.VITE_URL + "project", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data["success"]) {
        setData(response.data["data"]);
      }
    } catch (error) {
      setError("An Error Occured While Fetching Projects");
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (n: string, ah: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + "project/add",
        {
          name: n,
          allocatedHours: ah,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data["success"]) {
        setData((prevData) => [...prevData!, response.data["data"]]);
      } else {
        setError(response.data["message"]);
      }
    } catch (error) {
      setError("An Error Occured While Adding a Project");
    } finally {
      setLoading(false);
    }
  };
  const editProject = async (id: string, n: string, ah: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + "project/edit/" + id,
        {
          name: n,
          allocatedHours: ah,
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

  const deleteProject = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        import.meta.env.VITE_URL + "project/delete/" + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data["success"]) {
        setData((prevData) =>
          prevData?.filter((data) => data.id != parseInt(id))
        );
      } else {
        setError(response.data["message"]);
      }
    } catch (error) {
      setError("An Error Occured While Deleting a Project");
    } finally {
      setLoading(false);
    }
  };

  const closeProject = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + "project/close/" + id,
        {},
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
                ? { ...project, status: "CLOSED" } // Replace the project with updated data
                : project // Keep other projects unchanged
          );
        });
      } else {
        setError(response.data["message"]);
      }
    } catch (error) {
      setError("An Error Occured While Closing The Project");
    } finally {
      setLoading(false);
    }
  };

  const logHours = async (id: string, logHour: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + "project/log-hours/" + id,
        {
          hours: logHour,
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
      setError("An Error Occured While Adding Log Hours");
    } finally {
      setLoading(false);
    }
  };

  return {
    getProjcts,
    addProject,
    editProject,
    deleteProject,
    closeProject,
    logHours,
    data,
    loading,
    error,
  };
};

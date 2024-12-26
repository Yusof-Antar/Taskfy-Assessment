import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Availability } from "../model/availability";

export const useAvailabilityHook = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Availability[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { token } = useSelector((state: RootState) => state.auth);

  const getAvailability = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        import.meta.env.VITE_URL + "availability/get-availability",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data["success"]) {
        setData(response.data["data"]);
      }
    } catch (error) {
      setError("An Error Occured While Geting Availability");
    } finally {
      setLoading(false);
    }
  };

  const addAvailability = async (
    availableDate: string,
    startTime: string,
    endTime: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_URL + "availability/add",
        {
          availableDate: availableDate,
          startTime: startTime,
          endTime: endTime,
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

  const deleteAvailability = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        import.meta.env.VITE_URL + "availability/delete/" + id,
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
      setError("An Error Occured while Deleting Availability");
    } finally {
      setLoading(false);
    }
  };

  return {
    getAvailability,
    addAvailability,
    deleteAvailability,
    loading,
    data,
    error,
  };
};

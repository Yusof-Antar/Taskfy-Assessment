import React, { useEffect, useState } from "react";
import { useAvailabilityHook } from "../helper/availabilityHook";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const Availability = () => {
  const [showModal, setShowModal] = useState(false);

  const [availableDate, setAvailableDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  function formatDateTime(
    availableDate: string,
    startTime: string,
    endTime: string
  ) {
    const availableDateObj = new Date(availableDate);
    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

    const dayOfWeek = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(availableDateObj);

    const formattedDate = availableDateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    const formattedStartTime = startTimeObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const formattedEndTime = endTimeObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return {
      days: `${dayOfWeek} ${formattedDate}`,
      fromTime: formattedStartTime,
      toTime: formattedEndTime,
    };
  }

  const {
    getAvailability,
    addAvailability,
    deleteAvailability,
    loading,
    data,
  } = useAvailabilityHook();

  useEffect(() => {
    getAvailability();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {showModal && (
        <div
          className="absolute h-screen top-0 left-0 right-0 bg-black/10 flex items-center justify-center"
          onClick={(e) => {
            setShowModal(false);
            e.stopPropagation();
          }}
        >
          <div
            className="bg-white rounded-lg py-2 px-4 flex flex-col gap-2 border-2 border-primary"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="text-center text-2xl font-semibold">
              Add Availability
            </div>
            <label htmlFor="">Available Date</label>

            <input
              type="date"
              name="availableDate"
              id="availableDate"
              className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
              value={availableDate}
              onChange={(e) => {
                setAvailableDate(e.target.value);
              }}
            />
            <label htmlFor="">Start Time</label>

            <input
              type="time"
              name="startTime"
              id="startTime"
              className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
            <label htmlFor="">End Time</label>
            <input
              type="time"
              name="endTime"
              id="endTime"
              className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            />

            <button
              className="bg-secondary py-1 rounded-md text-white font-semibold text-xl"
              onClick={async () => {
                await addAvailability(availableDate, startTime, endTime);

                setShowModal(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
      <div>
        <div className="flex justify-between mr-12">
          <h1 className="text-3xl font-semibold">Availability</h1>
          <button
            className="bg-primary text-lg font-semibold text-white py-2 px-4 rounded-lg"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Add Availability
          </button>
        </div>
        <div className="flex flex-wrap gap-4  rounded-lg px-3 py-2 my-4">
          <TableContainer>
            <Table
              className="border"
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Available Date</TableCell>
                  <TableCell>From Time</TableCell>
                  <TableCell>To Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((available) => (
                  <TableRow key={available.id}>
                    <TableCell>
                      {
                        formatDateTime(
                          available.availableDate,
                          available.startTime,
                          available.endTime
                        ).days
                      }
                    </TableCell>
                    <TableCell>
                      {
                        formatDateTime(
                          available.availableDate,
                          available.startTime,
                          available.endTime
                        ).fromTime
                      }
                    </TableCell>
                    <TableCell>
                      {
                        formatDateTime(
                          available.availableDate,
                          available.startTime,
                          available.endTime
                        ).toTime
                      }
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={async () => {
                          await deleteAvailability(available.id.toString());
                        }}
                        className="bg-red-500 rounded-md py-1 px-2 text-white font-semibold"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default Availability;

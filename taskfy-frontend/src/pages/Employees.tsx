import { useEffect, useState } from "react";
import { useEmployeeHook } from "../helper/employeeHook";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Employees = () => {
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(true);

  const [employeeId, setEmployeeId] = useState(-1);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");

  const {
    getMyEmployees,
    addEmployee,
    editEmployee,
    deleteEmployee,
    data,
    loading,
  } = useEmployeeHook();

  useEffect(() => {
    getMyEmployees();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
      time: `From ${formattedStartTime} To ${formattedEndTime}`,
    };
  }

  return (
    <>
      {showModal && (
        <div
          className="absolute h-screen top-0 left-0 right-0 bg-black/10 flex items-center justify-center z-50"
          onClick={(e) => {
            setEmployeeId(-1);
            setEmployeeName("");
            setEmployeeEmail("");
            setEmployeePassword("");
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
              {addModal ? "Add" : "Edit"} Employee
            </div>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Employee Name"
              className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
              value={employeeName}
              onChange={(e) => {
                setEmployeeName(e.target.value);
              }}
            />
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Employee Email"
              className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
              value={employeeEmail}
              onChange={(e) => {
                setEmployeeEmail(e.target.value);
              }}
            />
            <input
              type="text"
              name="password"
              id="password"
              placeholder="Employee Password"
              className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
              value={employeePassword}
              onChange={(e) => {
                setEmployeePassword(e.target.value);
              }}
            />
            <button
              className="bg-secondary py-1 rounded-md text-white font-semibold text-xl"
              onClick={async () => {
                if (addModal) {
                  await addEmployee(
                    employeeName,
                    employeeEmail,
                    employeePassword
                  );
                } else {
                  await editEmployee(
                    employeeId.toString(),
                    employeeName,
                    employeeEmail,
                    employeePassword
                  );
                }
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
          <h1 className="text-3xl font-semibold">Employees</h1>
          <button
            className="bg-primary text-lg font-semibold text-white py-2 px-4 rounded-lg"
            onClick={() => {
              setAddModal(true);
              setShowModal(true);
            }}
          >
            Add Employee
          </button>
        </div>
        <div className="flex flex-wrap gap-4  rounded-lg px-3 py-2 my-4">
          {data.map((employee) => (
            <div
              key={employee.id}
              className="min-w-[320px] max-w-[320px] border-2 inset-2 border-primary shadow-xl rounded-lg  py-2"
            >
              <div className="flex justify-between px-4">
                {employee.name}
                <div
                  onClick={() => {
                    setEmployeeId(employee.id);
                    setEmployeeName(employee.name);
                    setEmployeeEmail(employee.email);
                    setEmployeePassword("");
                    setAddModal(false);
                    setShowModal(true);
                  }}
                >
                  <EditIcon className="text-secondary !text-xl cursor-pointer" />
                </div>
              </div>
              <div className="flex justify-between px-4">
                {employee.email}
                <div
                  onClick={() => {
                    deleteEmployee(employee.id.toString());
                  }}
                >
                  <DeleteIcon className="text-red-500 !text-xl cursor-pointer" />
                </div>
              </div>
              {employee.availability.length > 0 && (
                <details className="relative px-4">
                  <summary className="text-primary font-bold">
                    Availability
                  </summary>
                  <div className="p-4 absolute -left-[2px] -right-[2px] border-e-2 border-s-2 border-b-2 rounded-b-lg border-primary bg-white text-center">
                    {employee.availability.map((available, index) => (
                      <div key={index}>
                        <hr />

                        <div>
                          {
                            formatDateTime(
                              available.availableDate,
                              available.startTime,
                              available.endTime
                            ).days
                          }
                        </div>
                        <div>
                          {
                            formatDateTime(
                              available.availableDate,
                              available.startTime,
                              available.endTime
                            ).time
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Employees;

import { useEffect, useState } from "react";
import { useProjectHook } from "../helper/projectHook";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(true);
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);

  const [projectId, setProjectId] = useState(-1);
  const [projectName, setProjectName] = useState("");
  const [projectAllocatedHours, setProjectAllocatedHours] = useState(0);
  const [projectLogHours, setProjectLogHours] = useState(0);

  const { user } = useSelector((state: RootState) => state.auth);

  const {
    getProjcts,
    addProject,
    editProject,
    deleteProject,
    closeProject,
    logHours,
    data,
    loading,
  } = useProjectHook();

  useEffect(() => {
    getProjcts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {showLogHoursModal && (
        <div
          className="absolute h-screen top-0 left-0 right-0 bg-black/10 flex items-center justify-center"
          onClick={(e) => {
            setShowLogHoursModal(false);
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
              Add Log Hours
            </div>
            <input
              type="number"
              name="consumedHour"
              id="consumedHour"
              placeholder="Log Hours"
              className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
              value={projectLogHours}
              onChange={(e) => {
                setProjectLogHours(parseFloat(e.target.value));
              }}
            />
            <button
              className="bg-secondary py-1 rounded-md text-white font-semibold text-xl"
              onClick={async () => {
                await logHours(
                  projectId.toString(),
                  projectLogHours.toString()
                );
                setShowLogHoursModal(false);
              }}
            >
              ADD
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <div
          className="absolute h-screen top-0 left-0 right-0 bg-black/10 flex items-center justify-center"
          onClick={(e) => {
            setProjectName("");
            setProjectAllocatedHours(0);
            setProjectId(-1);
            setAddModal(true);
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
              {addModal ? "Add" : "Edit"} Project
            </div>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Project Name"
              className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
              }}
            />
            <input
              type="number"
              name="allocatedHours"
              id="allocatedHours"
              placeholder="Project Allocated Hours"
              className="h-[45px] min-w-[300px] border-2 px-2 border-primary rounded-lg focus-visible:outline-secondary"
              value={projectAllocatedHours}
              onChange={(e) => {
                setProjectAllocatedHours(parseFloat(e.target.value));
              }}
            />
            <button
              className="bg-secondary py-1 rounded-md text-white font-semibold text-xl"
              onClick={async () => {
                if (addModal) {
                  await addProject(
                    projectName,
                    projectAllocatedHours.toString()
                  );
                } else {
                  await editProject(
                    projectId.toString(),
                    projectName,
                    projectAllocatedHours.toString()
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
          <h1 className="text-3xl font-semibold">Projects</h1>
          <button
            className="bg-primary text-lg font-semibold text-white py-2 px-4 rounded-lg"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Add Project
          </button>
        </div>
        <div className="flex flex-wrap gap-4  rounded-lg px-3 py-2 my-4">
          {data?.map((project) => (
            <div
              key={project.id}
              className={`border-2 ${
                project.status == "ACTIVE"
                  ? "bg-green-500/25 border-green-500"
                  : "bg-orange-500/5 border-orange-500"
              } rounded-xl w-fit min-w-[370px] py-3 px-6 space-y-2 `}
            >
              <div className="flex justify-between">
                <div className="font-semibold">{project.name}</div>
                <div
                  className={`rounded-full text-xs font-semibold py-1 px-2 text-white ${
                    project.status == "ACTIVE"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                >
                  {project.status}
                </div>
              </div>
              <div className="flex justify-between gap-5 text-gray-400 font-semibold">
                <div>
                  Allocated:{" "}
                  <span className="text-black">
                    {project.allocatedHours} hour
                  </span>
                </div>
                <div>
                  Consumed:{" "}
                  <span className="text-black">
                    {project.consumedHours} hour
                  </span>
                </div>
              </div>
              <div className="text-gray-400 font-semibold">
                Manager <span className="text-black">{project.admin.name}</span>
              </div>
              {user?.role == "EMPLOYEE" && project.status == "ACTIVE" && (
                <div className="flex gap-2">
                  <button
                    className="px-2 bg-primary rounded-md py-1 text-white font-semibold"
                    onClick={() => {
                      setProjectId(project.id);
                      setShowLogHoursModal(true);
                    }}
                  >
                    Log Hours
                  </button>
                </div>
              )}
              {user?.role == "ADMIN" && (
                <div className="flex gap-2">
                  <button
                    className="w-[25%] bg-primary rounded-md py-1 text-white font-semibold"
                    onClick={() => {
                      setAddModal(false);
                      setProjectName(project.name);
                      setProjectAllocatedHours(project.allocatedHours);
                      setProjectId(project.id);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="w-[25%] bg-red-500 rounded-md py-1 text-white font-semibold"
                    onClick={() => {
                      deleteProject(project.id.toString());
                    }}
                  >
                    Delete
                  </button>
                  {project.status == "ACTIVE" && (
                    <button
                      className="w-[25%] bg-orange-500 rounded-md py-1 text-white font-semibold"
                      onClick={() => {
                        closeProject(project.id.toString());
                      }}
                    >
                      CLOSE
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;

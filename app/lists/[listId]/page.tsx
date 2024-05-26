"use client";
import React, { useEffect, useState, FormEventHandler } from "react";
import Link from "next/link";
//import AddTask from "@/app/components/AddTask"; // Adjust the path as needed
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "@/app/components/Modal";
import { useParams } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  listId: number;
  description: string;
  deadlineDate: Date | number;
}

export const addTodo = async ({
  params,
}: {
  params: { listId: string; title: string };
}) => {
  const res = await fetch(
    `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: params.title }), // Send only the title in the body
    }
  );
  const newTodo = await res.json();
  return newTodo;
};

export const editTodo = async ({
  params,
}: {
  params: { listId: string; title: string; id: number };
}) => {
  const res = await fetch(
    `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks/${params.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: params.title }), // Send only the title in the body
    }
  );
  const updatedTodo = await res.json();
  return updatedTodo;
};

export const deleteTodo = async ({
  params,
}: {
  params: { listId: string; id: number };
}) => {
  await fetch(
    `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks/${params.id}`,
    {
      method: "DELETE",
    }
  );
};

const ListPage = ({ params }: { params: { listId: string } }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [refreshTasks, setRefreshTasks] = useState<boolean>(false); // State to trigger refresh
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newTaskValue, setNewTaskValue] = useState<string>("");
  const { listId } = useParams(); // Get the listId from the URL parameters

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(
        `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks`,
        {
          cache: "no-store",
        }
      );
      const tasks: Task[] = await res.json();

      // Convert deadlineDate from Unix timestamp to Date object
      const convertedTasks = tasks.map((task) => ({
        ...task,
        deadlineDate: new Date(Number(task.deadlineDate) * 1000),
      }));

      setTasks(convertedTasks);
    };

    fetchTasks();
  }, [params.listId, refreshTasks]);

  const formatDate = (date: Date) => {
    // Convert the date to string and remove the time zone part
    const dateString = date.toString();
    const withoutTimeZone = dateString.split(" ").slice(0, 5).join(" ");
    return withoutTimeZone;
  };

  const handleSubmitNewTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (typeof listId === "string") {
      // Ensure listId is a string
      await addTodo({
        params: {
          title: newTaskValue,
          listId: listId,
        },
      });
      setNewTaskValue("");
      setModalOpen(false);
      setRefreshTasks((prev) => !prev); // Toggle refreshTasks state to trigger re-fetching
    } else {
      console.error("listId is not a valid string");
    }
  };

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (taskToEdit) {
      await editTodo({
        params: {
          title: taskToEdit.title,
          listId: params.listId,
          id: taskToEdit.id,
        },
      });
      setTaskToEdit(null);
      setOpenModalEdit(false);
      setRefreshTasks((prev) => !prev); // Toggle refreshTasks state to trigger re-fetching
    }
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTodo({ params: { listId: params.listId, id } });
    setOpenModalDeleted(false);
    setRefreshTasks((prev) => !prev); // Toggle refreshTasks state to trigger re-fetching
  };

  return (
    <>
      <main className="max-w-4xl mx-auto mt-4">
        <div className="text-center my-5 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Tasks for List {params.listId}</h1>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Completed</th>
              <th>DeadlineDate</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr className="hover" key={task.id}>
                <td>
                  <Link href={`/lists/${params.listId}/tasks/${task.id}`}>
                    {task.title}
                  </Link>
                </td>
                <td>{task.description}</td>
                <td>{task.completed ? "Yes" : "No"}</td>
                <td>{formatDate(task.deadlineDate as Date)}</td>
                <td className="flex gap-5">
                  <FiEdit
                    onClick={() => {
                      setOpenModalEdit(true);
                      setTaskToEdit(task);
                    }}
                    cursor="pointer"
                    className="text-blue-500"
                    size={18}
                  />
                  <Modal
                    modalOpen={openModalEdit}
                    setModalOpen={setOpenModalEdit}
                  >
                    <form onSubmit={handleSubmitEditTodo}>
                      <h3 className="font-bold text-lg">Edit Task</h3>
                      <div className="modal-action">
                        <input
                          value={taskToEdit ? taskToEdit.title : ""}
                          onChange={(e) =>
                            setTaskToEdit((prev) =>
                              prev ? { ...prev, title: e.target.value } : null
                            )
                          }
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered w-full"
                        />
                        <button type="submit" className="btn">
                          Submit
                        </button>
                      </div>
                    </form>
                  </Modal>
                  <FiTrash2
                    onClick={() => setOpenModalDeleted(true)}
                    cursor="pointer"
                    className="text-red-500"
                    size={18}
                  />
                  <Modal
                    modalOpen={openModalDeleted}
                    setModalOpen={setOpenModalDeleted}
                  >
                    <h3 className="text-lg">
                      Are you sure you want to delete this task?
                    </h3>
                    <div className="modal-action">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="btn"
                      >
                        Yes
                      </button>
                    </div>
                  </Modal>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary w-full"
          >
            ADD NEW TASK
            <AiOutlinePlus className="ml-2" size={18} />
          </button>
          <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <form onSubmit={handleSubmitNewTodo}>
              <h3 className="font-bold text-lg">Add new task</h3>
              <div className="modal-action">
                <input
                  value={newTaskValue}
                  onChange={(e) => setNewTaskValue(e.target.value)}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
                <button type="submit" className="btn">
                  Submit
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </main>
    </>
  );
};

export default ListPage;

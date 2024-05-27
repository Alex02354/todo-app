"use client";
import React, { useEffect, useState, FormEventHandler } from "react";
import Link from "next/link";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "@/app/components/Modal";
import { useParams } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

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
  params: {
    listId: string;
    title: string;
    completed: boolean;
    description: string;
    deadlineDate: Date;
  };
}) => {
  const res = await fetch(
    `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: params.title,
        completed: params.completed,
        description: params.description,
        deadlineDate: params.deadlineDate.getTime() / 1000, // Convert to Unix timestamp
      }),
    }
  );
  const newTodo = await res.json();
  return newTodo;
};

export const editTodo = async ({
  params,
}: {
  params: {
    listId: string;
    title: string;
    id: number;
  };
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
  const [refreshTasks, setRefreshTasks] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">(
    "all"
  );
  const { listId } = useParams();

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(
        `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks`,
        {
          cache: "no-store",
        }
      );
      const tasks: Task[] = await res.json();

      const convertedTasks = tasks.map((task) => ({
        ...task,
        deadlineDate: new Date(Number(task.deadlineDate) * 1000),
      }));

      setTasks(convertedTasks);
    };

    fetchTasks();
  }, [params.listId, refreshTasks]);

  const formatDate = (date: Date) => {
    const dateString = date.toString();
    const withoutTimeZone = dateString.split(" ").slice(0, 5).join(" ");
    return withoutTimeZone;
  };

  const schema = z.object({
    title: z.string().min(1, "Title is required"),
    completed: z.boolean(),
    description: z.string().min(1, "Description is required"),
    deadlineDate: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date({ invalid_type_error: "Invalid date" })),
  });

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (typeof listId === "string") {
      try {
        await addTodo({
          params: {
            listId: listId,
            title: data.title,
            completed: data.completed,
            description: data.description,
            deadlineDate: data.deadlineDate,
          },
        });
        setModalOpen(false);
        setRefreshTasks((prev) => !prev);
      } catch (error) {
        setError("root", {
          type: "manual",
          message: "Failed to add task",
        });
      }
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
      setRefreshTasks((prev) => !prev);
    }
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTodo({ params: { listId: params.listId, id } });
    setOpenModalDeleted(false);
    setRefreshTasks((prev) => !prev);
  };

  const [search, setSearch] = useState("");

  return (
    <>
      <main className="max-w-4xl mx-auto mt-4">
        <div className="text-center my-5 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Tasks for List {params.listId}</h1>
        </div>
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <div className="flex justify-center m-5 gap-10">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setFilter("all")}
          >
            ALL
          </button>
          <button
            className="btn btn-outline btn-secondary"
            onClick={() => setFilter("in-progress")}
          >
            IN PROGRESS
          </button>
          <button
            className="btn btn-outline btn-accent"
            onClick={() => setFilter("completed")}
          >
            COMPLETED
          </button>
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
            {tasks
              .filter((task) => {
                if (filter === "in-progress") return !task.completed;
                if (filter === "completed") return task.completed;
                return true;
              })
              .filter((task) => {
                return search.toLowerCase() === ""
                  ? task
                  : task.title.toLowerCase().includes(search);
              })
              .map((task) => (
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
            <form
              className="flex flex-col gap-4 p-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h3 className="text-xl font-bold mb-4">Add New Task</h3>
              <div className="flex flex-col gap-2">
                <label className="label">Title</label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="Title"
                  className="input input-bordered w-full"
                />
                {errors.title && (
                  <div className="text-red-500">{errors.title.message}</div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="label">Description</label>
                <input
                  {...register("description")}
                  type="text"
                  placeholder="Description"
                  className="input input-bordered w-full"
                />
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="label">Deadline Date</label>
                <input
                  {...register("deadlineDate")}
                  type="date"
                  placeholder="Deadline Date"
                  className="input input-bordered w-full"
                />
                {errors.deadlineDate && (
                  <div className="text-red-500">
                    {errors.deadlineDate.message}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="label">Completed</label>
                <input
                  {...register("completed")}
                  type="checkbox"
                  className="checkbox"
                />
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="btn btn-primary mt-4"
              >
                {isSubmitting ? "Loading..." : "Submit"}
              </button>
              {errors.root && (
                <div className="text-red-500 mt-2">{errors.root.message}</div>
              )}
            </form>
          </Modal>
        </div>
      </main>
    </>
  );
};

export default ListPage;

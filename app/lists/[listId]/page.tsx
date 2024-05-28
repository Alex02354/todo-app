"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import TaskFilter from "../../components/TaskFilter";
import TaskSearch from "../../components/TaskSearch";
import AddTask from "@/app/components/AddTask";
import DeleteTask from "@/app/components/DeleteTask";
import EditTask from "@/app/components/EditTask";
import CompleteTask from "@/app/components/CompleteTask";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  listId: number;
  description: string;
  deadlineDate: Date | number;
}

const ListPage = ({ params }: { params: { listId: string } }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [refreshTasks, setRefreshTasks] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">(
    "all"
  );

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

  const handleCompleteTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === updatedTask.id ? { ...t, completed: updatedTask.completed } : t
      )
    );
  };

  const [search, setSearch] = useState("");

  const [listName, setListName] = useState<string>("");

  useEffect(() => {
    const fetchListName = async () => {
      const res = await fetch(
        `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}`,
        {
          cache: "no-store",
        }
      );
      const list = await res.json();
      setListName(list.name);
    };

    fetchListName();
  }, [params.listId]);

  return (
    <>
      <main className="max-w-4xl mx-auto mt-10">
        <div className="text-center my-5 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{listName}</h1>
        </div>

        <div className="flex justify-between my-10">
          <TaskFilter filter={filter} setFilter={setFilter} />
          <TaskSearch setSearch={setSearch} />
        </div>

        <table className="table border">
          <thead className="bg-gray-300">
            <tr>
              <th className="w-40 text-sm text-black font-semibold">Title</th>
              <th className="w-40 text-sm text-black font-semibold">
                Description
              </th>
              <th className="w-40 text-sm text-black font-semibold">
                Completed
              </th>
              <th className="w-60 text-sm text-black font-semibold">
                Deadline Date
              </th>
              <th className="w-20 text-sm text-black font-semibold">Edit</th>
              <th className="w-20 text-sm text-black font-semibold">Delete</th>
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
                  <td className="w-40">
                    <Link href={`/lists/${params.listId}/tasks/${task.id}`}>
                      {task.title}
                    </Link>
                  </td>
                  <td className="w-40">{task.description}</td>
                  <td className="w-40">
                    <div className="flex flex-row gap-5">
                      <CompleteTask
                        task={task}
                        listId={params.listId}
                        onCompleteTask={handleCompleteTask}
                      />
                      {task.completed ? "Yes" : "No"}
                    </div>
                  </td>
                  <td className="w-60">
                    {formatDate(task.deadlineDate as Date)}
                  </td>

                  <td className="w-20">
                    <FiEdit
                      onClick={() => {
                        setOpenModalEdit(true);
                        setTaskToEdit(task);
                      }}
                      cursor="pointer"
                      className="text-blue-500"
                      size={20}
                    />
                    <EditTask
                      openModal={openModalEdit}
                      onCloseModal={() => setOpenModalEdit(false)}
                      onSubmitEdit={() => setRefreshTasks((prev) => !prev)}
                      taskToEdit={taskToEdit}
                      listId={params.listId}
                    />
                  </td>
                  <td className="w-20">
                    <FiTrash2
                      onClick={() => {
                        setTaskToDelete(task);
                        setOpenModalDeleted(true);
                      }}
                      cursor="pointer"
                      className="text-red-500"
                      size={20}
                    />
                    <DeleteTask
                      openModal={openModalDeleted}
                      onCloseModal={() => setOpenModalDeleted(false)}
                      onDeleteTask={() => setRefreshTasks((prev) => !prev)}
                      taskToDelete={taskToDelete}
                      listId={params.listId}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="mt-10">
          <AddTask
            listId={params.listId}
            onSubmitSuccess={() => setRefreshTasks((prev) => !prev)}
          />
        </div>
      </main>
    </>
  );
};

export default ListPage;

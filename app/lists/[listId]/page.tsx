import React from "react";
import Link from "next/link";
import AddTask from "@/app/components/AddTask"; // Adjust the path as needed

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

const ListPage = async ({ params }: { params: { listId: string } }) => {
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

  const formatDate = (date: Date) => {
    // Convert the date to string and remove the time zone part
    const dateString = date.toString();
    const withoutTimeZone = dateString.split(" ").slice(0, 5).join(" ");
    return withoutTimeZone;
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
            {convertedTasks.map((task) => (
              <tr className="hover" key={task.id}>
                <td>
                  <Link href={`/lists/${params.listId}/tasks/${task.id}`}>
                    {task.title}
                  </Link>
                </td>
                <td>{task.description}</td>
                <td>{task.completed ? "Yes" : "No"}</td>
                <td>{formatDate(task.deadlineDate as Date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddTask />
      </main>
    </>
  );
};

export default ListPage;

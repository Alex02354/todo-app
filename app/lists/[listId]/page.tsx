import React from "react";
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  listId: number;
}

const ListPage = async ({ params }: { params: { listId: string } }) => {
  const res = await fetch(
    `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks`,
    {
      cache: "no-store",
    }
  );
  const tasks: Task[] = await res.json();

  const taskId = 7;
  return (
    <>
      <h1>Tasks for List {params.listId}</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>taskId</th>
            <th>ID</th>
            <th>Title</th>
            <th>Completed</th>
            <th>List ID</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <Link href={`/lists/${params.listId}/tasks/${task.id}`}>
                  {task.id}
                </Link>
              </td>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.completed ? "Yes" : "No"}</td>
              <td>{task.listId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListPage;

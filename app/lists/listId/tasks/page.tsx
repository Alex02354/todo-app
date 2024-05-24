import React from "react";
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  listId: number;
}

const TasksPage = async () => {
  const res = await fetch(
    "https://66502dadec9b4a4a603102b5.mockapi.io/lists/1/tasks",
    {
      cache: "no-store",
    }
  );
  const tasks: Task[] = await res.json();

  return (
    <>
      <h1>Tasks for List</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Completed</th>
            <th>List ID</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
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

export default TasksPage;

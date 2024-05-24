import React from "react";
import Link from "next/link";

interface Task {
  id: number;
  name: string;
}

const ListPage = async () => {
  const res = await fetch("https://66502dadec9b4a4a603102b5.mockapi.io/lists", {
    cache: "no-store",
  });
  const tasks: Task[] = await res.json();

  return (
    <>
      <h1>List</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>List Name</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((list) => (
            <tr key={list.id}>
              <td>{list.id}</td>
              <td>{list.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListPage;

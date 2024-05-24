import React from "react";
import Link from "next/link";

interface List {
  id: number;
  name: string;
}

const ListsPage = async () => {
  const res = await fetch("https://66502dadec9b4a4a603102b5.mockapi.io/lists", {
    cache: "no-store",
  });
  const lists: List[] = await res.json();
  return (
    <>
      <h1>Lists</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {lists.map((list) => (
            <tr key={list.id}>
              <td>{list.id}</td>
              <td>
                <Link href={`/lists/listId/tasks?listId=${list.id}`}>
                  {list.name}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListsPage;

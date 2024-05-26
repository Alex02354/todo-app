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
      <main className="max-w-4xl mx-auto mt-4">
        <div className="text-center my-5 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Lists</h1>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((list) => (
                <tr className="hover" key={list.id}>
                  <td>{list.id}</td>
                  <td>
                    <Link href={`/lists/${list.id}`}>{list.name}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default ListsPage;

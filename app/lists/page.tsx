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
      <main className="max-w-8xl mx-auto mt-10">
        <div className="text-center my-5 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Your Checklists</h1>
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            {lists.map((list, index) => (
              <div
                key={list.id}
                className="card card-compact w-96 bg-base-100 shadow-xl"
              >
                <figure>
                  <img
                    src={`/assets/${(index % 3) + 1}.jpg`}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{list.name}</h2>
                  <div className="text-left">
                    {" "}
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor.
                    </p>
                  </div>
                  <div className="card-actions justify-end">
                    <Link href={`/lists/${list.id}`}>
                      <button className="btn btn-primary mt-2">
                        View {list.name}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default ListsPage;

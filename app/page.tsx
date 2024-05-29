import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-primary">
          Welcome to Your Checklists
        </h1>
        <Link
          href="/lists"
          className="px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-secondary transition duration-300"
        >
          Enter
        </Link>
      </div>
    </main>
  );
}

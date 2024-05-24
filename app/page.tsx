import Image from "next/image";
import Link from "next/link";
import ProductCard from "./components/ProductCard";

export default function Home() {
  return (
    <main>
      <Link href="/lists">Lists</Link>
      <ProductCard />
    </main>
  );
}

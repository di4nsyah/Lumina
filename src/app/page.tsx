import { getBooksByGenre } from "@/lib/bookService";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const shelves = await getBooksByGenre();

  return <HomeClient shelves={shelves} />;
}
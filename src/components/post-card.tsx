import { getAllBlogs } from "@/action";
import Pagination from "./pagination";
import BlogsData from "./blogs-data";

export default async function PostCard({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { count, data } = await getAllBlogs(searchParams);

  return (
    <>
      <BlogsData data={data} />
      <Pagination totalPages={Math.ceil(count / 10)} />
    </>
  );
}

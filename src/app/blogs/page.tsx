import PostCard from "@/components/post-card";
import SearchBar from "@/components/search-bar";

export default async function Blogs({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  return (
    <div className="mb-6">
      <SearchBar/>
      <PostCard searchParams={searchParams} />
    </div>
  );
}

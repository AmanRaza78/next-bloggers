import PostCard from "@/components/post-card";
import SearchBar from "@/components/search-bar";

export default async function Blogs({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";

  return (
    <div>
      <SearchBar />
      <PostCard query={query}/>
    </div>
  );
}

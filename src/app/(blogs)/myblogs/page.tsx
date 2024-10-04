import { getUserBlogs } from "@/action";
import DeletePostForm from "@/components/delete-post-form";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyBlogs() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }
  const posts = await getUserBlogs();
  
  return (
    <ul className="divide-y divide-gray-200">
      {!posts.length && "No posts found."}
      {posts.map((post) => {
        const { title, smalldescription, createdAt, id, user } = post;
        return (
          <li key={id} className="py-12">
            <article>
              <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500">
                    <p>
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "long",
                      }).format(createdAt)}
                    </p>
                  </dd>
                </dl>
                <div className="space-y-5 xl:col-span-3">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link href={`/post/${id}`} className="text-gray-900">
                          {title}
                        </Link>
                      </h2>
                      <div className="flex flex-wrap text-primary">
                        {user?.firstname} {user?.lastname}
                      </div>
                    </div>
                    <div className="prose max-w-none text-gray-500">
                      {smalldescription}
                    </div>
                  </div>
                  <div className="text-base font-medium leading-6">
                    <Link
                      href={`/post/${id}`}
                      className="text-primary"
                      aria-label={`Read more: "${title}"`}
                    >
                      Read more &rarr;
                    </Link>

                    <DeletePostForm postId={id} />
                  </div>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

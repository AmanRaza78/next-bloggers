import { getBlogs } from "@/action";
import Link from "next/link";

export default async function Home() {
  const posts = await getBlogs();
  return (
    <>
      <div className="divide-y">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight">
            Next<span className="text-primary">Bloggers</span>
          </h1>
          <p className="text-lg leading-7 text-gray-500">
            Our blog is your go-to destination for thought-provoking articles,
            industry insights, and practical tips to help you stay ahead of the
            curve.
          </p>
        </div>
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
                            <Link
                              href={`/post/${id}`}
                              className="text-gray-900"
                            >
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
                          href={`/blog/${id}`}
                          className="text-primary"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex justify-end text-base font-medium leading-6 mb-6">
        <Link href="/blogs" className="text-primary" aria-label="All Blogs">
          All Blogs &rarr;
        </Link>
      </div>
    </>
  );
}

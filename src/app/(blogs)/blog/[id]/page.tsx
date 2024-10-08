import BlogContent from "@/components/blog-content";
import LikeButton from "@/components/like-button";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { JSONContent } from "@tiptap/react";
import { redirect } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.post.findUnique({
    where: {
      id: id,
    },

    select: {
      createdAt: true,
      title: true,
      Likes: true,
      id: true,
      content: true,
      _count: {
        select: {
          Likes: true,
        },
      },
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return data;
}

export default async function BlogPage({ params }: { params: { id: string } }) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const post = await getData(params.id);

  if (!post) {
    return (
      <div>
        <p>No post Found</p>
      </div>
    );
  }
  return (
    <div className="w-full">
      <section className="bg-muted py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div>
                {" "}
                {post.user?.firstname} {post.user?.lastname}
              </div>
              <div className="h-4 w-px bg-muted" />
              <div>
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "long",
                }).format(post.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Separator className="my-4" />
      <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4">  
          <BlogContent content={post.content as JSONContent} />
      </div>
      <Separator className="my-4" />

      <LikeButton
        postId={post.id}
        initialState={{
          likes: post._count.Likes,
          isLikedByUser: post.Likes.some((like) => like.userId === user.id),
        }}
      />
    </div>
  );
}

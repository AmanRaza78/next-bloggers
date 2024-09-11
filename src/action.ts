"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { z } from "zod";

export type State = {
  status: "error" | "success" | undefined;
  error?: {
    [key: string]: string[];
  };
  message?: string | null;
};

const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, { message: "The title has to be a min character length of 3" }),
  smalldescription: z
    .string()
    .min(3, { message: "The title has to be a min character length of 3" }),
  content: z
    .string()
    .min(10, { message: "The title has to be a min character length of 10" }),
});

export async function CreateBlogPost(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const parsedFields = blogPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    smalldescription: formData.get("smalldescription"),
  });

  if (!parsedFields.success) {
    const state: State = {
      status: "error",
      error: parsedFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs",
    };

    return state;
  }

  const data = await prisma.post.create({
    data: {
      title: parsedFields.data.title,
      smalldescription: parsedFields.data.smalldescription,
      content: JSON.parse(parsedFields.data.content),
      userId: user.id,
    },
  });

  return redirect(`/post/${data.id}`);
}

export async function getBlogs() {
  const data = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      smalldescription: true,
      createdAt: true,
      user: {
        select: {
          firstname: true,
          lastname: true,
          profilepicture: true,
        },
      },
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export async function getAllBlogs() {
  const data = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      smalldescription: true,
      createdAt: true,
      user: {
        select: {
          firstname: true,
          lastname: true,
          profilepicture: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

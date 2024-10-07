"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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

const userSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: "The title has to be a min character length of 3" })
    .optional(),
  lastname: z
    .string()
    .min(3, { message: "The title has to be a min character length of 3" })
    .optional(),
  bio: z
    .string()
    .min(3, { message: "The title has to be a min character length of 3" })
    .optional(),
});

const deletePostSchema = z.object({
  postId: z.string(),
});

// Create a new blog post
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

// get blogs for home page
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

// get all the blogs
export async function getAllBlogs(searchParams: Record<string, string>) {
  try {
    const { page, query } = searchParams;
    const filters: any = {};

    if (query) {
      filters.OR = [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          smalldescription: {
            contains: query,
            mode: "insensitive",
          },
        },
      ];
    }

    const [count, data] = await prisma.$transaction([
      prisma.post.count({
        where: filters,
      }),

      prisma.post.findMany({
        take: 10,
        skip: page ? (Number(page) - 1) * 10 : 0,
        where: filters,
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
      }),
    ]);

    return { count, data };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch blogs");
  }
}

// Update the user Profile
export async function updateUser(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const parsedFields = userSchema.safeParse({
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      bio: formData.get("bio"),
    });

    if (!parsedFields.success) {
      const state: State = {
        status: "error",
        error: parsedFields.error.flatten().fieldErrors,
        message: "Oops, I think there is a mistake with your inputs",
      };

      return state;
    }

    const data = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstname: parsedFields.data.firstname,
        lastname: parsedFields.data.lastname,
        bio: parsedFields.data.bio,
      },
    });
    const state: State = {
      status: "success",
      message: "Your Settings have been updated",
    };

    return state;
  } catch (error) {
    console.log(error);
  }
}

// Get the user post
export async function getUserBlogs() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const data = await prisma.post.findMany({
      where: {
        userId: user.id,
      },
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
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch blogs");
  }
}

// Delete the user post
export async function deletePost(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const parsedFields = deletePostSchema.safeParse({
      postId: formData.get("postId"),
    });

    if (!parsedFields.success) {
      const state: State = {
        status: "error",
        error: parsedFields.error.flatten().fieldErrors,
        message: "Something Went Wrong",
      };

      return state;
    }
    await prisma.post.delete({
      where: {
        id: parsedFields.data.postId,
      },
    });
    const state: State = {
      status: "success",
      message: "Blog post Deleted Successfully",
    };
    return state;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete post");
  }
}

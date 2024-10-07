import prisma from "@/lib/db";
import { LikeInfo } from "@/lib/generated-types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const {getUser} = getKindeServerSession();
    const user = await getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        Likes: {
          where: {
            userId: user.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            Likes: true,
          },
        },
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const data: LikeInfo = {
      likes: post._count.Likes,
      isLikedByUser: !!post.Likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const {getUser} = getKindeServerSession();
    const user = await getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.like.upsert({
        where: {
          userId_postId: {
            userId: user.id,
            postId,
          },
        },
        create: {
          userId: user.id,
          postId,
        },
        update: {},
      }),
      ...(user.id !== post.userId
        ? [
            prisma.notifications.create({
              data: {
                issuserId: user.id,
                recipientId: post.userId ?? "",
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const {getUser} = getKindeServerSession();
    const user = await getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: user.id,
          postId,
        },
      }),
      prisma.notifications.deleteMany({
        where: {
          issuserId: user.id,
          recipientId: post.userId ?? "",
          postId,
          type: "LIKE",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
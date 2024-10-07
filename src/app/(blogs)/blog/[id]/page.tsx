import LikeButton from "@/components/like-button";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";


async function getData(id:string){
    const data = await prisma.post.findUnique({
        where:{
            id: id
        },

        select:{
            Likes:true,
            id:true,
            _count:{
                select:{
                    Likes:true
                }
            }
        }
    })

    return data
}


export default async function BlogPage({params}: {params: {id: string}}) {

    const {getUser} = getKindeServerSession()

    const user = await getUser()

    if (!user) {
        return redirect("/api/auth/login");
    }

    const post = await getData(params.id)

    if (!post) {
        return(
            <div>
            <p>No post Found</p>
            </div>
        )
    }
    return(
        <div>
            <h1>Blog Page</h1>
            <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.Likes,
              isLikedByUser: post.Likes.some((like) => like.userId === user.id),
            }}
          />
        </div>
    )

}
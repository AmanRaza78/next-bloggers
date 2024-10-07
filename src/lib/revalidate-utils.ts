"use server"
import { revalidatePath } from "next/cache"

export async function revalidateMyBlogs(){
    "use server"
    revalidatePath("myblogs")
  }
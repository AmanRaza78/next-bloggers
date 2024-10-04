"use client";

import { deletePost, State } from "@/action";
import { Button } from "./ui/button";
import SubmitButton from "./submit-button";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";


interface iAppProps {
    postId: string;
}

export default function DeletePostForm({postId}: iAppProps) {
    const initalState: State = { message: "", status: undefined };
    const [state, formAction] = useFormState(deletePost, initalState);
  
    useEffect(() => {
      if (state?.status === "success") {
        toast.success(state?.message);
      } else if (state?.status === "error") {
        toast.error(state?.message);
      }
    }, [state]);
    return(
        <form action={formAction}>
            <input type="hidden" name="postId" value={postId} />
            <SubmitButton text="Delete Post" />
        </form>
    )
}
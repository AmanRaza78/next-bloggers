"use client";
import { CreateBlogPost, type State } from "@/action";
import SubmitButton from "./submit-button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { JSONContent } from "@tiptap/react";
import { TipTapEditor } from "./editor";
import { toast } from "sonner";

export default function CreatePostForm() {
  const initalState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(CreateBlogPost, initalState);
  const [json, setJson] = useState<null | JSONContent>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);


  return (
    <form action={formAction}>
      <CardHeader>
        <CardTitle>
          Write Your blog post with{" "}
          <span className="text-xl tracking-tighter text-primary">
            NextBloggers
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="title">Blog Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Blog tltle (eg: Python Programming tips)"
            required
            minLength={3}
          />
          {state?.error?.["title"]?.[0] && (
            <p className="text-destructive">{state?.error?.["title"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="smalldescription">Blog Description</Label>
          <Input
            id="smalldescription"
            name="smalldescription"
            type="text"
            placeholder="What your blog is about?"
            required
            minLength={3}
          />
          {state?.error?.["smalldescription"]?.[0] && (
            <p className="text-destructive">
              {state?.error?.["smalldescription"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="content">Content</Label>
          <input type="hidden" name="content" value={JSON.stringify(json)} />
          <TipTapEditor json={json} setJson={setJson} />
          {state?.error?.["content"]?.[0] && (
            <p className="text-destructive">{state?.error?.["content"]?.[0]}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton />
      </CardFooter>
    </form>
  );
}

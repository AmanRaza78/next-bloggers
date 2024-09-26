"use client";
import { updateUser, type State } from "@/action";
import SubmitButton from "./submit-button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

interface iAppProps {
  firstname: string;
  lastname: string;
  bio: string;
}

export default function UpdateUserForm({
  firstname,
  lastname,
  bio,
}: iAppProps) {
  const initalState: State = { message: "", status: undefined };
  const [state, formAction] = useFormState(updateUser, initalState);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state?.message);
    } else if (state?.status === "error") {
      toast.error(state?.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <CardHeader>
        <CardTitle>
          Profile
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            name="firstname"
            type="text"
            defaultValue={firstname}
            required
            minLength={3}
          />
          {state?.error?.["firstname"]?.[0] && (
            <p className="text-destructive">
              {state?.error?.["firstname"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="lastname">Lastname</Label>
          <Input
            id="lastname"
            name="lastname"
            defaultValue={lastname}
            type="text"
            required
            minLength={3}
          />
          {state?.error?.["lastname"]?.[0] && (
            <p className="text-destructive">
              {state?.error?.["lastname"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" required minLength={3} defaultValue={bio} />
          {state?.error?.["bio"]?.[0] && (
            <p className="text-destructive">{state?.error?.["bio"]?.[0]}</p>
          )}
        </div>

      </CardContent>
      <CardFooter>
        <SubmitButton text="Update" />
      </CardFooter>
    </form>
  );
}

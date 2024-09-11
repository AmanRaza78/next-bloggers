"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>Please Wait....</Button>
      ) : (
        <Button type="submit">Post</Button>
      )}
    </>
  );
}

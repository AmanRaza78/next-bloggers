import { Card } from "@/components/ui/card";
import UpdateUserForm from "@/components/update-user-form";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

async function getUserData() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const data = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        firstname: true,
        lastname: true,
        bio: true,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

export default async function Profile() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const userData = await getUserData();
  if (!userData) {
    return redirect("No User Found");
  }
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
      <Card>
        <UpdateUserForm
          firstname={userData.firstname}
          lastname={userData.lastname}
          bio={userData.bio ?? ""}
        />
      </Card>
    </section>
  );
}

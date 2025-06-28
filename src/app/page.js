// app/page.js  (Server Component by default)

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LoginButton from "./components/LoginButton";
import UserInfo from "./components/UserInfo";
import Tools from "./tools/page";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="container mx-auto py-20">
      <div className="flex justify-between items-center mb-10">
        <h1>NextAuth.js Google Login</h1>
        <div className="flex items-center gap-2">
          <LoginButton />
          <UserInfo />
        </div>
      </div>

      {session ? (
        <Tools />
      ) : (
        <p className="text-center mt-10 text-red-600">
          Please login to access the tools.
        </p>
      )}
    </main>
  );
}

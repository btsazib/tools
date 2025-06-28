"use client";

import { Facebook, Github } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        {/* <p>Logged in as: {session.user.name}</p> */}
        <button onClick={() => signOut()} className="btn">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => signIn("google")}
        className="btn flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          role="img"
          color="#000000"
        >
          <path
            d="M15.5371 8.46599C14.6321 7.56027 13.3815 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12H12"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        Google
      </button>
      <br />
      <button
        onClick={() => signIn("facebook")}
        className="btn flex items-center gap-2"
      >
        <Facebook />
        Facebook
      </button>
      <br />
      <button
        onClick={() => signIn("github")}
        className="btn flex items-center gap-2"
      >
        <Github /> GitHub
      </button>
    </div>
  );
}

"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);

      // ✅ redirect to home page
      router.push("/");

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-6 py-3"
      >
        Login with Google
      </button>
    </div>
  );
}
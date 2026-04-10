"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";

export default function Login() {

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
    alert("Logged in!");
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
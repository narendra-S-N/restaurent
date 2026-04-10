"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);

  // 🔥 Check login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 🔓 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Restaurant Admin Panel</h1>

      {/* ✅ Show user name */}
      {user && (
        <p className="mt-3 text-green-600">
          Welcome, {user.displayName}
        </p>
      )}

      <div className="mt-5">
        {/* 🔐 Login button (only if NOT logged in) */}
        {!user && (
          <Link href="/login">
            <button className="bg-blue-500 text-white px-4 py-2 mr-3">
              Login
            </button>
          </Link>
        )}

        {/* 🔓 Logout button */}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 mr-3"
          >
            Logout
          </button>
        )}

        {/* 🚫 Disabled before login */}
        <Link href="/dashboard">
          <button
            disabled={!user}
            className={`px-4 py-2 mr-3 ${
              user
                ? "bg-green-500 text-white"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Dashboard
          </button>
        </Link>

        <Link href="/add-restaurant">
          <button
            disabled={!user}
            className={`px-4 py-2 ${
              user
                ? "bg-purple-500 text-white"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Add Restaurant
          </button>
        </Link>
      </div>
    </div>
  );
}
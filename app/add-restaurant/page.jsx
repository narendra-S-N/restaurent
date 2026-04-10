"use client";

import { useState } from "react";
import { db, auth } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddRestaurant() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleAdd = async () => {
    const user = auth.currentUser;

    if (!name || !user) {
      alert("Login required");
      return;
    }

    await addDoc(collection(db, "restaurants"), {
      name: name,
      ownerEmail: user.email,
      createdAt: new Date()
    });

    alert("Restaurant Added!");

    // 🔥 redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Add Restaurant</h1>

      <input
        className="border p-2 mt-3"
        placeholder="Restaurant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 mt-3"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
}
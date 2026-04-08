"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddRestaurant() {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name) return;

    await addDoc(collection(db, "restaurants"), {
      name: name,
      createdAt: new Date()
    });

    alert("Restaurant Added!");
    setName("");
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
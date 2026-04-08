"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const snapshot = await getDocs(collection(db, "restaurants"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRestaurants(data);
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>

   {restaurants.map((r) => (
  <div key={r.id} className="border p-3 mt-3">
    <Link href={`/restaurant/${r.id}`}>
      <h2 className="cursor-pointer text-blue-500">
        {r.name}
      </h2>
    </Link>
  </div>
))}
    </div>
  );
}
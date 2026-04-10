"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);

  const ADMIN_EMAIL = "narendraseerla@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      setUser(currentUser);

      const snapshot = await getDocs(collection(db, "restaurants"));

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      let filteredData;

      if (currentUser.email === ADMIN_EMAIL) {
        filteredData = data;
      } else {
        filteredData = data.filter(
          r => r.ownerEmail === currentUser.email
        );
      }

      setRestaurants(filteredData);
    });

    return () => unsubscribe();
  }, []);

  const canModify = (restaurant) => {
    if (!user) return false;

    return (
      user.email === restaurant.ownerEmail ||
      user.email === ADMIN_EMAIL
    );
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {restaurants.length === 0 && (
        <p className="mt-3 text-gray-500">No restaurants found</p>
      )}

      {restaurants.map((r) => (
        <div key={r.id} className="border p-3 mt-3">
          
          <Link href={`/restaurant/${r.id}`}>
            <h2 className="cursor-pointer text-blue-500">
              {r.name}
            </h2>
          </Link>

          {canModify(r) && (
            <div className="mt-2">
              <button className="bg-yellow-500 px-2 py-1 mr-2">
                Edit
              </button>
              <button className="bg-red-500 text-white px-2 py-1">
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
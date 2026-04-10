"use client";

import { useEffect, useState } from "react";
import { db, storage, auth } from "../../lib/firebase";
import { useRouter, useParams } from "next/navigation";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function RestaurantPage() {
  const { id } = useParams();
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [menu, setMenu] = useState([]);
  const [image, setImage] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // 🔐 Protect route
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
    }
  }, []);

  // 🔥 Real-time menu fetch
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "restaurants", id, "menu"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenu(data);
      }
    );

    return () => unsubscribe();
  }, [id]);

  // ➕ Add item
  const addMenuItem = async () => {
    const user = auth.currentUser;
    if (!user) return;

    let imageUrl = "";

    if (image) {
      const imageRef = ref(storage, `menu/${Date.now()}-${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "restaurants", id, "menu"), {
      name: item,
      price: Number(price),
      image: imageUrl,
      ownerEmail: user.email,
      category: category,
    });

    setItem("");
    setPrice("");
    setCategory("");
    setImage(null);
  };

  // ❌ Delete
  const deleteItem = async (itemId) => {
    await deleteDoc(doc(db, "restaurants", id, "menu", itemId));
  };

  // ✏ Update
  const updateItem = async () => {
    await updateDoc(
      doc(db, "restaurants", id, "menu", editItem.id),
      {
        name: editItem.name,
        price: Number(editItem.price),
      }
    );

    setEditItem(null);
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Menu Management</h1>

      {/* Category */}
      <select
        className="border p-2 mt-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="veg">Veg</option>
        <option value="non-veg">Non-Veg</option>
        <option value="drinks">Drinks</option>
      </select>

      {/* Add Item */}
      <div className="mt-4">
        <input
          placeholder="Item Name"
          className="border p-2 mr-2"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />

        <input
          placeholder="Price"
          className="border p-2 mr-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          onClick={addMenuItem}
          className="bg-green-500 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      {/* Menu List */}
      <div className="mt-6">
        {menu.map((m) => (
          <div
            key={m.id}
            className="border p-3 mt-2 flex justify-between"
          >
            <div>
              {/* <img
                src={m.image}
                className="w-16 h-16 object-cover"
              /> */}
              <p>{m.name} - ₹{m.price}</p>
              <p>{m.category}</p>
            </div>

            <div>
              <button
                onClick={() => setEditItem(m)}
                className="bg-blue-500 text-white px-2 py-1 mr-2"
              >
                Edit
              </button>

              <button
                onClick={() => deleteItem(m.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Popup */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded">
            <h2>Edit Item</h2>

            {/* <img
              src={editItem.image}
              className="w-16 h-16 object-cover"
            /> */}

            <input
              className="border p-2 block mt-2"
              value={editItem.name}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
            />

            <input
              className="border p-2 block mt-2"
              value={editItem.price}
              onChange={(e) =>
                setEditItem({ ...editItem, price: e.target.value })
              }
            />

            <button
              onClick={updateItem}
              className="bg-green-500 text-white px-3 py-1 mt-2"
            >
              Save
            </button>

            <button
              onClick={() => setEditItem(null)}
              className="ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
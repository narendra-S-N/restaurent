"use client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { storage } from "../../lib/firebase"; // ✅ ADD THIS
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useParams } from "next/navigation";

export default function RestaurantPage() {
  const { id } = useParams();
  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [menu, setMenu] = useState([]);

  //added image logic here
  const [image, setImage] = useState(null);

  const [editItem, setEditItem] = useState(null);

  // 📌 Fetch menu items
  const fetchMenu = async () => {
    const snapshot = await getDocs(
      collection(db, "restaurants", id, "menu")
    );

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMenu(data);
  };

  // useEffect(() => {
  //   fetchMenu();
  // }, []);


useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "restaurants", id, "menu"),
    (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenu(data);
    }
  );

  return () => unsubscribe();
}, []);

  // ❌ Delete item
  const deleteItem = async (itemId) => {
    await deleteDoc(doc(db, "restaurants", id, "menu", itemId));
    fetchMenu();
  };


  const addMenuItem = async () => {
    let imageUrl = "";

    if (image) {
      const imageRef = ref(storage, `menu/${Date.now()}-${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    // await addDoc(collection(db, "restaurants", id, "menu"), {
    //   name: item,
    //   price: Number(price),
    //   image: imageUrl,
    // });
    await addDoc(collection(db, "restaurants", id, "menu"), {
      name: item,
      price: Number(price),
      image: imageUrl,
      category: category,
    });

    fetchMenu();
  };

  // ✏ Update item
  const updateItem = async () => {
    await updateDoc(
      doc(db, "restaurants", id, "menu", editItem.id),
      {
        name: editItem.name,
        price: Number(editItem.price),
      }
    );

    setEditItem(null);
    fetchMenu();
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Menu Management</h1>
      <select
        className="border p-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="veg">Veg</option>
        <option value="non-veg">Non-Veg</option>
        <option value="drinks">Drinks</option>
      </select>
      {/* ➕ Add Item */}
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
          className="mt-2"
        />
        <button
          onClick={addMenuItem}
          className="bg-green-500 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      {/* 📋 Menu List */}
      <div className="mt-6">
        <h2 className="font-semibold">Menu Items</h2>

        {menu.map((m) => (
          <div
            key={m.id}
            className="border p-3 mt-2 flex justify-between"
          >
            <div>
              {m.name} - ₹{m.price}
            </div>
            <p>{m.category}</p>
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

      {/* 🧠 EDIT POPUP */}
      {editItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded">
            <h2 className="text-lg font-bold mb-3">Edit Item</h2>
            <img src={m.image} className="w-16 h-16 object-cover" />
            <input
              className="border p-2 block mb-2"
              value={editItem.name}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
            />

            <input
              className="border p-2 block mb-2"
              value={editItem.price}
              onChange={(e) =>
                setEditItem({ ...editItem, price: e.target.value })
              }
            />

            <button
              onClick={updateItem}
              className="bg-green-500 text-white px-3 py-1 mr-2"
            >
              Save
            </button>

            <button
              onClick={() => setEditItem(null)}
              className="bg-gray-500 text-white px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
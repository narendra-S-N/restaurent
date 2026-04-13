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

const [quantity, setQuantity] = useState("");
const [discountType, setDiscountType] = useState("none");
const [discountValue, setDiscountValue] = useState("");
const [baseQuantity, setBaseQuantity] = useState("");
const [unit, setUnit] = useState("");

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
  category: category, // ✅ ADD THIS

  baseQuantity: Number(baseQuantity),
  unit: unit,

  discountType,
  discountValue:
    discountType === "none" ? 0 : Number(discountValue)
});

    setItem("");
    setPrice("");
    setCategory("");
    setImage(null);
      setDiscountType("none");
      setBaseQuantity("");
      setUnit("");

  };

const getFinalPrice = (item) => {
  if (item.discountType === "none") return item.price;

  if (item.discountType === "percent") {
    return item.price - (item.price * item.discountValue) / 100;
  }

  if (item.discountType === "flat") {
    return item.price - item.discountValue;
  }
};
  // ❌ Delete
  const deleteItem = async (itemId) => {
    await deleteDoc(doc(db, "restaurants", id, "menu", itemId));
  };

  // ✏ Update
  const updateItem = async () => {
await updateDoc(doc(db, "restaurants", id, "menu", editItem.id), {
  name: editItem.name,
  price: Number(editItem.price),
  category: editItem.category,

  baseQuantity: Number(editItem.baseQuantity),
  unit: editItem.unit,

  discountType: editItem.discountType,
  discountValue:
    editItem.discountType === "none"
      ? 0
      : Number(editItem.discountValue)
}); 
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

<select
  className="border p-2 block mt-2"
  value={discountType}
  onChange={(e) => setDiscountType(e.target.value)}
>
  <option value="none">No Discount</option>
  <option value="percent">Percentage (%)</option>
  <option value="flat">Flat Amount (₹)</option>
</select>

{/* 👇 Show only if discount is selected */}
{discountType !== "none" && (
  <input
    placeholder="Discount Value"
    className="border p-2 block mt-2"
    value={discountValue}
    onChange={(e) => setDiscountValue(e.target.value)}
  />
)}

<input
  placeholder="Quantity Number (e.g. 6)"
  className="border p-2 block mt-2"
  value={baseQuantity}
  onChange={(e) => setBaseQuantity(e.target.value)}
/>

<input
  placeholder="Unit (e.g. pieces, plate, ml)"
  className="border p-2 block mt-2"
  value={unit}
  onChange={(e) => setUnit(e.target.value)}
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
    className="border p-4 mt-3 rounded-lg flex justify-between items-center shadow-sm"
  >
    {/* LEFT SIDE */}
    <div className="flex items-center gap-4">

      {/* IMAGE */}
      {m.image && (
        <img
          src={m.image}
          className="w-16 h-16 object-cover rounded"
        />
      )}

      <div>
        {/* CATEGORY */}
        <p className="text-sm text-gray-500">
          {m.category || "No Category"}
        </p>

        {/* NAME */}
        <h2 className="font-semibold text-lg">{m.name}</h2>

        {/* QUANTITY */}
        <p className="text-sm text-gray-600">
          {m.baseQuantity || 0} {m.unit || ""}
        </p>

        {/* PRICE */}
        <p className="text-md font-medium">
          ₹{getFinalPrice(m)}

          {m.discountType !== "none" && (
            <span className="line-through text-gray-400 ml-2 text-sm">
              ₹{m.price}
            </span>
          )}
        </p>

        {/* DISCOUNT */}
        {m.discountType !== "none" && (
          <p className="text-green-600 text-sm">
            {m.discountType === "percent"
              ? `${m.discountValue}% OFF`
              : `₹${m.discountValue} OFF`}
          </p>
        )}
      </div>
    </div>

    {/* RIGHT SIDE BUTTONS */}
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setEditItem(m)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Edit
      </button>

      <button
        onClick={() => deleteItem(m.id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
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

            <input
  value={editItem.category || ""}
  onChange={(e) =>
    setEditItem({ ...editItem, category: e.target.value })
  }
/>

<input
  value={editItem.baseQuantity || ""}
  onChange={(e) =>
    setEditItem({ ...editItem, baseQuantity: e.target.value })
  }
/>

<input
  value={editItem.unit || ""}
  onChange={(e) =>
    setEditItem({ ...editItem, unit: e.target.value })
  }
/>
<select
  value={editItem.discountType}
  onChange={(e) =>
    setEditItem({ ...editItem, discountType: e.target.value })
  }
>
  <option value="none">No Discount</option>
  <option value="percent">%</option>
  <option value="flat">₹</option>
</select>

{editItem.discountType !== "none" && (
  <input
    value={editItem.discountValue}
    onChange={(e) =>
      setEditItem({
        ...editItem,
        discountValue: e.target.value
      })
    }
  />
)}

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
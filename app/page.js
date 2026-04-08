import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Restaurant Admin Panel</h1>

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard">
          <button>Go to Dashboard</button>
        </Link>
      </div>

      <div style={{ marginTop: 10 }}>
        <Link href="/add-restaurant">
          <button>Add Restaurant</button>
        </Link>
      </div>
    </div>
  );
}
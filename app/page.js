import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Checkout App</h1>
      <a href="/checkout">Pay Your Bill</a>
      <a href="/backoffice">Admin Panel</a>
    </main>
  );
}

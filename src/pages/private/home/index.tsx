import { Link } from "react-router";

export default function HomePage() {
  return (
    <main className="container flex gap-2">
      HomePage
      <Link to="/dev" className="text-blue-500 underline">
        Go to Dev Page
      </Link>
    </main>
  );
}

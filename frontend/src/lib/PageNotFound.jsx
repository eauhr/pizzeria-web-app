import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>

        <p className="mt-4 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
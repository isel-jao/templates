import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { register } from "../hooks/use-auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Partial<typeof values>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof typeof values) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const result = RegisterSchema.safeParse(values);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors({ name: fe.name?.[0], email: fe.email?.[0], password: fe.password?.[0] });
      return;
    }

    setLoading(true);
    try {
      await register(values.name, values.email, values.password);
      navigate("/login");
    } catch {
      setServerError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={values.name} onChange={set("name")} error={errors.name} autoComplete="name" />
          <Input label="Email" type="email" value={values.email} onChange={set("email")} error={errors.email} autoComplete="email" />
          <Input label="Password" type="password" value={values.password} onChange={set("password")} error={errors.password} autoComplete="new-password" />
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  );
}

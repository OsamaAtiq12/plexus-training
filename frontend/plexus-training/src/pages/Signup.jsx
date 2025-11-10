import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api";
import { setToken } from "../auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signup(name, email, password);
      setToken(res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2">
      <div className="relative order-2 md:order-1 flex items-center justify-center p-10 md:p-16 bg-card text-card-foreground">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Start your journey with us
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6">
            Have an account?{" "}
            <Link className="text-primary hover:underline" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="relative order-1 md:order-2 flex items-center justify-center p-10 md:p-16 bg-gradient-to-br from-neutral-900 to-black text-white rounded-l-[120px] overflow-hidden">
        <div className="max-w-sm text-center">
          <h2 className="text-3xl font-semibold">Welcome back!</h2>
          <p className="mt-2 text-white/80 text-sm">
            Already have an account? Sign in to continue.
          </p>
          <Button
            asChild
            className="mt-6 bg-white text-black hover:opacity-90 mx-auto"
            variant="secondary"
          >
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

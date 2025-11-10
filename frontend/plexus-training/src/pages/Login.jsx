import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import { setToken } from "../auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);

       console.log("Login response:", res);
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
      <div className="relative flex items-center justify-center p-10 md:p-16 bg-gradient-to-br from-neutral-900 to-black text-white rounded-r-[120px] overflow-hidden">
        <div className="max-w-sm text-center md:text-left">
          <h2 className="text-3xl font-semibold">New here?</h2>
          <p className="mt-2 text-white/80 text-sm">
            Create an account to get started and access all features.
          </p>
          <Button
            asChild
            variant="secondary"
            className="mt-6 bg-white text-black hover:opacity-90"
          >
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
        {/* accent removed */}
      </div>
      <div className="flex items-center justify-center p-10 md:p-16 bg-card text-card-foreground">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Log in to your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6">
            No account?{" "}
            <Link className="text-primary hover:underline" to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

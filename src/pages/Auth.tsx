import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Auth = ({ mode }: { mode: "login" | "signup" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => { if (user) navigate("/", { replace: true }); }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back! 🎉");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're in!");
      }
      navigate("/");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-mesh p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-96 w-96 animate-blob rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 animate-blob rounded-full bg-accent/30 blur-3xl" style={{ animationDelay: "5s" }} />
      </div>

      <div className="w-full max-w-md animate-scale-in glass-strong rounded-3xl p-8 shadow-elegant">
        <Link to="/" className="group mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow transition-spring group-hover:rotate-6 group-hover:scale-110">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Notes<span className="text-gradient">Bridge</span></span>
        </Link>

        <h1 className="mb-1 text-center text-2xl font-bold">
          {isLogin ? "Welcome back" : "Join NotesBridge"}
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Sign in to access your nest" : "Create a free account in 10 seconds"}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" type="text" placeholder="Your name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-11 glass" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@college.edu" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 glass" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Min 6 characters" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 glass" />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-gradient-hero text-primary-foreground shadow-soft transition-spring hover:shadow-glow hover:-translate-y-0.5"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>New to NotesBridge? <Link to="/signup" className="font-semibold text-gradient hover:underline">Create account</Link></>
          ) : (
            <>Already have an account? <Link to="/login" className="font-semibold text-gradient hover:underline">Sign in</Link></>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, User, Hash, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

const LoginPage = () => {
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const inIframe = isInIframe();

  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      if (!name || !studentId || !email || !password) {
        toast({ title: "กรุณากรอกข้อมูลให้ครบถ้วน", variant: "destructive" });
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbygeVqi60zn8gWeSAhRXp0ZUIc76fmQeZywvrBtmHtrh7LJk3ZKDBFoIdh-fOlMVXjNCA/exec",
          {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, studentId, email, password }),
          }
        );
        toast({ title: "สมัครสมาชิกสำเร็จ!", description: "กรุณาเข้าสู่ระบบ" });
        setIsSignUp(false);
        setName("");
        setStudentId("");
        setEmail("");
        setPassword("");
      } catch {
        toast({ title: "เกิดข้อผิดพลาด กรุณาลองใหม่", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        toast({ title: "กรุณากรอกอีเมลและรหัสผ่าน", variant: "destructive" });
        return;
      }
      setLoading(true);
      try {
        // TODO: Verify against Google Sheets data
        toast({ title: "กำลังเข้าสู่ระบบ..." });
      } catch {
        toast({ title: "เกิดข้อผิดพลาด", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[hsl(210,60%,98%)]">
      {/* Cloud curve background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top wave */}
        <svg
          className="absolute -top-10 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: "260px" }}
        >
          <path
            fill="hsl(217, 91%, 50%)"
            fillOpacity="0.12"
            d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
        <svg
          className="absolute -top-4 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: "220px" }}
        >
          <path
            fill="hsl(217, 91%, 50%)"
            fillOpacity="0.07"
            d="M0,96L60,112C120,128,240,160,360,165.3C480,171,600,149,720,128C840,107,960,85,1080,96C1200,107,1320,149,1380,170.7L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
        {/* Bottom wave */}
        <svg
          className="absolute -bottom-10 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: "280px" }}
        >
          <path
            fill="hsl(217, 91%, 50%)"
            fillOpacity="0.10"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute -bottom-4 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: "240px" }}
        >
          <path
            fill="hsl(217, 91%, 50%)"
            fillOpacity="0.06"
            d="M0,288L60,272C120,256,240,224,360,218.7C480,213,600,235,720,245.3C840,256,960,256,1080,234.7C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
        {/* Floating circles */}
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute top-40 right-16 h-24 w-24 rounded-full bg-primary/8 blur-xl" />
        <div className="absolute bottom-32 left-1/4 h-20 w-20 rounded-full bg-primary/6 blur-xl" />
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-6 py-8 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-primary-foreground">
              ระบบจัดการฝึกงาน
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Internship Management System
            </p>
          </div>

          {/* Toggle */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                isSignUp
                  ? "border-b-2 border-primary text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              สมัครสมาชิก
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                !isSignUp
                  ? "border-b-2 border-primary text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              เข้าสู่ระบบ
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {isSignUp && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium text-foreground">
                    ชื่อ-นามสกุล
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="กรอกชื่อ-นามสกุล"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="studentId" className="text-xs font-medium text-foreground">
                    รหัสนักศึกษา
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="studentId"
                      placeholder="กรอกรหัสนักศึกษา"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                อีเมล
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="กรอกอีเมล"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-foreground">
                รหัสผ่าน
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-semibold"
            >
              {loading
                ? "กำลังดำเนินการ..."
                : isSignUp
                ? "สมัครสมาชิก"
                : "เข้าสู่ระบบ"}
            </Button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">หรือ</span>
              </div>
            </div>

            {/* Google login */}
            {inIframe ? (
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full h-11 text-sm font-medium gap-3 rounded-md border border-input bg-background text-foreground hover:bg-accent transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                เข้าสู่ระบบด้วย Google
              </a>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={loginWithGoogle}
                className="w-full h-11 text-sm font-medium gap-3"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                เข้าสู่ระบบด้วย Google
              </Button>
            )}
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          © 2026 ระบบจัดการฝึกงาน — Internship Management System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

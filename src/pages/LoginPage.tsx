import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, User, Hash, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SIGNUP_URL =
  "https://script.google.com/macros/s/AKfycbyvrog1HOPr2UfzTbZgMqErRzpM3rrh0jIoAmgDwAmU6MLToeYETR3JnD-KGEntP-Bh9A/exec";

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

const THAI_TITLES = ["นาย", "นาง", "นางสาว", "ผศ.", "รศ.", "ศ."];
const EN_TITLES = ["Mr.", "Mrs.", "Ms.", "Asst.Prof.", "Assoc.Prof.", "Prof."];
const ROLES = [
  { value: "student", label: "นักศึกษา (Student)" },
  { value: "teacher", label: "อาจารย์ (Teacher)" },
  { value: "staff", label: "เจ้าหน้าที่ (Staff)" },
];

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LoginPage = () => {
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const inIframe = isInIframe();

  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign-up fields
  const [role, setRole] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [nameTitle, setNameTitle] = useState("");
  const [nameTitleEn, setNameTitleEn] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameEn, setFirstNameEn] = useState("");
  const [lastNameEn, setLastNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const idLabel = role === "student" ? "รหัสนักศึกษา (Student ID)" : "รหัสบุคลากร (Staff ID)";

  const clearForm = () => {
    setRole(""); setIdNumber(""); setNameTitle(""); setNameTitleEn("");
    setFirstName(""); setLastName(""); setFirstNameEn(""); setLastNameEn("");
    setEmail(""); setPassword(""); setPhone("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      if (!role || !idNumber || !nameTitle || !nameTitleEn || !firstName || !lastName || !firstNameEn || !lastNameEn || !email || !password || !phone) {
        toast({ title: "กรุณากรอกข้อมูลให้ครบถ้วน", variant: "destructive" });
        return;
      }
      setLoading(true);
      try {
        await fetch(SIGNUP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_number: idNumber,
            name_title: nameTitle,
            name_title_en: nameTitleEn,
            first_name: firstName,
            last_name: lastName,
            first_name_en: firstNameEn,
            last_name_en: lastNameEn,
            email,
            password,
            phone,
            role,
          }),
        });
        toast({ title: "สมัครสมาชิกสำเร็จ!", description: "กรุณาเข้าสู่ระบบ" });
        setIsSignUp(false);
        clearForm();
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
      {/* Cloud background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute -top-10 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: "260px" }}>
          <path fill="hsl(217,91%,50%)" fillOpacity="0.12" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </svg>
        <svg className="absolute -bottom-10 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: "280px" }}>
          <path fill="hsl(217,91%,50%)" fillOpacity="0.10" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute top-40 right-16 h-24 w-24 rounded-full bg-primary/8 blur-xl" />
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-6 py-6 text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-primary-foreground">ระบบจัดการฝึกงาน</h1>
            <p className="mt-0.5 text-xs text-primary-foreground/80">Internship Management System</p>
          </div>

          {/* Toggle */}
          <div className="flex border-b border-border">
            <button type="button" onClick={() => setIsSignUp(true)} className={`flex-1 py-3 text-sm font-semibold transition-colors ${isSignUp ? "border-b-2 border-primary text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
              สมัครสมาชิก
            </button>
            <button type="button" onClick={() => setIsSignUp(false)} className={`flex-1 py-3 text-sm font-semibold transition-colors ${!isSignUp ? "border-b-2 border-primary text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
              เข้าสู่ระบบ
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 px-6 py-5 max-h-[60vh] overflow-y-auto">
            {isSignUp && (
              <>
                {/* Role */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-foreground">บทบาท (Role)</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue placeholder="เลือกบทบาท" /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ID Number */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-foreground">{idLabel}</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder={role === "student" ? "กรอกรหัสนักศึกษา" : "กรอกรหัสบุคลากร"} value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="pl-10" />
                  </div>
                </div>

                {/* Thai Title + Name */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">คำนำหน้า</Label>
                    <Select value={nameTitle} onValueChange={setNameTitle}>
                      <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                      <SelectContent>
                        {THAI_TITLES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">ชื่อ</Label>
                    <Input placeholder="ชื่อ" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">นามสกุล</Label>
                    <Input placeholder="นามสกุล" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                {/* English Title + Name */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">Title</Label>
                    <Select value={nameTitleEn} onValueChange={setNameTitleEn}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {EN_TITLES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">First Name</Label>
                    <Input placeholder="First Name" value={firstNameEn} onChange={(e) => setFirstNameEn(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">Last Name</Label>
                    <Input placeholder="Last Name" value={lastNameEn} onChange={(e) => setLastNameEn(e.target.value)} />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-foreground">เบอร์โทรศัพท์ (Phone)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="0XX-XXX-XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">อีเมล (Email)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="กรอกอีเมล" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">รหัสผ่าน (Password)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="กรอกรหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-semibold">
              {loading ? "กำลังดำเนินการ..." : isSignUp ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
            </Button>

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">หรือ</span></div>
            </div>

            {/* Google login */}
            {inIframe ? (
              <a href={window.location.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full h-11 text-sm font-medium gap-3 rounded-md border border-input bg-background text-foreground hover:bg-accent transition-colors">
                <GoogleIcon /> เข้าสู่ระบบด้วย Google
              </a>
            ) : (
              <Button type="button" variant="outline" onClick={loginWithGoogle} className="w-full h-11 text-sm font-medium gap-3">
                <GoogleIcon /> เข้าสู่ระบบด้วย Google
              </Button>
            )}
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">© 2026 ระบบจัดการฝึกงาน — Internship Management System</p>
      </div>
    </div>
  );
};

export default LoginPage;

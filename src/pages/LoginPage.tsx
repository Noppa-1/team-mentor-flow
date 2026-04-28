import { useState } from "react";
import { GraduationCap, Hash, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SIGNUP_URL =
  "https://script.google.com/macros/s/AKfycbyvrog1HOPr2UfzTbZgMqErRzpM3rrh0jIoAmgDwAmU6MLToeYETR3JnD-KGEntP-Bh9A/exec";

const EMAIL_DOMAIN = "@g.swu.ac.th";

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

const LoginPage = () => {
  const { toast } = useToast();

  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const isStudent = role === "student";

  const clearForm = () => {
    setRole(""); setIdNumber(""); setNameTitle(""); setNameTitleEn("");
    setFirstName(""); setLastName(""); setFirstNameEn(""); setLastNameEn("");
    setEmail(""); setPassword(""); setPhone("");
  };

  const validateEmail = (v: string) => v.endsWith(EMAIL_DOMAIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      // Common required fields
      if (!role || !nameTitle || !nameTitleEn || !firstName || !lastName || !firstNameEn || !lastNameEn || !email || !password || !phone) {
        toast({ title: "กรุณากรอกข้อมูลให้ครบถ้วน", variant: "destructive" });
        return;
      }
      if (isStudent && !idNumber) {
        toast({ title: "กรุณากรอกรหัสนักศึกษา", variant: "destructive" });
        return;
      }
      if (!validateEmail(email)) {
        toast({ title: `กรุณาใช้อีเมล ${EMAIL_DOMAIN} เท่านั้น`, variant: "destructive" });
        return;
      }
      if (password.length < 6) {
        toast({ title: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", variant: "destructive" });
        return;
      }

      setLoading(true);
      try {
        await fetch(SIGNUP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_number: isStudent ? idNumber : "",
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
      if (!validateEmail(email)) {
        toast({ title: `กรุณาใช้อีเมล ${EMAIL_DOMAIN} เท่านั้น`, variant: "destructive" });
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(SIGNUP_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action: "login", email, password }),
        });
        const data = await res.json();
        if (data.status === "success") {
          toast({ title: "เข้าสู่ระบบสำเร็จ!" });
          // Store user profile from response (handle nested or flat structure)
          const userProfile = data.user || data.data || data;
          localStorage.setItem("user", JSON.stringify(userProfile));
          window.location.href = "/";
        } else {
          toast({ title: data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง", variant: "destructive" });
        }
      } catch {
        toast({ title: "เกิดข้อผิดพลาด กรุณาลองใหม่", variant: "destructive" });
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
          <path fill="hsl(348,83%,47%)" fillOpacity="0.12" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </svg>
        <svg className="absolute -bottom-10 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: "280px" }}>
          <path fill="hsl(348,83%,47%)" fillOpacity="0.10" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
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
            <h1 className="text-lg font-bold text-primary-foreground">HU Co-op & Internship</h1>
            <p className="mt-0.5 text-xs text-primary-foreground/80">HU Co-op & Internship</p>
          </div>

          {/* Toggle */}
          <div className="flex border-b border-border">
            <button type="button" onClick={() => setIsSignUp(true)} className={`flex-1 py-3 text-sm font-semibold transition-colors ${isSignUp ? "border-b-2 border-primary text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
              ลงทะเบียน
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
                  <Select value={role} onValueChange={(v) => { setRole(v); if (v !== "student") setIdNumber(""); }}>
                    <SelectTrigger><SelectValue placeholder="เลือกบทบาท" /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Student ID — only for students */}
                {isStudent && (
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">รหัสนักศึกษา (Student ID) *</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="กรอกรหัสนักศึกษา" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                )}

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
              <Label className="text-xs font-medium text-foreground">อีเมล (Email — @g.swu.ac.th เท่านั้น)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="username@g.swu.ac.th" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">รหัสผ่าน (Password)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="อย่างน้อย 6 ตัวอักษร" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-semibold">
              {loading ? "กำลังดำเนินการ..." : isSignUp ? "ลงทะเบียน" : "เข้าสู่ระบบ"}
            </Button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">© 2026 HU Co-op & Internship</p>
      </div>
    </div>
  );
};

export default LoginPage;

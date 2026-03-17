import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Hash,
  Building2,
  MapPin,
  CalendarDays,
  FileText,
  ClipboardCheck,
  BookOpen,
  ArrowRight,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCircle,
  GraduationCap,
  BookMarked,
} from "lucide-react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyvrog1HOPr2UfzTbZgMqErRzpM3rrh0jIoAmgDwAmU6MLToeYETR3JnD-KGEntP-Bh9A/exec";

const fetchUserProfile = async (email: string): Promise<UserData | null> => {
  try {
    const res = await fetch(`${API_URL}?action=getProfile&email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data.status === "success") {
      const profile = data.user || data.data || data;
      localStorage.setItem("user", JSON.stringify(profile));
      return profile as UserData;
    }
  } catch (err) {
    console.error("Failed to fetch profile:", err);
  }
  return null;
};

interface UserData {
  id_number: string;
  name_title: string;
  first_name: string;
  last_name: string;
  name_title_en: string;
  first_name_en: string;
  last_name_en: string;
  email: string;
  phone: string;
  role: string;
  major?: string;
  major_en?: string;
  curriculum?: string;
  curriculum_en?: string;
  advisor?: string;
  term?: string;
  academic_year?: string;
}

interface InternshipData {
  company_name?: string;
  company_address?: string;
  contact_person?: string;
  start_date?: string;
  end_date?: string;
}

interface DocumentStatus {
  name: string;
  status: "submitted" | "pending" | "not_submitted";
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [internship, setInternship] = useState<InternshipData | null>(null);
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }

    const loadUser = async () => {
      try {
        const parsed = JSON.parse(stored);
        // Map from login response to UserData
        const user: UserData = {
          id_number: parsed.id_number || parsed.studentId || "",
          name_title: parsed.name_title || "",
          first_name: parsed.first_name || "",
          last_name: parsed.last_name || "",
          name_title_en: parsed.name_title_en || "",
          first_name_en: parsed.first_name_en || "",
          last_name_en: parsed.last_name_en || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          role: parsed.role || "student",
          major: parsed.major || "",
          major_en: parsed.major_en || "",
          curriculum: parsed.curriculum || "",
          curriculum_en: parsed.curriculum_en || "",
          advisor: parsed.advisor || "",
          term: parsed.term || "",
          academic_year: parsed.academic_year || "",
        };

        // If key fields are missing, fetch full profile from API
        if (!user.first_name && user.email) {
          const fetched = await fetchUserProfile(user.email);
          if (fetched) {
            setUserData(fetched);
            setLoading(false);
            return;
          }
        }

        setUserData(user);

        // Internship data
        setInternship({
          company_name: parsed.company_name || "",
          company_address: parsed.company_address || "",
          contact_person: parsed.contact_person || "",
          start_date: parsed.start_date || "",
          end_date: parsed.end_date || "",
        });

        // Document status
        setDocuments([
          { name: "ใบสมัครฝึกงาน", status: parsed.doc_application || "not_submitted" },
          { name: "ใบนิเทศการฝึกงาน", status: parsed.doc_supervision || "not_submitted" },
          { name: "รายงานการฝึกงาน", status: parsed.doc_report || "not_submitted" },
          { name: "แบบประเมินผล", status: parsed.doc_evaluation || "not_submitted" },
        ]);
      } catch {
        navigate("/login");
        return;
      }
      setLoading(false);
    };

    loadUser();
  }, [navigate]);

  if (loading || !userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-muted-foreground">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    );
  }

  const fullNameTh = `${userData.name_title}${userData.first_name} ${userData.last_name}`;
  const fullNameEn = `${userData.name_title_en} ${userData.first_name_en} ${userData.last_name_en}`;
  const hasInternship = !!(internship?.company_name);

  const docStatusConfig = {
    submitted: { label: "ส่งแล้ว", icon: CheckCircle2, className: "bg-success/10 text-success border-success/20" },
    pending: { label: "รอตรวจ", icon: Clock, className: "bg-warning/10 text-warning border-warning/20" },
    not_submitted: { label: "ยังไม่ส่ง", icon: AlertCircle, className: "bg-muted text-muted-foreground border-border" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-primary p-6 text-primary-foreground">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
            <UserCircle className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">สวัสดี, {userData.first_name}!</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              ยินดีต้อนรับสู่ระบบจัดการฝึกงาน — Internship Management System
            </p>
            <Badge className="mt-2 bg-primary-foreground/20 text-primary-foreground border-none text-xs">
              นักศึกษา (Student)
            </Badge>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">ข้อมูลนักศึกษา</CardTitle>
          </div>
          <CardDescription>ข้อมูลส่วนตัวจากระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={User} label="ชื่อ-นามสกุล (ไทย)" value={fullNameTh} />
            <InfoRow icon={User} label="Full Name (EN)" value={fullNameEn} />
            <InfoRow icon={Hash} label="รหัสนักศึกษา" value={userData.id_number || "—"} />
            <InfoRow icon={Mail} label="อีเมล" value={userData.email} />
            <InfoRow icon={Phone} label="เบอร์โทรศัพท์" value={userData.phone || "—"} />
            <InfoRow icon={GraduationCap} label="สาขาวิชา" value={userData.major || "—"} />
            <InfoRow icon={BookMarked} label="หลักสูตร" value={userData.curriculum || "—"} />
            <InfoRow icon={User} label="อาจารย์ที่ปรึกษา" value={userData.advisor || "—"} />
            <InfoRow icon={CalendarDays} label="ภาคเรียน" value={userData.term || "—"} />
            <InfoRow icon={CalendarDays} label="ปีการศึกษา" value={userData.academic_year || "—"} />
            <InfoRow icon={Briefcase} label="บทบาท" value="นักศึกษา (Student)" />
          </div>
        </CardContent>
      </Card>

      {/* Status Cards Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Company Info */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">สถานที่ฝึกงาน</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {hasInternship ? (
              <>
                <div>
                  <span className="text-muted-foreground">บริษัท: </span>
                  <span className="font-medium text-foreground">{internship!.company_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ที่อยู่: </span>
                  <span className="text-foreground">{internship!.company_address || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ผู้ประสานงาน: </span>
                  <span className="text-foreground">{internship!.contact_person || "—"}</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground text-xs">ยังไม่มีข้อมูลสถานที่ฝึกงาน</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Internship Period */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">ระยะเวลาฝึกงาน</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {internship?.start_date ? (
              <>
                <div>
                  <span className="text-muted-foreground">เริ่ม: </span>
                  <span className="font-medium text-foreground">{internship.start_date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">สิ้นสุด: </span>
                  <span className="font-medium text-foreground">{internship.end_date || "—"}</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <CalendarDays className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground text-xs">ยังไม่ได้กำหนดระยะเวลา</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">สถานะเอกสาร</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {documents.map((doc) => {
              const cfg = docStatusConfig[doc.status];
              const Icon = cfg.icon;
              return (
                <div key={doc.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{doc.name}</span>
                  <Badge variant="outline" className={`text-xs ${cfg.className}`}>
                    <Icon className="mr-1 h-3 w-3" />
                    {cfg.label}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">ดำเนินการด่วน</CardTitle>
          <CardDescription>ส่งเอกสารหรือจัดการข้อมูลฝึกงาน</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 hover:bg-accent"
              onClick={() => navigate("/submit")}
            >
              <ClipboardCheck className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">ส่งคำร้องฝึกงาน</span>
              <span className="text-xs text-muted-foreground">ยื่นใบสมัครฝึกงาน</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 hover:bg-accent"
              onClick={() => navigate("/my-applications")}
            >
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">คำร้องของฉัน</span>
              <span className="text-xs text-muted-foreground">ดูสถานะคำร้องทั้งหมด</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4 hover:bg-accent"
              onClick={() => navigate("/documents")}
            >
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">เอกสารฝึกงาน</span>
              <span className="text-xs text-muted-foreground">อัพโหลดและติดตามเอกสาร</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default StudentDashboard;

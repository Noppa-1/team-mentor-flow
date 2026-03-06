import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogOut, GraduationCap, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InternshipApp {
  id: string;
  studentName: string;
  studentId: string;
  company: string;
  position: string;
  status: "pending" | "approved" | "rejected";
  submittedAt?: string;
}

const AdvisorDashboard = () => {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<InternshipApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const appsRef = collection(db, "internship_apps");
      const q = query(appsRef, where("status", "==", "pending"));
      const snapshot = await getDocs(q);
      const apps: InternshipApp[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InternshipApp[];
      setApplications(apps);
    } catch (error) {
      toast.error("ไม่สามารถโหลดข้อมูลคำร้องได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (appId: string, newStatus: "approved" | "rejected") => {
    setUpdating(appId);
    try {
      const appRef = doc(db, "internship_apps", appId);
      await updateDoc(appRef, { status: newStatus });
      setApplications((prev) => prev.filter((app) => app.id !== appId));
      toast.success(
        newStatus === "approved"
          ? "อนุมัติคำร้องเรียบร้อยแล้ว"
          : "ปฏิเสธคำร้องเรียบร้อยแล้ว"
      );
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">ระบบจัดการฝึกงาน</h1>
              <p className="text-xs text-muted-foreground">แผงควบคุมอาจารย์ที่ปรึกษา</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user?.displayName || user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-warning" />
              <CardTitle className="text-xl">คำร้องที่รอดำเนินการ</CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              {applications.length} รายการ
            </Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">กำลังโหลดข้อมูล...</span>
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">
                  ไม่มีคำร้องที่รอดำเนินการ
                </p>
                <p className="text-sm text-muted-foreground/70">
                  คำร้องใหม่จะปรากฏที่นี่
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อนักศึกษา</TableHead>
                      <TableHead>รหัสนักศึกษา</TableHead>
                      <TableHead>บริษัท/สถานประกอบการ</TableHead>
                      <TableHead>ตำแหน่ง</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.studentName}</TableCell>
                        <TableCell>{app.studentId}</TableCell>
                        <TableCell>{app.company}</TableCell>
                        <TableCell>{app.position}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-warning text-warning">
                            รอดำเนินการ
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(app.id, "approved")}
                              disabled={updating === app.id}
                              className="gap-1.5 bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-[hsl(var(--success-foreground))]"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              อนุมัติ
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateStatus(app.id, "rejected")}
                              disabled={updating === app.id}
                              className="gap-1.5"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              ปฏิเสธ
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdvisorDashboard;

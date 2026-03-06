import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InternshipApp {
  id: string;
  studentName: string;
  studentEmail: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

const AdvisorDashboard = () => {
  const [applications, setApplications] = useState<InternshipApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "internship_apps"), where("status", "==", "pending"));
        const snap = await getDocs(q);
        setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as InternshipApp)));
      } catch {
        toast.error("ไม่สามารถโหลดข้อมูลคำร้องได้");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleUpdate = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, "internship_apps", id), { status });
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success(status === "approved" ? "อนุมัติแล้ว" : "ปฏิเสธแล้ว");
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[hsl(var(--warning))]" />
            <CardTitle className="text-xl">คำร้องที่รอดำเนินการ</CardTitle>
          </div>
          <Badge variant="secondary">{applications.length} รายการ</Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 text-muted-foreground">ไม่มีคำร้องที่รอดำเนินการ</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อนักศึกษา</TableHead>
                    <TableHead>บริษัท</TableHead>
                    <TableHead>ตำแหน่ง</TableHead>
                    <TableHead>ช่วงเวลา</TableHead>
                    <TableHead className="text-right">การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.studentName}</TableCell>
                      <TableCell>{app.company}</TableCell>
                      <TableCell>{app.position}</TableCell>
                      <TableCell className="text-xs">{app.startDate} - {app.endDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleUpdate(app.id, "approved")} disabled={updating === app.id} className="gap-1 bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-[hsl(var(--success-foreground))]">
                            <CheckCircle className="h-3.5 w-3.5" /> อนุมัติ
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUpdate(app.id, "rejected")} disabled={updating === app.id} className="gap-1">
                            <XCircle className="h-3.5 w-3.5" /> ปฏิเสธ
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
    </div>
  );
};

export default AdvisorDashboard;

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface App {
  id: string;
  studentName: string;
  studentEmail: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

const statusConfig = {
  pending: { label: "รอดำเนินการ", className: "border-[hsl(var(--warning))] text-[hsl(var(--warning))]" },
  approved: { label: "อนุมัติแล้ว", className: "border-[hsl(var(--success))] text-[hsl(var(--success))]" },
  rejected: { label: "ปฏิเสธ", className: "border-destructive text-destructive" },
};

const AdminDashboard = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const snap = await getDocs(collection(db, "internship_apps"));
        setApps(snap.docs.map((d) => ({ id: d.id, ...d.data() } as App)));
      } catch {
        toast.error("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleUpdate = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, "internship_apps", id), { status });
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      toast.success(status === "approved" ? "อนุมัติแล้ว" : "ปฏิเสธแล้ว");
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">คำร้องทั้งหมด</h1>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด ({apps.length})</SelectItem>
            <SelectItem value="pending">รอดำเนินการ ({apps.filter((a) => a.status === "pending").length})</SelectItem>
            <SelectItem value="approved">อนุมัติแล้ว ({apps.filter((a) => a.status === "approved").length})</SelectItem>
            <SelectItem value="rejected">ปฏิเสธ ({apps.filter((a) => a.status === "rejected").length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-16 text-muted-foreground">ไม่มีคำร้อง</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อนักศึกษา</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>บริษัท</TableHead>
                    <TableHead>ตำแหน่ง</TableHead>
                    <TableHead>ช่วงเวลา</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app) => {
                    const sc = statusConfig[app.status];
                    return (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.studentName}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{app.studentEmail}</TableCell>
                        <TableCell>{app.company}</TableCell>
                        <TableCell>{app.position}</TableCell>
                        <TableCell className="text-xs">{app.startDate} - {app.endDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {app.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleUpdate(app.id, "approved")} disabled={updating === app.id} className="gap-1 bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-[hsl(var(--success-foreground))]">
                                <CheckCircle className="h-3.5 w-3.5" /> อนุมัติ
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleUpdate(app.id, "rejected")} disabled={updating === app.id} className="gap-1">
                                <XCircle className="h-3.5 w-3.5" /> ปฏิเสธ
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

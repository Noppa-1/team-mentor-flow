import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, FileText } from "lucide-react";

interface App {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

const statusMap = {
  pending: { label: "รอดำเนินการ", variant: "outline" as const, className: "border-[hsl(var(--warning))] text-[hsl(var(--warning))]" },
  approved: { label: "อนุมัติแล้ว", variant: "outline" as const, className: "border-[hsl(var(--success))] text-[hsl(var(--success))]" },
  rejected: { label: "ปฏิเสธ", variant: "outline" as const, className: "border-destructive text-destructive" },
};

const MyApplications = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const fetch = async () => {
      try {
        const ref = collection(db, "internship_apps");
        const q = query(ref, where("studentEmail", "==", user.email));
        const snap = await getDocs(q);
        setApps(snap.docs.map((d) => ({ id: d.id, ...d.data() } as App)));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.email]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">คำร้องของฉัน</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : apps.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">ยังไม่มีคำร้อง</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>บริษัท</TableHead>
                    <TableHead>ตำแหน่ง</TableHead>
                    <TableHead>วันเริ่ม</TableHead>
                    <TableHead>วันสิ้นสุด</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apps.map((app) => {
                    const s = statusMap[app.status];
                    return (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.company}</TableCell>
                        <TableCell>{app.position}</TableCell>
                        <TableCell>{app.startDate}</TableCell>
                        <TableCell>{app.endDate}</TableCell>
                        <TableCell>
                          <Badge variant={s.variant} className={s.className}>{s.label}</Badge>
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

export default MyApplications;

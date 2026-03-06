import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    if (!user?.email) return;
    const fetchCounts = async () => {
      const ref = collection(db, "internship_apps");
      const q = query(ref, where("studentEmail", "==", user.email));
      const snap = await getDocs(q);
      const c = { pending: 0, approved: 0, rejected: 0 };
      snap.docs.forEach((d) => {
        const s = d.data().status as keyof typeof c;
        if (c[s] !== undefined) c[s]++;
      });
      setCounts(c);
    };
    fetchCounts();
  }, [user?.email]);

  const stats = [
    { label: "รอดำเนินการ", value: counts.pending, icon: Clock, color: "text-[hsl(var(--warning))]" },
    { label: "อนุมัติแล้ว", value: counts.approved, icon: CheckCircle, color: "text-[hsl(var(--success))]" },
    { label: "ปฏิเสธ", value: counts.rejected, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">สวัสดี, {user?.displayName}</h1>
        <p className="text-muted-foreground">ยินดีต้อนรับสู่ระบบจัดการฝึกงาน</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;

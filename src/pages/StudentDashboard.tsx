import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, LogOut } from "lucide-react";

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">ระบบจัดการฝึกงาน</h1>
              <p className="text-xs text-muted-foreground">แผงควบคุมนักศึกษา</p>
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

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>ยินดีต้อนรับ {user?.displayName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              หน้านี้สำหรับนักศึกษา — ฟีเจอร์เพิ่มเติมจะเปิดใช้งานเร็ว ๆ นี้
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;

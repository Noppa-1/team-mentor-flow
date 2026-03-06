import { useAuth, UserRole } from "@/contexts/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { GraduationCap, LogOut, FileText, PlusCircle, ClipboardList, LayoutDashboard, Users } from "lucide-react";

const menuByRole: Record<UserRole, { title: string; url: string; icon: React.ElementType }[]> = {
  student: [
    { title: "แดชบอร์ด", url: "/", icon: LayoutDashboard },
    { title: "ส่งคำร้องฝึกงาน", url: "/submit", icon: PlusCircle },
    { title: "คำร้องของฉัน", url: "/my-applications", icon: FileText },
  ],
  advisor: [
    { title: "คำร้องรอดำเนินการ", url: "/", icon: ClipboardList },
  ],
  admin: [
    { title: "แดชบอร์ด", url: "/", icon: LayoutDashboard },
    { title: "คำร้องทั้งหมด", url: "/all-applications", icon: Users },
  ],
  unknown: [],
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const items = menuByRole[role] || [];

  const roleLabel = role === "admin" ? "ผู้ดูแลระบบ" : role === "advisor" ? "อาจารย์ที่ปรึกษา" : "นักศึกษา";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold text-foreground">ระบบจัดการฝึกงาน</p>
                <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>เมนู</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <NavLink to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-xs font-medium text-foreground">{user?.displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="shrink-0 h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

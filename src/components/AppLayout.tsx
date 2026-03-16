import { useNavigate, NavLink, useLocation } from "react-router-dom";
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
import { GraduationCap, LogOut, FileText, PlusCircle, LayoutDashboard, UserCircle, FolderOpen } from "lucide-react";

const studentMenu = [
  { title: "แดชบอร์ด", url: "/", icon: LayoutDashboard },
  { title: "ข้อมูลส่วนตัว", url: "/profile", icon: UserCircle },
  { title: "ส่งคำร้องฝึกงาน", url: "/submit", icon: PlusCircle },
  { title: "คำร้องของฉัน", url: "/my-applications", icon: FileText },
  { title: "เอกสารฝึกงาน", url: "/documents", icon: FolderOpen },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const stored = localStorage.getItem("user");
  let displayName = "";
  let email = "";
  if (stored) {
    try {
      const u = JSON.parse(stored);
      displayName = u.first_name ? `${u.first_name} ${u.last_name || ""}` : u.displayName || "";
      email = u.email || "";
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold text-foreground">ระบบจัดการฝึกงาน</p>
                <p className="truncate text-xs text-muted-foreground">SWU Internship</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>เมนู</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {studentMenu.map((item) => (
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
                <p className="truncate text-xs font-medium text-foreground">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0 h-8 w-8 text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border bg-card px-4 gap-3">
            <SidebarTrigger />
            <span className="text-sm font-medium text-foreground">ระบบจัดการฝึกงาน</span>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

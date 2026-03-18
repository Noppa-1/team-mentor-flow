import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Building2,
  Users,
  FileCheck,
  TrendingUp,
  GraduationCap,
  Briefcase,
  MapPin,
  BarChart3,
} from "lucide-react";

// ── Summary stats ──
const summaryStats = [
  { label: "บริษัทที่รับฝึกงาน", value: 47, icon: Building2, color: "hsl(var(--primary))" },
  { label: "นักศึกษาทั้งหมด", value: 156, icon: Users, color: "hsl(var(--info))" },
  { label: "ส่งเอกสารครบ", value: 112, icon: FileCheck, color: "hsl(var(--success))" },
  { label: "อัตราตอบรับ", value: "89%", icon: TrendingUp, color: "hsl(var(--warning))" },
];

// ── Application status data ──
const statusData = [
  { name: "อนุมัติแล้ว", value: 98, fill: "hsl(var(--success))" },
  { name: "รอดำเนินการ", value: 34, fill: "hsl(var(--warning))" },
  { name: "ปฏิเสธ", value: 12, fill: "hsl(var(--destructive))" },
  { name: "ยังไม่สมัคร", value: 12, fill: "hsl(var(--muted-foreground))" },
];

const statusChartConfig: ChartConfig = {
  value: { label: "จำนวน" },
};

// ── Top companies by student count ──
const topCompanies = [
  { company: "SCB", students: 14 },
  { company: "PTT", students: 12 },
  { company: "AIS", students: 10 },
  { company: "TRUE", students: 9 },
  { company: "KBANK", students: 8 },
  { company: "CP ALL", students: 7 },
  { company: "LINE", students: 7 },
  { company: "Agoda", students: 6 },
  { company: "Shopee", students: 5 },
  { company: "SCG", students: 5 },
];

const companyChartConfig: ChartConfig = {
  students: { label: "นักศึกษา", color: "hsl(var(--primary))" },
};

// ── Monthly application trend ──
const monthlyTrend = [
  { month: "ม.ค.", applications: 8, accepted: 6 },
  { month: "ก.พ.", applications: 15, accepted: 12 },
  { month: "มี.ค.", applications: 28, accepted: 22 },
  { month: "เม.ย.", applications: 42, accepted: 35 },
  { month: "พ.ค.", applications: 35, accepted: 30 },
  { month: "มิ.ย.", applications: 18, accepted: 16 },
  { month: "ก.ค.", applications: 10, accepted: 9 },
];

const trendChartConfig: ChartConfig = {
  applications: { label: "สมัครทั้งหมด", color: "hsl(var(--info))" },
  accepted: { label: "ตอบรับ", color: "hsl(var(--success))" },
};

// ── Document submission progress ──
const documentProgress = [
  { name: "ใบสมัคร", submitted: 140, total: 156 },
  { name: "ใบนิเทศ", submitted: 112, total: 156 },
  { name: "รายงาน", submitted: 88, total: 156 },
  { name: "แบบประเมิน", submitted: 64, total: 156 },
];

const docChartConfig: ChartConfig = {
  submitted: { label: "ส่งแล้ว", color: "hsl(var(--success))" },
  remaining: { label: "ยังไม่ส่ง", color: "hsl(var(--muted))" },
};

// ── Companies by province ──
const provinceData = [
  { province: "กรุงเทพฯ", count: 28 },
  { province: "นนทบุรี", count: 5 },
  { province: "ปทุมธานี", count: 4 },
  { province: "ชลบุรี", count: 3 },
  { province: "เชียงใหม่", count: 3 },
  { province: "อื่นๆ", count: 4 },
];

const provinceChartConfig: ChartConfig = {
  count: { label: "จำนวนบริษัท", color: "hsl(var(--primary))" },
};

// ── Major breakdown ──
const majorData = [
  { name: "วิทยาการคอมพิวเตอร์", value: 52, fill: "hsl(var(--primary))" },
  { name: "วิศวกรรมซอฟต์แวร์", value: 38, fill: "hsl(var(--info))" },
  { name: "เทคโนโลยีสารสนเทศ", value: 34, fill: "hsl(var(--success))" },
  { name: "วิทยาการข้อมูล", value: 32, fill: "hsl(var(--warning))" },
];

const InternshipInsights = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            สถิติฝึกงาน — Internship Insights
          </h1>
          <p className="text-sm text-muted-foreground">
            ภาพรวมข้อมูลฝึกงานประจำปีการศึกษา 2567
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="companies">บริษัท</TabsTrigger>
          <TabsTrigger value="documents">เอกสาร</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Application Status Pie */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  สถานะคำร้องฝึกงาน
                </CardTitle>
                <CardDescription>จำนวน 156 คำร้อง</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={statusChartConfig} className="h-[260px] w-full">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {statusData.map((s) => (
                    <div key={s.name} className="flex items-center gap-1.5 text-xs">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: s.fill }}
                      />
                      {s.name} ({s.value})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend Line */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-info" />
                  แนวโน้มการสมัครฝึกงาน
                </CardTitle>
                <CardDescription>รายเดือน ม.ค. – ก.ค. 2567</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={trendChartConfig} className="h-[260px] w-full">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="hsl(var(--info))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accepted"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Major Breakdown Pie */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  สัดส่วนสาขาวิชา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={statusChartConfig} className="h-[260px] w-full">
                  <PieChart>
                    <Pie
                      data={majorData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name} (${value})`}
                      labelLine={false}
                    >
                      {majorData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Province Bar */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  บริษัทแยกตามจังหวัด
                </CardTitle>
                <CardDescription>จาก 47 บริษัท</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={provinceChartConfig} className="h-[260px] w-full">
                  <BarChart data={provinceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="province" type="category" width={80} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Companies Tab ── */}
        <TabsContent value="companies" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Top 10 บริษัทที่มีนักศึกษาฝึกงานมากที่สุด
              </CardTitle>
              <CardDescription>จากทั้งหมด 47 บริษัท</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={companyChartConfig} className="h-[400px] w-full">
                <BarChart data={topCompanies}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="company" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* All 47 companies grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">รายชื่อบริษัททั้งหมด (47 บริษัท)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {[
                  "SCB", "PTT", "AIS", "TRUE", "KBANK", "CP ALL", "LINE", "Agoda",
                  "Shopee", "SCG", "DTAC", "ThaiBev", "Lazada", "Grab", "Kerry",
                  "Minor", "Siam Cement", "BTS Group", "Central", "The Mall",
                  "Bangchak", "IRPC", "Gulf Energy", "Banpu", "EGAT",
                  "CAT Telecom", "TOT", "Thai Airways", "Bangkok Bank", "TMBThanachart",
                  "Krungsri", "KTB", "Tisco", "Land & Houses", "AP Thailand",
                  "Pruksa", "Sansiri", "Origin", "Major", "SF Cinema",
                  "MK Restaurant", "CPN", "Homepro", "Big C", "Tops",
                  "PTT GC", "PTTEP",
                ].map((name) => (
                  <Badge
                    key={name}
                    variant="outline"
                    className="justify-center py-1.5 text-xs"
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Documents Tab ── */}
        <TabsContent value="documents" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-success" />
                ความคืบหน้าการส่งเอกสาร
              </CardTitle>
              <CardDescription>จากนักศึกษาทั้งหมด 156 คน</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={docChartConfig} className="h-[300px] w-full">
                <BarChart
                  data={documentProgress.map((d) => ({
                    ...d,
                    remaining: d.total - d.submitted,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="submitted"
                    stackId="a"
                    fill="hsl(var(--success))"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="a"
                    fill="hsl(var(--muted))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Per-document stats cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {documentProgress.map((doc) => {
              const pct = Math.round((doc.submitted / doc.total) * 100);
              return (
                <Card key={doc.name}>
                  <CardContent className="p-4 text-center space-y-2">
                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                    <p className="text-3xl font-bold text-primary">{pct}%</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.submitted}/{doc.total} คน
                    </p>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternshipInsights;

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubmitApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim() || !form.startDate || !form.endDate) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "internship_apps"), {
        studentName: user?.displayName || "",
        studentEmail: user?.email || "",
        studentId: user?.uid || "",
        company: form.company.trim(),
        position: form.position.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description.trim(),
        status: "pending",
        submittedAt: Timestamp.now(),
      });
      toast.success("ส่งคำร้องเรียบร้อยแล้ว");
      navigate("/my-applications");
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">ส่งคำร้องขอฝึกงาน</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">ชื่อบริษัท/สถานประกอบการ</Label>
              <Input id="company" name="company" value={form.company} onChange={handleChange} maxLength={200} placeholder="เช่น บริษัท ABC จำกัด" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">ตำแหน่ง</Label>
              <Input id="position" name="position" value={form.position} onChange={handleChange} maxLength={200} placeholder="เช่น นักพัฒนาซอฟต์แวร์" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">วันที่เริ่มต้น</Label>
                <Input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">วันที่สิ้นสุด</Label>
                <Input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">รายละเอียดงาน</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} maxLength={1000} rows={4} placeholder="อธิบายลักษณะงานที่จะฝึก..." />
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              ส่งคำร้อง
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitApplication;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OnlinePayments = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    student_id: "",
    amount: "",
    receipt_no: "",
    payment_date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  useEffect(() => {
    const load = async () => {
      const [s, p] = await Promise.all([
        supabase.from("students").select("id, name, class, roll"),
        supabase.from("fee_payments").select("*, students(name, class, roll)").eq("payment_method", "online").order("payment_date", { ascending: false }).limit(50),
      ]);
      if (s.data) setStudents(s.data);
      if (p.data) setPayments(p.data);
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!form.student_id || !form.amount) {
      toast({ title: "Select a student and enter amount", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("fee_payments").insert({
      student_id: form.student_id,
      amount: parseFloat(form.amount),
      payment_method: "online",
      receipt_no: form.receipt_no || null,
      payment_date: form.payment_date,
      remarks: form.remarks || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Online payment recorded" });
      setForm({ student_id: "", amount: "", receipt_no: "", payment_date: new Date().toISOString().split("T")[0], remarks: "" });
      const { data } = await supabase.from("fee_payments").select("*, students(name, class, roll)").eq("payment_method", "online").order("payment_date", { ascending: false }).limit(50);
      if (data) setPayments(data);
    }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Online Payments</h1>
        <p className="text-muted-foreground">Record online/mobile banking fee payments</p>
      </div>

      <div className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Record Online Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Student</Label>
            <Select value={form.student_id} onValueChange={(v) => setForm({ ...form, student_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select Student" /></SelectTrigger>
              <SelectContent>
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} — Class {s.class} (Roll: {s.roll || "N/A"})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount (৳)</Label>
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Transaction/Receipt No</Label>
            <Input value={form.receipt_no} onChange={(e) => setForm({ ...form, receipt_no: e.target.value })} placeholder="TXN ID" />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Input value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="bKash / Nagad / Bank" />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving} className="bg-primary text-primary-foreground">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Record Payment
        </Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="p-4 border-b"><h2 className="font-semibold text-foreground">Recent Online Payments</h2></div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No online payments yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>TXN ID</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{p.students?.name || "—"}</TableCell>
                  <TableCell>{p.students?.class || "—"}</TableCell>
                  <TableCell>৳ {Number(p.amount).toLocaleString()}</TableCell>
                  <TableCell>{p.receipt_no || "—"}</TableCell>
                  <TableCell><Badge variant="secondary">{p.remarks || "Online"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};

export default OnlinePayments;

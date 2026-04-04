import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Search, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FeesReceivedCash = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchClass, setSearchClass] = useState("");
  const [form, setForm] = useState({
    student_id: "",
    fee_structure_id: "",
    amount: "",
    receipt_no: "",
    payment_date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  useEffect(() => {
    const load = async () => {
      const [s, f, p] = await Promise.all([
        supabase.from("students").select("id, name, class, roll, student_id"),
        supabase.from("fee_structures").select("*"),
        supabase.from("fee_payments").select("*, students(name, class, roll)").order("payment_date", { ascending: false }).limit(50),
      ]);
      if (s.data) setStudents(s.data);
      if (f.data) setFeeStructures(f.data);
      if (p.data) setPayments(p.data);
      setLoading(false);
    };
    load();
  }, []);

  const filteredStudents = searchClass ? students.filter(s => s.class === searchClass) : students;

  const handleSubmit = async () => {
    if (!form.student_id || !form.amount) {
      toast({ title: "Select a student and enter amount", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("fee_payments").insert({
      student_id: form.student_id,
      fee_structure_id: form.fee_structure_id || null,
      amount: parseFloat(form.amount),
      payment_method: "cash",
      receipt_no: form.receipt_no || null,
      payment_date: form.payment_date,
      remarks: form.remarks || null,
    });
    if (error) {
      toast({ title: "Payment failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Payment recorded successfully" });
      setForm({ student_id: "", fee_structure_id: "", amount: "", receipt_no: "", payment_date: new Date().toISOString().split("T")[0], remarks: "" });
      const { data } = await supabase.from("fee_payments").select("*, students(name, class, roll)").order("payment_date", { ascending: false }).limit(50);
      if (data) setPayments(data);
    }
    setSaving(false);
  };

  const selectedStudent = students.find(s => s.id === form.student_id);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fees Received — Cash</h1>
        <p className="text-muted-foreground">Record cash fee payments from students</p>
      </div>

      <div className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" /> New Cash Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Filter by Class</Label>
            <Select value={searchClass} onValueChange={setSearchClass}>
              <SelectTrigger><SelectValue placeholder="All Classes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {["Play","Nursery","KG","1","2","3","4","5","6","7","8","9","10"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Student</Label>
            <Select value={form.student_id} onValueChange={(v) => setForm({ ...form, student_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select Student" /></SelectTrigger>
              <SelectContent>
                {filteredStudents.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} — Class {s.class} (Roll: {s.roll || "N/A"})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fee Type (optional)</Label>
            <Select value={form.fee_structure_id} onValueChange={(v) => {
              const fs = feeStructures.find(f => f.id === v);
              setForm({ ...form, fee_structure_id: v, amount: fs ? String(fs.amount) : form.amount });
            }}>
              <SelectTrigger><SelectValue placeholder="Select Fee Type" /></SelectTrigger>
              <SelectContent>
                {feeStructures.filter(f => !selectedStudent || f.class === selectedStudent.class).map(f => (
                  <SelectItem key={f.id} value={f.id}>{f.fee_type} — ৳{f.amount}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount (৳)</Label>
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Enter amount" />
          </div>
          <div className="space-y-2">
            <Label>Receipt No</Label>
            <Input value={form.receipt_no} onChange={(e) => setForm({ ...form, receipt_no: e.target.value })} placeholder="Receipt number" />
          </div>
          <div className="space-y-2">
            <Label>Payment Date</Label>
            <Input type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Remarks</Label>
            <Input value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Optional remarks" />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving} className="bg-primary text-primary-foreground">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Record Payment
        </Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="p-4 border-b"><h2 className="font-semibold text-foreground">Recent Cash Payments</h2></div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No payments recorded yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Remarks</TableHead>
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
                  <TableCell className="text-muted-foreground">{p.remarks || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};

export default FeesReceivedCash;

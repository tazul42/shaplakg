import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const CLASSES = ["Play", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

interface StudentLedger {
  id: string;
  name: string;
  roll: number | null;
  totalFees: number;
  totalPaid: number;
  balance: number;
}

const ClassLedger = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [ledger, setLedger] = useState<StudentLedger[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLedger = async (cls: string) => {
    setLoading(true);
    // Get students in this class
    const { data: students } = await supabase.from("students").select("id, name, roll").eq("class", cls).order("roll");
    // Get fee structures for this class
    const { data: feeStructures } = await supabase.from("fee_structures").select("amount").eq("class", cls);
    const totalFees = (feeStructures || []).reduce((sum, f) => sum + Number(f.amount), 0);
    // Get payments for these students
    const studentIds = (students || []).map(s => s.id);
    let paymentsMap: Record<string, number> = {};
    if (studentIds.length > 0) {
      const { data: payments } = await supabase.from("fee_payments").select("student_id, amount").in("student_id", studentIds);
      (payments || []).forEach(p => {
        paymentsMap[p.student_id] = (paymentsMap[p.student_id] || 0) + Number(p.amount);
      });
    }
    const result: StudentLedger[] = (students || []).map(s => ({
      id: s.id,
      name: s.name,
      roll: s.roll,
      totalFees,
      totalPaid: paymentsMap[s.id] || 0,
      balance: totalFees - (paymentsMap[s.id] || 0),
    }));
    setLedger(result);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedClass) fetchLedger(selectedClass);
  }, [selectedClass]);

  const grandTotalFees = ledger.reduce((s, l) => s + l.totalFees, 0);
  const grandTotalPaid = ledger.reduce((s, l) => s + l.totalPaid, 0);
  const grandBalance = ledger.reduce((s, l) => s + l.balance, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Class-wise Ledger</h1>
          <p className="text-muted-foreground">View fee collection summary per class</p>
        </div>
        {ledger.length > 0 && (
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" /> Print
          </Button>
        )}
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Select Class" /></SelectTrigger>
            <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {!selectedClass ? (
        <div className="bg-card rounded-xl border p-12 text-center text-muted-foreground">Select a class to view the ledger</div>
      ) : loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : ledger.length === 0 ? (
        <div className="bg-card rounded-xl border p-12 text-center text-muted-foreground">No students found in Class {selectedClass}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Fees</p>
              <p className="text-2xl font-bold text-foreground">৳ {grandTotalFees.toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-xl border p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold text-primary">৳ {grandTotalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-xl border p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Due</p>
              <p className="text-2xl font-bold text-destructive">৳ {grandBalance.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10">
                  <TableHead>Roll</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Total Fees</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.roll || "—"}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>৳ {s.totalFees.toLocaleString()}</TableCell>
                    <TableCell className="text-primary">৳ {s.totalPaid.toLocaleString()}</TableCell>
                    <TableCell className={s.balance > 0 ? "text-destructive" : ""}>৳ {s.balance.toLocaleString()}</TableCell>
                    <TableCell>
                      {s.balance <= 0 ? (
                        <Badge className="bg-primary/20 text-primary">Paid</Badge>
                      ) : s.totalPaid > 0 ? (
                        <Badge variant="secondary">Partial</Badge>
                      ) : (
                        <Badge variant="destructive">Unpaid</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ClassLedger;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CLASSES = ["Play", "Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const FEE_TYPES = ["Tuition Fee", "Exam Fee", "Admission Fee", "Session Fee", "Library Fee", "Sports Fee", "Lab Fee", "Transport Fee", "Other"];

interface FeeStructure {
  id: string;
  class: string;
  fee_type: string;
  amount: number;
  academic_year: string;
}

const FeesTable = () => {
  const { toast } = useToast();
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFee, setNewFee] = useState({ class: "", fee_type: "", amount: "", academic_year: "2026" });

  const fetchFees = async () => {
    const { data, error } = await supabase.from("fee_structures").select("*").order("class");
    if (!error && data) setFees(data as FeeStructure[]);
    setLoading(false);
  };

  useEffect(() => { fetchFees(); }, []);

  const handleAdd = async () => {
    if (!newFee.class || !newFee.fee_type || !newFee.amount) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("fee_structures").insert({
      class: newFee.class,
      fee_type: newFee.fee_type,
      amount: parseFloat(newFee.amount),
      academic_year: newFee.academic_year,
    });
    if (error) {
      toast({ title: "Error adding fee", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Fee structure added successfully" });
      setNewFee({ class: "", fee_type: "", amount: "", academic_year: "2026" });
      fetchFees();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("fee_structures").delete().eq("id", id);
    if (!error) {
      toast({ title: "Fee structure deleted" });
      fetchFees();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fees Table</h1>
        <p className="text-muted-foreground">Define fee structures per class and academic year</p>
      </div>

      <div className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Add New Fee Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <Select value={newFee.class} onValueChange={(v) => setNewFee({ ...newFee, class: v })}>
            <SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger>
            <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={newFee.fee_type} onValueChange={(v) => setNewFee({ ...newFee, fee_type: v })}>
            <SelectTrigger><SelectValue placeholder="Fee Type" /></SelectTrigger>
            <SelectContent>{FEE_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
          <Input type="number" placeholder="Amount (৳)" value={newFee.amount} onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })} />
          <Input placeholder="Year" value={newFee.academic_year} onChange={(e) => setNewFee({ ...newFee, academic_year: e.target.value })} />
          <Button onClick={handleAdd} disabled={saving} className="bg-primary text-primary-foreground">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : fees.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No fee structures defined yet. Add one above.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead>Class</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount (৳)</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.class}</TableCell>
                  <TableCell>{fee.fee_type}</TableCell>
                  <TableCell>৳ {Number(fee.amount).toLocaleString()}</TableCell>
                  <TableCell>{fee.academic_year}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(fee.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};

export default FeesTable;

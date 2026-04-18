import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, User, Phone, MapPin, Calendar, Droplet, GraduationCap, Edit2, Printer, Receipt, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const { data: s, error } = await supabase.from("students").select("*").eq("id", id).maybeSingle();
      if (error || !s) {
        toast({ title: "Error", description: "Student not found", variant: "destructive" });
        setLoading(false);
        return;
      }
      setStudent(s);
      const [{ data: pays }, { data: fs }] = await Promise.all([
        supabase.from("fee_payments").select("*").eq("student_id", id).order("payment_date", { ascending: false }),
        supabase.from("fee_structures").select("*").eq("class", s.class),
      ]);
      setPayments(pays || []);
      setFeeStructures(fs || []);
      setLoading(false);
    };
    if (id) fetchAll();
  }, [id, toast]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Student not found</p>
        <Link to="/students"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back to List</Button></Link>
      </div>
    );
  }

  const totalFees = feeStructures.reduce((sum, f) => sum + Number(f.amount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const balance = totalFees - totalPaid;
  const paymentStatus = balance <= 0 ? "Paid" : totalPaid > 0 ? "Partial" : "Unpaid";

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value || "—"}</span>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/students">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Profile</h1>
            <p className="text-sm text-muted-foreground">Complete student information & records</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" /> Print</Button>
        </div>
      </div>

      {/* Profile header card */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-32 h-32 rounded-xl bg-card border-2 border-primary/30 overflow-hidden flex items-center justify-center shrink-0">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <User className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
              {student.bangla_name && <p className="text-lg text-muted-foreground">{student.bangla_name}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary"><GraduationCap className="h-3 w-3 mr-1" /> Class {student.class} {student.section && `- ${student.section}`}</Badge>
              {student.roll && <Badge variant="outline">Roll: {student.roll}</Badge>}
              {student.student_id && <Badge variant="outline">ID: {student.student_id}</Badge>}
              <Badge className={paymentStatus === "Paid" ? "bg-primary/20 text-primary" : paymentStatus === "Partial" ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" : "bg-destructive/20 text-destructive"}>
                {paymentStatus === "Paid" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {paymentStatus}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
              {student.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone}</span>}
              {student.dob && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {student.dob}</span>}
              {student.blood_group && <span className="flex items-center gap-1"><Droplet className="h-3 w-3" /> {student.blood_group}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Fee Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Fees</p>
          <p className="text-2xl font-bold text-foreground">৳ {totalFees.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-2xl font-bold text-primary">৳ {totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border p-4 text-center">
          <p className="text-sm text-muted-foreground">Balance Due</p>
          <p className={`text-2xl font-bold ${balance > 0 ? "text-destructive" : "text-primary"}`}>৳ {balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="fees">Fees ({payments.length})</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Personal */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Personal Information</h3>
              <InfoRow label="Full Name" value={student.name} />
              <InfoRow label="Bangla Name" value={student.bangla_name} />
              <InfoRow label="Date of Birth" value={student.dob} />
              <InfoRow label="Gender" value={student.gender} />
              <InfoRow label="Religion" value={student.religion} />
              <InfoRow label="Blood Group" value={student.blood_group} />
              <InfoRow label="Birth Reg. No" value={student.birth_registration_no} />
              <InfoRow label="Special Disease" value={student.special_disease} />
            </div>

            {/* Academic */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Academic Information</h3>
              <InfoRow label="Class" value={student.class} />
              <InfoRow label="Section" value={student.section} />
              <InfoRow label="Roll" value={student.roll} />
              <InfoRow label="Student ID" value={student.student_id} />
              <InfoRow label="Receipt No" value={student.receipt_no} />
              <InfoRow label="Admission Date" value={student.admission_date} />
              <InfoRow label="Admission Type" value={student.admission_type} />
              <InfoRow label="Previous Institution" value={student.previous_institution} />
            </div>

            {/* Father */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-foreground mb-3">Father's Information</h3>
              <InfoRow label="Name (English)" value={student.father_name} />
              <InfoRow label="Name (Bangla)" value={student.father_bangla_name} />
              <InfoRow label="Occupation" value={student.father_occupation} />
              <InfoRow label="NID" value={student.father_nid} />
            </div>

            {/* Mother */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-foreground mb-3">Mother's Information</h3>
              <InfoRow label="Name (English)" value={student.mother_name} />
              <InfoRow label="Name (Bangla)" value={student.mother_bangla_name} />
              <InfoRow label="Occupation" value={student.mother_occupation} />
              <InfoRow label="NID" value={student.mother_nid} />
            </div>

            {/* Contact + Address */}
            <div className="bg-card rounded-xl border p-5 lg:col-span-2">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Contact & Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div>
                  <p className="text-xs uppercase text-muted-foreground mb-2">Present Address</p>
                  <InfoRow label="Village" value={student.present_village} />
                  <InfoRow label="Post" value={student.present_post} />
                  <InfoRow label="Upazila" value={student.present_upazila} />
                  <InfoRow label="District" value={student.present_district} />
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground mb-2">Permanent Address</p>
                  <InfoRow label="Village" value={student.permanent_village} />
                  <InfoRow label="Post" value={student.permanent_post} />
                  <InfoRow label="Upazila" value={student.permanent_upazila} />
                  <InfoRow label="District" value={student.permanent_district} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <InfoRow label="Phone" value={student.phone} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <div className="bg-card rounded-xl border overflow-hidden">
            {payments.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Receipt className="h-10 w-10 mx-auto mb-2 opacity-50" />
                No payment records yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10">
                    <TableHead>Date</TableHead>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.payment_date}</TableCell>
                      <TableCell className="font-mono">{p.receipt_no || "—"}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{p.payment_method}</Badge></TableCell>
                      <TableCell className="font-semibold text-primary">৳ {Number(p.amount).toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{p.remarks || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="bg-card rounded-xl border p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Attendance Module Coming Soon</h3>
            <p className="text-sm text-muted-foreground">Once attendance entries start being recorded, individual student attendance summary, monthly trends, and detailed logs will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default StudentProfile;

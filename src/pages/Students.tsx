import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  father_name: string;
  mother_name: string;
  class: string;
  section: string;
  roll: number;
  student_id: string;
  dob: string;
  gender: string;
  religion: string;
  blood_group: string;
  address: string;
  phone: string;
}

type StudentForm = Omit<Student, "id">;

const emptyStudent: StudentForm = {
  name: "", father_name: "", mother_name: "", class: "", section: "", roll: 0,
  student_id: "", dob: "", gender: "", religion: "", blood_group: "", address: "", phone: "",
};

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyStudent);
  const { toast } = useToast();

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: "Failed to load students", variant: "destructive" });
    } else {
      setStudents(data as Student[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.student_id || "").toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingStudent(null);
    setForm({ ...emptyStudent, student_id: `SK-2024-${String(students.length + 1).padStart(3, "0")}` });
    setDialogOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    const { id, ...rest } = s;
    setForm(rest);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.class) return;
    setSaving(true);
    if (editingStudent) {
      const { error } = await supabase.from("students").update(form).eq("id", editingStudent.id);
      if (error) {
        toast({ title: "Error", description: "Failed to update student", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Student updated" });
      }
    } else {
      const { error } = await supabase.from("students").insert(form);
      if (error) {
        toast({ title: "Error", description: "Failed to add student", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Student added" });
      }
    }
    setSaving(false);
    setDialogOpen(false);
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete student", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Student removed" });
      fetchStudents();
    }
  };

  const updateForm = (key: keyof StudentForm, value: string | number) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-muted-foreground text-sm">{students.length} students enrolled</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Add Student
        </Button>
      </motion.div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name, ID, or class..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="stat-card overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left py-3 px-3 font-medium">Student</th>
                  <th className="text-left py-3 px-3 font-medium hidden md:table-cell">ID</th>
                  <th className="text-left py-3 px-3 font-medium">Class</th>
                  <th className="text-left py-3 px-3 font-medium hidden lg:table-cell">Section</th>
                  <th className="text-center py-3 px-3 font-medium hidden lg:table-cell">Roll</th>
                  <th className="text-left py-3 px-3 font-medium hidden xl:table-cell">Phone</th>
                  <th className="text-center py-3 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((student, i) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-foreground hidden md:table-cell">{student.student_id}</td>
                      <td className="py-3 px-3 text-foreground">{student.class}</td>
                      <td className="py-3 px-3 text-foreground hidden lg:table-cell">{student.section}</td>
                      <td className="py-3 px-3 text-center text-foreground hidden lg:table-cell">{student.roll}</td>
                      <td className="py-3 px-3 text-foreground hidden xl:table-cell">{student.phone}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(student)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">No students found.</p>
            )}
          </>
        )}
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Student ID</Label>
              <Input value={form.student_id} onChange={(e) => updateForm("student_id", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Father's Name</Label>
              <Input value={form.father_name} onChange={(e) => updateForm("father_name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Mother's Name</Label>
              <Input value={form.mother_name} onChange={(e) => updateForm("mother_name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Class *</Label>
              <Select value={form.class} onValueChange={(v) => updateForm("class", v)}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {["Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Section</Label>
              <Select value={form.section} onValueChange={(v) => updateForm("section", v)}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  {["A", "B", "C"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Roll Number</Label>
              <Input type="number" value={form.roll || ""} onChange={(e) => updateForm("roll", parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <Label>Date of Birth</Label>
              <Input type="date" value={form.dob} onChange={(e) => updateForm("dob", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Religion</Label>
              <Input value={form.religion} onChange={(e) => updateForm("religion", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Blood Group</Label>
              <Select value={form.blood_group} onValueChange={(v) => updateForm("blood_group", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => updateForm("address", e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingStudent ? "Update" : "Add Student"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

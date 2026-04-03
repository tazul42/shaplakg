import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Student {
  id: string;
  name: string;
  fatherName: string;
  motherName: string;
  class: string;
  section: string;
  roll: number;
  studentId: string;
  dob: string;
  gender: string;
  religion: string;
  bloodGroup: string;
  address: string;
  phone: string;
}

const initialStudents: Student[] = [
  { id: "1", name: "Rafiq Ahmed", fatherName: "Karim Ahmed", motherName: "Fatema Begum", class: "KG-1", section: "A", roll: 1, studentId: "SK-2024-001", dob: "2019-03-15", gender: "Male", religion: "Islam", bloodGroup: "A+", address: "Dhaka, Bangladesh", phone: "01712345678" },
  { id: "2", name: "Sumaiya Akter", fatherName: "Jamal Hossain", motherName: "Nasima Akter", class: "KG-2", section: "B", roll: 5, studentId: "SK-2024-002", dob: "2018-07-22", gender: "Female", religion: "Islam", bloodGroup: "B+", address: "Chittagong, Bangladesh", phone: "01898765432" },
  { id: "3", name: "Arif Rahman", fatherName: "Mizanur Rahman", motherName: "Halima Khatun", class: "Nursery", section: "A", roll: 3, studentId: "SK-2024-003", dob: "2020-01-10", gender: "Male", religion: "Islam", bloodGroup: "O+", address: "Sylhet, Bangladesh", phone: "01556789012" },
  { id: "4", name: "Nusrat Jahan", fatherName: "Abdul Kadir", motherName: "Rahima Begum", class: "Class 1", section: "A", roll: 2, studentId: "SK-2024-004", dob: "2017-11-05", gender: "Female", religion: "Islam", bloodGroup: "AB+", address: "Rajshahi, Bangladesh", phone: "01634567890" },
  { id: "5", name: "Tanvir Hasan", fatherName: "Shahidul Hasan", motherName: "Monira Begum", class: "Class 2", section: "B", roll: 8, studentId: "SK-2024-005", dob: "2016-09-18", gender: "Male", religion: "Islam", bloodGroup: "A-", address: "Khulna, Bangladesh", phone: "01912345678" },
  { id: "6", name: "Mim Akter", fatherName: "Rafiqul Islam", motherName: "Shahida Akter", class: "KG-1", section: "B", roll: 12, studentId: "SK-2024-006", dob: "2019-05-30", gender: "Female", religion: "Islam", bloodGroup: "B-", address: "Comilla, Bangladesh", phone: "01823456789" },
];

const emptyStudent: Omit<Student, "id"> = {
  name: "", fatherName: "", motherName: "", class: "", section: "", roll: 0,
  studentId: "", dob: "", gender: "", religion: "", bloodGroup: "", address: "", phone: "",
};

export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<Omit<Student, "id">>(emptyStudent);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingStudent(null);
    setForm({ ...emptyStudent, studentId: `SK-2024-${String(students.length + 1).padStart(3, "0")}` });
    setDialogOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    const { id, ...rest } = s;
    setForm(rest);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.class) return;
    if (editingStudent) {
      setStudents(students.map((s) => s.id === editingStudent.id ? { ...form, id: editingStudent.id } : s));
    } else {
      setStudents([...students, { ...form, id: Date.now().toString() }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const updateForm = (key: keyof typeof form, value: string | number) => {
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name, ID, or class..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="stat-card overflow-auto">
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
                  <td className="py-3 px-3 text-foreground hidden md:table-cell">{student.studentId}</td>
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
      </motion.div>

      {/* Add/Edit Dialog */}
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
              <Input value={form.studentId} onChange={(e) => updateForm("studentId", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Father's Name</Label>
              <Input value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Mother's Name</Label>
              <Input value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
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
              <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
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
            <Button onClick={handleSave}>{editingStudent ? "Update" : "Add Student"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

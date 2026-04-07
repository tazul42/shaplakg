import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, User, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
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

const CLASSES = ["All", "Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
const SECTIONS = ["All", "A", "B", "C"];
const GENDERS = ["All", "Male", "Female"];
const PAGE_SIZES = [10, 20, 50, 100];

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterSection, setFilterSection] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.student_id || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.father_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.phone || "").includes(search);
      const matchClass = filterClass === "All" || s.class === filterClass;
      const matchSection = filterSection === "All" || s.section === filterSection;
      const matchGender = filterGender === "All" || s.gender === filterGender;
      return matchSearch && matchClass && matchSection && matchGender;
    });
  }, [students, search, filterClass, filterSection, filterGender]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedStudents = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [search, filterClass, filterSection, filterGender, pageSize]);

  const openAdd = () => {
    setEditingStudent(null);
    setForm({ ...emptyStudent, student_id: `SK-2026-${String(students.length + 1).padStart(3, "0")}` });
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

  const activeFilterCount = [filterClass, filterSection, filterGender].filter(f => f !== "All").length;

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-muted-foreground text-sm">
            {filtered.length} of {students.length} students
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Add Student
        </Button>
      </motion.div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="নাম, আইডি, অভিভাবক বা ফোন দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          ফিল্টার
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-primary-foreground text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-3 p-4 rounded-lg border border-border bg-muted/30">
              <div className="space-y-1 min-w-[140px]">
                <Label className="text-xs text-muted-foreground">ক্লাস</Label>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CLASSES.map(c => <SelectItem key={c} value={c}>{c === "All" ? "সব ক্লাস" : c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 min-w-[120px]">
                <Label className="text-xs text-muted-foreground">সেকশন</Label>
                <Select value={filterSection} onValueChange={setFilterSection}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map(s => <SelectItem key={s} value={s}>{s === "All" ? "সব সেকশন" : s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 min-w-[120px]">
                <Label className="text-xs text-muted-foreground">লিঙ্গ</Label>
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GENDERS.map(g => <SelectItem key={g} value={g}>{g === "All" ? "সব" : g === "Male" ? "ছেলে" : "মেয়ে"}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {activeFilterCount > 0 && (
                <div className="flex items-end">
                  <Button variant="ghost" size="sm" onClick={() => { setFilterClass("All"); setFilterSection("All"); setFilterGender("All"); }}>
                    ফিল্টার রিসেট
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
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
                  <th className="text-left py-3 px-3 font-medium">#</th>
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
                  {paginatedStudents.map((student, i) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-3 text-muted-foreground text-xs">
                        {(currentPage - 1) * pageSize + i + 1}
                      </td>
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
              <p className="text-center py-8 text-muted-foreground">কোনো ছাত্র-ছাত্রী পাওয়া যায়নি।</p>
            )}
          </>
        )}
      </motion.div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>প্রতি পৃষ্ঠায়:</span>
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="ml-2">
              {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

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
                  {CLASSES.filter(c => c !== "All").map((c) => (
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
                  {SECTIONS.filter(s => s !== "All").map((s) => (
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

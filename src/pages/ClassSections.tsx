import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, GraduationCap, ChevronDown, ChevronRight, Save, X, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Section {
  id: string;
  name: string;
  capacity: number;
}

interface ClassItem {
  id: string;
  name: string;
  sections: Section[];
}

const initialClasses: ClassItem[] = [
  {
    id: "1",
    name: "Play",
    sections: [
      { id: "1a", name: "A", capacity: 30 },
      { id: "1b", name: "B", capacity: 30 },
    ],
  },
  {
    id: "2",
    name: "Nursery",
    sections: [
      { id: "2a", name: "A", capacity: 35 },
      { id: "2b", name: "B", capacity: 35 },
    ],
  },
  {
    id: "3",
    name: "KG",
    sections: [
      { id: "3a", name: "A", capacity: 40 },
      { id: "3b", name: "B", capacity: 40 },
      { id: "3c", name: "C", capacity: 40 },
    ],
  },
  {
    id: "4",
    name: "Class 1",
    sections: [
      { id: "4a", name: "A", capacity: 45 },
      { id: "4b", name: "B", capacity: 45 },
    ],
  },
  {
    id: "5",
    name: "Class 2",
    sections: [
      { id: "5a", name: "A", capacity: 45 },
    ],
  },
];

export default function ClassSections() {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  // Class dialog
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [className, setClassName] = useState("");

  // Section dialog
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionParentId, setSectionParentId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionCapacity, setSectionCapacity] = useState("30");

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState<{ type: "class" | "section"; classId: string; sectionId?: string } | null>(null);

  // Inline editing
  const [inlineEdit, setInlineEdit] = useState<{ classId: string; sectionId: string; field: "name" | "capacity"; value: string } | null>(null);

  const genId = () => Math.random().toString(36).slice(2, 9);

  // --- Class CRUD ---
  const openAddClass = () => {
    setEditingClass(null);
    setClassName("");
    setClassDialogOpen(true);
  };

  const openEditClass = (cls: ClassItem) => {
    setEditingClass(cls);
    setClassName(cls.name);
    setClassDialogOpen(true);
  };

  const saveClass = () => {
    if (!className.trim()) { toast.error("Class name is required"); return; }
    if (editingClass) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, name: className.trim() } : c));
      toast.success("Class updated");
    } else {
      setClasses(prev => [...prev, { id: genId(), name: className.trim(), sections: [] }]);
      toast.success("Class added");
    }
    setClassDialogOpen(false);
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    setDeleteDialog(null);
    toast.success("Class deleted");
  };

  // --- Section CRUD ---
  const openAddSection = (classId: string) => {
    setSectionParentId(classId);
    setEditingSection(null);
    setSectionName("");
    setSectionCapacity("30");
    setSectionDialogOpen(true);
  };

  const openEditSection = (classId: string, section: Section) => {
    setSectionParentId(classId);
    setEditingSection(section);
    setSectionName(section.name);
    setSectionCapacity(String(section.capacity));
    setSectionDialogOpen(true);
  };

  const saveSection = () => {
    if (!sectionName.trim()) { toast.error("Section name is required"); return; }
    const cap = parseInt(sectionCapacity) || 30;
    if (editingSection) {
      setClasses(prev => prev.map(c =>
        c.id === sectionParentId
          ? { ...c, sections: c.sections.map(s => s.id === editingSection.id ? { ...s, name: sectionName.trim(), capacity: cap } : s) }
          : c
      ));
      toast.success("Section updated");
    } else {
      setClasses(prev => prev.map(c =>
        c.id === sectionParentId
          ? { ...c, sections: [...c.sections, { id: genId(), name: sectionName.trim(), capacity: cap }] }
          : c
      ));
      toast.success("Section added");
    }
    setSectionDialogOpen(false);
  };

  const deleteSection = (classId: string, sectionId: string) => {
    setClasses(prev => prev.map(c =>
      c.id === classId ? { ...c, sections: c.sections.filter(s => s.id !== sectionId) } : c
    ));
    setDeleteDialog(null);
    toast.success("Section deleted");
  };

  // Inline save
  const saveInline = () => {
    if (!inlineEdit) return;
    const { classId, sectionId, field, value } = inlineEdit;
    setClasses(prev => prev.map(c =>
      c.id === classId
        ? {
            ...c,
            sections: c.sections.map(s =>
              s.id === sectionId
                ? { ...s, [field]: field === "capacity" ? (parseInt(value) || 0) : value }
                : s
            ),
          }
        : c
    ));
    setInlineEdit(null);
    toast.success("Updated");
  };

  const totalSections = classes.reduce((sum, c) => sum + c.sections.length, 0);
  const totalCapacity = classes.reduce((sum, c) => sum + c.sections.reduce((s2, sec) => s2 + sec.capacity, 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes & Sections</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage class structure and section allocation</p>
        </div>
        <Button onClick={openAddClass} className="gap-2">
          <Plus className="w-4 h-4" /> Add Class
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Classes", value: classes.length, icon: GraduationCap, color: "text-primary" },
          { label: "Total Sections", value: totalSections, icon: Layers, color: "text-blue-500" },
          { label: "Total Capacity", value: totalCapacity, icon: GraduationCap, color: "text-amber-500" },
        ].map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-5 flex items-center gap-4"
          >
            <div className={`p-2.5 rounded-lg bg-muted ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Class List */}
      <div className="space-y-3">
        {classes.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No classes yet. Click "Add Class" to get started.
          </div>
        )}
        {classes.map((cls) => {
          const isExpanded = expandedClass === cls.id;
          return (
            <motion.div
              key={cls.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Class Row */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">{cls.name}</span>
                  <Badge variant="secondary" className="text-xs">{cls.sections.length} section{cls.sections.length !== 1 ? "s" : ""}</Badge>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditClass(cls)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteDialog({ type: "class", classId: cls.id })}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Sections */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-1 border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sections</p>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => openAddSection(cls.id)}>
                          <Plus className="w-3 h-3" /> Add Section
                        </Button>
                      </div>

                      {cls.sections.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-3 text-center">No sections. Add one above.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {cls.sections.map((sec) => (
                            <div key={sec.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                              <div>
                                {inlineEdit?.sectionId === sec.id && inlineEdit.classId === cls.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={inlineEdit.value}
                                      onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                                      className="h-7 w-20 text-sm"
                                      autoFocus
                                      onKeyDown={(e) => e.key === "Enter" && saveInline()}
                                    />
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={saveInline}>
                                      <Save className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setInlineEdit(null)}>
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm font-medium text-foreground">Section {sec.name}</p>
                                    <p className="text-xs text-muted-foreground">Capacity: {sec.capacity}</p>
                                  </>
                                )}
                              </div>
                              {!(inlineEdit?.sectionId === sec.id && inlineEdit.classId === cls.id) && (
                                <div className="flex items-center gap-0.5">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditSection(cls.id, sec)}>
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteDialog({ type: "section", classId: cls.id, sectionId: sec.id })}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Class Dialog */}
      <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingClass ? "Edit Class" : "Add New Class"}</DialogTitle>
            <DialogDescription>Enter the class name below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Class Name</label>
              <Input
                placeholder="e.g. Class 3"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveClass()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClassDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveClass}>{editingClass ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Section Dialog */}
      <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSection ? "Edit Section" : "Add New Section"}</DialogTitle>
            <DialogDescription>
              {editingSection ? "Update section details." : "Add a section to this class."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Section Name</label>
              <Input
                placeholder="e.g. A, B, C"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Capacity</label>
              <Input
                type="number"
                placeholder="30"
                value={sectionCapacity}
                onChange={(e) => setSectionCapacity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveSection()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSectionDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveSection}>{editingSection ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              {deleteDialog?.type === "class"
                ? "This will delete the class and all its sections. This action cannot be undone."
                : "This will delete the section. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteDialog) return;
                if (deleteDialog.type === "class") deleteClass(deleteDialog.classId);
                else if (deleteDialog.sectionId) deleteSection(deleteDialog.classId, deleteDialog.sectionId);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Printer, RotateCcw, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const initialForm = {
  receipt_no: "",
  admission_date: new Date().toISOString().split("T")[0],
  admission_type: "New",
  class: "",
  section: "",
  name: "",
  bangla_name: "",
  dob: "",
  birth_registration_no: "",
  gender: "",
  blood_group: "",
  religion: "",
  special_disease: "",
  previous_institution: "",
  phone: "",
  student_id: "",
  father_name: "",
  father_bangla_name: "",
  father_occupation: "",
  father_nid: "",
  mother_name: "",
  mother_bangla_name: "",
  mother_occupation: "",
  mother_nid: "",
  permanent_village: "",
  permanent_post: "",
  permanent_upazila: "",
  permanent_district: "",
  present_village: "",
  present_post: "",
  present_upazila: "",
  present_district: "",
  address: "",
};

type FormState = typeof initialForm;

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 mb-4">
    <h3 className="text-sm font-bold text-primary uppercase tracking-wide">{children}</h3>
  </div>
);

const Field = ({ label, children, required, span2 }: { label: string; children: React.ReactNode; required?: boolean; span2?: boolean }) => (
  <div className={`space-y-1.5 ${span2 ? "sm:col-span-2" : ""}`}>
    <Label className="text-xs font-medium text-muted-foreground">
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
  </div>
);

export default function AdmissionForm() {
  const [form, setForm] = useState<FormState>({ ...initialForm });
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const update = (key: keyof FormState, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setForm({ ...initialForm, admission_date: new Date().toISOString().split("T")[0] });
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "ছবির সাইজ ৫MB এর বেশি হতে পারবে না", variant: "destructive" });
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;
    setUploadingPhoto(true);
    const ext = photoFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage.from("student-photos").upload(fileName, photoFile, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploadingPhoto(false);
    if (error) {
      toast({ title: "Error", description: "ছবি আপলোড করতে সমস্যা হয়েছে", variant: "destructive" });
      return null;
    }
    const { data: urlData } = supabase.storage.from("student-photos").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!form.name || !form.class) {
      toast({ title: "Required", description: "Student name and class are required", variant: "destructive" });
      return;
    }
    setSaving(true);

    // Upload photo first if selected
    const photoUrl = await uploadPhoto();

    const { error } = await supabase.from("students").insert({
      name: form.name,
      bangla_name: form.bangla_name || null,
      class: form.class,
      section: form.section || null,
      roll: null,
      student_id: form.student_id || null,
      dob: form.dob || null,
      gender: form.gender || null,
      religion: form.religion || null,
      blood_group: form.blood_group || null,
      phone: form.phone || null,
      address: form.address || null,
      father_name: form.father_name || null,
      father_bangla_name: form.father_bangla_name || null,
      father_occupation: form.father_occupation || null,
      father_nid: form.father_nid || null,
      mother_name: form.mother_name || null,
      mother_bangla_name: form.mother_bangla_name || null,
      mother_occupation: form.mother_occupation || null,
      mother_nid: form.mother_nid || null,
      birth_registration_no: form.birth_registration_no || null,
      special_disease: form.special_disease || null,
      previous_institution: form.previous_institution || null,
      admission_type: form.admission_type,
      receipt_no: form.receipt_no || null,
      admission_date: form.admission_date || null,
      permanent_village: form.permanent_village || null,
      permanent_post: form.permanent_post || null,
      permanent_upazila: form.permanent_upazila || null,
      permanent_district: form.permanent_district || null,
      present_village: form.present_village || null,
      present_post: form.present_post || null,
      present_upazila: form.present_upazila || null,
      present_district: form.present_district || null,
      photo_url: photoUrl,
    } as any);

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: "Failed to save admission. " + error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Student admission saved successfully" });
      handleReset();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-foreground">শাপলা কিন্ডারগার্টেন এন্ড প্রি-ক্যাডেট</h1>
        <p className="text-sm text-muted-foreground">নাওতলা, মাধাইয়া বাজার, চান্দিনা, কুমিল্লা</p>
        <p className="text-xs text-muted-foreground">School Code: 416614 | Mobile: 01777584352 | Email: cma@gmail.com</p>
        <h2 className="text-xl font-bold text-primary mt-2">ভর্তি আবেদন ফরম / Admission Form</h2>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="stat-card p-6 space-y-6">
        {/* Receipt & Admission Info + Photo */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Left: Receipt info */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="রিসিট নম্বর / Receipt No">
              <Input value={form.receipt_no} onChange={(e) => update("receipt_no", e.target.value)} placeholder="R-001" />
            </Field>
            <Field label="তারিখ / Date">
              <Input type="date" value={form.admission_date} onChange={(e) => update("admission_date", e.target.value)} />
            </Field>
            <Field label="ভর্তির ধরন / Type">
              <RadioGroup value={form.admission_type} onValueChange={(v) => update("admission_type", v)} className="flex gap-4 pt-2">
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="New" id="new" />
                  <Label htmlFor="new" className="text-sm cursor-pointer">নতুন / New</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="Old" id="old" />
                  <Label htmlFor="old" className="text-sm cursor-pointer">পুরাতন / Old</Label>
                </div>
              </RadioGroup>
            </Field>
            <Field label="শ্রেণি / Class" required>
              <Select value={form.class} onValueChange={(v) => update("class", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Play-Group", "Nursery", "KG-1", "KG-2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Right: Photo Upload */}
          <div className="flex flex-col items-center gap-2">
            <Label className="text-xs font-medium text-muted-foreground">ছবি / Photo</Label>
            <div
              className="relative w-[120px] h-[140px] border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden bg-muted/30 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Camera className="w-8 h-8" />
                  <span className="text-[10px] text-center leading-tight">ছবি আপলোড<br />করুন</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />
            <span className="text-[10px] text-muted-foreground">Max 5MB (JPG/PNG)</span>
          </div>
        </div>

        <Separator />

        {/* Student Information */}
        <SectionHeader>ভর্তি ইচ্ছুক শিক্ষার্থীর তথ্য / Student Information</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="ছাত্র-ছাত্রীর নাম (English)" required>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name in English" />
          </Field>
          <Field label="বাংলায় নিখুন / Name (Bangla)">
            <Input value={form.bangla_name} onChange={(e) => update("bangla_name", e.target.value)} placeholder="বাংলায় নাম" />
          </Field>
          <Field label="Student ID">
            <Input value={form.student_id} onChange={(e) => update("student_id", e.target.value)} placeholder="SK-2026-001" />
          </Field>
          <Field label="জন্ম তারিখ / Date of Birth">
            <Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
          </Field>
          <Field label="জন্ম নিবন্ধন নং / Birth Reg. No">
            <Input value={form.birth_registration_no} onChange={(e) => update("birth_registration_no", e.target.value)} />
          </Field>
          <Field label="লিঙ্গ / Gender">
            <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="রক্তের গ্রুপ / Blood Group">
            <Select value={form.blood_group} onValueChange={(v) => update("blood_group", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="ধর্ম / Religion">
            <Input value={form.religion} onChange={(e) => update("religion", e.target.value)} placeholder="Islam / Hindu / Others" />
          </Field>
          <Field label="বিশেষ কোন রোগ / Special Disease">
            <Input value={form.special_disease} onChange={(e) => update("special_disease", e.target.value)} placeholder="If any" />
          </Field>
          <Field label="পূর্বের প্রতিষ্ঠানের নাম / Previous Institution" span2>
            <Input value={form.previous_institution} onChange={(e) => update("previous_institution", e.target.value)} />
          </Field>
          <Field label="মোবাইল / Phone">
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="01XXXXXXXXX" />
          </Field>
        </div>

        <Separator />

        {/* Parents Information */}
        <SectionHeader>পিতা-মাতার তথ্য / Parents Information</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="পিতার নাম (English)">
            <Input value={form.father_name} onChange={(e) => update("father_name", e.target.value)} />
          </Field>
          <Field label="পিতার নাম (বাংলা)">
            <Input value={form.father_bangla_name} onChange={(e) => update("father_bangla_name", e.target.value)} />
          </Field>
          <Field label="পিতার পেশা / Occupation">
            <Input value={form.father_occupation} onChange={(e) => update("father_occupation", e.target.value)} />
          </Field>
          <Field label="পিতার NID No">
            <Input value={form.father_nid} onChange={(e) => update("father_nid", e.target.value)} />
          </Field>
          <Field label="মাতার নাম (English)">
            <Input value={form.mother_name} onChange={(e) => update("mother_name", e.target.value)} />
          </Field>
          <Field label="মাতার নাম (বাংলা)">
            <Input value={form.mother_bangla_name} onChange={(e) => update("mother_bangla_name", e.target.value)} />
          </Field>
          <Field label="মাতার পেশা / Occupation">
            <Input value={form.mother_occupation} onChange={(e) => update("mother_occupation", e.target.value)} />
          </Field>
          <Field label="মাতার NID No">
            <Input value={form.mother_nid} onChange={(e) => update("mother_nid", e.target.value)} />
          </Field>
        </div>

        <Separator />

        {/* Address */}
        <SectionHeader>শিক্ষার্থীর স্থায়ী ঠিকানা / Permanent Address</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="গ্রাম / Village">
            <Input value={form.permanent_village} onChange={(e) => update("permanent_village", e.target.value)} />
          </Field>
          <Field label="পোষ্ট / Post">
            <Input value={form.permanent_post} onChange={(e) => update("permanent_post", e.target.value)} />
          </Field>
          <Field label="উপজেলা / Upazila">
            <Input value={form.permanent_upazila} onChange={(e) => update("permanent_upazila", e.target.value)} />
          </Field>
          <Field label="জেলা / District">
            <Input value={form.permanent_district} onChange={(e) => update("permanent_district", e.target.value)} />
          </Field>
        </div>

        <SectionHeader>শিক্ষার্থীর বর্তমান ঠিকানা / Present Address</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="গ্রাম / Village">
            <Input value={form.present_village} onChange={(e) => update("present_village", e.target.value)} />
          </Field>
          <Field label="পোষ্ট / Post">
            <Input value={form.present_post} onChange={(e) => update("present_post", e.target.value)} />
          </Field>
          <Field label="উপজেলা / Upazila">
            <Input value={form.present_upazila} onChange={(e) => update("present_upazila", e.target.value)} />
          </Field>
          <Field label="জেলা / District">
            <Input value={form.present_district} onChange={(e) => update("present_district", e.target.value)} />
          </Field>
        </div>

        <Separator />

        <Field label="Section">
          <Select value={form.section} onValueChange={(v) => update("section", v)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {["A", "B", "C"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button onClick={handleSubmit} disabled={saving || uploadingPhoto} className="gap-2">
            {(saving || uploadingPhoto) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Admission
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

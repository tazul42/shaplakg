import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";
import ComingSoon from "./pages/ComingSoon";
import ClassSections from "./pages/ClassSections";
import AdmissionForm from "./pages/AdmissionForm";
import FeesTable from "./pages/FeesTable";
import FeesReceivedCash from "./pages/FeesReceivedCash";
import OnlinePayments from "./pages/OnlinePayments";
import ClassLedger from "./pages/ClassLedger";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            {/* Student Management */}
            <Route path="/students/admission-form" element={<AdmissionForm />} />
            <Route path="/students/new-admission" element={<AdmissionForm />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/students/bulk-upload" element={<ComingSoon />} />
            <Route path="/students/promotion" element={<ComingSoon />} />
            <Route path="/students/release-transfer" element={<ComingSoon />} />
            {/* Fees Management */}
            <Route path="/fees/received-cash" element={<FeesReceivedCash />} />
            <Route path="/fees/online-payments" element={<OnlinePayments />} />
            <Route path="/fees/table" element={<FeesTable />} />
            <Route path="/fees/class-ledger" element={<ClassLedger />} />
            {/* Teacher & Staff */}
            <Route path="/teachers/add" element={<ComingSoon />} />
            <Route path="/teachers/profiles" element={<ComingSoon />} />
            <Route path="/teachers/vacation" element={<ComingSoon />} />
            {/* Attendance */}
            <Route path="/attendance/students" element={<ComingSoon />} />
            <Route path="/attendance/teachers" element={<ComingSoon />} />
            <Route path="/attendance/biometric" element={<ComingSoon />} />
            {/* Examinations */}
            <Route path="/exams/monthly" element={<ComingSoon />} />
            <Route path="/exams/semester" element={<ComingSoon />} />
            <Route path="/exams/annual" element={<ComingSoon />} />
            <Route path="/exams/tabulation" element={<ComingSoon />} />
            {/* Inventory */}
            <Route path="/inventory/products" element={<ComingSoon />} />
            <Route path="/inventory/stock" element={<ComingSoon />} />
            <Route path="/inventory/balance" element={<ComingSoon />} />
            <Route path="/inventory/margin" element={<ComingSoon />} />
            {/* Accounts */}
            <Route path="/accounts/salary" element={<ComingSoon />} />
            <Route path="/accounts/stationery" element={<ComingSoon />} />
            <Route path="/accounts/income-expense" element={<ComingSoon />} />
            <Route path="/accounts/cash-book" element={<ComingSoon />} />
            {/* SMS Notifications */}
            <Route path="/sms/dues" element={<ComingSoon />} />
            <Route path="/sms/absent" element={<ComingSoon />} />
            <Route path="/sms/exam-result" element={<ComingSoon />} />
            <Route path="/sms/general" element={<ComingSoon />} />
            {/* Question Management */}
            <Route path="/questions/create" element={<ComingSoon />} />
            <Route path="/questions/bank" element={<ComingSoon />} />
            <Route path="/questions/stock" element={<ComingSoon />} />
            {/* Reports & Results */}
            <Route path="/reports/admissions" element={<ComingSoon />} />
            <Route path="/reports/sales" element={<ComingSoon />} />
            <Route path="/reports/profit-loss" element={<ComingSoon />} />
            <Route path="/reports/monthly-marksheet" element={<ComingSoon />} />
            <Route path="/reports/final-marksheet" element={<ComingSoon />} />
            <Route path="/reports/tabulation" element={<ComingSoon />} />
            {/* Master Settings */}
            <Route path="/classes" element={<ClassSections />} />
            <Route path="/settings/fees" element={<ComingSoon />} />
            <Route path="/settings/exam" element={<ComingSoon />} />
            <Route path="/settings/mark" element={<ComingSoon />} />
            <Route path="/settings/admin-user" element={<ComingSoon />} />
            <Route path="/settings/school-info" element={<ComingSoon />} />
            <Route path="/settings/language" element={<ComingSoon />} />
            <Route path="/settings/salary" element={<ComingSoon />} />
            {/* Certificates & IDs */}
            <Route path="/certificates/id-card" element={<ComingSoon />} />
            <Route path="/certificates/admit-card" element={<ComingSoon />} />
            <Route path="/certificates/testimonial" element={<ComingSoon />} />
            <Route path="/certificates/transfer" element={<ComingSoon />} />
            <Route path="/certificates/seat-plan" element={<ComingSoon />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

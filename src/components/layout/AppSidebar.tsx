import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, ClipboardCheck,
  BookOpen, DollarSign, Package, Bell, Settings, ChevronLeft, ChevronRight,
  Receipt, BarChart3, ChevronDown, UserPlus, ListOrdered, Upload,
  ArrowUpRight, FileText, CreditCard, Table2, BookOpenCheck,
  UserCheck, Palmtree, Fingerprint, Calendar, Award, ScrollText,
  ShoppingCart, TrendingUp, TrendingDown, BookCopy, MessageSquare,
  AlertCircle, HelpCircle, FileQuestion, Library, BadgeCheck,
  IdCard, Ticket, FileSignature, MapPin, Wrench, Languages, Banknote
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: any;
  path?: string;
  children?: { title: string; icon: any; path: string }[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  {
    title: "Student Management", icon: Users, children: [
      { title: "Admission Form", path: "/students/admission-form", icon: FileText },
      { title: "New Admission", path: "/students/new-admission", icon: UserPlus },
      { title: "Student List", path: "/students", icon: ListOrdered },
      { title: "Bulk Upload", path: "/students/bulk-upload", icon: Upload },
      { title: "Promotion", path: "/students/promotion", icon: ArrowUpRight },
      { title: "Release / Transfer", path: "/students/release-transfer", icon: ArrowUpRight },
    ]
  },
  {
    title: "Fees Management", icon: Receipt, children: [
      { title: "Fees Received Cash", path: "/fees/received-cash", icon: DollarSign },
      { title: "Online Payments", path: "/fees/online-payments", icon: CreditCard },
      { title: "Fees Table", path: "/fees/table", icon: Table2 },
      { title: "Class-wise Ledger", path: "/fees/class-ledger", icon: BookOpenCheck },
    ]
  },
  {
    title: "Teacher & Staff", icon: GraduationCap, children: [
      { title: "Add Teacher", path: "/teachers/add", icon: UserPlus },
      { title: "Teacher Profiles", path: "/teachers/profiles", icon: UserCheck },
      { title: "Vacation Management", path: "/teachers/vacation", icon: Palmtree },
    ]
  },
  {
    title: "Attendance", icon: ClipboardCheck, children: [
      { title: "Student Attendance", path: "/attendance/students", icon: Users },
      { title: "Teacher Attendance", path: "/attendance/teachers", icon: GraduationCap },
      { title: "Biometric Logs", path: "/attendance/biometric", icon: Fingerprint },
    ]
  },
  {
    title: "Examinations", icon: BookOpen, children: [
      { title: "Monthly Exam", path: "/exams/monthly", icon: Calendar },
      { title: "Semester Exam", path: "/exams/semester", icon: BookOpen },
      { title: "Annual Exam", path: "/exams/annual", icon: Award },
      { title: "Tabulation Sheet", path: "/exams/tabulation", icon: ScrollText },
    ]
  },
  {
    title: "Inventory", icon: Package, children: [
      { title: "Product Entry", path: "/inventory/products", icon: Package },
      { title: "Stock In/Out", path: "/inventory/stock", icon: ShoppingCart },
      { title: "Balance", path: "/inventory/balance", icon: TrendingUp },
      { title: "Stock Margin", path: "/inventory/margin", icon: TrendingDown },
    ]
  },
  {
    title: "Accounts", icon: DollarSign, children: [
      { title: "Teacher Salary", path: "/accounts/salary", icon: Banknote },
      { title: "Stationery Sale", path: "/accounts/stationery", icon: ShoppingCart },
      { title: "Income/Expense", path: "/accounts/income-expense", icon: TrendingUp },
      { title: "Cash Book", path: "/accounts/cash-book", icon: BookCopy },
    ]
  },
  {
    title: "SMS Notifications", icon: Bell, children: [
      { title: "Dues", path: "/sms/dues", icon: AlertCircle },
      { title: "Absent", path: "/sms/absent", icon: UserCheck },
      { title: "Exam Result", path: "/sms/exam-result", icon: Award },
      { title: "General Notice", path: "/sms/general", icon: MessageSquare },
    ]
  },
  {
    title: "Question Management", icon: HelpCircle, children: [
      { title: "Create Question", path: "/questions/create", icon: FileQuestion },
      { title: "Question Bank", path: "/questions/bank", icon: Library },
      { title: "Question Stock", path: "/questions/stock", icon: Package },
    ]
  },
  {
    title: "Reports & Results", icon: BarChart3, children: [
      { title: "Admission Reports", path: "/reports/admissions", icon: FileText },
      { title: "Sales Reports", path: "/reports/sales", icon: TrendingUp },
      { title: "Profit/Loss", path: "/reports/profit-loss", icon: TrendingDown },
      { title: "Monthly Marksheet", path: "/reports/monthly-marksheet", icon: ScrollText },
      { title: "Final Marksheet", path: "/reports/final-marksheet", icon: Award },
      { title: "Tabulation Sheet", path: "/reports/tabulation", icon: Table2 },
    ]
  },
  {
    title: "Master Settings", icon: Settings, children: [
      { title: "Fees Settings", path: "/settings/fees", icon: Receipt },
      { title: "Exam Settings", path: "/settings/exam", icon: BookOpen },
      { title: "Mark Settings", path: "/settings/mark", icon: BadgeCheck },
      { title: "Class & Section", path: "/classes", icon: GraduationCap },
      { title: "Admin / User", path: "/settings/admin-user", icon: Users },
      { title: "Logo / School Info", path: "/settings/school-info", icon: Wrench },
      { title: "Language", path: "/settings/language", icon: Languages },
      { title: "Salary Settings", path: "/settings/salary", icon: Banknote },
    ]
  },
  {
    title: "Certificates & IDs", icon: IdCard, children: [
      { title: "ID Card", path: "/certificates/id-card", icon: IdCard },
      { title: "Admit Card", path: "/certificates/admit-card", icon: Ticket },
      { title: "Testimonial", path: "/certificates/testimonial", icon: FileSignature },
      { title: "Transfer Certificate", path: "/certificates/transfer", icon: FileText },
      { title: "Seat Plan", path: "/certificates/seat-plan", icon: MapPin },
    ]
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const isChildActive = (item: MenuItem) =>
    item.children?.some(c => location.pathname === c.path) ?? false;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 270 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen sticky top-0 bg-sidebar border-r border-sidebar-border flex flex-col z-30"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border gap-3">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <span className="text-sidebar-primary-foreground font-bold text-sm">SK</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden whitespace-nowrap">
              <p className="text-sidebar-foreground font-semibold text-sm leading-tight">Shapla</p>
              <p className="text-sidebar-foreground/60 text-xs">Kindergarten & Pre-cadet</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
        {menuItems.map((item) => {
          if (!item.children) {
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={item.path} to={item.path!} className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`} title={collapsed ? item.title : undefined}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">{item.title}</motion.span>}
                </AnimatePresence>
              </NavLink>
            );
          }

          const childActive = isChildActive(item);
          const isOpen = openMenus[item.title] ?? childActive;

          return (
            <div key={item.title}>
              <button
                onClick={() => !collapsed && toggleMenu(item.title)}
                className={`sidebar-link w-full ${childActive ? "sidebar-link-active" : ""}`}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm flex-1 text-left">{item.title}</motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && (
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                )}
              </button>
              <AnimatePresence>
                {isOpen && !collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-3 border-l border-sidebar-border space-y-0.5 py-1">
                      {item.children.map(child => {
                        const active = location.pathname === child.path;
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={`sidebar-link text-xs py-1.5 ${active ? "sidebar-link-active" : ""}`}
                          >
                            <child.icon className="w-4 h-4 flex-shrink-0" />
                            <span>{child.title}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <button onClick={() => setCollapsed(!collapsed)} className="sidebar-link w-full justify-center">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}

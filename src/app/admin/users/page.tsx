"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTranslation } from "@/components/layout/I18nProvider";
import { getUsers, updateUserRole } from "@/services/auth";

interface UserDto {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  joinedDate: string;
  roles: string[];
  roleId: string;
}

export default function UserManagementPage() {
  const { locale, dir } = useTranslation();
  const isRtl = dir === "rtl";

  const [users, setUsers] = useState<UserDto[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchUsersAndRoles = async () => {
    try {
      // Fetch users
      const usersData = await getUsers();
      const mapped = usersData.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        status: u.status as "active" | "inactive",
        joinedDate: u.joinedDate,
        roleId: u.role,
        roles: [u.role.replace("role-", "")],
      }));
      setUsers(mapped);

      // Fetch roles
      setRoles([
        { id: "role-superadmin", name: "Super Admin" },
        { id: "role-admin", name: "Admin" },
        { id: "role-manager", name: "Manager" },
        { id: "role-employee", name: "Employee" },
        { id: "role-customer", name: "Customer" },
      ]);
    } catch (err) {
      console.error("Failed to load users / roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setUpdatingUserId(userId);
    setMessage(null);
    try {
      await updateUserRole(userId, newRoleId);
      setMessage(locale === "en" ? "User role updated successfully!" : "تم تحديث دور المستخدم بنجاح!");
      // Refresh list
      await fetchUsersAndRoles();
    } catch {
      setMessage(locale === "en" ? "Failed to update role." : "فشل تحديث دور المستخدم.");
    } finally {
      setUpdatingUserId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "All" || u.roles.includes(roleFilter);

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-champagne-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={cn("flex items-center justify-between flex-wrap gap-4", isRtl && "flex-row-reverse")}>
        <div>
          <h1 className="font-caslon text-headline-lg text-deep-navy">
            {locale === "en" ? "User Management" : "إدارة المستخدمين والصلاحيات"}
          </h1>
          <p className="font-jakarta text-body-md text-outline mt-1">
            {locale === "en" ? "Manage all registered user credentials and assign platform roles." : "إدارة بيانات حسابات المستخدمين وتعيين الأدوار والصلاحيات."}
          </p>
        </div>
      </div>

      {message && (
        <div className="bg-sand-beige text-deep-navy px-6 py-4 rounded-xl font-jakarta text-sm border border-champagne-gold/30">
          {message}
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4", isRtl && "flex-row-reverse")}>
        {[
          { label: locale === "en" ? "Registered Users" : "المستخدمين المسجلين", value: users.length, icon: "group" },
          { label: locale === "en" ? "System Roles" : "أدوار النظام المتاحة", value: roles.length, icon: "workspace_premium" },
          { label: locale === "en" ? "Active Sessions" : "الجلسات النشطة حالياً", value: users.filter(u => u.status === "active").length, icon: "trending_up" },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn("bg-white rounded-xl p-6 shadow-luxury flex items-center gap-4", isRtl && "flex-row-reverse")}
          >
            <div className="w-12 h-12 rounded-xl bg-sand-beige flex items-center justify-center">
              <span className="material-symbols-outlined text-champagne-gold">{c.icon}</span>
            </div>
            <div className={isRtl ? "text-right" : "text-left"}>
              <p className="font-caslon text-headline-md text-deep-navy">{c.value}</p>
              <p className="font-jakarta text-label-sm text-outline">{c.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-luxury overflow-hidden">
        <div className={cn("flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 flex-wrap gap-4", isRtl && "flex-row-reverse")}>
          <h2 className="font-caslon text-headline-md text-deep-navy">
            {locale === "en" ? "System Accounts" : "الحسابات النشطة"}
          </h2>
          <div className={cn("flex gap-3", isRtl && "flex-row-reverse")}>
            <input
              placeholder={locale === "en" ? "Search users..." : "بحث باسم المستخدم..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("border border-outline-variant rounded-xl px-4 py-2 font-jakarta text-sm focus:outline-none focus:border-champagne-gold", isRtl && "text-right")}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-outline-variant rounded-xl px-4 py-2 font-jakarta text-sm focus:outline-none focus:border-champagne-gold bg-white"
              aria-label="Filter by role"
            >
              <option value="All">{locale === "en" ? "All Roles" : "كل الأدوار"}</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={cn("border-b border-outline-variant/20 bg-surface-container-low/50", isRtl && "text-right")}>
                {["User", "Email", "Joined Date", "Role Assignment", "Status"].map((h) => (
                  <th key={h} className={cn("px-6 py-4 font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider whitespace-nowrap", isRtl && "text-right")}>
                    {h === "User" && (locale === "en" ? "User" : "المستخدم")}
                    {h === "Email" && (locale === "en" ? "Email Address" : "البريد الإلكتروني")}
                    {h === "Joined Date" && (locale === "en" ? "Joined Date" : "تاريخ الانضمام")}
                    {h === "Role Assignment" && (locale === "en" ? "Role Assignment" : "الدور والترخيص")}
                    {h === "Status" && (locale === "en" ? "Status" : "الحالة")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredUsers.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                      <div className="w-9 h-9 rounded-full bg-sand-beige flex items-center justify-center">
                        <span className="font-jakarta font-bold text-champagne-gold text-sm">{u.name.charAt(0)}</span>
                      </div>
                      <span className="font-jakarta font-semibold text-sm text-deep-navy whitespace-nowrap">{u.name}</span>
                    </div>
                  </td>
                  <td className={cn("px-6 py-4 font-jakarta text-sm text-on-surface-variant", isRtl && "text-right")}>{u.email}</td>
                  <td className={cn("px-6 py-4 font-jakarta text-sm text-outline", isRtl && "text-right")}>{u.joinedDate}</td>
                  <td className="px-6 py-4">
                    <div className={cn("flex items-center gap-2", isRtl && "flex-row-reverse")}>
                      <select
                        value={u.roleId}
                        disabled={updatingUserId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="border border-outline-variant rounded-xl px-3 py-1.5 font-jakarta text-xs focus:outline-none focus:border-champagne-gold bg-white"
                        aria-label="Assign Role"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                      {updatingUserId === u.id && (
                        <div className="w-4 h-4 border-2 border-champagne-gold border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status === "active" ? "Approved" : "Rejected"} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

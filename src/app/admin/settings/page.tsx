"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/layout/I18nProvider";
import { getCurrentUser, getRolesWithPermissions, getAllPermissions, updateRolePermissions } from "@/services/auth";

interface RoleWithPermissions {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface PermissionDto {
  id: string;
  code: string;
  description: string;
}

export default function SystemSettingsPage() {
  const { locale, dir } = useTranslation();
  const isRtl = dir === "rtl";

  const [activeTab, setActiveTab] = useState("General");
  const [hasRoleManagePermission, setHasRoleManagePermission] = useState(false);

  // RBAC permissions state
  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionDto[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("role-admin");
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check permissions
    async function checkPermissions() {
      try {
        const data = await getCurrentUser();
        if (data.authenticated) {
          const managePerm = data.permissions.includes("role.manage");
          setHasRoleManagePermission(managePerm);
        }
      } catch (err) {
        console.error("Auth me fetch error in settings:", err);
      }
    }

    checkPermissions();
  }, []);

  const loadRolePermissions = async () => {
    try {
      const rolesData = await getRolesWithPermissions();
      const permsData = getAllPermissions();
      setRoles(rolesData);
      setAllPermissions(permsData);
    } catch (err) {
      console.error("Failed to load role permissions:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "Roles & Permissions" && hasRoleManagePermission) {
      loadRolePermissions();
    }
  }, [activeTab, hasRoleManagePermission]);

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const handlePermissionToggle = async (permissionCode: string, isChecked: boolean) => {
    if (!selectedRole) return;
    
    setUpdatingRoleId(selectedRole.id);
    setMessage(null);

    // Calculate new set of permissions
    let newPermissions = [...selectedRole.permissions];
    if (isChecked) {
      if (!newPermissions.includes(permissionCode)) {
        newPermissions.push(permissionCode);
      }
    } else {
      newPermissions = newPermissions.filter((p) => p !== permissionCode);
    }

    try {
      await updateRolePermissions(selectedRole.id, newPermissions);
      
      // Refresh local state
      setRoles(
        roles.map((r) =>
          r.id === selectedRole.id ? { ...r, permissions: newPermissions } : r
        )
      );
      setMessage(locale === "en" ? "Permissions updated successfully!" : "تم تحديث الصلاحيات بنجاح!");
    } catch {
      setMessage("Failed to update permissions.");
    } finally {
      setUpdatingRoleId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const tabs = ["General", "Payments", "Notifications", "Integrations", "Security"];
  if (hasRoleManagePermission) {
    tabs.push("Roles & Permissions");
  }

  return (
    <div className="space-y-6">
      <div className={cn("flex justify-between items-center flex-wrap gap-4", isRtl && "flex-row-reverse")}>
        <div>
          <h1 className={cn("font-caslon text-headline-lg text-deep-navy", isRtl && "text-right")}>
            {locale === "en" ? "System Settings" : "إعدادات النظام"}
          </h1>
          <p className={cn("font-jakarta text-body-md text-outline mt-1", isRtl && "text-right")}>
            {locale === "en" ? "Configure platform settings, preferences, and user role permission mapping." : "تعديل إعدادات المنصة، وخيارات الدفع، وتعيين صلاحيات الأدوار."}
          </p>
        </div>
      </div>

      {message && (
        <div className="bg-sand-beige text-deep-navy px-6 py-4 rounded-xl font-jakarta text-sm border border-champagne-gold/30">
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className={cn("flex gap-2 border-b border-outline-variant/30 pb-0 flex-wrap", isRtl && "flex-row-reverse justify-start")}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "px-6 py-3 font-jakarta font-semibold text-sm transition-all duration-300 border-b-2 -mb-px",
              activeTab === t ? "text-champagne-gold border-champagne-gold" : "text-on-surface-variant border-transparent hover:text-deep-navy"
            )}
          >
            {t === "General" && (locale === "en" ? "General" : "عام")}
            {t === "Payments" && (locale === "en" ? "Payments" : "بوابات الدفع")}
            {t === "Notifications" && (locale === "en" ? "Notifications" : "التنبيهات")}
            {t === "Integrations" && (locale === "en" ? "Integrations" : "الربط الخارجي")}
            {t === "Security" && (locale === "en" ? "Security" : "الحماية والأمان")}
            {t === "Roles & Permissions" && (locale === "en" ? "Roles & Permissions" : "الأدوار والصلاحيات")}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === "General" && (
          <>
            <div className="bg-white rounded-xl shadow-luxury p-6 space-y-5">
              <h2 className={cn("font-caslon text-headline-md text-deep-navy", isRtl && "text-right")}>
                {locale === "en" ? "Business Information" : "معلومات الشركة"}
              </h2>
              {[
                { label: locale === "en" ? "Company Name" : "اسم الشركة", value: "Cairo Hangzhou Travel & Visa" },
                { label: locale === "en" ? "Email Address" : "البريد الإلكتروني", value: "info@cairohangzhou.com" },
                { label: locale === "en" ? "Phone Number" : "رقم الهاتف", value: "+20 2 1234 5678" },
                { label: locale === "en" ? "Website URL" : "رابط الموقع الالكتروني", value: "https://cairohangzhou.com" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>{f.label}</label>
                  <input defaultValue={f.value} className={cn("w-full border border-outline-variant rounded-xl px-4 py-3 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors", isRtl && "text-right")} />
                </div>
              ))}
              <button className={cn("bg-deep-navy text-white font-jakarta font-bold px-6 py-3 rounded-full hover:bg-champagne-gold hover:text-deep-navy transition-all duration-300", isRtl && "float-right")}>
                {locale === "en" ? "Save Changes" : "حفظ التغييرات"}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-luxury p-6 space-y-5">
              <h2 className={cn("font-caslon text-headline-md text-deep-navy", isRtl && "text-right")}>
                {locale === "en" ? "Platform Settings" : "إعدادات المنصة"}
              </h2>
              {[
                { label: locale === "en" ? "Default Language" : "اللغة الافتراضية", options: ["English", "Arabic", "Chinese"] },
                { label: locale === "en" ? "Timezone" : "المنطقة الزمنية", options: ["UTC+2 (Cairo)", "UTC+8 (Hangzhou)", "UTC+0 (London)"] },
                { label: locale === "en" ? "Currency" : "العملة الرئيسية", options: ["USD ($)", "EGP (£)", "CNY (¥)"] },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className={cn("font-jakarta font-semibold text-label-sm text-outline uppercase tracking-wider block", isRtl && "text-right")}>{f.label}</label>
                  <select className={cn("w-full border border-outline-variant rounded-xl px-4 py-3 font-jakarta text-sm focus:outline-none focus:border-champagne-gold transition-colors appearance-none bg-white", isRtl && "text-right")} aria-label={f.label}>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              {[
                { label: locale === "en" ? "Maintenance Mode" : "وضع الصيانة", desc: locale === "en" ? "Temporarily disable the site for updates" : "إغلاق الموقع مؤقتاً للتحديثات" },
                { label: locale === "en" ? "User Registration" : "تسجيل مستخدمين جدد", desc: locale === "en" ? "Allow new users to register" : "السماح للمستخدمين الجدد بإنشاء حسابات" },
                { label: locale === "en" ? "Email Notifications" : "إشعارات البريد الإلكتروني", desc: locale === "en" ? "Send automated booking confirmations" : "إرسال تأكيدات الحجز التلقائية بالبريد" },
              ].map((toggle) => (
                <div key={toggle.label} className={cn("flex items-center justify-between", isRtl && "flex-row-reverse")}>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <p className="font-jakarta font-semibold text-sm text-deep-navy">{toggle.label}</p>
                    <p className="font-jakarta text-label-sm text-outline">{toggle.desc}</p>
                  </div>
                  <button className="w-12 h-6 bg-champagne-gold rounded-full relative transition-colors" role="switch" aria-label={toggle.label}>
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Roles & Permissions" && hasRoleManagePermission && (
          <div className="lg:col-span-2 bg-white rounded-xl shadow-luxury p-6 space-y-6">
            <div className={cn("flex items-center justify-between border-b border-outline-variant/30 pb-4 flex-wrap gap-4", isRtl && "flex-row-reverse")}>
              <div className={isRtl ? "text-right" : "text-left"}>
                <h2 className="font-caslon text-headline-md text-deep-navy">
                  {locale === "en" ? "Role Authorization Mapping" : "تعديل صلاحيات أدوار النظام"}
                </h2>
                <p className="font-jakarta text-xs text-outline mt-1">
                  {locale === "en" ? "Select a system role below and customize its granular permissions." : "اختر الدور من القائمة لتعديل صلاحيات الوصول والعمليات المتاحة له."}
                </p>
              </div>

              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="border border-outline-variant rounded-xl px-4 py-2 font-jakarta text-sm focus:outline-none focus:border-champagne-gold bg-white"
                aria-label="Select Role"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {selectedRole && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: Role Info */}
                <div className={cn("space-y-4 bg-sand-beige/10 p-5 rounded-xl border border-outline-variant/30", isRtl ? "text-right" : "text-left")}>
                  <div className="flex items-center gap-2 mb-2 justify-start">
                    <span className="material-symbols-outlined text-champagne-gold">verified_user</span>
                    <span className="font-caslon text-headline-md text-deep-navy">{selectedRole.name}</span>
                  </div>
                  <p className="font-jakarta text-sm text-outline">{selectedRole.description}</p>
                  <div className="pt-4 border-t border-outline-variant/20">
                    <span className="font-jakarta text-xs font-semibold text-deep-navy uppercase tracking-wider block mb-2">
                      {locale === "en" ? "Summary of Assigned Permissions" : "ملخص الصلاحيات الممنوحة حالياً"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRole.permissions.map((p) => (
                        <span key={p} className="bg-deep-navy/5 text-deep-navy font-jakarta text-[10px] px-2.5 py-1 rounded-full border border-deep-navy/10">
                          {p}
                        </span>
                      ))}
                      {selectedRole.permissions.length === 0 && (
                        <span className="text-xs text-outline">{locale === "en" ? "No permissions assigned" : "لا يوجد صلاحيات معينة"}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Permissions Checklist */}
                <div className="space-y-3">
                  <h3 className={cn("font-jakarta text-xs font-semibold text-deep-navy uppercase tracking-wider block", isRtl && "text-right")}>
                    {locale === "en" ? "Configure Permissions" : "تعديل الصلاحيات الفردية"}
                  </h3>
                  
                  <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2 no-scrollbar border border-outline-variant/20 rounded-xl p-4">
                    {allPermissions.map((p) => {
                      const isChecked = selectedRole.permissions.includes(p.code);
                      const isSuperAdminDisable = selectedRole.id === "role-superadmin"; // Super admin cannot be changed to prevent lock-out

                      return (
                        <label
                          key={p.id}
                          className={cn(
                            "flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-container-low transition-all cursor-pointer border border-transparent",
                            isRtl && "flex-row-reverse text-right",
                            isChecked ? "bg-sand-beige/5 border-champagne-gold/10" : ""
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isSuperAdminDisable || updatingRoleId === selectedRole.id}
                            onChange={(e) => handlePermissionToggle(p.code, e.target.checked)}
                            className="mt-1 accent-champagne-gold"
                          />
                          <div>
                            <span className="font-jakarta font-semibold text-xs text-deep-navy block">{p.code}</span>
                            <span className="font-jakarta text-[11px] text-outline">{p.description}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab !== "General" && activeTab !== "Roles & Permissions" && (
          <div className="lg:col-span-2 bg-white rounded-xl shadow-luxury p-12 text-center">
            <div className="w-16 h-16 bg-sand-beige rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-champagne-gold text-2xl">settings</span>
            </div>
            <h2 className="font-caslon text-headline-md text-deep-navy mb-2">{activeTab} Settings</h2>
            <p className="font-jakarta text-body-md text-on-surface-variant">Configure your {activeTab.toLowerCase()} settings here.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

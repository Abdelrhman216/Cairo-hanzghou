import { getDbItem, setDbItem } from "./db";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
}

const guestNav = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Flights", href: "/flights", icon: "flight" },
  { label: "Hotels", href: "/hotels", icon: "apartment" },
  { label: "Packages", href: "/packages", icon: "history_edu" },
  { label: "Visa", href: "/visa", icon: "description" },
];

const customerNav = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Flights", href: "/flights", icon: "flight" },
  { label: "Hotels", href: "/hotels", icon: "apartment" },
  { label: "Packages", href: "/packages", icon: "history_edu" },
  { label: "Visa", href: "/visa", icon: "description" },
];

const defaultRolePermissions: Record<string, string[]> = {
  "role-superadmin": [
    "admin.access", "users.read", "users.create", "users.update", "users.delete",
    "visa.read", "visa.create", "visa.update", "visa.delete", "packages.manage",
    "payments.read", "settings.manage", "support.manage", "campaigns.manage",
    "reports.read", "role.manage", "customer.access"
  ],
  "role-admin": [
    "admin.access", "users.read", "users.create", "users.update",
    "visa.read", "visa.create", "visa.update", "visa.delete", "packages.manage",
    "payments.read", "settings.manage", "support.manage", "campaigns.manage",
    "reports.read", "customer.access"
  ],
  "role-manager": [
    "admin.access", "users.read", "visa.read", "visa.update", "support.manage", "reports.read"
  ],
  "role-employee": [
    "admin.access", "visa.read", "visa.update", "support.manage"
  ],
  "role-customer": [
    "customer.access", "visa.create"
  ]
};

export function getRolePermissions(role: string): string[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("mock_db_role_permissions");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed[role]) return parsed[role];
      } catch (e) {}
    }
  }
  return defaultRolePermissions[role] || [];
}

export function updateRolePermissions(role: string, permissions: string[]) {
  let current: Record<string, string[]> = { ...defaultRolePermissions };
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("mock_db_role_permissions");
    if (data) {
      try {
        current = JSON.parse(data);
      } catch (e) {}
    }
  }
  current[role] = permissions;
  if (typeof window !== "undefined") {
    localStorage.setItem("mock_db_role_permissions", JSON.stringify(current));
  }
}

export function getAllPermissions() {
  return [
    { id: "perm-admin-access", code: "admin.access", description: "Access Admin Dashboard UI" },
    { id: "perm-users-read", code: "users.read", description: "View user listings" },
    { id: "perm-users-create", code: "users.create", description: "Create user accounts" },
    { id: "perm-users-update", code: "users.update", description: "Edit user roles/statuses" },
    { id: "perm-users-delete", code: "users.delete", description: "Delete user accounts" },
    { id: "perm-visa-read", code: "visa.read", description: "View visa requests" },
    { id: "perm-visa-create", code: "visa.create", description: "Submit visa requests" },
    { id: "perm-visa-update", code: "visa.update", description: "Update visa states/checklist rules" },
    { id: "perm-visa-delete", code: "visa.delete", description: "Remove visa applications" },
    { id: "perm-packages-manage", code: "packages.manage", description: "Manage tour packages" },
    { id: "perm-payments-read", code: "payments.read", description: "Access payments & financial metrics" },
    { id: "perm-settings-manage", code: "settings.manage", description: "Configure system rules" },
    { id: "perm-support-manage", code: "support.manage", description: "Handle customer queries & support chats" },
    { id: "perm-campaigns-manage", code: "campaigns.manage", description: "Create and publish alerts/promos" },
    { id: "perm-reports-read", code: "reports.read", description: "View dashboard widgets & statistics reports" },
    { id: "perm-role-manage", code: "role.manage", description: "Configure role/permission controls" },
    { id: "perm-customer-access", code: "customer.access", description: "Standard client dashboard access" },
  ];
}

export async function getRolesWithPermissions() {
  const roles = [
    { id: "role-superadmin", name: "Super Admin", description: "Full system access & security config" },
    { id: "role-admin", name: "Admin", description: "Administrative portal management" },
    { id: "role-manager", name: "Manager", description: "Team management & reporting tools" },
    { id: "role-employee", name: "Employee", description: "Assigned applications handling" },
    { id: "role-customer", name: "Customer", description: "Standard traveler client access" },
  ];

  return roles.map((r) => ({
    ...r,
    permissions: getRolePermissions(r.id),
  }));
}

export function getRoleNavigation(role: string): { label: string; href: string; icon: string }[] {
  const permissions = getRolePermissions(role);
  const nav = [];

  if (permissions.includes("settings.manage")) {
    return [
      { label: "Overview", href: "/admin", icon: "dashboard" },
      { label: "Hotel Bookings", href: "/admin/bookings/hotels", icon: "hotel" },
      { label: "Flight Requests", href: "/admin/bookings/flights", icon: "flight" },
      { label: "Package Inventory", href: "/admin/packages", icon: "inventory_2" },
      { label: "User Management", href: "/admin/users", icon: "group" },
      { label: "Visa Applications", href: "/admin/visa", icon: "badge" },
      { label: "Visa Requirements DB", href: "/admin/visa/requirements", icon: "public" },
      { label: "Payments & Analytics", href: "/admin/payments", icon: "bar_chart" },
      { label: "Support Center", href: "/admin/support", icon: "support_agent" },
      { label: "Campaigns & Alerts", href: "/admin/campaigns", icon: "campaign" },
      { label: "System Settings", href: "/admin/settings", icon: "settings" }
    ];
  }

  if (permissions.includes("reports.read") && permissions.includes("users.read")) {
    return [
      { label: "Team Dashboard", href: "/admin", icon: "dashboard" },
      { label: "Reports", href: "/admin/payments", icon: "bar_chart" },
      { label: "Employee Management", href: "/admin/users", icon: "group" },
      { label: "Visa Applications", href: "/admin/visa", icon: "badge" },
      { label: "Support Center", href: "/admin/support", icon: "support_agent" }
    ];
  }

  if (permissions.includes("admin.access")) {
    return [
      { label: "Assigned Applications", href: "/admin/visa", icon: "badge" },
      { label: "Customers", href: "/admin/users", icon: "group" },
      { label: "Support Center", href: "/admin/support", icon: "support_agent" }
    ];
  }

  return customerNav;
}

export async function getCurrentUser() {
  const user = getDbItem<User | null>("currentUser");
  if (!user) {
    return {
      authenticated: false,
      user: null,
      permissions: [] as string[],
      navigation: guestNav,
    };
  }

  const permissions = getRolePermissions(user.role);
  const navigation = getRoleNavigation(user.role);

  return {
    authenticated: true,
    user,
    permissions,
    navigation,
  };
}

export async function login(email: string, passwordHash: string) {
  const users = getDbItem<User[]>("users");
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Simulate successful authentication
  setDbItem<User>("currentUser", user);
  
  // Set cookie for browser compatibility
  if (typeof document !== "undefined") {
    document.cookie = `ch_session=${encodeURIComponent(user.id)}; path=/; max-age=86400; SameSite=Lax`;
  }

  return {
    success: true,
    user,
  };
}

export async function logout() {
  setDbItem<null>("currentUser", null);
  if (typeof document !== "undefined") {
    document.cookie = "ch_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  return { success: true };
}

export async function getUsers() {
  return getDbItem<User[]>("users");
}

export async function updateUserRole(userId: string, role: string) {
  const users = getDbItem<User[]>("users");
  const updated = users.map((u) => (u.id === userId ? { ...u, role } : u));
  setDbItem<User[]>("users", updated);
  
  // Update currentUser session if they updated themselves
  const currentUser = getDbItem<User | null>("currentUser");
  if (currentUser && currentUser.id === userId) {
    setDbItem<User>("currentUser", { ...currentUser, role });
  }

  return { success: true };
}

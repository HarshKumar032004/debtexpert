"use client";

import * as React from "react";
import {
  Users,
  UserPlus,
  Key,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Search,
  Filter,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  AlertCircle,
  X,
  Briefcase,
  Mail,
  Calendar,
  Sparkles,
  Shield,
  Loader2,
} from "lucide-react";
import { UserRole } from "@/lib/auth";

export interface StaffUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  leadsAssignedCount?: number;
}

interface CurrentUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UserManagementProps {
  currentUser: CurrentUserProfile;
  initialStaffUsers: StaffUserItem[];
}

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}

export function UserManagement({
  currentUser,
  initialStaffUsers,
}: UserManagementProps) {
  const [users, setUsers] = React.useState<StaffUserItem[]>(initialStaffUsers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  // Modals & Drawers state
  const [isAddStaffOpen, setIsAddStaffOpen] = React.useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);
  const [editRoleUser, setEditRoleUser] = React.useState<StaffUserItem | null>(null);
  const [activeDropdownId, setActiveDropdownId] = React.useState<string | null>(null);

  // Form states: Add Staff
  const [addName, setAddName] = React.useState("");
  const [addEmail, setAddEmail] = React.useState("");
  const [addPassword, setAddPassword] = React.useState("");
  const [addRole, setAddRole] = React.useState<UserRole>("LEGAL_ADVISOR");
  const [showAddPassword, setShowAddPassword] = React.useState(false);
  const [submittingAddStaff, setSubmittingAddStaff] = React.useState(false);
  const [addStaffError, setAddStaffError] = React.useState<string | null>(null);

  // Form states: Change Password
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [submittingPassword, setSubmittingPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  // Form states: Edit Role
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("LEGAL_ADVISOR");
  const [submittingEditRole, setSubmittingEditRole] = React.useState(false);
  const [editRoleError, setEditRoleError] = React.useState<string | null>(null);

  // Toast notifications
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Filtered users list
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && u.isActive) ||
        (statusFilter === "SUSPENDED" && !u.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Handle Create Staff
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStaffError(null);

    if (addPassword.length < 8) {
      setAddStaffError("Password must be at least 8 characters long.");
      return;
    }

    setSubmittingAddStaff(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName.trim(),
          email: addEmail.trim().toLowerCase(),
          password: addPassword,
          role: addRole,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create staff account.");
      }

      // Optimistic update
      const createdItem: StaffUserItem = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        isActive: data.user.isActive,
        createdAt: data.user.createdAt,
        leadsAssignedCount: 0,
      };

      setUsers((prev) => [...prev, createdItem]);
      setIsAddStaffOpen(false);
      setAddName("");
      setAddEmail("");
      setAddPassword("");
      setAddRole("LEGAL_ADVISOR");

      addToast(
        "success",
        "Staff Account Provisioned",
        `${createdItem.name} (${createdItem.role.replace("_", " ")}) is now authorized.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating staff account";
      setAddStaffError(msg);
      addToast("error", "Provisioning Failed", msg);
    } finally {
      setSubmittingAddStaff(false);
    }
  };

  // Handle Toggle User Suspension
  const handleToggleSuspension = async (userItem: StaffUserItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(null);

    if (userItem.id === currentUser.id) {
      addToast("error", "Action Forbidden", "You cannot suspend your own active administrator account.");
      return;
    }

    const previousState = userItem.isActive;
    const newState = !previousState;

    // Optimistic UI state update
    setUsers((prev) =>
      prev.map((u) => (u.id === userItem.id ? { ...u, isActive: newState } : u))
    );

    try {
      const res = await fetch(`/api/admin/users/${userItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newState }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update account status.");
      }

      addToast(
        "success",
        newState ? "Access Restored" : "Access Suspended",
        `${userItem.name}'s CRM access has been ${newState ? "reactivated" : "suspended"}.`
      );
    } catch (err: unknown) {
      // Revert optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === userItem.id ? { ...u, isActive: previousState } : u))
      );
      const msg = err instanceof Error ? err.message : "Failed to toggle status";
      addToast("error", "Status Update Failed", msg);
    }
  };

  // Handle Edit Role
  const handleOpenEditRole = (userItem: StaffUserItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    setEditRoleUser(userItem);
    setSelectedRole(userItem.role as UserRole);
    setEditRoleError(null);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoleUser) return;

    if (editRoleUser.id === currentUser.id && selectedRole !== "SUPER_ADMIN") {
      setEditRoleError("You cannot demote your own Super Administrator role.");
      return;
    }

    setSubmittingEditRole(true);
    setEditRoleError(null);

    const prevRole = editRoleUser.role;

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === editRoleUser.id ? { ...u, role: selectedRole } : u))
    );

    try {
      const res = await fetch(`/api/admin/users/${editRoleUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update staff role.");
      }

      addToast(
        "success",
        "Role Updated",
        `${editRoleUser.name}'s role is now ${selectedRole.replace("_", " ")}.`
      );
      setEditRoleUser(null);
    } catch (err: unknown) {
      // Revert optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === editRoleUser.id ? { ...u, role: prevRole } : u))
      );
      const msg = err instanceof Error ? err.message : "Failed to update role";
      setEditRoleError(msg);
      addToast("error", "Role Update Failed", msg);
    } finally {
      setSubmittingEditRole(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match. Please verify and retype.");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    setSubmittingPassword(true);

    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password.");
      }

      setIsChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      addToast("success", "Password Updated", "Your account credentials have been changed successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating password";
      setPasswordError(msg);
      addToast("error", "Password Change Failed", msg);
    } finally {
      setSubmittingPassword(false);
    }
  };

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";

  return (
    <div className="space-y-8">
      {/* 1. TOP SECURITY DETAILS & CREDENTIAL MANAGEMENT CARD */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">{currentUser.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    currentUser.role === "SUPER_ADMIN"
                      ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30"
                      : "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/30"
                  }`}
                >
                  {currentUser.role.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          {/* Action button: Change My Password */}
          <button
            onClick={() => {
              setIsChangePasswordOpen(true);
              setPasswordError(null);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-900 dark:text-white shadow-sm transition-all active:scale-95"
          >
            <Key className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Change My Password</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">
              Authentication
            </span>
            <span className="text-gray-800 dark:text-zinc-300 font-medium">HS256 JWT Signed</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">
              Session Max-Age
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">8 Hours (Auto-Expiry)</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">
              Cookie Scope
            </span>
            <span className="text-gray-800 dark:text-zinc-300 font-medium">HttpOnly, SameSite=Strict</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-zinc-400 block text-[10px] uppercase font-bold tracking-wider">
              Audit Logging
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Tamper-Evident Active</span>
          </div>
        </div>
      </div>

      {/* 2. STAFF ROSTER & ACCESS CONTROL SECTION */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Authorized Counsel & Staff Accounts</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              Provision staff accounts, manage advocate permissions, and control case file visibility.
            </p>
          </div>

          {/* Add Staff Button - visible strictly to SUPER_ADMIN */}
          {isSuperAdmin && (
            <button
              onClick={() => {
                setIsAddStaffOpen(true);
                setAddStaffError(null);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 shrink-0"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add New Staff</span>
            </button>
          )}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search counsel name or email address..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="LEGAL_ADVISOR">Legal Advisor</option>
              <option value="SUPPORT_AGENT">Support Agent</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>
          </div>
        </div>

        {/* Staff Table - Wrapped for responsive horizontal swiping */}
        <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-thin rounded-xl border border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-zinc-950/80 text-gray-600 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 font-bold">Counsel & Advocate Name</th>
                <th className="px-4 py-3 font-bold">Official Email</th>
                <th className="px-4 py-3 font-bold">RBAC Role</th>
                <th className="px-4 py-3 font-bold">Assigned Cases</th>
                <th className="px-4 py-3 font-bold">Account Status</th>
                <th className="px-4 py-3 font-bold">Joined Date</th>
                {isSuperAdmin && <th className="px-4 py-3 font-bold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={isSuperAdmin ? 7 : 6}
                    className="px-4 py-8 text-center text-gray-500 dark:text-zinc-400 text-xs"
                  >
                    No staff accounts matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((staff) => {
                  const isCurrent = staff.id === currentUser.id;

                  return (
                    <tr
                      key={staff.id}
                      className={`hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors ${
                        !staff.isActive ? "opacity-60 bg-rose-50/50 dark:bg-rose-950/10" : ""
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-[11px] shrink-0">
                            {staff.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="block">{staff.name}</span>
                            {isCurrent && (
                              <span className="inline-block text-[9px] px-1.5 py-0.2 bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 rounded font-mono">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 font-mono text-gray-500 dark:text-zinc-400">{staff.email}</td>

                      {/* Role Badge */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase inline-block ${
                            staff.role === "SUPER_ADMIN"
                              ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30"
                              : staff.role === "LEGAL_ADVISOR"
                              ? "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/30"
                              : "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700"
                          }`}
                        >
                          {staff.role.replace("_", " ")}
                        </span>
                      </td>

                      {/* Assigned Cases */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 text-[11px] font-mono font-bold">
                          <Briefcase className="h-3 w-3 text-gray-400 dark:text-zinc-500" />
                          <span>{staff.leadsAssignedCount ?? 0}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {staff.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                            <XCircle className="h-3 w-3 text-rose-500" />
                            <span>Suspended</span>
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3 text-gray-500 dark:text-zinc-400 text-[11px]">
                        {new Date(staff.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions dropdown */}
                      {isSuperAdmin && (
                        <td className="px-4 py-3 text-right relative">
                          <div className="inline-block text-left">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(activeDropdownId === staff.id ? null : staff.id);
                              }}
                              className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Staff Actions"
                              aria-label="Staff actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdownId === staff.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-4 mt-1 w-44 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl py-1.5 z-30 text-xs backdrop-blur-xl"
                              >
                                <button
                                  onClick={(e) => handleOpenEditRole(staff, e)}
                                  className="w-full px-3 py-2 text-left text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                                >
                                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                  <span>Edit RBAC Role</span>
                                </button>

                                {!isCurrent ? (
                                  <button
                                    onClick={(e) => handleToggleSuspension(staff, e)}
                                    className={`w-full px-3 py-2 text-left flex items-center gap-2 transition-colors ${
                                      staff.isActive
                                        ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                        : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                    }`}
                                  >
                                    {staff.isActive ? (
                                      <>
                                        <UserX className="h-3.5 w-3.5" />
                                        <span>Suspend Access</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="h-3.5 w-3.5" />
                                        <span>Restore Access</span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <div className="px-3 py-1.5 text-[10px] text-gray-400 dark:text-zinc-500 italic border-t border-gray-100 dark:border-zinc-800/80">
                                    Current User Account
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL: ADD NEW STAFF SLIDE-OVER / MODAL */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Add New Staff Account</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    Authorize a new legal advocate or intake counsel on the CRM.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close add staff modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Banner */}
            {addStaffError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{addStaffError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  Full Name & Title <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Advocate Rohit Mehta"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  Official Email Address <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="rohit.mehta@debtsupportexpert.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  Initial Password <span className="text-amber-600 dark:text-amber-400">* (min 8 characters)</span>
                </label>
                <div className="relative">
                  <input
                    type={showAddPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300 p-1"
                  >
                    {showAddPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  Practice & RBAC Role <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="LEGAL_ADVISOR">
                    LEGAL ADVISOR (Case lead management, advocate notes, and statutory notice defense)
                  </option>
                  <option value="SUPPORT_AGENT">
                    SUPPORT AGENT (Client intake, WhatsApp communications, follow-ups)
                  </option>
                  <option value="SUPER_ADMIN">
                    SUPER ADMIN (Full system authority, user provisioning, audit export)
                  </option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  disabled={submittingAddStaff}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-bold text-gray-700 dark:text-zinc-300 transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAddStaff}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingAddStaff ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    <span>Create Staff Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: CHANGE PASSWORD */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Change Password</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Update your administrator session credentials.</p>
                </div>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close change password modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Banner */}
            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300 p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  New Password <span className="text-gray-400 dark:text-zinc-500 font-normal">(min 8 characters)</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300 p-1"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Confirm New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  disabled={submittingPassword}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-bold text-gray-700 dark:text-zinc-300 transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPassword}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingPassword ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: EDIT ROLE */}
      {editRoleUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Modify RBAC Permissions</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">{editRoleUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditRoleUser(null)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close edit role modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editRoleError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{editRoleError}</span>
              </div>
            )}

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">Select Assigned Role</label>
                <div className="space-y-2">
                  {[
                    {
                      role: "LEGAL_ADVISOR",
                      title: "Legal Advisor",
                      desc: "Can review, annotate cases, and prepare statutory legal notices.",
                    },
                    {
                      role: "SUPPORT_AGENT",
                      title: "Support Agent",
                      desc: "Intake desk handler with WhatsApp chat & borrower intake access.",
                    },
                    {
                      role: "SUPER_ADMIN",
                      title: "Super Administrator",
                      desc: "Full administrative control over user access, CRM settings, and exports.",
                    },
                  ].map((item) => (
                    <label
                      key={item.role}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedRole === item.role
                          ? "bg-amber-500/10 border-amber-500/40 text-gray-900 dark:text-white"
                          : "bg-gray-50 dark:bg-zinc-950/60 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="editRoleSelection"
                        value={item.role}
                        checked={selectedRole === item.role}
                        onChange={() => setSelectedRole(item.role as UserRole)}
                        className="mt-1 text-amber-500 focus:ring-amber-500"
                      />
                      <div>
                        <div className="font-bold text-xs text-gray-900 dark:text-white">{item.title}</div>
                        <div className="text-[11px] text-gray-500 dark:text-zinc-400 leading-tight">{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditRoleUser(null)}
                  disabled={submittingEditRole}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-bold text-gray-700 dark:text-zinc-300 transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEditRole}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingEditRole ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Role</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. TOAST NOTIFICATIONS CONTAINER */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === "success"
                ? "bg-white/95 dark:bg-zinc-900/95 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : toast.type === "error"
                ? "bg-white/95 dark:bg-zinc-900/95 border-rose-500/40 text-rose-800 dark:text-rose-300"
                : "bg-white/95 dark:bg-zinc-900/95 border-blue-500/40 text-blue-800 dark:text-blue-300"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : toast.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{toast.title}</h4>
                {toast.description && (
                  <p className="text-[11px] text-gray-600 dark:text-zinc-300 mt-0.5 leading-relaxed">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-white p-1 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

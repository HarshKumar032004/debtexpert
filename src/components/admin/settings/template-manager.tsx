"use client";

import * as React from "react";
import {
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";

export interface TemplateItem {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplateManagerProps {
  initialTemplates: TemplateItem[];
  isSuperAdmin: boolean;
  onToast: (type: "success" | "error" | "info", title: string, description?: string) => void;
}

export function TemplateManager({
  initialTemplates,
  isSuperAdmin,
  onToast,
}: TemplateManagerProps) {
  const [templates, setTemplates] = React.useState<TemplateItem[]>(initialTemplates);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<TemplateItem | null>(null);

  // Form states: Add
  const [addTitle, setAddTitle] = React.useState("");
  const [addContent, setAddContent] = React.useState("");
  const [submittingAdd, setSubmittingAdd] = React.useState(false);
  const [addError, setAddError] = React.useState<string | null>(null);

  // Form states: Edit
  const [editTitle, setEditTitle] = React.useState("");
  const [editContent, setEditContent] = React.useState("");
  const [editIsActive, setEditIsActive] = React.useState(true);
  const [submittingEdit, setSubmittingEdit] = React.useState(false);
  const [editError, setEditError] = React.useState<string | null>(null);

  // Handle Add Template
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (addTitle.trim().length < 2) {
      setAddError("Title must be at least 2 characters.");
      return;
    }
    if (addContent.trim().length < 5) {
      setAddError("Template content must be at least 5 characters.");
      return;
    }

    setSubmittingAdd(true);

    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: addTitle.trim(),
          content: addContent.trim(),
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create template.");
      }

      setTemplates((prev) => [...prev, data.template]);
      setIsAddOpen(false);
      setAddTitle("");
      setAddContent("");

      onToast("success", "Template Created", `Quick-reply "${data.template.title}" is now available in chat.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating template";
      setAddError(msg);
      onToast("error", "Creation Failed", msg);
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Handle Toggle Active
  const handleToggleActive = async (template: TemplateItem) => {
    const newState = !template.isActive;

    // Optimistic update
    setTemplates((prev) =>
      prev.map((t) => (t.id === template.id ? { ...t, isActive: newState } : t))
    );

    try {
      const res = await fetch(`/api/admin/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newState }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to toggle template status.");
      }

      onToast(
        "success",
        newState ? "Template Activated" : "Template Deactivated",
        `"${template.title}" is now ${newState ? "visible in" : "hidden from"} WhatsApp action bar.`
      );
    } catch (err: unknown) {
      // Revert optimistic update
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? { ...t, isActive: !newState } : t))
      );
      const msg = err instanceof Error ? err.message : "Error updating template";
      onToast("error", "Update Failed", msg);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (template: TemplateItem) => {
    setEditingTemplate(template);
    setEditTitle(template.title);
    setEditContent(template.content);
    setEditIsActive(template.isActive);
    setEditError(null);
  };

  // Handle Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setSubmittingEdit(true);
    setEditError(null);

    const prevTitle = editingTemplate.title;
    const prevContent = editingTemplate.content;
    const prevActive = editingTemplate.isActive;

    // Optimistic update
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editingTemplate.id
          ? { ...t, title: editTitle.trim(), content: editContent.trim(), isActive: editIsActive }
          : t
      )
    );

    try {
      const res = await fetch(`/api/admin/templates/${editingTemplate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
          isActive: editIsActive,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save template changes.");
      }

      onToast("success", "Template Updated", `Changes to "${data.template.title}" saved.`);
      setEditingTemplate(null);
    } catch (err: unknown) {
      // Revert optimistic update
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? { ...t, title: prevTitle, content: prevContent, isActive: prevActive }
            : t
        )
      );
      const msg = err instanceof Error ? err.message : "Error saving template";
      setEditError(msg);
      onToast("error", "Update Failed", msg);
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Handle Delete
  const handleDelete = async (template: TemplateItem) => {
    if (!confirm(`Are you sure you want to delete template "${template.title}"?`)) return;

    // Optimistic removal
    setTemplates((prev) => prev.filter((t) => t.id !== template.id));

    try {
      const res = await fetch(`/api/admin/templates/${template.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete template.");
      }

      onToast("success", "Template Deleted", `"${template.title}" has been permanently removed.`);
    } catch (err: unknown) {
      // Revert optimistic removal
      setTemplates((prev) => [...prev, template]);
      const msg = err instanceof Error ? err.message : "Error deleting template";
      onToast("error", "Delete Failed", msg);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">WhatsApp Quick-Reply Template Manager</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure one-click legal responses for counsel to inject into live WhatsApp client chats.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => {
              setIsAddOpen(true);
              setAddError(null);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Template</span>
          </button>
        )}
      </div>

      {/* Templates Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3 font-bold">Button Label / Title</th>
              <th className="px-4 py-3 font-bold">Message Content Preview</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Last Modified</th>
              {isSuperAdmin && <th className="px-4 py-3 font-bold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {templates.length === 0 ? (
              <tr>
                <td colSpan={isSuperAdmin ? 5 : 4} className="px-4 py-8 text-center text-slate-500 text-xs">
                  No quick-reply templates created yet.
                </td>
              </tr>
            ) : (
              templates.map((tmpl) => (
                <tr key={tmpl.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
                      {tmpl.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-md">
                    <p className="line-clamp-2 text-[11px] leading-relaxed">{tmpl.content}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isSuperAdmin ? (
                      <button
                        onClick={() => handleToggleActive(tmpl)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all ${
                          tmpl.isActive
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                        }`}
                        title="Click to toggle active state"
                      >
                        {tmpl.isActive ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-slate-500" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {tmpl.isActive ? "Active" : "Disabled"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(tmpl.updatedAt || tmpl.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(tmpl)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Template"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tmpl)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete Template"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Add Template */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Quick-Reply Template</h3>
                  <p className="text-xs text-slate-400">Add a pre-approved legal response for advocate chat.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Button Label <span className="text-emerald-400">* (Includes Emoji)</span>
                </label>
                <input
                  type="text"
                  required
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  placeholder="e.g. 📄 OTS Proposal Link or ⚠️ Police Notice"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Message Body <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={addContent}
                  onChange={(e) => setAddContent(e.target.value)}
                  placeholder="Type the exact legal guidance text that will populate the WhatsApp composer..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  disabled={submittingAdd}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingAdd ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Create Template</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Template */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Template</h3>
                  <p className="text-xs text-slate-400">{editingTemplate.title}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Button Label</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Message Body</label>
                <textarea
                  required
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsActiveCheckbox"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="editIsActiveCheckbox" className="text-xs text-slate-300 cursor-pointer font-medium">
                  Active (Display in WhatsApp Quick-Reply Bar)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  disabled={submittingEdit}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingEdit ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

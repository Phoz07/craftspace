"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LeadNotesModal } from "@/components/admin/LeadNotesModal";
import { PipelineKanbanView } from "@/components/admin/PipelineKanbanView";
import { PipelineTableView } from "@/components/admin/PipelineTableView";
import type { LeadRecord, LeadStatus } from "@/lib/db";

function AdminPipelineContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL sync state: ?view=table | ?view=kanban
  const viewParam = searchParams.get("view");
  const currentView: "table" | "kanban" =
    viewParam === "kanban" ? "kanban" : "table";

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeLeadForNotes, setActiveLeadForNotes] =
    useState<LeadRecord | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  // Fetch leads on mount
  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/leads");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to load leads");
      }
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("ไม่สามารถดึงข้อมูลลีดได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleViewChange = (newView: "table" | "kanban") => {
    router.push(`/admin?view=${newView}`);
  };

  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    // Optimistic state update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
    );

    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        // Revert on failure
        fetchLeads();
      }
    } catch (e) {
      console.error("Failed to patch status:", e);
      fetchLeads();
    }
  };

  const handleSaveNotes = async (
    id: string,
    notes: string,
    status: LeadStatus,
  ) => {
    // Optimistic state update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, notes, status } : l)),
    );

    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, status }),
      });
      if (!res.ok) {
        fetchLeads();
      }
    } catch (e) {
      console.error("Failed to patch notes:", e);
      fetchLeads();
    }
  };

  const handleOpenNotes = (lead: LeadRecord) => {
    setActiveLeadForNotes(lead);
    setIsNotesModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] selection:bg-[#DFB978] selection:text-[#1F1D1A]">
      <AdminHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        leads={leads}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#8F653B] animate-spin" />
            <span className="text-xs text-[#7A7368] font-medium">
              กำลังโหลดข้อมูลไปป์ไลน์สตูดิโอ...
            </span>
          </div>
        ) : currentView === "table" ? (
          <PipelineTableView
            leads={leads}
            onOpenNotes={handleOpenNotes}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <PipelineKanbanView
            leads={leads}
            onOpenNotes={handleOpenNotes}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Internal Notes Modal */}
      <LeadNotesModal
        lead={activeLeadForNotes}
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
          setActiveLeadForNotes(null);
        }}
        onSave={handleSaveNotes}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
          <Loader2 className="w-8 h-8 text-[#8F653B] animate-spin" />
        </div>
      }
    >
      <AdminPipelineContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/common-elements/button";
import { Plus, Trash2, Info } from "lucide-react";
import { AddDomainDialog } from "./add-domain-dialog";
// import { EditDomainDialog } from "./edit-domain-dialog";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { useDomains } from "@/hooks/useDomain";
import { DomainObject } from "@/services/assessment/types";
import toast from "react-hot-toast";

export function DomainsTab() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // const [editingDomain, setEditingDomain] = useState<DomainObject | null>(null);
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Use the domains hook
  const {
    domains,
    loading,
    error,
    operationLoading,
    operationError,
    addDomain,
    deleteDomain,
    // updateDomain,
    refetch,
    clearOperationError
  } = useDomains();

  // Handle operation errors with useEffect
  useEffect(() => {
    if (operationError) {
      toast.error(operationError);
      // Clear the error after showing it
      clearOperationError();
    }
  }, [operationError, clearOperationError]);

  const handleAddDomain = async (domainData: { title: string; url: string }) => {
    try {
      // Create a new domain object
      const newDomain: DomainObject = {
        _id: Date.now().toString(), // Temporary ID
        title: domainData.title,
        url: domainData.url,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      // WAIT for the API response before showing any toast
      const result = await addDomain(newDomain);
      
      // Check the actual result
      if (result.success) {
        // toast.success("Domain added successfully");
        setIsAddDialogOpen(false);
      } 
      // If not success, the error will be handled by the useEffect above
    } catch (err) {
      // Error is already handled in the hook, just log it
      console.error("Error adding domain:", err);
    }
  };

  // const handleEditDomain = async (domainData: { title: string; url: string }) => {
  //   if (!editingDomain) return;

  //   try {
  //     // Create updated domain object
  //     const updatedDomain: DomainObject = {
  //       ...editingDomain,
  //       title: domainData.title,
  //       url: domainData.url,
  //     };

  //     // WAIT for the API response
  //     const result = await updateDomain(updatedDomain);
      
  //     // Check the actual result
  //     if (result.success) {
  //       toast.success("Domain updated successfully");
  //       setEditingDomain(null);
  //     }
  //     // If not success, error is handled by useEffect
  //   } catch (err) {
  //     console.error("Error updating domain:", err);
  //   }
  // };

  const handleDeleteDomain = async (domainId: string) => {
    if (!domainId) return;

    try {
      // WAIT for the API response
      const result = await deleteDomain(domainId);
      
      // Check the actual result
      if (result.success) {
        toast.success("Domain deleted successfully");
        setIsConfirmOpen(false);
        setDomainToDelete(null);
      } else {
        // Show error but don't close modal (let user retry)
        // The error toast will also be shown by useEffect
        // We keep the modal open for user to retry
        return; // Don't close modal on error
      }
    } catch (err) {
      console.error("Error deleting domain:", err);
      // Keep modal open on error
      return;
    }
    
    // Only close modal if success
    setIsConfirmOpen(false);
    setDomainToDelete(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl text-neutral-900 dark:text-white font-bold mb-2">
            Manage Domains
          </h2>
          <p className="text-sm text-muted-foreground dark:text-dark-text">
            Add or update domains associated with your organization.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl text-neutral-900 dark:text-white font-bold mb-2">
            Manage Domains
          </h2>
          <p className="text-sm text-muted-foreground dark:text-dark-text">
            Add or update domains associated with your organization.
          </p>
        </div>
        <div className="h-[48px] bg-red-100 border border-red-200 rounded-md px-4 flex items-center gap-3">
          <Info className="size-5 text-red-600 shrink-0" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
        <Button 
          onClick={refetch} 
          variant="outline"
          className="dark:border-dark-border dark:text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl text-neutral-900 dark:text-white font-bold mb-2">
          Manage Domains
        </h2>
        <p className="text-sm text-muted-foreground dark:text-dark-text">
          Add or update domains associated with your organization.
        </p>
      </div>

      {/* Info Banner */}
      <div className="h-[48px] bg-secondary-100 border border-secondary-200 rounded-md px-4 flex items-center gap-3">
        <Info className="size-5 text-secondary-950 shrink-0" />
        <span className="text-sm text-secondary-950">
          You can add up to 5 domains.
        </span>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <div
            key={domain._id}
            className="h-[153px] bg-white dark:bg-dark-background-100 border border-[#E5E5E5] dark:border-dark-border rounded-[8px] p-4 space-y-4"
          >
            <div>
              <h3 className="font-semibold mb-1 space-y-2 dark:text-dark-text">{domain.title}</h3>
              <a
                href={`https://${domain.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-blue font-medium underline mt-2"
              >
                {domain.url}
              </a>
              <p className="text-sm text-neutral-500 dark:text-white mt-2">
                {/* {domain.date || "No date"} */}
              </p>
            </div>
            <div className="flex gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                className="h-10 flex-1 dark:bg-[linear-gradient(0deg,#374151,#374151),linear-gradient(180deg,rgba(55,65,81,0.16)_0%,rgba(55,65,81,0)_100%)]"
                onClick={() => setEditingDomain(domain)}
                disabled={operationLoading}
              >
                <PencilLine className="size-4 dark:text-dark-text" />
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                className="h-10 flex-1 bg-secondary-50 dark:bg-[#FEF2F2] text-destructive hover:text-destructive"
                onClick={() => {
                  setDomainToDelete(domain._id);
                  setIsConfirmOpen(true);
                }}
                disabled={operationLoading}
              >
                <Trash2 className="size-4 dark:text-[#811B1F]" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add Domain Card */}
        {domains.length < 5 && (
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="h-[150px] border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors min-h-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={operationLoading}
          >
            <Plus className="size-8 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {operationLoading ? "Processing..." : "Add Domain"}
            </span>
          </button>
        )}
      </div>

      {/* Dialogs */}
      <AddDomainDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddDomain}
        isLoading={operationLoading}
      />
      {/* <EditDomainDialog
        isOpen={!!editingDomain}
        onClose={() => setEditingDomain(null)}
        domain={editingDomain}
        onSave={handleEditDomain}
        isLoading={operationLoading}
      /> */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDomainToDelete(null);
        }}
        onConfirm={() => {
          if (domainToDelete) handleDeleteDomain(domainToDelete);
        }}
        title={"Delete domain"}
        description={
          "Are you sure you want to delete this domain? This action cannot be undone."
        }
        confirmLabel={operationLoading ? "Deleting..." : "Delete"}
        cancelLabel={"Cancel"}
        danger
      />
    </div>
  );
}
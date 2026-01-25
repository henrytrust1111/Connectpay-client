import { useState, useEffect, useCallback } from 'react';
import { getOrganisationData, updateOrganisationDomains } from "@/services/assessment";
import { getSession } from "@/services/auth/session";
import { IAuthData } from "@/services/auth/types";
import { DomainObject } from "@/services/assessment/types";

export function useDomains() {
  const [domains, setDomains] = useState<DomainObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  // Clear operation error after 5 seconds
  useEffect(() => {
    if (operationError) {
      const timer = setTimeout(() => {
        setOperationError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [operationError]);

  const fetchDomains = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const session: IAuthData | null = await getSession();
      
      if (!session?.user?.id) {
        throw new Error("Organisation ID not found in session");
      }
      
      setOrganisationId(session.user.id);
      
      const response = await getOrganisationData();
      
      // TODO: Implement organisation data fetching when API is available
      // if (response.success && response.data) {
      //   const organisation = response.data.data.organisation;
      //   const domainObjects: DomainObject[] = organisation.domains || [];
      //   setDomains(domainObjects);
      //   
      //   if (domainObjects.length === 0) {
      //     setError("No domains configured for your organisation. Please contact administrator.");
      //   }
      // } else {
      //   setError(response.message || "Failed to fetch organisation domains");
      // }
    } catch (err) {
      console.error("Error fetching organisation data:", err);
      setError(err instanceof Error ? err.message : "Failed to load organisation data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new domain
  const addDomain = useCallback(async (newDomain: DomainObject) => {
    if (!organisationId) {
      return { success: false, error: "Organisation ID not found" };
    }

    setOperationLoading(true);
    setOperationError(null);
    
    try {
      // Create new array with the added domain
      const updatedDomains = [...domains, newDomain];
      
      // Call update endpoint with the complete list
      // TODO: Implement domain update when API is available
      // const response = await updateOrganisationDomains();
      // 
      // if (response.success && response.data) {
      //   // ONLY update local state from server response, not from our local array
      //   const serverDomains = response.data.data?.organisation?.domains || updatedDomains;
      //   setDomains(serverDomains);
      //   return { success: true, data: serverDomains };
      // } else {
      //   const errorMsg = response.message || "Failed to add domain";
      //   setOperationError(errorMsg);
      //   return { success: false, error: errorMsg };
      // }
      
      // For now, just update local state
      setDomains(updatedDomains);
      return { success: true, data: updatedDomains };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add domain";
      setOperationError(errorMessage);
      console.error("Error adding domain:", err);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  }, [domains, organisationId]);

  // Delete a domain by ID
  const deleteDomain = useCallback(async (domainId: string) => {
    if (!organisationId) {
      return { success: false, error: "Organisation ID not found" };
    }

    setOperationLoading(true);
    setOperationError(null);
    
    try {
      // Filter out the domain to delete
      const updatedDomains = domains.filter(domain => domain._id !== domainId);
      
      if (updatedDomains.length === domains.length) {
        const errorMsg = "Domain not found";
        setOperationError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      // TODO: Implement domain deletion when API is available
      // const response = await updateOrganisationDomains(organisationId, updatedDomains);
      // 
      // if (response.success && response.data) {
      //   // ONLY update local state from server response
      //   const serverDomains = response.data.data?.organisation?.domains || updatedDomains;
      //   setDomains(serverDomains);
      //   return { success: true, data: serverDomains };
      // } else {
      //   const errorMsg = response.message || "Failed to delete domain";
      //   setOperationError(errorMsg);
      //   return { success: false, error: errorMsg };
      // }
      
      // For now, just update local state
      setDomains(updatedDomains);
      return { success: true, data: updatedDomains };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete domain";
      setOperationError(errorMessage);
      console.error("Error deleting domain:", err);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  }, [domains, organisationId]);

  // Update a domain
  const updateDomain = useCallback(async (updatedDomain: DomainObject) => {
    if (!organisationId) {
      return { success: false, error: "Organisation ID not found" };
    }

    setOperationLoading(true);
    setOperationError(null);
    
    try {
      // Map through domains and replace the updated one
      const updatedDomains = domains.map(domain => 
        domain._id === updatedDomain._id ? updatedDomain : domain
      );
      
      // Check if domain was found and updated
      const domainFound = domains.some(domain => domain._id === updatedDomain._id);
      if (!domainFound) {
        const errorMsg = "Domain not found";
        setOperationError(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      // TODO: Implement domain update when API is available
      // const response = await updateOrganisationDomains(organisationId, updatedDomains);
      // 
      // if (response.success && response.data) {
      //   // ONLY update local state from server response
      //   const serverDomains = response.data.data?.organisation?.domains ;
      //   setDomains(serverDomains);
      //   return { success: true, data: serverDomains };
      // } else {
      //   const errorMsg = response.message || "Failed to update domain";
      //   setOperationError(errorMsg);
      //   return { success: false, error: errorMsg };
      // }
      
      // For now, just update local state
      setDomains(updatedDomains);
      return { success: true, data: updatedDomains };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update domain";
      setOperationError(errorMessage);
      console.error("Error updating domain:", err);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  }, [domains, organisationId]);

  const clearOperationError = useCallback(() => {
    setOperationError(null);
  }, []);

  // Batch update multiple domains at once
  const updateDomainsBatch = useCallback(async (newDomains: DomainObject[]) => {
    if (!organisationId) {
      return { success: false, error: "Organisation ID not found" };
    }

    setOperationLoading(true);
    setOperationError(null);
    
    try {
      // TODO: Implement domain update when API is available
      // const response = await updateOrganisationDomains(organisationId, newDomains);
      // 
      // if (response.success && response.data) {
      //   // ONLY update local state from server response
      //   const serverDomains = response.data.data?.organisation?.domains || newDomains;
      //   setDomains(serverDomains);
      //   return { success: true, data: serverDomains };
      // } else {
      //   const errorMsg = response.message || "Failed to update domains";
      //   setOperationError(errorMsg);
      //   return { success: false, error: errorMsg };
      // }
      
      // For now, just update local state
      setDomains(newDomains);
      return { success: true, data: newDomains };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update domains";
      setOperationError(errorMessage);
      console.error("Error updating domains:", err);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  }, [organisationId]);

  // Refetch domains
  const refetch = useCallback(() => {
    fetchDomains();
  }, [fetchDomains]);

  // Fetch domains on mount
  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // Get domain titles as strings for dropdowns
  const domainTitles = domains.map(domain => domain.title);
  
  // Get domain object by title
  const getDomainByTitle = useCallback((title: string) => {
    return domains.find(domain => domain.title === title);
  }, [domains]);

  // Get domain object by ID
  const getDomainById = useCallback((id: string) => {
    return domains.find(domain => domain._id === id);
  }, [domains]);

  return {
    domains,
    domainTitles,
    loading,
    error,
    organisationId,
    operationLoading,
    operationError,
    refetch,
    addDomain,
    deleteDomain,
    updateDomain,
    updateDomainsBatch,
    getDomainByTitle,
    getDomainById,
    clearOperationError,
  };
}
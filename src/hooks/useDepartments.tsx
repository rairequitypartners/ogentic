import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Department = Database['public']['Tables']['departments']['Row'];
type DepartmentInsert = Database['public']['Tables']['departments']['Insert'];
type DepartmentUpdate = Database['public']['Tables']['departments']['Update'];

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('departments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setDepartments(data || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDepartment = useCallback(async (userId: string, name: string, description?: string, color?: string) => {
    try {
      setError(null);

      const departmentData: DepartmentInsert = {
        user_id: userId,
        name,
        description,
        color: color || '#3b82f6'
      };

      const { data, error: createError } = await supabase
        .from('departments')
        .insert(departmentData)
        .select()
        .single();

      if (createError) throw createError;

      setDepartments(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating department:', err);
      setError(err instanceof Error ? err.message : 'Failed to create department');
      return null;
    }
  }, []);

  const updateDepartment = useCallback(async (departmentId: string, updates: Partial<DepartmentUpdate>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', departmentId)
        .select()
        .single();

      if (updateError) throw updateError;

      setDepartments(prev => prev.map(dept => 
        dept.id === departmentId ? data : dept
      ));
      return data;
    } catch (err) {
      console.error('Error updating department:', err);
      setError(err instanceof Error ? err.message : 'Failed to update department');
      return null;
    }
  }, []);

  const deleteDepartment = useCallback(async (departmentId: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId);

      if (deleteError) throw deleteError;

      setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
      return true;
    } catch (err) {
      console.error('Error deleting department:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete department');
      return false;
    }
  }, []);

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
}; 
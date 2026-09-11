-- ==============================================================================
-- Suggula's Kitchen - Security Patches
-- Run this script in your Supabase SQL Editor to resolve the Security Advisor alerts.
-- ==============================================================================

-- 1. FIX: Function Search Path Mutable for `recalculate_order_total`
ALTER FUNCTION public.recalculate_order_total() SET search_path = public;

-- 2. FIX: Public Can Execute SECURITY DEFINER Functions
-- Revoke execution from the default PUBLIC role
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.recalculate_order_total() FROM PUBLIC;

-- Explicitly grant is_admin execution only to authenticated users (and service roles)
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- (Optional) If the advisor also flags rls_auto_enable, you can run this, but usually it's internal
-- REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;

-- 3. FIX: Public Bucket Allows Listing
-- Drop the overly permissive SELECT policy that allowed anyone to list objects
DROP POLICY IF EXISTS "Public can view gallery images" ON storage.objects;

-- Create a stricter SELECT policy that only allows admins to list the objects in the gallery
-- Note: Making the bucket public via `storage.buckets` handles downloading without needing a SELECT policy.
CREATE POLICY "Admins can list gallery images" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'gallery' AND public.is_admin());

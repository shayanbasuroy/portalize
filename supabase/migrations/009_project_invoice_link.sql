-- Migration 009: Add invoice_url and invoice_amount to projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS invoice_url text, 
ADD COLUMN IF NOT EXISTS invoice_amount text;

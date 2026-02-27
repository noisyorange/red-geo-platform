import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rcbqdmjnlujouqpmaitl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYnFkbWpubHVqb3VxcG1haXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MzA5NTUsImV4cCI6MjA4NzIwNjk1NX0._dBhpaQ31b9SuzXEAXPVnRq-mboE1-Xk7UkmQH-04tg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: number;
  brand_name: string;
  product_name: string;
  industry: string;
  status: 'pending' | 'approved' | 'deleted';
  form_data: Record<string, string>;
  submit_time: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectData {
  id: number;
  project_id: number;
  file_name: string;
  data: ExcelRow[];
  uploaded_at: string;
}

export interface ExcelRow {
  id: number;
  query_time: string;
  query: string;
  brand1: string;
  brand2: string;
  brand3: string;
  brand4: string;
  brand5: string;
  ai_content: string;
  geo_summary: string;
}

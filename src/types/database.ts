// ============================================================
// Database Types — mirrors Supabase PostgreSQL schema
// ============================================================

export type PaymentStatus = "unpaid" | "paid";
export type ProjectStatus = "in_review" | "changes_requested" | "approved";
export type DeliverableType = "file" | "link" | "code" | "embed";
export type DeliverableStatus = "pending" | "changes_requested" | "approved";
export type SenderRole = "freelancer" | "client";

// ----- Freelancers (extends auth.users) -----
export interface Freelancer {
  id: string;
  full_name: string;
  business_name: string | null;
  logo_url: string | null;
  brand_color: string;
  created_at: string;
}

export interface FreelancerInsert {
  id: string;
  full_name: string;
  business_name?: string | null;
  logo_url?: string | null;
  brand_color?: string;
}

export interface FreelancerUpdate {
  full_name?: string;
  business_name?: string | null;
  logo_url?: string | null;
  brand_color?: string;
}

// ----- Clients -----
export interface Client {
  id: string;
  freelancer_id: string;
  client_name: string;
  company_name: string | null;
  client_email: string;
  created_at: string;
}

export interface ClientInsert {
  freelancer_id: string;
  client_name: string;
  company_name?: string | null;
  client_email: string;
}

export interface ClientUpdate {
  client_name?: string;
  company_name?: string | null;
  client_email?: string;
}

// ----- Projects -----
export interface Project {
  id: string;
  freelancer_id: string;
  client_id: string;
  title: string;
  slug: string;
  access_pin: string; // stored as SHA-256 hash
  payment_status: PaymentStatus;
  project_status: ProjectStatus;
  watermark_enabled: boolean;
  created_at: string;
}

export interface ProjectInsert {
  freelancer_id: string;
  client_id: string;
  title: string;
  slug: string;
  access_pin: string;
  payment_status?: PaymentStatus;
  project_status?: ProjectStatus;
  watermark_enabled?: boolean;
}

export interface ProjectUpdate {
  title?: string;
  payment_status?: PaymentStatus;
  project_status?: ProjectStatus;
  watermark_enabled?: boolean;
}

// Project with joined relations
export interface ProjectWithClient extends Project {
  clients: Client;
}

export interface ProjectWithDeliverables extends Project {
  deliverables: Deliverable[];
}

export interface ProjectFull extends Project {
  clients: Client;
  deliverables: DeliverableWithFeedback[];
  freelancers: Pick<Freelancer, "full_name" | "business_name" | "logo_url" | "brand_color">;
}

// ----- Deliverables -----
export interface Deliverable {
  id: string;
  project_id: string;
  title: string;
  deliverable_type: DeliverableType;
  content_url: string | null;
  code_content: string | null;
  code_language: string;
  file_size: string | null;
  mime_type: string | null;
  status: DeliverableStatus;
  created_at: string;
}

export interface DeliverableInsert {
  project_id: string;
  title: string;
  deliverable_type: DeliverableType;
  content_url?: string | null;
  code_content?: string | null;
  code_language?: string;
  file_size?: string | null;
  mime_type?: string | null;
}

export interface DeliverableUpdate {
  title?: string;
  content_url?: string | null;
  code_content?: string | null;
  code_language?: string;
  status?: DeliverableStatus;
}

export interface DeliverableWithFeedback extends Deliverable {
  feedback_comments: FeedbackComment[];
}

// ----- Feedback Comments -----
export interface FeedbackComment {
  id: string;
  deliverable_id: string;
  sender_role: SenderRole;
  author_name: string;
  comment_text: string;
  created_at: string;
}

export interface FeedbackCommentInsert {
  deliverable_id: string;
  sender_role: SenderRole;
  author_name: string;
  comment_text: string;
}

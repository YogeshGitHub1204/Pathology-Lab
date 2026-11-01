export type LeadLabel = 'Hot' | 'Warm' | 'Cold';

export type LeadStatus = 'New' | 'Contacted' | 'Scheduled' | 'Completed' | 'Archived';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export interface Lead {
  id: number;
  session_id: string;
  name: string;
  phone: string;
  test_or_course: string;
  preferred_timing: string;
  label: LeadLabel;
  summary: string;
  chat_transcript: ChatMessage[];
  follow_up_message: string;
  status: LeadStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionItem {
  sessionId: string;
  visitorName: string;
  visitorPhone: string;
  testOrCourse: string;
  preferredTiming: string;
  step: string;
  isCompleted: boolean;
  messages: ChatMessage[];
  messageCount: number;
  label: LeadLabel;
  leadStatus: string;
  followUpMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabTest {
  id: string;
  category: 'Blood Tests' | 'Urine Tests' | 'X-Ray' | 'Related Diagnostics' | 'Certification Courses';
  name: string;
  code: string;
  description: string;
  fastingRequired?: boolean;
  sampleType: string;
  turnaround: string;
  popular?: boolean;
}

export interface LabConfig {
  lab_name?: string;
  lab_city?: string;
  lab_address?: string;
  lab_phone?: string;
  lab_phone_raw?: string;
  lab_whatsapp?: string;
  lab_email?: string;
  lab_timings?: string;
  lab_sample_collection_timings?: string;
  lab_report_dispatch?: string;
  fee_notice?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

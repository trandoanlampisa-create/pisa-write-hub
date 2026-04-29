export type Role = "student" | "teacher";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: Role;
  class_name?: string;
  target_band?: number;
  created_at: string;
}

export type TaskType = "task1" | "task2";

export interface WritingTask {
  id: string;
  title: string;
  task_type: TaskType;
  question_prompt: string;
  instructions?: string;
  image_urls?: string[];
  target_band?: number;
  assigned_class?: string;
  assigned_students?: string[];
  created_by: string;
  due_date?: string;
  created_at: string;
}

export type SubmissionStatus = "draft" | "submitted" | "reviewed";

export interface EssaySubmission {
  id: string;
  task_id: string;
  student_id: string;
  essay_text: string;
  word_count: number;
  status: SubmissionStatus;
  student_note?: string;
  submitted_at?: string;
  updated_at: string;
}

export interface TeacherFeedback {
  id: string;
  submission_id: string;
  teacher_id: string;
  task_response_score: number;
  coherence_score: number;
  lexical_score: number;
  grammar_score: number;
  task_response_comment?: string;
  coherence_comment?: string;
  lexical_comment?: string;
  grammar_comment?: string;
  overall_band: number;
  overall_feedback: string;
  strengths: string;
  weaknesses: string;
  next_action: string;
  progress_note?: string;
  sample_essay?: string;
  is_sent_to_student: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgressNote {
  id: string;
  student_id: string;
  teacher_id: string;
  note: string;
  focus_area: string;
  estimated_band: number;
  created_at: string;
}

export interface ClassRoom {
  id: string;
  class_name: string;
  teacher_id: string;
  join_code: string;
  created_at: string;
}
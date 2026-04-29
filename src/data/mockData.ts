import type {
  Profile,
  WritingTask,
  EssaySubmission,
  TeacherFeedback,
  ProgressNote,
  ClassRoom,
} from "@/types";

export const mockProfiles: Profile[] = [
  {
    id: "p-t1",
    user_id: "u-t1",
    full_name: "Ms. Linh Tran",
    email: "linh@pisa.edu.vn",
    role: "teacher",
    class_name: "IELTS 6.5 — Evening",
    created_at: "2025-01-10T09:00:00Z",
  },
  {
    id: "p-s1",
    user_id: "u-s1",
    full_name: "Minh Nguyen",
    email: "minh@student.pisa.edu.vn",
    role: "student",
    class_name: "IELTS 6.5 — Evening",
    target_band: 7.0,
    created_at: "2025-02-01T09:00:00Z",
  },
  {
    id: "p-s2",
    user_id: "u-s2",
    full_name: "An Pham",
    email: "an@student.pisa.edu.vn",
    role: "student",
    class_name: "IELTS 6.5 — Evening",
    target_band: 6.5,
    created_at: "2025-02-01T09:00:00Z",
  },
  {
    id: "p-s3",
    user_id: "u-s3",
    full_name: "Chi Le",
    email: "chi@student.pisa.edu.vn",
    role: "student",
    class_name: "IELTS 7.0 — Weekend",
    target_band: 7.5,
    created_at: "2025-02-01T09:00:00Z",
  },
];

export const mockClasses: ClassRoom[] = [
  { id: "c1", class_name: "IELTS 6.5 — Evening", teacher_id: "p-t1", created_at: "2025-01-10T09:00:00Z" },
  { id: "c2", class_name: "IELTS 7.0 — Weekend", teacher_id: "p-t1", created_at: "2025-01-10T09:00:00Z" },
];

export const mockTasks: WritingTask[] = [
  {
    id: "task-1",
    title: "Two-pie chart: Energy sources 1990 vs 2020",
    task_type: "task1",
    question_prompt:
      "The two pie charts below show the percentage of energy generated from different sources in a country in 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
    instructions:
      "Focus on overview + 2 body paragraphs. Use comparative language and approximate figures.",
    target_band: 6.5,
    assigned_class: "IELTS 6.5 — Evening",
    created_by: "p-t1",
    due_date: "2026-05-05T23:59:00Z",
    created_at: "2026-04-22T08:00:00Z",
  },
  {
    id: "task-2",
    title: "Opinion essay: Working from home",
    task_type: "task2",
    question_prompt:
      "Some people believe that working from home is better for both employees and employers, while others think it harms productivity and team culture. Discuss both views and give your own opinion.\n\nWrite at least 250 words.",
    instructions:
      "Discuss both sides clearly before stating your opinion. Use 1 strong example per body paragraph.",
    target_band: 7.0,
    assigned_class: "IELTS 6.5 — Evening",
    created_by: "p-t1",
    due_date: "2026-05-02T23:59:00Z",
    created_at: "2026-04-20T08:00:00Z",
  },
  {
    id: "task-3",
    title: "Problem & solution: Urban traffic",
    task_type: "task2",
    question_prompt:
      "Many cities around the world are facing serious traffic congestion. What are the main causes of this problem, and what solutions can you suggest?",
    target_band: 6.5,
    assigned_class: "IELTS 6.5 — Evening",
    created_by: "p-t1",
    due_date: "2026-05-10T23:59:00Z",
    created_at: "2026-04-25T08:00:00Z",
  },
];

export const mockSubmissions: EssaySubmission[] = [
  {
    id: "sub-1",
    task_id: "task-2",
    student_id: "p-s1",
    essay_text:
      "Nowadays, working from home become more popular than before. Some people think it good for workers and companies, but other people disagree. In my opinion, working from home have both advantages and disadvantages, but the benefits is bigger.\n\nOn the one hand, working from home help employees save a lot of time. They don't need to travel to the office every day, so they can spend more time with family. Also, employers can save money on office rent and electricity. For example, many tech companies in Vietnam now allow staff work remotely 3 days per week and they report higher satisfaction.\n\nOn the other hand, some people argue that working from home reduce productivity because workers get distracted by housework or family members. Team culture also suffer because colleagues meet less often. However, with modern tools like Zoom and Slack, teams can still communicate effectively.\n\nIn conclusion, although working from home has some problems, I believe the advantages such as saving time and money are more important. Companies should offer flexible options for their staff.",
    word_count: 198,
    status: "reviewed",
    submitted_at: "2026-04-26T14:32:00Z",
    updated_at: "2026-04-27T10:12:00Z",
  },
  {
    id: "sub-2",
    task_id: "task-1",
    student_id: "p-s2",
    essay_text:
      "The two pie charts illustrate how energy was produced from different sources in a country in 1990 and 2020. Overall, the country shifted away from fossil fuels and increased its use of renewable energy over the period.\n\nIn 1990, coal was the dominant source at around 45%, followed by oil at 30% and gas at 15%. Renewable sources made up only a small portion (about 10%).\n\nBy 2020, the picture changed significantly. Coal dropped to 20%, while solar and wind together accounted for nearly 35%. Gas remained roughly the same at 18%, and oil fell to 22%.\n\nThis suggests a clear move toward cleaner energy.",
    word_count: 142,
    status: "submitted",
    submitted_at: "2026-04-27T19:05:00Z",
    updated_at: "2026-04-27T19:05:00Z",
    student_note: "I'm not sure if my overview is strong enough — please check!",
  },
  {
    id: "sub-3",
    task_id: "task-2",
    student_id: "p-s3",
    essay_text:
      "Working from home has become a defining feature of the modern workplace, sparking debate about whether it benefits everyone involved. While critics raise valid concerns about productivity and team cohesion, I believe the advantages outweigh the drawbacks when implemented thoughtfully.\n\nProponents of remote work highlight several compelling benefits. Employees gain flexibility, eliminate stressful commutes, and can structure their day around personal commitments — leading to improved well-being and, often, higher output. Employers, meanwhile, reduce overhead costs and can recruit talent from a wider geographic pool. A recent Stanford study, for example, found that hybrid workers were 13% more productive than their fully office-based peers.\n\nOn the other hand, opponents argue that remote work erodes collaboration and weakens organisational culture. Spontaneous conversations that often spark innovation are lost, and managers may struggle to mentor junior staff effectively. These concerns are legitimate, particularly for roles that depend on close teamwork.\n\nIn conclusion, although working from home is not without challenges, the gains in flexibility, cost savings, and access to talent make it a net positive — provided companies invest in clear communication and occasional in-person collaboration.",
    word_count: 196,
    status: "submitted",
    submitted_at: "2026-04-28T08:10:00Z",
    updated_at: "2026-04-28T08:10:00Z",
  },
];

export const mockFeedback: TeacherFeedback[] = [
  {
    id: "fb-1",
    submission_id: "sub-1",
    teacher_id: "p-t1",
    task_response_score: 6,
    coherence_score: 7,
    lexical_score: 6,
    grammar_score: 5,
    task_response_comment: "Clear position; both views are addressed.",
    coherence_comment: "Logical paragraphs; linkers used naturally.",
    lexical_comment: "Some repetition of \"working from home\".",
    grammar_comment: "Subject-verb agreement errors hold the band back.",
    overall_band: 6,
    overall_feedback:
      "Strong structure and clear opinion. Your ideas are well-organised, but grammar accuracy is holding you back from band 6.5. Focus this week on subject-verb agreement and articles.",
    strengths:
      "Clear 4-paragraph structure. Good use of linking phrases (\"On the one hand\", \"In conclusion\"). Relevant example about Vietnamese tech companies.",
    weaknesses:
      "Repeated subject-verb agreement errors (\"working from home become\", \"benefits is\"). Limited vocabulary range — same words repeated. Some informal phrasing.",
    next_action:
      "Rewrite paragraph 2 with correct subject-verb agreement. Learn 5 collocations for \"work-life balance\" topic.",
    progress_note:
      "Minh has improved structure significantly over the last 3 essays. Main blocker is now grammar accuracy at sentence level.",
    sample_essay:
      "Working from home has grown rapidly in recent years, and opinions about its impact remain divided. While some argue that remote work harms productivity and team culture, I believe its benefits for both employees and employers are greater overall.\n\nOn the one hand, working from home offers significant time and cost savings. Employees avoid daily commutes, which reduces stress and allows them to spend more time with family. Employers, in turn, cut spending on office space and utilities. For example, many Vietnamese tech firms now permit staff to work remotely three days a week and have reported higher employee satisfaction as a result.\n\nOn the other hand, critics point out that remote workers can be distracted by household tasks, and that team culture may weaken when colleagues rarely meet face-to-face. However, with collaboration tools such as Zoom and Slack, teams can still maintain regular communication and cohesion.\n\nIn conclusion, although working from home presents some challenges, the advantages — particularly time savings and reduced costs — clearly outweigh the drawbacks. Companies should therefore offer flexible arrangements that suit both their goals and their employees' needs.",
    is_sent_to_student: true,
    created_at: "2026-04-27T10:12:00Z",
    updated_at: "2026-04-27T10:12:00Z",
  },
];

export const mockProgressNotes: ProgressNote[] = [
  {
    id: "pn-1",
    student_id: "p-s1",
    teacher_id: "p-t1",
    note: "First essay — solid structure but very weak grammar accuracy. Estimated band 5.5.",
    focus_area: "Grammatical accuracy",
    estimated_band: 5.5,
    created_at: "2026-03-10T10:00:00Z",
  },
  {
    id: "pn-2",
    student_id: "p-s1",
    teacher_id: "p-t1",
    note: "Big improvement in coherence. Ideas now flow logically. Vocabulary still repetitive.",
    focus_area: "Lexical resource",
    estimated_band: 5.5,
    created_at: "2026-03-31T10:00:00Z",
  },
  {
    id: "pn-3",
    student_id: "p-s1",
    teacher_id: "p-t1",
    note: "Structure mastered. Grammar still the main blocker for band 6.5.",
    focus_area: "Grammatical accuracy",
    estimated_band: 6.0,
    created_at: "2026-04-27T10:12:00Z",
  },
];

export const getProfile = (id: string) => mockProfiles.find((p) => p.id === id);
export const getTask = (id: string) => mockTasks.find((t) => t.id === id);
export const getSubmission = (id: string) => mockSubmissions.find((s) => s.id === id);
export const getFeedbackBySubmission = (subId: string) =>
  mockFeedback.find((f) => f.submission_id === subId);
export const getSubmissionsByStudent = (studentId: string) =>
  mockSubmissions.filter((s) => s.student_id === studentId);
export const getProgressNotesByStudent = (studentId: string) =>
  mockProgressNotes
    .filter((p) => p.student_id === studentId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

export const getStudentsByClass = (className: string) =>
  mockProfiles.filter((p) => p.role === "student" && p.class_name === className);

export const getClassByName = (name: string) =>
  mockClasses.find((c) => c.class_name === name);

export type FeedbackInput = Omit<TeacherFeedback, "id" | "created_at" | "updated_at">;

export const upsertFeedback = (input: FeedbackInput): TeacherFeedback => {
  const now = new Date().toISOString();
  const idx = mockFeedback.findIndex((f) => f.submission_id === input.submission_id);
  if (idx >= 0) {
    mockFeedback[idx] = { ...mockFeedback[idx], ...input, updated_at: now };
  } else {
    mockFeedback.push({
      ...input,
      id: `fb-${Date.now()}`,
      created_at: now,
      updated_at: now,
    });
  }
  // Mark the submission as reviewed when sent
  if (input.is_sent_to_student) {
    const sub = mockSubmissions.find((s) => s.id === input.submission_id);
    if (sub) {
      sub.status = "reviewed";
      sub.updated_at = now;
    }
  }
  return mockFeedback[idx >= 0 ? idx : mockFeedback.length - 1];
};
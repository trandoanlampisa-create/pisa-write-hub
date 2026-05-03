import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Settings from "./pages/Settings.tsx";
import StudentDashboard from "./pages/student/StudentDashboard.tsx";
import StudentProgression from "./pages/student/StudentProgression.tsx";
import WritingTask from "./pages/student/WritingTask.tsx";
import StudentFeedback from "./pages/student/StudentFeedback.tsx";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.tsx";
import CreateTask from "./pages/teacher/CreateTask.tsx";
import ReviewWorkspace from "./pages/teacher/ReviewWorkspace.tsx";
import StudentProgress from "./pages/teacher/StudentProgress.tsx";
import ClassesOverview from "./pages/teacher/ClassesOverview.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/progression" element={<StudentProgression />} />
            <Route path="/student/write/:taskId" element={<WritingTask />} />
            <Route path="/student/feedback/:submissionId" element={<StudentFeedback />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/tasks/new" element={<CreateTask />} />
            <Route path="/teacher/review/:submissionId" element={<ReviewWorkspace />} />
            <Route path="/teacher/student/:studentId" element={<StudentProgress />} />
            <Route path="/teacher/classes" element={<ClassesOverview />} />
            <Route path="/teacher/classes/:className" element={<ClassesOverview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

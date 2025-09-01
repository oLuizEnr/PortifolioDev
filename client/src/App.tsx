import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import ProjectDetails from "@/pages/ProjectDetails";
import Login from "@/pages/Login";
import AdminProjects from "@/pages/AdminProjects";
import AdminExperiences from "@/pages/AdminExperiences";
import AdminAchievements from "@/pages/AdminAchievements";
import AdminComments from "@/pages/AdminComments";
import ExperienceDetails from "@/pages/ExperienceDetails";
import AchievementDetails from "@/pages/AchievementDetails";
import AllProjects from "@/pages/AllProjects";
import AllExperiences from "@/pages/AllExperiences";
import AllAchievements from "@/pages/AllAchievements";
import AllComments from "@/pages/AllComments";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/project/:id" component={ProjectDetails} />
          <Route path="/experience/:id" component={ExperienceDetails} />
          <Route path="/achievement/:id" component={AchievementDetails} />
          <Route path="/projects" component={AllProjects} />
          <Route path="/experiences" component={AllExperiences} />
          <Route path="/achievements" component={AllAchievements} />
          <Route path="/comments" component={AllComments} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/projects" component={AdminProjects} />
          <Route path="/admin/experiences" component={AdminExperiences} />
          <Route path="/admin/achievements" component={AdminAchievements} />
          <Route path="/admin/comments" component={AdminComments} />
          <Route path="/project/:id" component={ProjectDetails} />
          <Route path="/experience/:id" component={ExperienceDetails} />
          <Route path="/achievement/:id" component={AchievementDetails} />
          <Route path="/projects" component={AllProjects} />
          <Route path="/experiences" component={AllExperiences} />
          <Route path="/achievements" component={AllAchievements} />
          <Route path="/comments" component={AllComments} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

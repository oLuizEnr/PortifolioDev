import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import AchievementsSection from "@/components/AchievementsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";
import ProjectModal from "@/components/ProjectModal";
import ExperienceModal from "@/components/ExperienceModal";
import AchievementModal from "@/components/AchievementModal";
import CommentsModal from "@/components/CommentsModal";
import RecentComments from "@/components/RecentComments";
import { useState } from "react";

export default function Home() {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [commentsItem, setCommentsItem] = useState<{ type: string; id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const openComments = (type: string, id: string) => {
    setCommentsItem({ type, id });
    setIsCommentsModalOpen(true);
  };

  const openProjectModal = (project?: any) => {
    setEditingItem(project);
    setIsProjectModalOpen(true);
  };

  const openExperienceModal = (experience?: any) => {
    setEditingItem(experience);
    setIsExperienceModalOpen(true);
  };

  const openAchievementModal = (achievement?: any) => {
    setEditingItem(achievement);
    setIsAchievementModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation 
        onToggleAdmin={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
        showAdmin 
      />
      
      <HeroSection />
      <AboutSection />
      <ProjectsSection 
        onOpenComments={openComments}
        onOpenProjectModal={() => openProjectModal()}
      />
      <ExperienceSection 
        onOpenExperienceModal={() => openExperienceModal()}
      />
      <AchievementsSection 
        onOpenComments={openComments}
        onOpenAchievementModal={() => openAchievementModal()}
      />
      
      {/* Recent Comments Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentComments 
            showAllComments={true}
            title="Comentários Recentes do Portfólio"
            limit={5}
          />
        </div>
      </section>
      
      <ContactSection />
      <Footer />
      
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onOpenProject={() => openProjectModal()}
        onOpenExperience={() => openExperienceModal()}
        onOpenAchievement={() => openAchievementModal()}
        onViewComments={() => setIsCommentsModalOpen(true)}
      />
      
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingItem(null);
        }}
        project={editingItem}
      />
      
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => {
          setIsExperienceModalOpen(false);
          setEditingItem(null);
        }}
        experience={editingItem}
      />
      
      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => {
          setIsAchievementModalOpen(false);
          setEditingItem(null);
        }}
        achievement={editingItem}
      />
      
      <CommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        itemType={commentsItem?.type || ""}
        itemId={commentsItem?.id || ""}
      />
    </div>
  );
}

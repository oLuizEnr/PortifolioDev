import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import AchievementsSection from "@/components/AchievementsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import CommentsModal from "@/components/CommentsModal";
import { useState } from "react";

export default function Landing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [commentsItem, setCommentsItem] = useState<{ type: string; id: string } | null>(null);

  const openComments = (type: string, id: string) => {
    setCommentsItem({ type, id });
    setIsCommentsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation onLogin={() => setIsAuthModalOpen(true)} />
      <HeroSection />
      <AboutSection />
      <ProjectsSection onOpenComments={openComments} />
      <ExperienceSection />
      <AchievementsSection onOpenComments={openComments} />
      <ContactSection />
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
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

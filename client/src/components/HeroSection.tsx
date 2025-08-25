import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Download, Github, Linkedin, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import { useContent } from "@/hooks/useContent";

interface ProfileData {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  heroImageUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export default function HeroSection() {
  const { data: profile } = useQuery<ProfileData>({
    queryKey: ['/api/profile'],
    staleTime: 0, // No cache to update immediately
  });
  const { data: content } = useQuery({
    queryKey: ['/api/content'],
    staleTime: 0,
  });
  const { updateContent, updateImage } = useContent();

  // Default values
  const name = profile ? `${profile.firstName || 'Admin'} ${profile.lastName || 'Portfolio'}` : 'Seu Nome';
  const heroImage = profile?.heroImageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  
  // Editable content with defaults
  const heroTitle = content?.hero?.title || "Desenvolvedor Full Stack apaixonado por criar soluções digitais inovadoras.";
  const heroDescription = content?.hero?.description || "Especializado em React, Node.js e tecnologias modernas de desenvolvimento web.";
  const heroLocation = content?.hero?.location || "Poá, SP";
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadCV = () => {
    // In a real application, this would download the actual CV
    alert("Funcionalidade de download do CV será implementada em breve!");
  };

  return (
    <section id="home" className="bg-gradient-to-br from-primary/5 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                <MapPin className="w-3 h-3 mr-1" />
                <EditableText
                  content={heroLocation}
                  onSave={async (newContent) => {
                    await updateContent({ section: 'hero', field: 'location', content: newContent });
                  }}
                  tag="span"
                  className="inline"
                  placeholder="Sua localização..."
                />
              </Badge>
            </div>
            <EditableText
              content={`Olá, eu sou ${name}`}
              onSave={async (newContent) => {
                await updateContent({ section: 'hero', field: 'greeting', content: newContent });
              }}
              tag="h1"
              className="text-4xl lg:text-6xl font-bold text-slate-800 mb-6"
              placeholder="Digite sua saudação..."
            />
            <EditableText
              content={heroTitle}
              onSave={async (newContent) => {
                await updateContent({ section: 'hero', field: 'title', content: newContent });
              }}
              tag="p"
              className="text-xl text-slate-600 mb-8 leading-relaxed"
              multiline
              placeholder="Descreva sua especialização..."
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToProjects}
                size="lg"
                data-testid="button-view-projects"
              >
                Ver Projetos
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={downloadCV}
                data-testid="button-download-cv"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-6 mt-8">
              {profile?.linkedinUrl && (
                <a 
                  href={profile.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-primary transition-colors"
                  data-testid="link-linkedin"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {profile?.githubUrl && (
                <a 
                  href={profile.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-primary transition-colors"
                  data-testid="link-github"
                >
                  <Github className="w-6 h-6" />
                </a>
              )}
              <a 
                href="mailto:contato@portfolio.dev" 
                className="text-slate-500 hover:text-primary transition-colors"
                data-testid="link-email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <EditableImage
              src={heroImage}
              alt={`${name} - Desenvolvedor Full Stack`}
              onSave={async (newImageUrl) => {
                await updateImage({ section: 'profile', field: 'heroImage', imageUrl: newImageUrl });
              }}
              className="w-80 h-80 rounded-2xl shadow-2xl object-cover"
              aspectRatio="square"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

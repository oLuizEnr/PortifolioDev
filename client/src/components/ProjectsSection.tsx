import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, Github, ExternalLink, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Project } from "@shared/schema";

interface ProjectsSectionProps {
  onOpenComments: (type: string, id: string) => void;
}

export default function ProjectsSection({ onOpenComments }: ProjectsSectionProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const likeMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => {
      await apiRequest("POST", "/api/likes", {
        itemType: "project",
        itemId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/likes"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Faça login para curtir projetos",
        variant: "destructive",
      });
    },
  });

  const handleLike = (projectId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir projetos",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate({ itemId: projectId });
  };

  const handleShare = async (project: Project) => {
    const url = `${window.location.origin}/project/${project.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copiado",
          description: "O link do projeto foi copiado para a área de transferência",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Projetos em Destaque
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-slate-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 rounded mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4" data-testid="text-projects-title">
            Projetos em Destaque
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Alguns dos meus trabalhos mais recentes e impactantes
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project: Project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow"
              data-testid={`card-project-${project.id}`}
            >
              {project.imageUrl && (
                <img 
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  data-testid={`img-project-${project.id}`}
                />
              )}
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-slate-800" data-testid={`text-project-title-${project.id}`}>
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(project.id)}
                      className="text-slate-400 hover:text-red-500"
                      data-testid={`button-like-${project.id}`}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(project)}
                      className="text-slate-400 hover:text-primary"
                      data-testid={`button-share-${project.id}`}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4" data-testid={`text-project-description-${project.id}`}>
                  {project.description}
                </p>
                
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        data-testid={`badge-tech-${project.id}-${index}`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setLocation(`/project/${project.id}`)}
                    data-testid={`button-details-${project.id}`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <div className="flex items-center space-x-2">
                    {project.githubUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        data-testid={`button-github-${project.id}`}
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        data-testid={`button-live-${project.id}`}
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" data-testid="button-view-all-projects">
            Ver Todos os Projetos
          </Button>
        </div>
      </div>
    </section>
  );
}

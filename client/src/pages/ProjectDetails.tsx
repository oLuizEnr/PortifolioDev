import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Github, ExternalLink, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import CommentsModal from "@/components/CommentsModal";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";

export default function ProjectDetails() {
  const { id } = useParams() as { id: string };
  const [, setLocation] = useLocation();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
  });

  const { data: likeData } = useQuery({
    queryKey: ["/api/likes/project", id],
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/likes", {
        itemType: "project",
        itemId: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/likes/project", id] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Faça login para curtir projetos",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir projetos",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title,
          text: project?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
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

  if (projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Projeto não encontrado</h1>
          <Button onClick={() => setLocation("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-4" data-testid="text-title">
                {project.title}
              </h1>
              <p className="text-lg text-slate-600 mb-6" data-testid="text-description">
                {project.description}
              </p>
              
              {project.technologies && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" data-testid={`badge-tech-${index}`}>
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                {project.githubUrl && (
                  <Button asChild variant="outline" data-testid="button-github">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                
                {project.liveUrl && (
                  <Button asChild data-testid="button-live">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver Projeto
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            {project.imageUrl && (
              <div className="lg:w-96">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                  data-testid="img-project"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Interações</h2>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`${likeData?.userLiked ? 'text-red-500' : 'text-slate-500'}`}
                  data-testid="button-like"
                >
                  <Heart className={`w-4 h-4 mr-2 ${likeData?.userLiked ? 'fill-current' : ''}`} />
                  {likeData?.count || 0}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCommentsOpen(true)}
                  data-testid="button-comments"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comentários
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  data-testid="button-share"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p>
                Este projeto demonstra as habilidades técnicas e criativas aplicadas 
                no desenvolvimento de soluções digitais modernas. Cada detalhe foi 
                cuidadosamente planejado para oferecer a melhor experiência possível 
                aos usuários finais.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        itemType="project"
        itemId={id}
      />
    </div>
  );
}

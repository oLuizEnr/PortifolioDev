import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Share2, Trophy, Award, GraduationCap, Medal, CalendarDays, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Achievement } from "@shared/schema";

interface AchievementsSectionProps {
  onOpenComments: (type: string, id: string) => void;
}

const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'certification':
      return GraduationCap;
    case 'award':
      return Trophy;
    case 'speaking':
      return Medal;
    default:
      return Award;
  }
};

const getColorForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'certification':
      return 'bg-blue-100 text-blue-600';
    case 'award':
      return 'bg-yellow-100 text-yellow-600';
    case 'speaking':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-green-100 text-green-600';
  }
};

export default function AchievementsSection({ onOpenComments }: AchievementsSectionProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const likeMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => {
      await apiRequest("POST", "/api/likes", {
        itemType: "achievement",
        itemId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/likes"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Faça login para curtir conquistas",
        variant: "destructive",
      });
    },
  });

  const handleLike = (achievementId: string) => {
    if (!user) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir conquistas",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate({ itemId: achievementId });
  };

  const handleShare = async (achievement: Achievement) => {
    const text = `Confira esta conquista: ${achievement.title} - ${achievement.description}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: achievement.title,
          text,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        toast({
          title: "Texto Copiado",
          description: "A conquista foi copiada para a área de transferência",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o texto",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section id="achievements" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Conquistas & Certificações
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4" data-testid="text-achievements-title">
            Conquistas & Certificações
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Reconhecimentos e certificações que marcaram minha carreira
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {achievements.map((achievement: Achievement, index) => {
            const IconComponent = getIconForType(achievement.type);
            const colorClass = getColorForType(achievement.type);
            
            return (
              <Card 
                key={achievement.id} 
                className="hover:shadow-lg transition-shadow"
                data-testid={`card-achievement-${index}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mr-4`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-slate-800" data-testid={`text-achievement-title-${index}`}>
                          {achievement.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(achievement.id)}
                            className="text-slate-400 hover:text-red-500"
                            data-testid={`button-like-${index}`}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(achievement)}
                            className="text-slate-400 hover:text-primary"
                            data-testid={`button-share-${index}`}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-3" data-testid={`text-achievement-description-${index}`}>
                        {achievement.description}
                      </p>
                      <div className="flex items-center text-sm text-slate-500 mb-4">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        <span data-testid={`text-achievement-date-${index}`}>
                          {formatDate(achievement.date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation(`/achievement/${achievement.id}`)}
                          data-testid={`button-details-${index}`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        {achievement.certificateUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            data-testid={`button-certificate-${index}`}
                          >
                            <a href={achievement.certificateUrl} target="_blank" rel="noopener noreferrer">
                              Ver Certificado
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" data-testid="button-view-all-achievements">
            Ver Todas as Conquistas
          </Button>
        </div>
      </div>
    </section>
  );
}

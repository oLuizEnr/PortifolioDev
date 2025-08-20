import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit, CalendarDays, Eye, Trophy, Award, GraduationCap, Medal } from "lucide-react";
import { useLocation } from "wouter";
import AchievementModal from "@/components/AchievementModal";
import type { Achievement } from "@shared/schema";

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

const getTypeLabel = (type: string) => {
  switch (type.toLowerCase()) {
    case 'certification':
      return 'Certificação';
    case 'award':
      return 'Prêmio';
    case 'speaking':
      return 'Palestra';
    case 'publication':
      return 'Publicação';
    default:
      return 'Outro';
  }
};

export default function AdminAchievements() {
  const [, setLocation] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | undefined>(undefined);

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ["/api/admin/achievements"],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const handleEdit = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAchievement(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/admin")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-slate-800" data-testid="text-page-title">
              Gerenciar Conquistas
            </h1>
          </div>
          <Button onClick={handleCreate} data-testid="button-create-achievement">
            <Plus className="w-4 h-4 mr-2" />
            Nova Conquista
          </Button>
        </div>

        <div className="grid gap-6">
          {achievements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-slate-400 mb-4">
                  <Trophy className="w-16 h-16" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  Nenhuma conquista encontrada
                </h3>
                <p className="text-slate-500 text-center mb-4">
                  Adicione suas conquistas e certificações para destacar suas realizações
                </p>
                <Button onClick={handleCreate} data-testid="button-create-first-achievement">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Conquista
                </Button>
              </CardContent>
            </Card>
          ) : (
            achievements.map((achievement: Achievement) => {
              const IconComponent = getIconForType(achievement.type);
              const colorClass = getColorForType(achievement.type);
              
              return (
                <Card key={achievement.id} data-testid={`card-achievement-${achievement.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mr-4`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{achievement.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <div className="flex items-center">
                              <CalendarDays className="w-4 h-4 mr-1" />
                              {formatDate(achievement.date)}
                            </div>
                            <Badge variant="outline">
                              {getTypeLabel(achievement.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {achievement.published ? (
                          <Badge variant="default">Publicado</Badge>
                        ) : (
                          <Badge variant="secondary">Rascunho</Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(achievement)}
                          data-testid={`button-edit-${achievement.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{achievement.description}</p>
                    {achievement.certificateUrl && (
                      <div className="mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <a href={achievement.certificateUrl} target="_blank" rel="noopener noreferrer">
                            Ver Certificado
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <AchievementModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        achievement={selectedAchievement}
      />
    </div>
  );
}
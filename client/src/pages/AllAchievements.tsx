import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CalendarDays, Eye, Award, Trophy, GraduationCap, Medal } from "lucide-react";
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

export default function AllAchievements() {
  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-6"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Conquistas & Certificações
          </h1>
          <p className="text-lg text-slate-600">
            Todos os reconhecimentos e certificações que marcaram minha carreira
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {achievements.map((achievement, index: number) => {
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
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-slate-600 mb-3">
                        {achievement.description}
                      </p>
                      <div className="flex items-center text-sm text-slate-500 mb-4">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        <span>{formatDate(achievement.date)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Link href={`/achievement/${achievement.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </Link>
                        {achievement.certificateUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
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

        {(achievements as Achievement[]).length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">Nenhuma conquista encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
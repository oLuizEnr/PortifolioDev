import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, ExternalLink, Award, Trophy, GraduationCap, Medal } from "lucide-react";
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

export default function AchievementDetails() {
  const { id } = useParams();
  
  const { data: achievement, isLoading } = useQuery({
    queryKey: [`/api/achievements/${id}`],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-6"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!achievement) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Conquista não encontrada</h1>
          <Link href="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = getIconForType(achievement.type);
  const colorClass = getColorForType(achievement.type);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-start mb-6">
              <div className={`flex-shrink-0 w-16 h-16 ${colorClass} rounded-xl flex items-center justify-center mr-6`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Badge variant="outline" className="mr-3">
                    {achievement.type}
                  </Badge>
                  <div className="flex items-center text-slate-500">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    <span data-testid="achievement-date">
                      {formatDate(achievement.date)}
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-4" data-testid="achievement-title">
                  {achievement.title}
                </h1>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Descrição</h3>
              <p className="text-slate-600 leading-relaxed" data-testid="achievement-description">
                {achievement.description}
              </p>
            </div>

            {achievement.issuer && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Emissor</h3>
                <p className="text-slate-600">{achievement.issuer}</p>
              </div>
            )}

            {achievement.skills && achievement.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Habilidades Demonstradas</h3>
                <div className="flex flex-wrap gap-2">
                  {achievement.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {achievement.certificateUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Certificado</h3>
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary/90"
                  data-testid="certificate-link"
                >
                  <a href={achievement.certificateUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Certificado
                  </a>
                </Button>
              </div>
            )}

            {achievement.credentialId && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">ID da Credencial</h3>
                <p className="text-slate-600 font-mono text-sm bg-slate-100 px-3 py-2 rounded">
                  {achievement.credentialId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
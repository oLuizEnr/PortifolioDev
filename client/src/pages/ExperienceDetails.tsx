import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, MapPin, Globe } from "lucide-react";
import type { Experience } from "@shared/schema";

export default function ExperienceDetails() {
  const { id } = useParams();
  
  const { data: experience, isLoading } = useQuery({
    queryKey: [`/api/experiences/${id}`],
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

  if (!experience) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Experiência não encontrada</h1>
          <Link href="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-800 mb-2" data-testid="experience-title">
                {experience.position}
              </h1>
              <p className="text-xl text-primary font-semibold mb-4" data-testid="experience-company">
                {experience.company}
              </p>
              
              <div className="flex flex-wrap gap-4 text-slate-600 mb-6">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span data-testid="experience-period">
                    {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Presente'}
                  </span>
                </div>
                {experience.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{experience.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Descrição</h3>
              <p className="text-slate-600 leading-relaxed" data-testid="experience-description">
                {experience.description}
              </p>
            </div>

            {experience.responsibilities && experience.responsibilities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Responsabilidades</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  {experience.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            )}

            {experience.technologies && experience.technologies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Tecnologias Utilizadas</h3>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-primary/5 text-primary border-primary/20"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {experience.achievements && experience.achievements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Principais Conquistas</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600">
                  {experience.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
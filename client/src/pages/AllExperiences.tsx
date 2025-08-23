import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Eye } from "lucide-react";
import type { Experience } from "@shared/schema";

export default function AllExperiences() {
  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
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
            Experiência Profissional
          </h1>
          <p className="text-lg text-slate-600">
            Minha trajetória completa no desenvolvimento de software
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200"></div>
            
            <div className="space-y-12">
              {experiences.map((experience, index: number) => (
                <div 
                  key={experience.id} 
                  className="relative pl-16"
                  data-testid={`experience-${index}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 top-2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2"></div>
                  
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-800">
                            {experience.position}
                          </h3>
                          <p className="text-primary font-medium">
                            {experience.company}
                          </p>
                        </div>
                        <div className="flex items-center text-slate-500 text-sm lg:text-base mt-2 lg:mt-0">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          <span>
                            {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Presente'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-4">
                        {experience.description}
                      </p>
                      
                      {experience.technologies && experience.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {experience.technologies.map((tech, techIndex) => (
                            <Badge 
                              key={techIndex} 
                              variant="outline" 
                              className="bg-primary/5 text-primary border-primary/20"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Link href={`/experience/${experience.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(experiences as Experience[]).length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">Nenhuma experiência encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
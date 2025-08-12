import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import type { Experience } from "@shared/schema";

export default function ExperienceSection() {
  const { data: experiences = [], isLoading } = useQuery({
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
      <section id="experience" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Experiência Profissional
            </h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4" data-testid="text-experience-title">
            Experiência Profissional
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Minha trajetória profissional no desenvolvimento de software
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200"></div>
            
            <div className="space-y-12">
              {experiences.map((experience: Experience, index) => (
                <div 
                  key={experience.id} 
                  className="relative pl-16"
                  data-testid={`experience-${index}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 top-2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2"></div>
                  
                  <Card className="bg-slate-50">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-800" data-testid={`text-position-${index}`}>
                            {experience.position}
                          </h3>
                          <p className="text-primary font-medium" data-testid={`text-company-${index}`}>
                            {experience.company}
                          </p>
                        </div>
                        <div className="flex items-center text-slate-500 text-sm lg:text-base mt-2 lg:mt-0">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          <span data-testid={`text-period-${index}`}>
                            {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Presente'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-4" data-testid={`text-description-${index}`}>
                        {experience.description}
                      </p>
                      
                      {experience.technologies && experience.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, techIndex) => (
                            <Badge 
                              key={techIndex} 
                              variant="outline" 
                              className="bg-primary/5 text-primary border-primary/20"
                              data-testid={`badge-tech-${index}-${techIndex}`}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

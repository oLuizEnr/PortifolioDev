import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit, CalendarDays, Eye } from "lucide-react";
import { useLocation } from "wouter";
import ExperienceModal from "@/components/ExperienceModal";
import type { Experience } from "@shared/schema";

export default function AdminExperiences() {
  const [, setLocation] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["/api/admin/experiences"],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEdit = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedExperience(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExperience(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando experiências...</p>
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
              Gerenciar Experiências
            </h1>
          </div>
          <Button onClick={handleCreate} data-testid="button-create-experience">
            <Plus className="w-4 h-4 mr-2" />
            Nova Experiência
          </Button>
        </div>

        <div className="grid gap-6">
          {experiences.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-slate-400 mb-4">
                  <Eye className="w-16 h-16" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  Nenhuma experiência encontrada
                </h3>
                <p className="text-slate-500 text-center mb-4">
                  Adicione suas experiências profissionais para mostrar sua trajetória
                </p>
                <Button onClick={handleCreate} data-testid="button-create-first-experience">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Experiência
                </Button>
              </CardContent>
            </Card>
          ) : (
            experiences.map((experience: Experience) => (
              <Card key={experience.id} data-testid={`card-experience-${experience.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{experience.position}</CardTitle>
                      <p className="text-primary font-medium">{experience.company}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-slate-500 text-sm">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        <span>
                          {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Presente'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {experience.published ? (
                          <Badge variant="default">Publicado</Badge>
                        ) : (
                          <Badge variant="secondary">Rascunho</Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(experience)}
                        data-testid={`button-edit-${experience.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{experience.description}</p>
                  
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <ExperienceModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        experience={selectedExperience}
      />
    </div>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit, Trash2, Eye, Github, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import ProjectModal from "@/components/ProjectModal";
import type { Project } from "@shared/schema";

export default function AdminProjects() {
  const [, setLocation] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
  });

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProject(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando projetos...</p>
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
              Gerenciar Projetos
            </h1>
          </div>
          <Button onClick={handleCreate} data-testid="button-create-project">
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        <div className="grid gap-6">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-slate-400 mb-4">
                  <Eye className="w-16 h-16" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-slate-500 text-center mb-4">
                  Crie seu primeiro projeto para começar a mostrar seu trabalho
                </p>
                <Button onClick={handleCreate} data-testid="button-create-first-project">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              </CardContent>
            </Card>
          ) : (
            projects.map((project: Project) => (
              <Card key={project.id} data-testid={`card-project-${project.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <div className="flex space-x-2">
                        {project.published ? (
                          <Badge variant="default">Publicado</Badge>
                        ) : (
                          <Badge variant="secondary">Rascunho</Badge>
                        )}
                        {project.featured && (
                          <Badge variant="outline">Destaque</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/project/${project.id}`)}
                        data-testid={`button-view-${project.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        data-testid={`button-edit-${project.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-4 text-sm text-slate-500">
                    {project.githubUrl && (
                      <div className="flex items-center">
                        <Github className="w-4 h-4 mr-1" />
                        GitHub
                      </div>
                    )}
                    {project.liveUrl && (
                      <div className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Demo
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        project={selectedProject}
      />
    </div>
  );
}
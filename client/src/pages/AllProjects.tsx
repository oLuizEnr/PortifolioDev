import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Github, ExternalLink, Eye } from "lucide-react";
import type { Project } from "@shared/schema";

export default function AllProjects() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-6"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-slate-200 rounded"></div>
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
            Todos os Projetos
          </h1>
          <p className="text-lg text-slate-600">
            Explore todos os meus projetos e trabalhos desenvolvidos
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow"
              data-testid={`card-project-${project.id}`}
            >
              {project.imageUrl && (
                <img 
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {project.title}
                </h3>
                
                <p className="text-slate-600 mb-4">
                  {project.description}
                </p>
                
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Link href={`/project/${project.id}`}>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-2">
                    {project.githubUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(projects as Project[]).length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">Nenhum projeto encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
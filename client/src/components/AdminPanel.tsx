import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Briefcase, Trophy, MessageCircle, BarChart } from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProject: () => void;
  onOpenExperience: () => void;
  onOpenAchievement: () => void;
  onViewComments: () => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  onOpenProject,
  onOpenExperience,
  onOpenAchievement,
  onViewComments
}: AdminPanelProps) {
  if (!isOpen) return null;

  const adminActions = [
    {
      icon: Plus,
      label: "Novo Projeto",
      description: "Adicionar um novo projeto ao portfólio",
      onClick: onOpenProject,
      color: "text-primary"
    },
    {
      icon: Briefcase,
      label: "Nova Experiência",
      description: "Adicionar experiência profissional",
      onClick: onOpenExperience,
      color: "text-primary"
    },
    {
      icon: Trophy,
      label: "Nova Conquista",
      description: "Adicionar certificação ou prêmio",
      onClick: onOpenAchievement,
      color: "text-primary"
    }
  ];

  const managementActions = [
    {
      icon: MessageCircle,
      label: "Comentários",
      description: "Ver e gerenciar comentários",
      onClick: onViewComments,
      color: "text-slate-500",
      badge: "3"
    },
    {
      icon: BarChart,
      label: "Estatísticas",
      description: "Ver métricas e analytics",
      onClick: () => alert("Estatísticas em desenvolvimento"),
      color: "text-slate-500"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle data-testid="text-admin-title">Painel Administrativo</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-admin"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-slate-800 mb-3">Criar Conteúdo</h3>
            <div className="space-y-2">
              {adminActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={action.onClick}
                  data-testid={`button-${action.label.toLowerCase().replace(' ', '-')}`}
                >
                  <action.icon className={`w-5 h-5 mr-3 ${action.color}`} />
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-sm text-slate-500">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium text-slate-800 mb-3">Gerenciamento</h3>
            <div className="space-y-2">
              {managementActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={action.onClick}
                  data-testid={`button-${action.label.toLowerCase()}`}
                >
                  <action.icon className={`w-5 h-5 mr-3 ${action.color}`} />
                  <div className="text-left flex-1">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-sm text-slate-500">{action.description}</div>
                  </div>
                  {action.badge && (
                    <span className="ml-auto bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      {action.badge}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

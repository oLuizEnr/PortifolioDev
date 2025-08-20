import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Briefcase, Trophy, MessageCircle, BarChart, Settings, Upload, LinkedinIcon, User, Image, FolderOpen, Github } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [linkedinUrl, setLinkedinUrl] = useState((user as any)?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState((user as any)?.githubUrl || '');
  const [profileImage, setProfileImage] = useState((user as any)?.profileImageUrl || '');
  const [heroImage, setHeroImage] = useState((user as any)?.heroImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.url);
        alert('Arquivo enviado com sucesso!');
      } else {
        alert('Erro ao enviar arquivo');
      }
    } catch (error) {
      alert('Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          linkedinUrl,
          githubUrl,
          profileImageUrl: profileImage,
          heroImageUrl: heroImage
        })
      });

      if (response.ok) {
        alert('Perfil atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar perfil');
      }
    } catch (error) {
      alert('Erro ao atualizar perfil');
    }
  };

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
      icon: FolderOpen,
      label: "Gerenciar Projetos",
      description: "Ver e editar todos os projetos",
      onClick: () => window.open('/admin/projects', '_blank'),
      color: "text-slate-500"
    },
    {
      icon: Briefcase,
      label: "Gerenciar Experiências",
      description: "Ver e editar todas as experiências",
      onClick: () => window.open('/admin/experiences', '_blank'),
      color: "text-slate-500"
    },
    {
      icon: Trophy,
      label: "Gerenciar Conquistas",
      description: "Ver e editar todas as conquistas",
      onClick: () => window.open('/admin/achievements', '_blank'),
      color: "text-slate-500"
    },
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

  const tabs = [
    { id: 'create', label: 'Criar', icon: Plus },
    { id: 'manage', label: 'Gerenciar', icon: FolderOpen },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'upload', label: 'Upload', icon: Upload }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
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
        
        <CardContent>
          {/* Tabs */}
          <div className="flex border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Create Tab */}
          {activeTab === 'create' && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-800 mb-3">Criar Conteúdo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {adminActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                    onClick={action.onClick}
                    data-testid={`button-${action.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
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
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-800 mb-3">Configurações do Perfil</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkedin">URL do LinkedIn</Label>
                  <div className="flex space-x-2">
                    <LinkedinIcon className="w-5 h-5 text-blue-600 mt-2" />
                    <Input
                      id="linkedin"
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/seu-perfil"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="github">URL do GitHub</Label>
                  <div className="flex space-x-2">
                    <Github className="w-5 h-5 text-gray-800 mt-2" />
                    <Input
                      id="github"
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/seu-usuario"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="profileImage">Imagem de Perfil</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="profileImage"
                      type="url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="URL da imagem de perfil"
                    />
                  </div>
                  {profileImage && (
                    <div className="mt-2">
                      <img src={profileImage} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="heroImage">Imagem Hero (Página Inicial)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="heroImage"
                      type="url"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      placeholder="URL da imagem para a página inicial"
                    />
                  </div>
                  {heroImage && (
                    <div className="mt-2">
                      <img src={heroImage} alt="Hero Preview" className="w-32 h-32 rounded-lg object-cover" />
                    </div>
                  )}
                </div>
                
                <Button onClick={handleSaveProfile} className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-800 mb-3">Upload de Arquivos</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <Image className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h4 className="font-medium text-slate-700 mb-2">Enviar Imagem ou GIF</h4>
                  <p className="text-sm text-slate-500 mb-4">Suporta JPEG, PNG, GIF, WebP até 10MB</p>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                  />
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    variant="outline"
                  >
                    {isUploading ? 'Enviando...' : 'Selecionar Arquivo'}
                  </Button>
                </div>
                
                <div className="text-sm text-slate-600">
                  <h5 className="font-medium mb-2">Como usar:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Faça upload da imagem aqui</li>
                    <li>Copie a URL gerada</li>
                    <li>Use a URL nos projetos, experiências ou perfil</li>
                    <li>Arquivos ficam disponíveis em /uploads/nome-do-arquivo</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

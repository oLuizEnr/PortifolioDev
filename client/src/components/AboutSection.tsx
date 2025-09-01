import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import EditableText from "./EditableText";
import { useContent } from "@/hooks/useContent";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Plus, X, Check } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AboutSection() {
  const { data: content } = useQuery({
    queryKey: ['/api/content'],
    staleTime: 0,
  });
  const { updateContent } = useContent();
  const { user, isAuthenticated } = useAuth();
  const [isEditingTech, setIsEditingTech] = useState(false);
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [tempTech, setTempTech] = useState<Array<{name: string, icon: string, color: string}>>([]);
  const [tempStats, setTempStats] = useState<Array<{value: string, label: string, color: string}>>([]);
  const [newTechName, setNewTechName] = useState('');
  const [newTechIcon, setNewTechIcon] = useState('');
  const [newTechColor, setNewTechColor] = useState('');

  // Get content with defaults - declare contentData first
  const contentData = content as any;
  
  // Editable content with defaults
  const aboutTitle = contentData?.about?.title || "Sobre Mim";
  const aboutSubtitle = contentData?.about?.subtitle || "Conheça mais sobre minha jornada e paixão pelo desenvolvimento";
  const aboutDescription1 = contentData?.about?.description1 || "Sou um desenvolvedor full stack com mais de 5 anos de experiência criando aplicações web modernas e escaláveis. Minha paixão está em transformar ideias complexas em soluções digitais elegantes e funcionais.";
  const aboutDescription2 = contentData?.about?.description2 || "Baseado em Poá, SP, trabalho com as mais recentes tecnologias do mercado, sempre focando na experiência do usuário e na qualidade do código. Acredito que a tecnologia deve simplificar a vida das pessoas.";

  const defaultStats = [
    { value: "5+", label: "Anos de Experiência", color: "bg-primary/5 text-primary" },
    { value: "50+", label: "Projetos Concluídos", color: "bg-emerald-50 text-emerald-600" },
    { value: "30+", label: "Clientes Satisfeitos", color: "bg-amber-50 text-amber-600" },
    { value: "10+", label: "Certificações", color: "bg-purple-50 text-purple-600" },
  ];

  const defaultTechnologies = [
    { name: "JavaScript/TypeScript", icon: "fab fa-js-square", color: "text-yellow-500" },
    { name: "React/Next.js", icon: "fab fa-react", color: "text-blue-500" },
    { name: "Node.js", icon: "fab fa-node-js", color: "text-green-500" },
    { name: "PostgreSQL/MongoDB", icon: "fas fa-database", color: "text-blue-600" },
  ];

  const stats = contentData?.about?.stats ? JSON.parse(contentData.about.stats) : defaultStats;
  const technologies = contentData?.about?.technologies ? JSON.parse(contentData.about.technologies) : defaultTechnologies;
  
  const isAdmin = isAuthenticated && (user as any)?.isAdmin;

  const handleSaveTechnologies = async () => {
    try {
      await updateContent({ 
        section: 'about', 
        field: 'technologies', 
        content: JSON.stringify(tempTech) 
      });
      setIsEditingTech(false);
    } catch (error) {
      console.error('Erro ao salvar tecnologias:', error);
    }
  };

  const handleSaveStats = async () => {
    try {
      await updateContent({ 
        section: 'about', 
        field: 'stats', 
        content: JSON.stringify(tempStats) 
      });
      setIsEditingStats(false);
    } catch (error) {
      console.error('Erro ao salvar estatísticas:', error);
    }
  };

  const addTechnology = () => {
    if (newTechName.trim()) {
      setTempTech([...tempTech, {
        name: newTechName.trim(),
        icon: newTechIcon.trim() || 'fas fa-code',
        color: newTechColor.trim() || 'text-blue-500'
      }]);
      setNewTechName('');
      setNewTechIcon('');
      setNewTechColor('');
    }
  };

  const removeTechnology = (index: number) => {
    setTempTech(tempTech.filter((_, i) => i !== index));
  };

  const startEditingTech = () => {
    setTempTech([...technologies]);
    setIsEditingTech(true);
  };

  const startEditingStats = () => {
    setTempStats([...stats]);
    setIsEditingStats(true);
  };

  const updateTempStat = (index: number, field: string, value: string) => {
    const updatedStats = [...tempStats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setTempStats(updatedStats);
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <EditableText
            content={aboutTitle}
            onSave={async (newContent) => {
              await updateContent({ section: 'about', field: 'title', content: newContent });
            }}
            tag="h2"
            className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4"
            placeholder="Título da seção sobre..."
          />
          <EditableText
            content={aboutSubtitle}
            onSave={async (newContent) => {
              await updateContent({ section: 'about', field: 'subtitle', content: newContent });
            }}
            tag="p"
            className="text-lg text-slate-600 max-w-2xl mx-auto"
            placeholder="Subtítulo da seção sobre..."
          />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <EditableText
              content={aboutDescription1}
              onSave={async (newContent) => {
                await updateContent({ section: 'about', field: 'description1', content: newContent });
              }}
              tag="p"
              className="text-lg text-slate-700 mb-6 leading-relaxed"
              multiline
              placeholder="Primeiro parágrafo sobre você..."
            />
            <EditableText
              content={aboutDescription2}
              onSave={async (newContent) => {
                await updateContent({ section: 'about', field: 'description2', content: newContent });
              }}
              tag="p"
              className="text-lg text-slate-700 mb-8 leading-relaxed"
              multiline
              placeholder="Segundo parágrafo sobre você..."
            />
            
            {/* Skills */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">
                  Principais Tecnologias
                </h3>
                {isAdmin && !isEditingTech && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startEditingTech}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {isEditingTech ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tempTech.map((tech: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center">
                          <i className={`${tech.icon} ${tech.color} text-xl mr-3`}></i>
                          <span className="text-slate-700">{tech.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTechnology(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 p-4 border rounded bg-slate-50">
                    <h4 className="font-medium">Adicionar Nova Tecnologia:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        placeholder="Nome da tecnologia"
                        value={newTechName}
                        onChange={(e) => setNewTechName(e.target.value)}
                      />
                      <Input
                        placeholder="Ícone (ex: fab fa-react)"
                        value={newTechIcon}
                        onChange={(e) => setNewTechIcon(e.target.value)}
                      />
                      <Input
                        placeholder="Cor (ex: text-blue-500)"
                        value={newTechColor}
                        onChange={(e) => setNewTechColor(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addTechnology}
                      disabled={!newTechName.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveTechnologies}>
                      <Check className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingTech(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {technologies.map((tech: any, index: number) => (
                    <div key={index} className="flex items-center" data-testid={`skill-${index}`}>
                      <i className={`${tech.icon} ${tech.color} text-xl mr-3`}></i>
                      <span className="text-slate-700">{tech.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="relative group">
            {isAdmin && !isEditingStats && (
              <Button
                variant="ghost"
                size="sm"
                onClick={startEditingStats}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white hover:bg-blue-600 z-10"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            
            {isEditingStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  {tempStats.map((stat: any, index: number) => (
                    <div key={index} className="p-4 border rounded bg-white space-y-2">
                      <Input
                        placeholder="Valor (ex: 5+)"
                        value={stat.value}
                        onChange={(e) => updateTempStat(index, 'value', e.target.value)}
                      />
                      <Input
                        placeholder="Label (ex: Anos de Experiência)"
                        value={stat.label}
                        onChange={(e) => updateTempStat(index, 'label', e.target.value)}
                      />
                      <Input
                        placeholder="Classes CSS (ex: bg-primary/5 text-primary)"
                        value={stat.color}
                        onChange={(e) => updateTempStat(index, 'color', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSaveStats}>
                    <Check className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingStats(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat: any, index: number) => (
                  <div 
                    key={index}
                    className={`${stat.color} p-6 rounded-xl text-center`}
                    data-testid={`stat-${index}`}
                  >
                    <div className="text-3xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

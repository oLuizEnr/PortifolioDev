import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, CalendarDays } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertExperienceSchema, type Experience } from "@shared/schema";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience;
}

export default function ExperienceModal({ isOpen, onClose, experience }: ExperienceModalProps) {
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: [] as string[],
    published: true
  });
  const [newTech, setNewTech] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (experience) {
      setFormData({
        position: experience.position || '',
        company: experience.company || '',
        startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
        endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
        description: experience.description || '',
        technologies: experience.technologies || [],
        published: experience.published || false
      });
    } else {
      setFormData({
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
        technologies: [],
        published: true
      });
    }
  }, [experience, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const submitData = {
        ...data,
        startDate: data.startDate, // Send as string, let backend handle conversion
        endDate: data.endDate || undefined
      };
      
      if (experience) {
        await apiRequest("PUT", `/api/experiences/${experience.id}`, submitData);
      } else {
        await apiRequest("POST", "/api/experiences", submitData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      toast({
        title: "Sucesso",
        description: experience ? "Experiência atualizada com sucesso!" : "Experiência criada com sucesso!",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a experiência. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (experience) {
        await apiRequest("DELETE", `/api/experiences/${experience.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      toast({
        title: "Sucesso",
        description: "Experiência excluída com sucesso!",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a experiência. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate) {
      toast({
        title: "Erro de Validação",
        description: "Data de início é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      published: checked
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta experiência?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle data-testid="text-experience-modal-title">
            {experience ? 'Editar Experiência' : 'Nova Experiência'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-experience-modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-experience">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Cargo *</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Desenvolvedor Full Stack Senior"
                  data-testid="input-experience-position"
                />
              </div>
              <div>
                <Label htmlFor="company">Empresa *</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Tech Solutions Ltda"
                  data-testid="input-experience-company"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  data-testid="input-experience-start-date"
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  placeholder="Deixe em branco se ainda trabalha aqui"
                  data-testid="input-experience-end-date"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Deixe em branco se ainda trabalha aqui
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Descreva suas principais responsabilidades e conquistas..."
                data-testid="textarea-experience-description"
              />
            </div>
            
            <div>
              <Label>Tecnologias Utilizadas</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Digite uma tecnologia"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  data-testid="input-new-experience-tech"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTechnology}
                  data-testid="button-add-experience-tech"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTechnology(tech)}
                    data-testid={`badge-experience-tech-${index}`}
                  >
                    {tech} ×
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={handleSwitchChange}
                data-testid="switch-experience-published"
              />
              <Label htmlFor="published">Publicado</Label>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={mutation.isPending}
                data-testid="button-save-experience"
              >
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel-experience"
              >
                Cancelar
              </Button>
              {experience && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  data-testid="button-delete-experience"
                >
                  {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

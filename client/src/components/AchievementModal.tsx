import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CalendarDays } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertAchievementSchema, type Achievement } from "@shared/schema";

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement?: Achievement;
}

const achievementTypes = [
  { value: 'certification', label: 'Certificação' },
  { value: 'award', label: 'Prêmio' },
  { value: 'speaking', label: 'Palestra' },
  { value: 'publication', label: 'Publicação' },
  { value: 'other', label: 'Outro' }
];

export default function AchievementModal({ isOpen, onClose, achievement }: AchievementModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'certification',
    certificateUrl: '',
    published: false
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || '',
        description: achievement.description || '',
        date: achievement.date ? new Date(achievement.date).toISOString().split('T')[0] : '',
        type: achievement.type || 'certification',
        certificateUrl: achievement.certificateUrl || '',
        published: achievement.published || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        type: 'certification',
        certificateUrl: '',
        published: false
      });
    }
  }, [achievement, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const submitData = {
        ...data,
        date: data.date // Send as string, let backend handle conversion
      };
      
      if (achievement) {
        await apiRequest("PUT", `/api/achievements/${achievement.id}`, submitData);
      } else {
        await apiRequest("POST", "/api/achievements", submitData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      toast({
        title: "Sucesso",
        description: achievement ? "Conquista atualizada com sucesso!" : "Conquista criada com sucesso!",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a conquista. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (achievement) {
        await apiRequest("DELETE", `/api/achievements/${achievement.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      toast({
        title: "Sucesso",
        description: "Conquista excluída com sucesso!",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conquista. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date) {
      toast({
        title: "Erro de Validação",
        description: "Data da conquista é obrigatória.",
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

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      published: checked
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta conquista?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle data-testid="text-achievement-modal-title">
            {achievement ? 'Editar Conquista' : 'Nova Conquista'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-achievement-modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-achievement">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ex: AWS Certified Developer"
                data-testid="input-achievement-title"
              />
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
                placeholder="Descreva a conquista e sua importância..."
                data-testid="textarea-achievement-description"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  data-testid="input-achievement-date"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={handleSelectChange}>
                  <SelectTrigger data-testid="select-achievement-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {achievementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="certificateUrl">URL do Certificado/Comprovante</Label>
              <Input
                id="certificateUrl"
                name="certificateUrl"
                type="url"
                value={formData.certificateUrl}
                onChange={handleChange}
                placeholder="https://exemplo.com/certificado.pdf"
                data-testid="input-achievement-certificate"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={handleSwitchChange}
                data-testid="switch-achievement-published"
              />
              <Label htmlFor="published">Publicado</Label>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={mutation.isPending}
                data-testid="button-save-achievement"
              >
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel-achievement"
              >
                Cancelar
              </Button>
              {achievement && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  data-testid="button-delete-achievement"
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

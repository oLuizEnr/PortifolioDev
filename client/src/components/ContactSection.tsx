import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Instagram, Pencil, Check, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useContent } from "@/hooks/useContent";
import EditableText from "./EditableText";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { updateContent } = useContent();
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [tempContactInfo, setTempContactInfo] = useState<any[]>([]);
  const [tempSocialLinks, setTempSocialLinks] = useState<any[]>([]);
  
  const { data: content } = useQuery({
    queryKey: ['/api/content'],
    staleTime: 0,
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Mensagem Enviada",
        description: "Obrigado pelo contato! Responderei em breve.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Get content data with defaults
  const contentData = content as any;
  
  const defaultContactInfo = [
    {
      icon: "Mail",
      label: "Email",
      value: "luiz.enrique@email.com",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: "Phone",
      label: "Telefone",
      value: "+55 (11) 99999-9999",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: "MapPin",
      label: "Localização",
      value: "Poá, São Paulo - Brasil",
      color: "bg-primary/10 text-primary"
    }
  ];

  const defaultSocialLinks = [
    { icon: "Linkedin", href: "#", label: "LinkedIn" },
    { icon: "Github", href: "#", label: "GitHub" },
    { icon: "Twitter", href: "#", label: "Twitter" },
    { icon: "Instagram", href: "#", label: "Instagram" }
  ];

  const contactInfo = contentData?.contact?.info ? JSON.parse(contentData.contact.info) : defaultContactInfo;
  const socialLinks = contentData?.contact?.social ? JSON.parse(contentData.contact.social) : defaultSocialLinks;
  const contactTitle = contentData?.contact?.title || "Vamos Conversar?";
  const contactSubtitle = contentData?.contact?.subtitle || "Entre em contato para discutir seu próximo projeto ou oportunidade";
  
  const isAdmin = isAuthenticated && (user as any)?.isAdmin;
  
  const getIconComponent = (iconName: string) => {
    const icons = { Mail, Phone, MapPin, Linkedin, Github, Twitter, Instagram };
    return icons[iconName as keyof typeof icons] || Mail;
  };

  const handleSaveContactInfo = async () => {
    try {
      await updateContent({ 
        section: 'contact', 
        field: 'info', 
        content: JSON.stringify(tempContactInfo) 
      });
      setIsEditingContact(false);
    } catch (error) {
      console.error('Erro ao salvar informações de contato:', error);
    }
  };

  const handleSaveSocialLinks = async () => {
    try {
      await updateContent({ 
        section: 'contact', 
        field: 'social', 
        content: JSON.stringify(tempSocialLinks) 
      });
      setIsEditingSocial(false);
    } catch (error) {
      console.error('Erro ao salvar links sociais:', error);
    }
  };

  const updateTempContactInfo = (index: number, field: string, value: string) => {
    const updated = [...tempContactInfo];
    updated[index] = { ...updated[index], [field]: value };
    setTempContactInfo(updated);
  };

  const updateTempSocialLinks = (index: number, field: string, value: string) => {
    const updated = [...tempSocialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setTempSocialLinks(updated);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <EditableText
            content={contactTitle}
            onSave={async (newContent) => {
              await updateContent({ section: 'contact', field: 'title', content: newContent });
            }}
            tag="h2"
            className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4"
            placeholder="Título da seção de contato..."
          />
          <EditableText
            content={contactSubtitle}
            onSave={async (newContent) => {
              await updateContent({ section: 'contact', field: 'subtitle', content: newContent });
            }}
            tag="p"
            className="text-lg text-slate-600 max-w-2xl mx-auto"
            placeholder="Subtítulo da seção de contato..."
            multiline
          />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="relative group">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Entre em Contato</h3>
                {isAdmin && !isEditingContact && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTempContactInfo([...contactInfo]);
                      setIsEditingContact(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {isEditingContact ? (
                <div className="space-y-4">
                  {tempContactInfo.map((info: any, index: number) => (
                    <div key={index} className="p-4 border rounded bg-white space-y-2">
                      <Input
                        placeholder="Label (ex: Email)"
                        value={info.label}
                        onChange={(e) => updateTempContactInfo(index, 'label', e.target.value)}
                      />
                      <Input
                        placeholder="Valor (ex: email@exemplo.com)"
                        value={info.value}
                        onChange={(e) => updateTempContactInfo(index, 'value', e.target.value)}
                      />
                      <Input
                        placeholder="Ícone (ex: Mail, Phone, MapPin)"
                        value={info.icon}
                        onChange={(e) => updateTempContactInfo(index, 'icon', e.target.value)}
                      />
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveContactInfo}>
                      <Check className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingContact(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {contactInfo.map((info: any, index: number) => {
                    const IconComponent = getIconComponent(info.icon);
                    return (
                      <div key={index} className="flex items-center" data-testid={`contact-info-${index}`}>
                        <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center mr-4`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{info.label}</p>
                          <p className="text-slate-600">{info.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="mt-8 relative group">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-800">Redes Sociais</h4>
                {isAdmin && !isEditingSocial && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTempSocialLinks([...socialLinks]);
                      setIsEditingSocial(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {isEditingSocial ? (
                <div className="space-y-4">
                  {tempSocialLinks.map((social: any, index: number) => (
                    <div key={index} className="p-4 border rounded bg-white space-y-2">
                      <Input
                        placeholder="Label (ex: LinkedIn)"
                        value={social.label}
                        onChange={(e) => updateTempSocialLinks(index, 'label', e.target.value)}
                      />
                      <Input
                        placeholder="URL (ex: https://linkedin.com/...)"
                        value={social.href}
                        onChange={(e) => updateTempSocialLinks(index, 'href', e.target.value)}
                      />
                      <Input
                        placeholder="Ícone (ex: Linkedin, Github, Twitter)"
                        value={social.icon}
                        onChange={(e) => updateTempSocialLinks(index, 'icon', e.target.value)}
                      />
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveSocialLinks}>
                      <Check className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingSocial(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  {socialLinks.map((social: any, index: number) => {
                    const IconComponent = getIconComponent(social.icon);
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors"
                        aria-label={social.label}
                        data-testid={`social-link-${index}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          <Card className="bg-slate-50">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Assunto da mensagem"
                    required
                    data-testid="input-subject"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Descreva seu projeto ou oportunidade..."
                    required
                    data-testid="textarea-message"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={contactMutation.isPending}
                  data-testid="button-submit"
                >
                  {contactMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

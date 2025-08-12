import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [user, isLoading, setLocation, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Painel Administrativo</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Projetos</h2>
            <p className="text-slate-600 mb-4">Gerencie seus projetos e portfólio</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
              Gerenciar Projetos
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Experiências</h2>
            <p className="text-slate-600 mb-4">Atualize sua experiência profissional</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
              Gerenciar Experiências
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Conquistas</h2>
            <p className="text-slate-600 mb-4">Adicione certificações e prêmios</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
              Gerenciar Conquistas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

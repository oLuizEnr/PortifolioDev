import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AllComments() {
  const [, setLocation] = useLocation();
  
  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ['/api/contact/comments/all'],
    staleTime: 30000, // 30 seconds
  });

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Data inválida';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0) || 'U';
    const last = lastName?.charAt(0) || 'U';
    return `${first}${last}`.toUpperCase();
  };

  const extractSubject = (content: string) => {
    const match = content.match(/\*\*Assunto:\*\* (.+)/);
    return match ? match[1] : 'Sem assunto';
  };

  const extractMessage = (content: string) => {
    const parts = content.split('\n\n');
    return parts.length > 1 ? parts[1] : content;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">Todos os Comentários</h1>
            <p className="text-slate-600 mt-2">Mensagens enviadas através do formulário de contato</p>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded mb-2 w-1/3"></div>
                        <div className="h-6 bg-slate-200 rounded mb-3 w-2/3"></div>
                        <div className="h-4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Todos os Comentários</h1>
          <p className="text-slate-600 mt-2">
            {comments.length > 0 
              ? `${comments.length} mensagens enviadas através do formulário de contato`
              : 'Nenhuma mensagem encontrada'
            }
          </p>
        </div>

        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                Nenhum comentário ainda
              </h3>
              <p className="text-slate-500 mb-6">
                Quando alguém enviar uma mensagem pelo formulário de contato, ela aparecerá aqui.
              </p>
              <Button 
                onClick={() => setLocation('/#contact')}
                data-testid="button-go-to-contact"
              >
                Ir para Contato
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} data-testid={`comment-card-${comment.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="text-sm bg-primary/10 text-primary">
                        {getInitials(comment.user?.firstName || 'U', comment.user?.lastName || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-slate-800">
                          {comment.user?.firstName || 'Usuário'} {comment.user?.lastName || ''}
                        </h3>
                        <span className="text-sm text-slate-500">
                          {comment.user?.email || 'Sem email'}
                        </span>
                        <span className="text-sm text-slate-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-lg font-medium text-slate-700">
                          {extractSubject(comment.content)}
                        </h4>
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {extractMessage(comment.content)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
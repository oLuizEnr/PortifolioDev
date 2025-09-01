import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

interface ContactCommentsProps {
  limit?: number;
  showHeader?: boolean;
}

export default function ContactComments({ limit = 5, showHeader = true }: ContactCommentsProps) {
  const navigate = useNavigate();
  
  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ['/api/contact/comments', { limit }],
    staleTime: 30000, // 30 seconds
  });

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Data inválida';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
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
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comentários Recentes
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (comments.length === 0) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comentários Recentes
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-slate-500 text-center py-8">
            Nenhum comentário ainda. Seja o primeiro a enviar uma mensagem!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center text-lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comentários Recentes
            </div>
            <span className="text-sm text-slate-500">
              {comments.length} comentário{comments.length !== 1 ? 's' : ''}
            </span>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              data-testid={`contact-comment-${comment.id}`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(comment.user?.firstName || 'U', comment.user?.lastName || 'U')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-slate-800 text-sm">
                    {comment.user?.firstName || 'Usuário'} {comment.user?.lastName || ''}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm font-medium text-slate-700">
                    {extractSubject(comment.content)}
                  </p>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed break-words line-clamp-2">
                  {extractMessage(comment.content)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {comments.length > 0 && (
          <div className="text-center mt-4 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/comments')}
              data-testid="button-view-all-comments"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver todos os comentários
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
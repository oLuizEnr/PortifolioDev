import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  MessageCircle, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Calendar,
  User,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Comment, User as UserType } from "@shared/schema";

interface CommentWithUser extends Comment {
  user: UserType;
  itemTitle: string;
  itemType: string;
  repliesCount: number;
}

export default function AdminComments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: comments = [], isLoading } = useQuery<CommentWithUser[]>({
    queryKey: ["/api/admin/comments"],
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await apiRequest("DELETE", `/api/admin/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments"] });
      toast({
        title: "Sucesso",
        description: "Comentário removido com sucesso!"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o comentário",
        variant: "destructive"
      });
    }
  });

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Data inválida';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-700';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-700';
      case 'experience':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project':
        return 'Projeto';
      case 'achievement':
        return 'Conquista';
      case 'experience':
        return 'Experiência';
      default:
        return type;
    }
  };

  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.itemTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || comment.itemType === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Group comments by date
  const commentsByDate = filteredComments.reduce((acc, comment) => {
    const date = new Date(comment.createdAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(comment);
    return acc;
  }, {} as Record<string, CommentWithUser[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Painel
            </Button>
          </Link>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Gerenciar Comentários
              </h1>
              <p className="text-lg text-slate-600">
                {comments.length} comentário{comments.length !== 1 ? 's' : ''} total
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                {filteredComments.length} exibidos
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por comentário, usuário ou item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-comments"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="filter-type"
              >
                <option value="all">Todos os tipos</option>
                <option value="project">Projetos</option>
                <option value="achievement">Conquistas</option>
                <option value="experience">Experiências</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {filteredComments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Nenhum comentário encontrado
              </h3>
              <p className="text-slate-600">
                {searchTerm || selectedType !== 'all' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Ainda não há comentários no sistema'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(commentsByDate)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dayComments]) => (
                <div key={date}>
                  <div className="flex items-center mb-4">
                    <Calendar className="w-4 h-4 text-slate-500 mr-2" />
                    <h2 className="text-lg font-semibold text-slate-700">
                      {new Date(date || new Date()).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h2>
                    <Badge variant="outline" className="ml-3">
                      {dayComments.length} comentário{dayComments.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {dayComments
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((comment) => (
                        <Card key={comment.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {getInitials(comment.user.firstName + ' ' + comment.user.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="font-semibold text-slate-800">
                                      {comment.user.firstName} {comment.user.lastName}
                                    </h3>
                                    <Badge className={getTypeColor(comment.itemType)}>
                                      {getTypeLabel(comment.itemType)}
                                    </Badge>
                                    {comment.parentId && (
                                      <Badge variant="outline" className="text-xs">
                                        Resposta
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-slate-600 mb-2">
                                    Comentário em: <span className="font-medium">{comment.itemTitle}</span>
                                  </p>
                                  
                                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                                    <div className="flex items-center">
                                      <User className="w-3 h-3 mr-1" />
                                      ID: {comment.user.id.slice(0, 8)}...
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {formatDate(comment.createdAt)}
                                    </div>
                                    {comment.repliesCount > 0 && (
                                      <div className="flex items-center">
                                        <MessageCircle className="w-3 h-3 mr-1" />
                                        {comment.repliesCount} resposta{comment.repliesCount !== 1 ? 's' : ''}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteCommentMutation.mutate(comment.id)}
                                  disabled={deleteCommentMutation.isPending}
                                  data-testid={`delete-comment-${comment.id}`}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <p className="text-slate-700 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                            
                            {comment.parentId && (
                              <div className="mt-3 text-sm text-slate-500">
                                <AlertTriangle className="w-4 h-4 inline mr-1" />
                                Este é um comentário de resposta
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
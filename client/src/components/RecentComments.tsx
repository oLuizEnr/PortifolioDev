import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Comment, User } from "@shared/schema";

interface CommentWithUser extends Comment {
  user: User;
  itemTitle?: string;
}

interface RecentCommentsProps {
  itemType?: string;
  itemId?: string;
  onOpenComments?: (type: string, id: string) => void;
  showAllComments?: boolean;
  title?: string;
  limit?: number;
}

export default function RecentComments({ 
  itemType, 
  itemId, 
  onOpenComments,
  showAllComments = false,
  title = "Comentários Recentes",
  limit = 3
}: RecentCommentsProps) {
  const { data: comments = [], isLoading } = useQuery<CommentWithUser[]>({
    queryKey: showAllComments ? ["/api/admin/comments/recent"] : ["/api/comments", itemType, itemId],
    enabled: showAllComments || (!!itemType && !!itemId),
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
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
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayComments = showAllComments ? comments : comments.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center text-lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            {title}
          </div>
          <span className="text-sm text-slate-500">
            {comments.length} comentário{comments.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayComments.map((comment) => (
            <div 
              key={comment.id} 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              data-testid={`comment-${comment.id}`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(comment.user.firstName + ' ' + comment.user.lastName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-slate-800 text-sm">
                    {comment.user.firstName} {comment.user.lastName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDate(comment.createdAt)}
                  </span>
                  {showAllComments && comment.itemTitle && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {comment.itemTitle}
                    </span>
                  )}
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed break-words">
                  {comment.content}
                </p>
                
                <div className="flex items-center space-x-3 mt-2">
                  <button className="flex items-center space-x-1 text-slate-400 hover:text-red-500 transition-colors">
                    <Heart className="w-3 h-3" />
                    <span className="text-xs">0</span>
                  </button>
                  {comment.parentId === null && (
                    <span className="text-xs text-slate-400">
                      Comentário principal
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!showAllComments && comments.length > limit && onOpenComments && itemType && itemId && (
          <div className="text-center mt-4 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenComments(itemType, itemId)}
              data-testid="button-view-all-comments"
            >
              Ver todos os {comments.length} comentários
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
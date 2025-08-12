import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Heart, MessageCircle, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Comment, User } from "@shared/schema";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: string;
  itemId: string;
}

interface CommentWithUser extends Comment {
  user: User;
  replies: (Comment & { user: User })[];
}

export default function CommentsModal({ isOpen, onClose, itemType, itemId }: CommentsModalProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["/api/comments", itemType, itemId],
    enabled: isOpen && !!itemType && !!itemId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      await apiRequest("POST", "/api/comments", {
        itemType,
        itemId,
        content,
        parentId: parentId || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments", itemType, itemId] });
      setNewComment('');
      setReplyText('');
      setReplyingTo(null);
      toast({
        title: "Sucesso",
        description: "Comentário adicionado com sucesso!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Login Necessário",
          description: "Faça login para comentar.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1500);
        return;
      }
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
        variant: "destructive",
      });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await apiRequest("POST", "/api/likes", {
        itemType: "comment",
        itemId: commentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments", itemType, itemId] });
      queryClient.invalidateQueries({ queryKey: ["/api/likes"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Login Necessário",
          description: "Faça login para curtir comentários.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Erro",
        description: "Não foi possível curtir o comentário.",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Login Necessário",
        description: "Faça login para comentar.",
        variant: "destructive",
      });
      return;
    }

    addCommentMutation.mutate({ content: newComment.trim() });
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Login Necessário",
        description: "Faça login para responder.",
        variant: "destructive",
      });
      return;
    }

    addCommentMutation.mutate({ 
      content: replyText.trim(), 
      parentId 
    });
  };

  const handleLikeComment = (commentId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Necessário",
        description: "Faça login para curtir comentários.",
        variant: "destructive",
      });
      return;
    }
    likeCommentMutation.mutate(commentId);
  };

  const formatDate = (date: string | Date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'agora há pouco';
    } else if (diffHours < 24) {
      return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    } else {
      return commentDate.toLocaleDateString('pt-BR');
    }
  };

  const getUserInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle data-testid="text-comments-title">Comentários</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-comments"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-6" data-testid="comments-list">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded mb-2 w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded mb-1"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center text-slate-500 py-8" data-testid="no-comments">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>Nenhum comentário ainda.</p>
                <p className="text-sm">Seja o primeiro a comentar!</p>
              </div>
            ) : (
              comments.map((comment: CommentWithUser) => (
                <div key={comment.id} className="space-y-3" data-testid={`comment-${comment.id}`}>
                  <div className="flex space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-white text-sm font-medium">
                        {getUserInitials(comment.user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-slate-800" data-testid={`comment-author-${comment.id}`}>
                          {comment.user.firstName && comment.user.lastName
                            ? `${comment.user.firstName} ${comment.user.lastName}`
                            : comment.user.email
                          }
                        </span>
                        <span className="text-sm text-slate-500" data-testid={`comment-date-${comment.id}`}>
                          {formatDate(comment.createdAt!)}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-2" data-testid={`comment-content-${comment.id}`}>
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.id)}
                          className="text-slate-400 hover:text-red-500 p-0 h-auto"
                          data-testid={`button-like-comment-${comment.id}`}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="text-slate-400 hover:text-primary p-0 h-auto"
                          data-testid={`button-reply-comment-${comment.id}`}
                        >
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="ml-13">
                      <form 
                        onSubmit={(e) => handleSubmitReply(e, comment.id)}
                        className="flex space-x-2"
                        data-testid={`form-reply-${comment.id}`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-slate-300 text-slate-600 text-sm">
                            {user ? getUserInitials(user) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Escreva uma resposta..."
                            rows={2}
                            className="resize-none"
                            data-testid={`textarea-reply-${comment.id}`}
                          />
                          <div className="flex justify-end mt-2 space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              data-testid={`button-cancel-reply-${comment.id}`}
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="submit"
                              size="sm"
                              disabled={!replyText.trim() || addCommentMutation.isPending}
                              data-testid={`button-submit-reply-${comment.id}`}
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Responder
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-13 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3" data-testid={`reply-${reply.id}`}>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-white text-xs font-medium">
                              {getUserInitials(reply.user)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-slate-800 text-sm">
                                {reply.user.firstName && reply.user.lastName
                                  ? `${reply.user.firstName} ${reply.user.lastName}`
                                  : reply.user.email
                                }
                              </span>
                              <span className="text-xs text-slate-500">
                                {formatDate(reply.createdAt!)}
                              </span>
                            </div>
                            <p className="text-slate-600 text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Add Comment Form */}
          <div className="border-t pt-4">
            <form onSubmit={handleSubmitComment} data-testid="form-new-comment">
              <div className="flex space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-slate-300 text-slate-600 text-sm">
                    {user ? getUserInitials(user) : <MessageCircle className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isAuthenticated ? "Adicione um comentário..." : "Faça login para comentar..."}
                    rows={3}
                    className="resize-none"
                    disabled={!isAuthenticated}
                    data-testid="textarea-new-comment"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      disabled={!newComment.trim() || addCommentMutation.isPending || !isAuthenticated}
                      data-testid="button-submit-comment"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      {addCommentMutation.isPending ? "Enviando..." : "Comentar"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

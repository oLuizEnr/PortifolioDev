import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Hook para gerenciar conteúdo editável
export function useContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateContentMutation = useMutation({
    mutationFn: async (data: { section: string; field: string; content: string }) => {
      return await apiRequest("POST", "/api/content", data);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Conteúdo atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar conteúdo",
        variant: "destructive",
      });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: async (data: { section: string; field: string; imageUrl: string }) => {
      return await apiRequest("POST", "/api/content/image", data);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Imagem atualizada com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar imagem",
        variant: "destructive",
      });
    },
  });

  return {
    updateContent: updateContentMutation.mutateAsync,
    updateImage: updateImageMutation.mutateAsync,
    isUpdating: updateContentMutation.isPending || updateImageMutation.isPending,
  };
}
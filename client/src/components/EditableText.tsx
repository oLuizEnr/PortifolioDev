import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  content: string;
  onSave: (newContent: string) => Promise<void>;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  multiline?: boolean;
  placeholder?: string;
}

export default function EditableText({
  content,
  onSave,
  className = "",
  tag = "p",
  multiline = false,
  placeholder = "Digite seu texto..."
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(tempContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setTempContent(content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempContent(content);
    setIsEditing(false);
  };

  const isAdmin = isAuthenticated && (user as any)?.isAdmin;

  if (!isAdmin) {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return <Tag className={className}>{content}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <Textarea
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            className={cn("min-h-[100px] resize-none", className)}
            placeholder={placeholder}
            disabled={isLoading}
          />
        ) : (
          <Input
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            className={className}
            placeholder={placeholder}
            disabled={isLoading}
          />
        )}
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading || tempContent.trim() === ""}
          >
            <Check className="w-3 h-3 mr-1" />
            Salvar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="w-3 h-3 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  const Tag = tag as keyof JSX.IntrinsicElements;
  return (
    <div className="relative group">
      <Tag className={cn(className, "relative pr-8")}>
        {content}
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="w-3 h-3" />
        </Button>
      </Tag>
    </div>
  );
}
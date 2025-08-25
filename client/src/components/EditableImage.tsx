import { useState, useRef } from "react";
import { Pencil, Upload, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (newImageUrl: string) => Promise<void>;
  className?: string;
  aspectRatio?: "square" | "landscape" | "portrait";
}

export default function EditableImage({
  src,
  alt,
  onSave,
  className = "",
  aspectRatio = "square"
}: EditableImageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(src);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated } = useAuth();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (uploadedFile) {
        // Here you would upload the file and get the URL
        // For now, we'll use a placeholder URL
        const formData = new FormData();
        formData.append('image', uploadedFile);
        // await uploadImage(formData);
        await onSave(tempUrl);
      } else {
        await onSave(tempUrl);
      }
      setIsEditing(false);
      setUploadedFile(null);
    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
      setTempUrl(src);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempUrl(src);
    setIsEditing(false);
    setUploadedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setTempUrl(url);
    }
  };

  const isAdmin = isAuthenticated && (user as any)?.isAdmin;

  const aspectClasses = {
    square: "aspect-square",
    landscape: "aspect-video", 
    portrait: "aspect-[3/4]"
  };

  if (!isAdmin) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(className, aspectClasses[aspectRatio])}
        loading="lazy"
      />
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <img
            src={tempUrl}
            alt={alt}
            className={cn(className, aspectClasses[aspectRatio], "opacity-75")}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Trocar Imagem
            </Button>
          </div>
        </div>
        
        <Input
          type="url"
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
          placeholder="Cole a URL da imagem aqui..."
          disabled={isLoading}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading || tempUrl.trim() === ""}
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

  return (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        className={cn(className, aspectClasses[aspectRatio])}
        loading="lazy"
      />
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="w-3 h-3" />
      </Button>
    </div>
  );
}
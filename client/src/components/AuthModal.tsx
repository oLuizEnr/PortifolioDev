import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Info } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Replit Auth
    window.location.href = "/api/login";
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle data-testid="text-auth-modal-title">
            {isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-auth-modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Admin Login Info */}
          <Alert className="bg-yellow-50 border-yellow-200">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Login de Teste (Administrador):</strong><br />
              Use sua conta do Replit para fazer login. 
              O primeiro usuário será automaticamente definido como administrador.
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-auth">
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
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                data-testid="input-password"
              />
            </div>
            
            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  data-testid="input-confirm-password"
                />
              </div>
            )}
            
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                    data-testid="checkbox-remember"
                  />
                  <span className="text-sm text-slate-600">Lembrar de mim</span>
                </label>
                <Button 
                  variant="link" 
                  className="text-sm p-0 h-auto"
                  type="button"
                  data-testid="button-forgot-password"
                >
                  Esqueci a senha
                </Button>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              data-testid="button-auth-submit"
            >
              {isLogin ? 'Entrar com Replit' : 'Cadastrar com Replit'}
            </Button>
          </form>
          
          <div className="text-center">
            <span className="text-sm text-slate-600">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            </span>
            <Button 
              variant="link" 
              className="text-sm p-0 h-auto font-medium"
              onClick={toggleMode}
              type="button"
              data-testid="button-toggle-auth-mode"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </Button>
          </div>
          
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-slate-500">
              A autenticação é feita através do Replit para maior segurança.
              Seus dados estão protegidos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

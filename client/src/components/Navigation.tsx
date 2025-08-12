import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  onLogin?: () => void;
  onToggleAdmin?: () => void;
  showAdmin?: boolean;
}

export default function Navigation({ onLogin, onToggleAdmin, showAdmin }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-800" data-testid="text-logo">
              Luiz Enrique
            </h1>
            <span className="ml-2 text-sm text-slate-500">
              Desenvolvedor Full Stack
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-slate-700 hover:text-primary transition-colors"
              data-testid="link-home"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-slate-700 hover:text-primary transition-colors"
              data-testid="link-about"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-slate-700 hover:text-primary transition-colors"
              data-testid="link-projects"
            >
              Projetos
            </button>
            <button 
              onClick={() => scrollToSection('experience')}
              className="text-slate-700 hover:text-primary transition-colors"
              data-testid="link-experience"
            >
              Experiência
            </button>
            <button 
              onClick={() => scrollToSection('achievements')}
              className="text-slate-700 hover:text-primary transition-colors"
              data-testid="link-achievements"
            >
              Conquistas
            </button>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost"
                  onClick={onLogin}
                  data-testid="button-login"
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-signup"
                >
                  Cadastrar
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {showAdmin && user?.isAdmin && (
                  <Button
                    variant="ghost"
                    onClick={onToggleAdmin}
                    data-testid="button-admin"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-3 space-y-3">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-slate-700 hover:text-primary transition-colors"
              data-testid="mobile-link-home"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-slate-700 hover:text-primary transition-colors"
              data-testid="mobile-link-about"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left text-slate-700 hover:text-primary transition-colors"
              data-testid="mobile-link-projects"
            >
              Projetos
            </button>
            <button 
              onClick={() => scrollToSection('experience')}
              className="block w-full text-left text-slate-700 hover:text-primary transition-colors"
              data-testid="mobile-link-experience"
            >
              Experiência
            </button>
            <button 
              onClick={() => scrollToSection('achievements')}
              className="block w-full text-left text-slate-700 hover:text-primary transition-colors"
              data-testid="mobile-link-achievements"
            >
              Conquistas
            </button>
            
            <div className="border-t border-slate-200 pt-3 mt-3">
              {!isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start mb-2"
                    onClick={() => {
                      onLogin?.();
                      setIsMobileMenuOpen(false);
                    }}
                    data-testid="mobile-button-login"
                  >
                    Entrar
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => window.location.href = "/api/login"}
                    data-testid="mobile-button-signup"
                  >
                    Cadastrar
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  {user?.isAdmin && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        onToggleAdmin?.();
                        setIsMobileMenuOpen(false);
                      }}
                      data-testid="mobile-button-admin"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleLogout}
                    data-testid="mobile-button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

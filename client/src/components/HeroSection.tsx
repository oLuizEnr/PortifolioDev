import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Download } from "lucide-react";

export default function HeroSection() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadCV = () => {
    // In a real application, this would download the actual CV
    alert("Funcionalidade de download do CV será implementada em breve!");
  };

  return (
    <section id="home" className="bg-gradient-to-br from-primary/5 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                <MapPin className="w-3 h-3 mr-1" />
                Poá, SP
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 mb-6" data-testid="text-hero-title">
              Olá, eu sou{" "}
              <span className="text-primary">Luiz Enrique</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed" data-testid="text-hero-description">
              Desenvolvedor Full Stack apaixonado por criar soluções digitais inovadoras. 
              Especializado em React, Node.js e tecnologias modernas de desenvolvimento web.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToProjects}
                size="lg"
                data-testid="button-view-projects"
              >
                Ver Projetos
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={downloadCV}
                data-testid="button-download-cv"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-6 mt-8">
              <a 
                href="#" 
                className="text-slate-500 hover:text-primary transition-colors text-xl"
                data-testid="link-linkedin"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a 
                href="#" 
                className="text-slate-500 hover:text-primary transition-colors text-xl"
                data-testid="link-github"
              >
                <i className="fab fa-github"></i>
              </a>
              <a 
                href="#" 
                className="text-slate-500 hover:text-primary transition-colors text-xl"
                data-testid="link-email"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500" 
              alt="Luiz Enrique - Desenvolvedor Full Stack" 
              className="w-80 h-80 rounded-2xl shadow-2xl object-cover"
              data-testid="img-profile"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigationLinks = [
    { label: "Início", id: "home" },
    { label: "Sobre", id: "about" },
    { label: "Projetos", id: "projects" },
    { label: "Experiência", id: "experience" },
    { label: "Conquistas", id: "achievements" }
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/luiz-enrique-487b06300/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/oLuizEnr", label: "GitHub" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4" data-testid="text-footer-title">
              Luiz Enrique
            </h3>
            <p className="text-slate-300 mb-6 max-w-md" data-testid="text-footer-description">
              Desenvolvedor Full Stack apaixonado por criar soluções digitais inovadoras 
              que fazem a diferença na vida das pessoas.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.label}
                  data-testid={`footer-social-${index}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-slate-300 hover:text-white transition-colors"
                    data-testid={`footer-nav-${index}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-slate-300">
              <li data-testid="footer-location">Poá, São Paulo</li>
              <li data-testid="footer-email">luiz.enrique@email.com</li>
              <li data-testid="footer-phone">+55 (11) 99999-9999</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-300 text-sm" data-testid="text-copyright">
            © {currentYear} Luiz Enrique. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm" data-testid="link-privacy">
              Política de Privacidade
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm" data-testid="link-terms">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import EditableText from "./EditableText";
import { useContent } from "@/hooks/useContent";

export default function AboutSection() {
  const { data: content } = useQuery({
    queryKey: ['/api/content'],
    staleTime: 0,
  });
  const { updateContent } = useContent();

  // Editable content with defaults
  const aboutTitle = content?.about?.title || "Sobre Mim";
  const aboutSubtitle = content?.about?.subtitle || "Conheça mais sobre minha jornada e paixão pelo desenvolvimento";
  const aboutDescription1 = content?.about?.description1 || "Sou um desenvolvedor full stack com mais de 5 anos de experiência criando aplicações web modernas e escaláveis. Minha paixão está em transformar ideias complexas em soluções digitais elegantes e funcionais.";
  const aboutDescription2 = content?.about?.description2 || "Baseado em Poá, SP, trabalho com as mais recentes tecnologias do mercado, sempre focando na experiência do usuário e na qualidade do código. Acredito que a tecnologia deve simplificar a vida das pessoas.";

  const stats = [
    { value: "5+", label: "Anos de Experiência", color: "bg-primary/5 text-primary" },
    { value: "50+", label: "Projetos Concluídos", color: "bg-emerald-50 text-emerald-600" },
    { value: "30+", label: "Clientes Satisfeitos", color: "bg-amber-50 text-amber-600" },
    { value: "10+", label: "Certificações", color: "bg-purple-50 text-purple-600" },
  ];

  const technologies = [
    { name: "JavaScript/TypeScript", icon: "fab fa-js-square", color: "text-yellow-500" },
    { name: "React/Next.js", icon: "fab fa-react", color: "text-blue-500" },
    { name: "Node.js", icon: "fab fa-node-js", color: "text-green-500" },
    { name: "PostgreSQL/MongoDB", icon: "fas fa-database", color: "text-blue-600" },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <EditableText
            content={aboutTitle}
            onSave={async (newContent) => {
              await updateContent({ section: 'about', field: 'title', content: newContent });
            }}
            tag="h2"
            className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4"
            placeholder="Título da seção sobre..."
          />
          <EditableText
            content={aboutSubtitle}
            onSave={async (newContent) => {
              await updateContent({ section: 'about', field: 'subtitle', content: newContent });
            }}
            tag="p"
            className="text-lg text-slate-600 max-w-2xl mx-auto"
            placeholder="Subtítulo da seção sobre..."
          />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <EditableText
              content={aboutDescription1}
              onSave={async (newContent) => {
                await updateContent({ section: 'about', field: 'description1', content: newContent });
              }}
              tag="p"
              className="text-lg text-slate-700 mb-6 leading-relaxed"
              multiline
              placeholder="Primeiro parágrafo sobre você..."
            />
            <EditableText
              content={aboutDescription2}
              onSave={async (newContent) => {
                await updateContent({ section: 'about', field: 'description2', content: newContent });
              }}
              tag="p"
              className="text-lg text-slate-700 mb-8 leading-relaxed"
              multiline
              placeholder="Segundo parágrafo sobre você..."
            />
            
            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Principais Tecnologias
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {technologies.map((tech, index) => (
                  <div key={index} className="flex items-center" data-testid={`skill-${index}`}>
                    <i className={`${tech.icon} ${tech.color} text-xl mr-3`}></i>
                    <span className="text-slate-700">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`${stat.color} p-6 rounded-xl text-center`}
                data-testid={`stat-${index}`}
              >
                <div className="text-3xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

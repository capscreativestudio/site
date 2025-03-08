import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Play, Pause, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Types pour les projets - exporté pour être utilisé dans ProjectDetail
export type Project = {
  id: number;
  title: string;
  category: 'film' | 'clip' | 'pub';
  thumbnail: string;
  videoUrl: string;
  client: string;
  software: string[];
  duration: string;
  makingOfUrl?: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
  breakdown?: {
    plates: string[];
    description: string;
  };
};

// Données des projets - exportées pour être accessibles dans ProjectDetail
export const projects: Project[] = [
  {
    id: 1,
    title: "Rammstein - Deutschland",
    category: 'clip',
    thumbnail: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
    videoUrl: "https://vimeo.com/123456789",
    client: "Universal Music",
    software: ["Nuke", "Maya", "Houdini"],
    duration: "3 mois",
    makingOfUrl: "https://vimeo.com/123456790",
    beforeAfter: {
      before: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      after: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
    },
    breakdown: {
      plates: [
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
      ],
      description: "Intégration d'éléments CGI, clean-up et color grading"
    }
  },
  {
    id: 2,
    title: "Louis Vuitton x BTS",
    category: 'pub',
    thumbnail: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
    videoUrl: "https://vimeo.com/123456791",
    client: "Louis Vuitton",
    software: ["Nuke", "Flame"],
    duration: "2 semaines",
    beforeAfter: {
      before: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      after: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
    }
  },
  {
    id: 3,
    title: "Dune: Part Two",
    category: 'film',
    thumbnail: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2",
    videoUrl: "https://vimeo.com/123456792",
    client: "Legendary Pictures",
    software: ["Nuke", "Houdini", "Maya"],
    duration: "8 mois",
    beforeAfter: {
      before: "https://images.unsplash.com/photo-1450133064473-71024230f91b",
      after: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a"
    },
    breakdown: {
      plates: [
        "https://images.unsplash.com/photo-1506157786151-b8491531f063",
        "https://images.unsplash.com/photo-1502085026254-61eed13b5a40",
        "https://images.unsplash.com/photo-1536697246787-1f7ae568d89a"
      ],
      description: "Création d'une extension de désert et simulations de tempêtes de sable"
    }
  }
];

export function Portfolio() {
  // États
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBreakdownIndex, setCurrentBreakdownIndex] = useState(0);
  
  // Refs
  const playerRef = useRef<ReactPlayer>(null);
  const beforeAfterRef = useRef<HTMLDivElement>(null);
  const [beforeAfterPosition, setBeforeAfterPosition] = useState(50);
  
  // Navigation
  const navigate = useNavigate();

  // Filtrer les projets selon la catégorie
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  // Effet pour gérer le slider avant/après
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!beforeAfterRef.current) return;
      const rect = beforeAfterRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setBeforeAfterPosition(Math.min(Math.max(x, 0), 100));
    };

    if (selectedProject?.beforeAfter) {
      beforeAfterRef.current?.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      beforeAfterRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [selectedProject]);

  // Gestion des contrôles du lecteur et du carrousel
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextBreakdownPlate = () => {
    if (!selectedProject?.breakdown) return;
    setCurrentBreakdownIndex((prev) => 
      prev === selectedProject.breakdown!.plates.length - 1 ? 0 : prev + 1
    );
  };

  const prevBreakdownPlate = () => {
    if (!selectedProject?.breakdown) return;
    setCurrentBreakdownIndex((prev) => 
      prev === 0 ? selectedProject.breakdown!.plates.length - 1 : prev - 1
    );
  };

  // Gestionnaire de clic sur un projet
  const handleProjectClick = (project: Project) => {
    // Nouvelle navigation vers la page de détail
    navigate(`/project/${project.id}`);
    
    // On conserve aussi le modal pour les environnements sans routage
    // ou pour une compatibilité arrière
    setSelectedProject(project);
  };

  return (
    <section id="portfolio" className="py-20 bg-background relative">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='%23282828' d='M0 0h60v60H0z'/%3E%3Cpath d='M60 0v60m-59-50v50m-1-60h60m-50 59h50m-60-10h60m-60-10h60m-60-10h60m-60-10h60m-60-10h60m-50-1v60m-10-59v59m-10-59v59m-10-59v59m-10-59v59' stroke='%23333' opacity='.1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      <div className="container relative z-10">
        <motion.h2 
          className="text-4xl md:text-5xl font-heading mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Portfolio
        </motion.h2>

        {/* Filtres de catégories améliorés */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['all', 'film', 'clip', 'pub'].map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-accent text-white font-medium scale-105' 
                  : 'bg-surface text-gray-400 hover:text-white hover:bg-surface/80'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <span className="relative">
                {category === 'all' ? 'Tous' : 
                 category === 'film' ? 'Films' :
                 category === 'clip' ? 'Clips' : 'Publicités'}
                {selectedCategory === category && (
                  <motion.span
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Grille de projets améliorée */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="group relative cursor-pointer rounded-lg overflow-hidden"
              onClick={() => handleProjectClick(project)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={project.thumbnail} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                
                {/* Étiquette de catégorie */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent/80 text-white text-xs uppercase tracking-wider rounded-full">
                    {project.category === 'film' ? 'Film' : 
                     project.category === 'clip' ? 'Clip' : 'Pub'}
                  </span>
                </div>
                
                {/* Overlay avec bouton play */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
                
                {/* Informations sur le projet */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-heading group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{project.client}</p>
                  
                  {/* Tags des logiciels utilisés */}
                  <div className="flex flex-wrap gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.software.map((sw, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-background/80 rounded-full">
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal pour afficher les détails du projet (à conserver pour la compatibilité) */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-lg max-w-6xl w-full">
              <div className="relative">
                <div className="aspect-video">
                  <ReactPlayer
                    ref={playerRef}
                    url={selectedProject.videoUrl}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    controls={false}
                  />
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="w-12 h-12 rounded-full bg-accent flex items-center justify-center"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-3xl font-heading mb-6">{selectedProject.title}</h3>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xl font-heading mb-4">Détails du projet</h4>
                    <div className="space-y-2">
                      <p><span className="text-gray-400">Client:</span> {selectedProject.client}</p>
                      <p><span className="text-gray-400">Logiciels:</span> {selectedProject.software.join(', ')}</p>
                      <p><span className="text-gray-400">Durée:</span> {selectedProject.duration}</p>
                    </div>
                  </div>
                  
                  {selectedProject.makingOfUrl && (
                    <div>
                      <h4 className="text-xl font-heading mb-4">Making-of</h4>
                      <a 
                        href={selectedProject.makingOfUrl}
                        className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir le processus de création →
                      </a>
                    </div>
                  )}
                </div>

                {selectedProject.beforeAfter && (
                  <div className="mb-8">
                    <h4 className="text-xl font-heading mb-4">Avant / Après</h4>
                    <div 
                      ref={beforeAfterRef}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-ew-resize"
                    >
                      <img 
                        src={selectedProject.beforeAfter.after} 
                        alt="Après"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div 
                        className="absolute inset-y-0 left-0 overflow-hidden"
                        style={{ width: `${beforeAfterPosition}%` }}
                      >
                        <img 
                          src={selectedProject.beforeAfter.before} 
                          alt="Avant"
                          className="absolute inset-0 w-[100vw] h-full object-cover"
                        />
                      </div>
                      <div 
                        className="absolute inset-y-0 w-1 bg-accent"
                        style={{ left: `${beforeAfterPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                          <ChevronLeft className="w-4 h-4" />
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProject.breakdown && (
                  <div>
                    <h4 className="text-xl font-heading mb-4">Breakdown</h4>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={selectedProject.breakdown.plates[currentBreakdownIndex]}
                        alt={`Plate ${currentBreakdownIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={prevBreakdownPlate}
                            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <p className="text-sm bg-black/50 px-4 py-2 rounded-full">
                            {currentBreakdownIndex + 1} / {selectedProject.breakdown.plates.length}
                          </p>
                          <button
                            onClick={nextBreakdownPlate}
                            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </div>
                        <p className="mt-4 text-center bg-black/50 p-4 rounded-lg">
                          {selectedProject.breakdown.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface flex items-center justify-center"
                onClick={() => setSelectedProject(null)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

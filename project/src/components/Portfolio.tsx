import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Play, Pause, X, ChevronLeft, ChevronRight } from 'lucide-react';

type Project = {
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

const projects: Project[] = [
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
  }
];

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBreakdownIndex, setCurrentBreakdownIndex] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const beforeAfterRef = useRef<HTMLDivElement>(null);
  const [beforeAfterPosition, setBeforeAfterPosition] = useState(50);

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

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

  return (
    <section id="portfolio" className="py-20">
      <div className="container">
        <motion.h2 
          className="text-4xl md:text-5xl font-heading mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Portfolio
        </motion.h2>

        <div className="flex justify-center gap-4 mb-12">
          {['all', 'film', 'clip', 'pub'].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category 
                  ? 'bg-accent text-white' 
                  : 'bg-surface text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="group relative cursor-pointer"
              onClick={() => setSelectedProject(project)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img 
                  src={project.thumbnail} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-heading">{project.title}</h3>
              <p className="text-gray-400">{project.client}</p>
            </motion.div>
          ))}
        </div>

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
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowLeft, Share2, Download, Tag, ChevronDown, ChevronUp, Info, Sparkles, Layers, Film } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, projects } from './Portfolio'; // Importation des types et données depuis Portfolio

export function ProjectDetail() {
  // Router hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get project data based on ID
  const project = projects.find(p => p.id === Number(id));
  
  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [currentBreakdownIndex, setCurrentBreakdownIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [beforeAfterPosition, setBeforeAfterPosition] = useState(50);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const beforeAfterRef = useRef<HTMLDivElement>(null);
  
  // Return to home if project not found
  useEffect(() => {
    if (!project) {
      navigate('/');
    }
  }, [project, navigate]);
  
  // Guard clause
  if (!project) {
    return <div className="h-screen flex items-center justify-center">Projet non trouvé</div>;
  }
  
  // Handle before-after slider
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!beforeAfterRef.current) return;
      const touch = e.touches[0];
      const rect = beforeAfterRef.current.getBoundingClientRect();
      const position = ((touch.clientX - rect.left) / rect.width) * 100;
      setBeforeAfterPosition(Math.min(Math.max(position, 0), 100));
    };
    
    if (activeSection === 'beforeAfter' && beforeAfterRef.current && project.beforeAfter) {
      beforeAfterRef.current.addEventListener('touchmove', handleTouchMove);
    }
    
    return () => {
      if (beforeAfterRef.current) {
        beforeAfterRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [activeSection, project.beforeAfter]);
  
  // Handle video playback
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
  };
  
  // Next/previous slide handlers
  const nextBreakdownPlate = () => {
    if (!project.breakdown) return;
    setCurrentBreakdownIndex((prev) => 
      prev === project.breakdown!.plates.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevBreakdownPlate = () => {
    if (!project.breakdown) return;
    setCurrentBreakdownIndex((prev) => 
      prev === 0 ? project.breakdown!.plates.length - 1 : prev - 1
    );
  };
  
  // Share project handler
  const shareProject = () => {
    navigator.clipboard.writeText(window.location.href).catch(err => {
      console.error('Failed to copy URL:', err);
    });
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col relative overflow-hidden pt-16">
      {/* Floating back button */}
      <div className="absolute top-20 left-4 z-20">
        <button 
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      
      {/* Header video/image section */}
      <div className="relative h-80 w-full overflow-hidden">
        <video 
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          src={project.videoUrl}
          poster={project.thumbnail}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          loop
          muted
        />
        
        {/* Video overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        
        {/* Play/Pause button */}
        <button 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        
        {/* Project info */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="px-2 py-1 bg-accent rounded-full text-xs font-medium mb-2 inline-block">
            {project.category === 'film' ? 'Film' : 
             project.category === 'clip' ? 'Clip' : 'Publicité'}
          </span>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-sm text-gray-300">{project.client} • {project.duration}</p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">Logiciels:</span> 
          <span className="text-sm text-gray-300">{project.software.join(', ')}</span>
        </div>
        
        <div className="flex space-x-4">
          <button 
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"
            onClick={shareProject}
          >
            <Share2 size={16} />
          </button>
          {project.makingOfUrl && (
            <a 
              href={project.makingOfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"
            >
              <Download size={16} />
            </a>
          )}
        </div>
        
        {/* Share tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div 
              className="absolute right-4 top-16 bg-accent text-white px-3 py-1 rounded text-sm"
              variants={tooltipVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              Lien copié!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Tab navigation */}
      <div className="px-4 py-2 flex space-x-1 border-b border-gray-800 overflow-x-auto">
        <button
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
            activeSection === 'overview' 
              ? 'bg-accent text-white' 
              : 'bg-gray-800 text-gray-300'
          }`}
          onClick={() => setActiveSection('overview')}
        >
          <Info size={14} className="inline mr-1" />
          Aperçu
        </button>
        
        {project.breakdown && (
          <button
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeSection === 'breakdown' 
                ? 'bg-accent text-white' 
                : 'bg-gray-800 text-gray-300'
            }`}
            onClick={() => setActiveSection('breakdown')}
          >
            <Layers size={14} className="inline mr-1" />
            Breakdown
          </button>
        )}
        
        {project.beforeAfter && (
          <button
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeSection === 'beforeAfter' 
                ? 'bg-accent text-white' 
                : 'bg-gray-800 text-gray-300'
            }`}
            onClick={() => setActiveSection('beforeAfter')}
          >
            <Sparkles size={14} className="inline mr-1" />
            Avant/Après
          </button>
        )}
      </div>
      
      {/* Content sections */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Overview section */}
          {activeSection === 'overview' && (
            <motion.div 
              key="overview"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-4"
            >
              <div className="p-4 bg-gray-900 rounded-lg mb-4">
                <h2 className="text-lg font-medium mb-2">Résumé du projet</h2>
                <p className="text-gray-300 text-sm">
                  {project.category === 'clip' ? 
                    `Direction artistique et supervision VFX du clip ${project.title}, impliquant des effets spéciaux avancés, l'intégration d'éléments CG et un traitement visuel unique.` :
                   project.category === 'pub' ?
                    `Campagne publicitaire pour ${project.client}, utilisant des techniques de compositing avancées et un grade spécifique pour créer une atmosphère luxueuse et distinctive.` :
                    `Travail d'effets visuels sur le film ${project.title}, incluant l'intégration d'éléments CGI, les extensions de décors et le color grading final.`
                  }
                </p>
              </div>
              
              <div className="p-4 bg-gray-900 rounded-lg mb-4">
                <div className="flex justify-between items-center" onClick={() => setExpandedInfo(!expandedInfo)}>
                  <h2 className="text-lg font-medium">Informations techniques</h2>
                  {expandedInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                
                {expandedInfo && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3"
                  >
                    <div className="flex flex-col space-y-3">
                      <div>
                        <h3 className="text-sm text-gray-400">Outils utilisés</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {project.software.map((tool) => (
                            <span key={tool} className="px-2 py-1 bg-gray-800 rounded-full text-xs">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-400">Durée du projet</h3>
                        <p className="text-sm">{project.duration}</p>
                      </div>
                      {project.makingOfUrl && (
                        <div>
                          <h3 className="text-sm text-gray-400">Documentation</h3>
                          <a 
                            href={project.makingOfUrl}
                            className="text-accent hover:underline text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Voir le making-of
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="p-4 bg-gray-900 rounded-lg mb-4">
                <h2 className="text-lg font-medium mb-2">Résultats</h2>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mr-2 mt-0.5">
                      <Film size={14} className="text-accent" />
                    </div>
                    Livraison dans les délais avec un haut niveau de qualité
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mr-2 mt-0.5">
                      <Film size={14} className="text-accent" />
                    </div>
                    Client satisfait, conduisant à de nouvelles collaborations
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mr-2 mt-0.5">
                      <Film size={14} className="text-accent" />
                    </div>
                    Optimisation du pipeline pour les projets futurs
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
          
          {/* Breakdown section */}
          {activeSection === 'breakdown' && project.breakdown && (
            <motion.div 
              key="breakdown"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-4"
            >
              <div className="relative w-full rounded-lg overflow-hidden mb-4">
                {/* Breakdown slider */}
                <div className="aspect-video bg-gray-900 relative overflow-hidden">
                  <img 
                    src={project.breakdown.plates[currentBreakdownIndex]}
                    alt={`Étape ${currentBreakdownIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation dots */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {project.breakdown.plates.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentBreakdownIndex ? 'bg-accent' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentBreakdownIndex(index)}
                      />
                    ))}
                  </div>
                  
                  {/* Navigation arrows */}
                  <button 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                    onClick={prevBreakdownPlate}
                  >
                    <ChevronDown className="transform rotate-90" size={20} />
                  </button>
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                    onClick={nextBreakdownPlate}
                  >
                    <ChevronDown className="transform -rotate-90" size={20} />
                  </button>
                </div>
                
                {/* Slide info */}
                <div className="p-4 bg-gray-900 rounded-lg">
                  <h3 className="font-medium text-lg">
                    Étape {currentBreakdownIndex + 1}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {currentBreakdownIndex === 0 
                      ? "Plaque originale non retouchée" 
                      : currentBreakdownIndex === 1 
                        ? "Intégration des éléments 3D" 
                        : "Finalisation avec color grading"}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-900 rounded-lg">
                <h3 className="font-medium mb-2">Processus de création</h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Prévisualisation</h4>
                      <p className="text-sm text-gray-300">Modélisation 3D préliminaire et tests d'intégration</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-accent/70 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Production</h4>
                      <p className="text-sm text-gray-300">Création des éléments visuels et simulations</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Compositing</h4>
                      <p className="text-sm text-gray-300">{project.breakdown.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Before/After section */}
          {activeSection === 'beforeAfter' && project.beforeAfter && (
            <motion.div 
              key="beforeAfter"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-4"
            >
              <div 
                ref={beforeAfterRef}
                className="relative aspect-video rounded-lg overflow-hidden mb-4 touch-none"
              >
                {/* After image (background) */}
                <img 
                  src={project.beforeAfter.after} 
                  alt="Après"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Before image (revealed portion) */}
                <div 
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${beforeAfterPosition}%` }}
                >
                  <img 
                    src={project.beforeAfter.before} 
                    alt="Avant"
                    className="absolute inset-0 w-[100vw] max-w-none h-full object-cover"
                  />
                </div>
                
                {/* Divider */}
                <div 
                  className="absolute inset-y-0 w-1 bg-accent"
                  style={{ left: `${beforeAfterPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <ChevronDown className="rotate-90" size={18} />
                    <ChevronDown className="-rotate-90" size={18} />
                  </div>
                </div>
                
                {/* Labels */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs">
                  Avant
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs">
                  Après
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-400 mb-4">
                Glissez pour comparer l'avant et l'après
              </div>
              
              <div className="p-4 bg-gray-900 rounded-lg">
                <h3 className="font-medium mb-2">Détails des effets</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Tag size={16} className="mr-2 text-accent flex-shrink-0 mt-0.5" />
                    <span>Clean-up et suppression d'éléments</span>
                  </li>
                  <li className="flex items-start">
                    <Tag size={16} className="mr-2 text-accent flex-shrink-0 mt-0.5" />
                    <span>Intégration d'éléments CGI</span>
                  </li>
                  <li className="flex items-start">
                    <Tag size={16} className="mr-2 text-accent flex-shrink-0 mt-0.5" />
                    <span>Correction de couleur et look final</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Fixed action button */}
      <div className="fixed bottom-6 right-6">
        <button 
          className="w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/20 flex items-center justify-center"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </div>
  );
}

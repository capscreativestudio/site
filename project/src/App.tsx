import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Logo } from './components/Logo';
import { Hero } from './components/Hero';
import { Expertise } from './components/Expertise';
import { Portfolio } from './components/Portfolio';
import { Timeline } from './components/Timeline';
import { Contact } from './components/Contact';
import { ProjectDetail } from './components/ProjectDetail';

// Enregistrer les plugins GSAP
gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();
  
  // Effet pour forcer le mode sombre
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Effet pour scroll vers le haut lors des changements de routes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header fixe avec le logo qui apparaît sur toutes les pages */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container py-4">
          <Logo />
        </div>
      </header>
      
      {/* Contenu principal avec les routes */}
      <main>
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route 
            path="/" 
            element={
              <>
                <Hero />
                <Expertise />
                <Portfolio />
                <Timeline />
                <Contact />
              </>
            } 
          />
          
          {/* Route pour les pages de détail de projet */}
          <Route path="/project/:id" element={<ProjectDetail />} />
          
          {/* Route de secours pour les URL non reconnues */}
          <Route path="*" element={
            <div className="h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-heading mb-4">Page non trouvée</h1>
                <p className="mb-6">La page que vous recherchez n'existe pas.</p>
                <a href="/" className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/80 transition-colors">
                  Retour à l'accueil
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Logo } from './components/Logo';
import { Hero } from './components/Hero';
import { Expertise } from './components/Expertise';
import { Portfolio } from './components/Portfolio';
import { Timeline } from './components/Timeline';
import { Contact } from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container py-4">
          <Logo />
        </div>
      </header>
      
      <main>
        <Hero />
        <Expertise />
        <Portfolio />
        <Timeline />
        <Contact />
      </main>
    </div>
  );
}

export default App;
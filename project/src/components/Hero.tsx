import { ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(textRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative h-screen">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src="https://player.vimeo.com/progressive_redirect/playback/123456789/rendition/1080p" // Replace with actual Vimeo URL
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div 
        ref={textRef}
        className="relative container h-full flex flex-col items-center justify-center text-center"
      >
        <h1 className="text-6xl md:text-8xl font-heading mb-6">
          L'art invisible des effets visuels
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl">
          Superviseur VFX & Compositeur Nuke
        </p>
        <a 
          href="#portfolio"
          className="group flex items-center gap-2 text-accent hover:text-white transition-colors"
        >
          <span className="text-lg">Voir les projets</span>
          <ChevronDown className="animate-bounce-slow" />
        </a>
      </div>
    </section>
  );
}
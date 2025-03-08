import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const timelineEvents = [
  {
    year: 2017,
    title: "Diplôme Superviseur VFX",
    description: "Formation aux Gobelins",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
  },
  {
    year: 2019,
    title: "Lead Compositor",
    description: "Mac Guff Ligne",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728"
  },
  {
    year: 2021,
    title: "VFX Supervisor",
    description: "Mikros Image",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279"
  },
  {
    year: 2023,
    title: "Head of VFX",
    description: "CAPS Studio",
    image: "https://images.unsplash.com/photo-1517799094725-e3453440724e"
  }
];

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-20 bg-surface overflow-hidden">
      <div className="container">
        <motion.h2 
          className="text-4xl md:text-5xl font-heading mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Parcours
        </motion.h2>

        <div className="relative">
          <div className="absolute left-1/2 h-full w-px bg-accent/20" />
          
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.year}
              className={`flex items-center gap-8 mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex-1">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-heading text-accent">
                      {event.year}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-4 h-4 rounded-full bg-accent relative z-10 flex-shrink-0" />

              <div className="flex-1">
                <h3 className="text-2xl font-heading mb-2">{event.title}</h3>
                <p className="text-gray-400">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
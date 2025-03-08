import { Monitor, Users, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const expertiseItems = [
  {
    icon: <Monitor className="w-8 h-8" />,
    title: "Nuke Compositing",
    description: "Expert en compositing avec plus de 8 ans d'expérience sur Nuke. Spécialisé dans l'intégration CGI, le clean-up et le color grading.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Leadership",
    description: "Supervision d'équipes VFX sur des projets majeurs. Collaboration étroite avec les réalisateurs et les clients pour concrétiser leur vision.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Innovation",
    description: "Développement de pipelines et d'outils personnalisés pour optimiser les workflows. Veille technologique constante.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa"
  }
];

export function Expertise() {
  return (
    <section id="expertise" className="py-20 bg-surface">
      <div className="container">
        <motion.h2 
          className="text-4xl md:text-5xl font-heading mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Expertise
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {expertiseItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-background rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="relative h-48">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
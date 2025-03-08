import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const projectTypes = [
  'Film',
  'Clip Musical',
  'Publicité',
  'Série TV',
  'Autre'
];

export function Contact() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');

  return (
    <section id="contact" className="py-20">
      <div className="container">
        <motion.h2 
          className="text-4xl md:text-5xl font-heading mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Contact
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            className="bg-surface rounded-lg p-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {step === 1 ? (
              <div>
                <h3 className="text-2xl font-heading mb-6">Type de projet</h3>
                <div className="grid gap-4">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      className={`p-4 rounded-lg transition-colors ${
                        projectType === type 
                          ? 'bg-accent text-white' 
                          : 'bg-background hover:bg-accent/20'
                      }`}
                      onClick={() => {
                        setProjectType(type);
                        setStep(2);
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type de projet sélectionné
                  </label>
                  <div className="flex items-center justify-between bg-background p-4 rounded-lg">
                    <span>{projectType}</span>
                    <button 
                      type="button"
                      className="text-accent hover:text-white transition-colors"
                      onClick={() => setStep(1)}
                    >
                      Modifier
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom du projet
                  </label>
                  <input
                    type="text"
                    className="w-full bg-background p-4 rounded-lg focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-background p-4 rounded-lg focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget estimé
                  </label>
                  <input
                    type="number"
                    className="w-full bg-background p-4 rounded-lg focus:ring-2 focus:ring-accent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent text-white py-4 rounded-lg hover:bg-accent/80 transition-colors"
                >
                  Envoyer
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            className="h-[400px] rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <MapContainer 
              center={[48.8566, 2.3522]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[48.8566, 2.3522]}>
                <Popup>
                  CAPS Studio<br />
                  Paris, France
                </Popup>
              </Marker>
            </MapContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
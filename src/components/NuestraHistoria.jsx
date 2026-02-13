import React, { useState, useEffect } from 'react';
import { Upload, X, Heart, Calendar, Video, Image as ImageIcon, Plus } from 'lucide-react';
import { database } from '../firebase';
import { ref, onValue, push, remove } from 'firebase/database';

const NuestraHistoria = () => {
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMemory, setNewMemory] = useState({ title: '', date: '' });
  const [loading, setLoading] = useState(true);

  // Cargar memorias
  useEffect(() => {
    const memoriesRef = ref(database, 'memories');
    const unsubscribe = onValue(memoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const memoriesArray = Object.entries(data).map(([id, memory]) => ({
          id,
          ...memory
        }));
        // Ordenar por fecha del recuerdo (si existe), si no por fecha de subida
        memoriesArray.sort((a, b) => {
            const dateA = new Date(a.date || a.timestamp);
            const dateB = new Date(b.date || b.timestamp);
            return dateB - dateA;
        });
        setMemories(memoriesArray);
      } else {
        setMemories([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Configurar Cloudinary
  const openUploadWidget = () => {
    const cloudName = 'dblx4jylk';
    const uploadPreset = 'nuestra_historia';

    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          maxFileSize: 100000000,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'mp4', 'mov', 'avi', 'webm'],
          resourceType: 'auto',
          styles: {
            palette: {
              window: "#FFF1F2",
              sourceBg: "#FFFFFF",
              windowBorder: "#FDA4AF",
              tabIcon: "#E11D48",
              inactiveTabIcon: "#9F1239",
              menuIcons: "#E11D48",
              link: "#E11D48",
              action: "#E11D48",
              inProgress: "#FB7185",
              complete: "#BE123C",
              error: "#9F1239",
              textDark: "#881337",
              textLight: "#FFFFFF"
            }
          }
        },
        async (error, result) => {
          if (!error && result && result.event === 'success') {
            const newMemoryData = {
              url: result.info.secure_url,
              type: result.info.resource_type,
              title: newMemory.title || 'Un momento especial',
              date: newMemory.date || new Date().toISOString().split('T')[0],
              timestamp: Date.now(),
            };
            
            await push(ref(database, 'memories'), newMemoryData);
            setNewMemory({ title: '', date: '' });
            setShowUploadModal(false);
            setIsUploading(false);
          }
          if (error) setIsUploading(false);
        }
      );
      widget.open();
    }
  };

  const handleStartUpload = () => {
    if (!newMemory.title.trim()) {
      alert('¡Ponle un nombre lindo a este recuerdo!');
      return;
    }
    setIsUploading(true);
    openUploadWidget();
  };

  const deleteMemory = async (id) => {
    if (window.confirm('¿Quieres borrar este recuerdo de nuestra historia?')) {
      await remove(ref(database, `memories/${id}`));
      setSelectedMemory(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="flex flex-col items-center animate-pulse">
          <Heart className="w-12 h-12 text-rose-400 mb-4" fill="#FB7185" />
          <p className="font-serif text-xl text-rose-800">Recuperando momentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff0f3] selection:bg-rose-200">
      
      {/* Hero Section / Header */}
      <header className="relative pt-12 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-200 via-transparent to-transparent opacity-60 z-0"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/40 backdrop-blur-md rounded-full mb-6 shadow-sm border border-white/50">
            <Heart className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" />
            <span className="text-sm font-medium text-rose-900 tracking-wide uppercase">Nuestro Álbum</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif text-rose-950 mb-4 tracking-tight">
            Nuestra Historia
          </h1>
          <p className="text-rose-800/80 max-w-lg mx-auto text-lg font-light italic">
            "Coleccionando instantes que hacen eterna nuestra aventura juntos."
          </p>
        </div>
      </header>

      {/* Floating Upload Button (Visible on Scroll) */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-8 right-8 z-40 bg-rose-600 text-white p-4 rounded-full shadow-xl hover:bg-rose-700 hover:scale-110 transition-all duration-300 group"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Main Gallery - Masonry Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {memories.length === 0 ? (
          <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/60 mx-auto max-w-2xl shadow-sm">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Upload className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-3xl font-serif text-rose-900 mb-3">
              El lienzo está en blanco
            </h2>
            <p className="text-rose-700 mb-8 font-light">
              Es el momento perfecto para subir la primera foto de nosotros.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-rose-900 text-rose-50 px-8 py-3 rounded-full hover:shadow-lg hover:bg-rose-800 transition-all font-serif"
            >
              Crear primer recuerdo
            </button>
          </div>
        ) : (
          /* CSS Columns for Masonry Effect */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {memories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => setSelectedMemory(memory)}
                className="break-inside-avoid group relative bg-white p-3 pb-4 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1"
              >
                {/* Image/Video Container - Polaroid Style */}
                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                  {memory.type === 'video' ? (
                    <div className="relative aspect-[3/4]">
                      <video
                        src={memory.url}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                         <div className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                           <Video className="w-5 h-5 text-rose-600" />
                         </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={memory.url}
                      alt={memory.title}
                      loading="lazy"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  
                  {/* Date Badge Overlay */}
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    {new Date(memory.date).getFullYear()}
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-4 px-1">
                  <h3 className="font-serif text-lg text-gray-800 leading-tight group-hover:text-rose-700 transition-colors">
                    {memory.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(memory.date).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Upload Modal - Glassmorphism */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-rose-950/30 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/50 animate-fade-in">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-100 text-rose-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-serif text-rose-950 mb-1">Nuevo Recuerdo</h2>
            <p className="text-rose-600/70 text-sm mb-6">Agrega un momento para no olvidarlo nunca.</p>
            
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-semibold text-rose-900 mb-2 ml-1">
                  ¿Qué momento es?
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newMemory.title}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Nuestra cena bajo las estrellas..."
                  className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all placeholder:text-rose-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-rose-900 mb-2 ml-1">
                  ¿Cuándo sucedió?
                </label>
                <input
                  type="date"
                  value={newMemory.date}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none text-gray-600"
                />
              </div>

              <button
                onClick={handleStartUpload}
                disabled={isUploading}
                className="w-full mt-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <span className="animate-pulse">Subiendo...</span>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Seleccionar Archivo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Memory Modal - Immersive */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedMemory(null)}
          />
          
          <div className="relative w-full max-w-6xl h-full md:h-auto max-h-[90vh] flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Media Section */}
            <div className="flex-1 bg-black flex items-center justify-center relative min-h-[40vh]">
               {selectedMemory.type === 'video' ? (
                <video src={selectedMemory.url} controls autoPlay className="max-w-full max-h-[85vh] object-contain" />
              ) : (
                <img src={selectedMemory.url} alt={selectedMemory.title} className="max-w-full max-h-[85vh] object-contain" />
              )}
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 left-4 md:hidden w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Info Sidebar */}
            <div className="w-full md:w-96 bg-white flex flex-col p-8 border-l border-gray-100">
               <div className="flex items-center justify-end mb-6">
                  <button
                    onClick={() => deleteMemory(selectedMemory.id)}
                    className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
                  >
                    Eliminar Recuerdo
                  </button>
                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="hidden md:flex ml-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
               </div>

               <div className="flex-1">
                  <h2 className="text-3xl font-serif text-gray-900 mb-4 leading-tight">
                    {selectedMemory.title}
                  </h2>
                  <div className="flex items-center gap-2 text-rose-500 mb-6">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(selectedMemory.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="w-12 h-1 bg-rose-100 rounded-full mb-6"></div>
                  <p className="text-gray-500 font-light italic text-sm">
                    Guardado el {new Date(selectedMemory.timestamp).toLocaleDateString()}
                  </p>
               </div>

               <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-center">
                 <Heart className="w-6 h-6 text-rose-300 animate-pulse" fill="#FDA4AF" />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuestraHistoria;
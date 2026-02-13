import React, { useState, useEffect } from 'react';
import { Upload, X, Heart, Calendar } from 'lucide-react';

const NuestraHistoria = () => {
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMemory, setNewMemory] = useState({ title: '', date: '' });

  // Cargar memorias desde localStorage al inicio
  useEffect(() => {
    const savedMemories = localStorage.getItem('memories');
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    }
  }, []);

  // Guardar memorias en localStorage cuando cambien
  useEffect(() => {
    if (memories.length > 0) {
      localStorage.setItem('memories', JSON.stringify(memories));
    }
  }, [memories]);

  // Configurar Cloudinary Upload Widget
  const openUploadWidget = () => {
    // ⚠️ IMPORTANTE: Reemplaza estos valores con los tuyos de Cloudinary
    const cloudName = 'dblx4jylk';  // Tu Cloud Name
    const uploadPreset = 'nuestrahistoria';  // Tu Upload Preset

    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          sources: ['local', 'camera'],
          multiple: false,
          maxFileSize: 10000000,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          theme: 'minimal',
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#E5E7EB',
              tabIcon: '#6366F1',
              menuIcons: '#4B5563',
              textDark: '#1F2937',
              textLight: '#FFFFFF',
              link: '#6366F1',
              action: '#6366F1',
              inactiveTabIcon: '#9CA3AF',
              error: '#EF4444',
              inProgress: '#6366F1',
              complete: '#10B981',
              sourceBg: '#F9FAFB'
            }
          }
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            const newMemoryData = {
              id: Date.now(),
              imageUrl: result.info.secure_url,
              title: newMemory.title || 'Sin título',
              date: newMemory.date || new Date().toISOString().split('T')[0],
              timestamp: Date.now()
            };
            setMemories(prev => [newMemoryData, ...prev]);
            setNewMemory({ title: '', date: '' });
            setShowUploadModal(false);
            setIsUploading(false);
          }
          if (error) {
            console.error('Error uploading:', error);
            setIsUploading(false);
          }
        }
      );
      widget.open();
    } else {
      alert('Por favor espera un momento mientras carga el sistema de subida de imágenes');
    }
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleStartUpload = () => {
    if (!newMemory.title.trim()) {
      alert('Por favor agrega un título a tu recuerdo');
      return;
    }
    setIsUploading(true);
    openUploadWidget();
  };

  const deleteMemory = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este recuerdo?')) {
      setMemories(prev => prev.filter(m => m.id !== id));
      setSelectedMemory(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Nuestra Historia
              </h1>
            </div>
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Subir Recuerdo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {memories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Comienza tu historia
            </h2>
            <p className="text-gray-600 mb-8">
              Sube tu primer recuerdo juntos y construyan su galería de momentos especiales
            </p>
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
            >
              <Upload className="w-5 h-5" />
              Subir Primera Foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => setSelectedMemory(memory)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">
                    {memory.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(memory.date).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Nuevo Recuerdo</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setNewMemory({ title: '', date: '' });
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del recuerdo *
                </label>
                <input
                  type="text"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Nuestra primera cita, Viaje a la playa..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha (opcional)
                </label>
                <input
                  type="date"
                  value={newMemory.date}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <button
                onClick={handleStartUpload}
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Seleccionar Foto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedMemory && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={selectedMemory.imageUrl}
                alt={selectedMemory.title}
                className="w-full max-h-[70vh] object-contain bg-gray-100"
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedMemory.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(selectedMemory.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMemory(selectedMemory.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuestraHistoria;
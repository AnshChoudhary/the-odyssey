import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';

export function Chapters() {
  const [chapters] = useState(mockUserProfile.chapters);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-parchment-50 to-parchment-200 parchment-texture">
      <div className="max-w-4xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-ink-700 mb-4">
            Your journey told as mock-epic prose — editable, with privacy per chapter
          </p>
          <h1 className="font-display text-5xl font-bold text-ink-900">
            Chapters of the Epic
          </h1>
        </motion.div>

        <div className="space-y-8">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glass-panel p-8"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-ocean-700 uppercase tracking-wider">
                    {chapter.month}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-ink-900 mt-1">
                    {chapter.title}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {chapter.isPrivate && (
                    <span className="text-xs px-2 py-1 bg-ink-700 text-parchment-50 rounded-full">
                      🔒 Private
                    </span>
                  )}
                  {chapter.isEdited && (
                    <span className="text-xs px-2 py-1 bg-parchment-200 text-ink-900 rounded-full">
                      ✏️ Edited
                    </span>
                  )}
                </div>
              </div>

              {editingId === chapter.id ? (
                <div>
                  <textarea
                    defaultValue={chapter.content}
                    className="w-full px-4 py-3 border border-ink-700 border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 bg-parchment-50 font-serif text-ink-900 leading-relaxed"
                    rows={12}
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="prose prose-lg text-ink-900 font-serif leading-relaxed whitespace-pre-line mb-4">
                    {chapter.content}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingId(chapter.id)}
                      className="btn-secondary text-sm"
                    >
                      ✏️ Edit Chapter
                    </button>
                    <button className="btn-secondary text-sm">
                      {chapter.isPrivate ? '👁️ Make Public' : '🔒 Make Private'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

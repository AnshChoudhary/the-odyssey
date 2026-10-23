import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockUserProfile } from '../data/mockData';
import { CartographicBackground } from './CartographicBackground';

export function Chapters() {
  const [chapters] = useState(mockUserProfile.chapters);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <CartographicBackground title="Chapters of the Epic" subtitle="Your journey told as illuminated prose">
      <div className="max-w-4xl mx-auto px-8 py-32">
        <div className="space-y-8">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-[#f4efe6] p-8 rounded border-2 border-[#8b7355] shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-[#8b7355] uppercase tracking-wider font-serif">
                    {chapter.month}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[#2d2419] mt-1">
                    {chapter.title}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {chapter.isPrivate && (
                    <span className="text-xs px-2 py-1 bg-[#5a4a3a] text-[#f4efe6] rounded-full font-serif">
                      🔒 Private
                    </span>
                  )}
                  {chapter.isEdited && (
                    <span className="text-xs px-2 py-1 bg-[#e8dcc7] text-[#2d2419] rounded-full border border-[#8b7355]/30 font-serif">
                      ✏️ Edited
                    </span>
                  )}
                </div>
              </div>

              {editingId === chapter.id ? (
                <div>
                  <textarea
                    defaultValue={chapter.content}
                    className="w-full px-4 py-3 border-2 border-[#8b7355]/30 rounded focus:outline-none focus:border-[#6b8e9d] bg-[#f4efe6] font-serif text-[#2d2419] leading-relaxed"
                    rows={12}
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-6 py-3 bg-[#6b8e9d] text-[#f4efe6] rounded font-medium hover:bg-[#5a7d8c] transition-all font-serif"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-6 py-3 bg-[#e8dcc7] text-[#2d2419] rounded font-medium hover:bg-[#d4c9b3] transition-all border-2 border-[#8b7355]/30 font-serif"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="prose prose-lg text-[#2d2419] font-serif leading-relaxed whitespace-pre-line mb-4">
                    {chapter.content}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingId(chapter.id)}
                      className="px-4 py-2 bg-[#e8dcc7] text-[#2d2419] rounded text-sm font-medium hover:bg-[#d4c9b3] transition-all border border-[#8b7355]/30 font-serif"
                    >
                      ✏️ Edit Chapter
                    </button>
                    <button className="px-4 py-2 bg-[#e8dcc7] text-[#2d2419] rounded text-sm font-medium hover:bg-[#d4c9b3] transition-all border border-[#8b7355]/30 font-serif">
                      {chapter.isPrivate ? '👁️ Make Public' : '🔒 Make Private'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </CartographicBackground>
  );
}

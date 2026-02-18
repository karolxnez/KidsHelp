
import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Star, Zap, Brain } from 'lucide-react';

interface HeroGamesProps {
  onWin: (stars: number, xp: number) => void;
}

const ICONS = ['🧹', '📚', '🍎', '❤️', '🦷', '🛏️', '💡', '🎨'];

const HeroGames: React.FC<HeroGamesProps> = ({ onWin }) => {
  const [cards, setCards] = useState<{ id: number, emoji: string, solved: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, solved: false }));
    setCards(deck);
    setFlipped([]);
    setWon(false);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      setDisabled(true);
      const [first, second] = flipped;
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => prev.map(c => (c.id === first || c.id === second) ? { ...c, solved: true } : c));
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 800);
      }
      setMoves(m => m + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    // Verificamos se todas as cartas estão resolvidas e se o estado 'won' ainda é falso
    if (cards.length > 0 && cards.every(c => c.solved) && !won) {
      setWon(true);
      onWin(5, 20); // Recompensa única
    }
  }, [cards, won, onWin]);

  const handleClick = (id: number) => {
    if (disabled || flipped.includes(id) || cards[id].solved) return;
    setFlipped([...flipped, id]);
  };

  return (
    <div className="space-y-8 animate-in zoom-in duration-300">
      <div className="text-center">
        <div className="inline-flex p-4 bg-yellow-400 text-yellow-900 rounded-3xl shadow-lg mb-4">
          <Brain size={40} />
        </div>
        <h2 className="text-3xl font-kids font-bold text-slate-800">Treino de Memória</h2>
        <p className="text-slate-500">Encontre os pares para fortalecer sua mente heróica!</p>
      </div>

      <div className="flex justify-center space-x-6 text-sm font-bold uppercase tracking-widest text-slate-400">
        <div className="flex items-center"><RotateCcw size={16} className="mr-1"/> Movimentos: {moves}</div>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto p-4 bg-white/50 rounded-[32px] border-4 border-white">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || card.solved;
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className="aspect-square cursor-pointer relative preserve-3d transition-transform duration-500"
              style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              {/* Back of card (Question mark) */}
              <div className="absolute inset-0 rounded-2xl bg-indigo-500 border-b-4 border-indigo-700 flex items-center justify-center text-white text-2xl font-bold backface-hidden shadow-sm">
                ?
              </div>
              
              {/* Front of card (Emoji) */}
              <div className="absolute inset-0 rounded-2xl bg-white border-b-4 border-slate-100 flex items-center justify-center text-3xl backface-hidden rotate-y-180 shadow-inner">
                {card.emoji}
              </div>
            </div>
          );
        })}
      </div>

      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-indigo-600/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 text-center shadow-2xl max-w-sm w-full animate-in zoom-in duration-500">
            <div className="bg-yellow-400 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-200">
              <Trophy size={48} className="text-yellow-900" />
            </div>
            <h2 className="text-3xl font-kids font-bold text-slate-800 mb-2">Treino Concluído!</h2>
            <p className="text-slate-500 mb-6">Sua mente está cada vez mais forte, pequeno herói!</p>
            
            <div className="flex justify-center space-x-4 mb-8">
              <div className="bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100 text-yellow-600 font-bold flex items-center">
                <Star size={18} className="mr-1" fill="currentColor" /> +5
              </div>
              <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 text-indigo-600 font-bold flex items-center">
                <Zap size={18} className="mr-1" fill="currentColor" /> +20 XP
              </div>
            </div>

            <button 
              onClick={initGame}
              className="w-full py-4 bg-indigo-500 text-white font-kids font-bold text-xl rounded-2xl shadow-lg hover:bg-indigo-600 transition-all border-b-4 border-indigo-700"
            >
              Jogar de Novo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroGames;
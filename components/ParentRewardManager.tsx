
import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Sparkles, Star, Loader2, Gift } from 'lucide-react';
import { Reward, UserStats } from '../types';
import { getRewardSuggestions } from '../services/geminiService';

interface ParentRewardManagerProps {
  stats: UserStats;
  rewards: Reward[];
  onAddReward: (reward: Omit<Reward, 'id'>) => void;
  onRemoveReward: (id: string) => void;
}

const ParentRewardManager: React.FC<ParentRewardManagerProps> = ({ stats, rewards, onAddReward, onRemoveReward }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const [newReward, setNewReward] = useState({
    title: '',
    cost: 50,
    icon: '🎁'
  });

  const handleSuggest = async () => {
    setIsSuggesting(true);
    const ideas = await getRewardSuggestions(stats);
    setSuggestions(ideas);
    setIsSuggesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReward.title && newReward.cost > 0) {
      onAddReward(newReward);
      setNewReward({ title: '', cost: 50, icon: '🎁' });
      setIsAdding(false);
    }
  };

  const averageCost = rewards.length > 0 
    ? Math.round(rewards.reduce((acc, curr) => acc + curr.cost, 0) / rewards.length) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão da Loja de Tesouros</h2>
          <p className="text-slate-500 text-sm">Controle o que {stats.name} pode trocar por estrelas.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          {isAdding ? <Gift size={20} /> : <Plus size={20} />}
          <span>{isAdding ? 'Ver Lista' : 'Novo Prêmio'}</span>
        </button>
      </div>

      {/* Economy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
            <Star fill="currentColor" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Custo Médio</p>
            <p className="text-2xl font-bold text-slate-800">{averageCost} estrelas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Itens</p>
            <p className="text-2xl font-bold text-slate-800">{rewards.length} recompensas</p>
          </div>
        </div>
      </div>

      {isAdding ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Form */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Criar Recompensa</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Nome do Prêmio</label>
                <input 
                  type="text" 
                  value={newReward.title}
                  onChange={e => setNewReward({...newReward, title: e.target.value})}
                  placeholder="Ex: Noite da Pizza"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Custo (Estrelas)</label>
                  <input 
                    type="number" 
                    value={newReward.cost}
                    onChange={e => setNewReward({...newReward, cost: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Emoji/Ícone</label>
                  <input 
                    type="text" 
                    value={newReward.icon}
                    onChange={e => setNewReward({...newReward, icon: e.target.value})}
                    placeholder="🍕"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 mt-4 hover:bg-indigo-700 transition-all"
              >
                Adicionar à Loja
              </button>
            </form>
          </div>

          {/* AI Suggestions */}
          <div className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 text-indigo-700">
                <Sparkles size={20} fill="currentColor" />
                <h3 className="font-bold text-lg">Ideias com IA</h3>
              </div>
              <button 
                onClick={handleSuggest}
                disabled={isSuggesting}
                className="text-xs font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full text-indigo-600 shadow-sm border border-indigo-100 flex items-center"
              >
                {isSuggesting ? <Loader2 size={12} className="animate-spin mr-1" /> : 'Gerar Novas'}
              </button>
            </div>
            
            <div className="space-y-3">
              {suggestions.length === 0 && !isSuggesting && (
                <div className="text-center py-8 text-indigo-400">
                  <p className="text-sm">Clique em gerar para ver sugestões baseadas no nível de {stats.name}!</p>
                </div>
              )}
              {isSuggesting && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="animate-spin text-indigo-500" size={32} />
                  <p className="text-indigo-600 font-medium animate-pulse">Consultando o oráculo...</p>
                </div>
              )}
              {suggestions.map((s, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-4 rounded-2xl border border-indigo-100 flex items-center justify-between hover:border-indigo-400 cursor-pointer transition-colors group"
                  onClick={() => setNewReward({ title: s.title, cost: s.cost, icon: s.icon })}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.title}</p>
                      <p className="text-xs text-slate-400">{s.cost} estrelas sugeridas</p>
                    </div>
                  </div>
                  <Plus size={16} className="text-indigo-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {rewards.map(reward => (
            <div key={reward.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl">
                  {reward.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{reward.title}</h4>
                  <div className="flex items-center text-yellow-600 font-bold">
                    <Star size={14} className="mr-1" fill="currentColor" />
                    {reward.cost} estrelas
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onRemoveReward(reward.id)}
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {rewards.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">Sua loja está vazia. Comece adicionando um prêmio heróico!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParentRewardManager;

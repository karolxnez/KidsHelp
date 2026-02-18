
import React from 'react';
import { Star, ShoppingBag, ChevronRight } from 'lucide-react';
import { Reward, UserStats } from '../types';

interface RewardStoreProps {
  stats: UserStats;
  rewards: Reward[];
  onRedeem: (reward: Reward) => void;
}

const RewardStore: React.FC<RewardStoreProps> = ({ stats, rewards, onRedeem }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-yellow-50 p-6 rounded-3xl border border-yellow-200">
        <div>
          <h2 className="text-2xl font-kids font-bold text-yellow-800">Loja de Tesouros</h2>
          <p className="text-yellow-700">Troque suas estrelas por prêmios incríveis!</p>
        </div>
        <div className="flex items-center bg-white px-4 py-2 rounded-2xl shadow-sm font-bold text-yellow-600 text-xl border border-yellow-100">
          <Star fill="currentColor" className="mr-2" size={24} />
          {stats.stars}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map(reward => {
          const canAfford = stats.stars >= reward.cost;
          return (
            <div 
              key={reward.id} 
              className={`bg-white rounded-3xl p-5 shadow-md border-b-4 transition-all relative ${
                canAfford 
                  ? 'border-green-400 hover:scale-[1.02] cursor-pointer' 
                  : 'border-slate-200 grayscale opacity-70'
              }`}
              onClick={() => canAfford && onRedeem(reward)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl bg-slate-50 p-3 rounded-2xl">
                  {reward.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-kids font-bold text-lg text-slate-800">{reward.title}</h4>
                  <div className="flex items-center text-yellow-600 font-bold">
                    <Star size={16} className="mr-1" fill="currentColor" />
                    {reward.cost} estrelas
                  </div>
                </div>
                {canAfford && (
                  <div className="bg-indigo-500 text-white p-2 rounded-full">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
              {!canAfford && (
                <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-full rounded-full" 
                    style={{ width: `${(stats.stars / reward.cost) * 100}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {rewards.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
          <p>Nenhum prêmio disponível no momento.</p>
        </div>
      )}
    </div>
  );
};

export default RewardStore;

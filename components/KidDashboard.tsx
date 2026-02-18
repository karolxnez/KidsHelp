
import React, { useState, useEffect } from 'react';
import { Star, Trophy, Target, ShieldCheck, Sparkles, Loader2, Zap } from 'lucide-react';
import { Task, UserStats } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { getEpicTaskMotivation } from '../services/geminiService';

interface KidDashboardProps {
  stats: UserStats;
  tasks: Task[];
  onCompleteTask: (id: string) => void;
}

const KidDashboard: React.FC<KidDashboardProps> = ({ stats, tasks, onCompleteTask }) => {
  const [motivationalMessage, setMotivationalMessage] = useState<string>("");
  const [loadingMsg, setLoadingMsg] = useState(false);

  useEffect(() => {
    const fetchInspiration = async () => {
      setLoadingMsg(true);
      const res = await getEpicTaskMotivation("Ser um super herói das tarefas hoje");
      setMotivationalMessage(res.motivation);
      setLoadingMsg(false);
    };
    fetchInspiration();
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const awaitingTasks = tasks.filter(t => t.status === 'awaiting_approval');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Hero Stats Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border-b-8 border-indigo-800">
        <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
          <Trophy size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-1 rounded-2xl backdrop-blur-sm border border-white/30">
              <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${stats.name}`} className="w-16 h-16" />
            </div>
            <div>
              <h2 className="text-4xl font-kids font-bold mb-0">Herói {stats.name}!</h2>
              <div className="flex items-center bg-yellow-400/30 text-yellow-200 px-3 py-1 rounded-full text-sm font-bold border border-yellow-400/20">
                <Zap size={14} className="mr-1 fill-current" />
                NÍVEL {stats.level} ALCANÇADO
              </div>
            </div>
          </div>

          <p className="text-indigo-50 mb-8 font-medium italic text-lg bg-black/10 p-4 rounded-2xl border-l-4 border-yellow-400">
            {loadingMsg ? <Loader2 className="animate-spin inline mr-2" /> : `"${motivationalMessage}"`}
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 flex items-center space-x-4 border border-white/10 shadow-inner">
              <div className="bg-yellow-400 p-3 rounded-2xl text-yellow-900 shadow-lg shadow-yellow-400/20">
                <Star fill="currentColor" size={32} />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-indigo-100 tracking-wider">Estrelas</p>
                <p className="text-4xl font-kids font-bold">{stats.stars}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 flex items-center space-x-4 border border-white/10 shadow-inner">
              <div className="bg-blue-400 p-3 rounded-2xl text-blue-900 shadow-lg shadow-blue-400/20">
                <Target size={32} />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-indigo-100 tracking-wider">Energia XP</p>
                <p className="text-4xl font-kids font-bold">{stats.xp}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2 font-bold uppercase tracking-widest text-indigo-200">
              <span>Rumo ao Próximo Nível</span>
              <span>{Math.round((stats.xp / ((stats.level + 1) * 500)) * 100)}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-5 overflow-hidden border-2 border-white/10 p-1">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-300 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(52,211,153,0.5)]" 
                style={{ width: `${(stats.xp / ((stats.level + 1) * 500)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Missions List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-kids font-bold text-slate-800 flex items-center">
            <Sparkles className="text-yellow-500 mr-2" fill="currentColor" />
            Minhas Missões
          </h3>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-sm font-bold text-slate-500">
            {pendingTasks.length} DISPONÍVEIS
          </div>
        </div>
        
        <div className="grid gap-6">
          {pendingTasks.map(task => (
            <div key={task.id} className="bg-white rounded-[32px] p-6 shadow-xl border-b-8 border-slate-100 hover:border-indigo-400 hover:translate-y-[-4px] transition-all active:scale-95 group">
              <div className="flex items-start justify-between">
                <div className="flex space-x-5">
                  <div className="bg-indigo-50 text-indigo-500 p-4 rounded-3xl group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                    {CATEGORY_ICONS[task.category]}
                  </div>
                  <div>
                    <h4 className="font-kids font-bold text-2xl text-slate-800 mb-1">{task.epicTitle || task.title}</h4>
                    <p className="text-slate-500 text-lg leading-relaxed">{task.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center text-yellow-600 font-kids font-bold text-xl">
                    <Star size={20} className="mr-1" fill="currentColor" />
                    +{task.stars}
                  </div>
                  <div className="text-indigo-500 font-bold bg-indigo-50 px-3 py-1 rounded-xl text-sm mt-2">+{task.xp} XP</div>
                </div>
              </div>
              <button 
                onClick={() => onCompleteTask(task.id)}
                className="w-full mt-6 py-5 bg-indigo-500 hover:bg-indigo-600 text-white font-kids font-bold text-xl rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center space-x-3 border-b-4 border-indigo-700"
              >
                <ShieldCheck size={24} />
                <span>Missão Cumprida!</span>
              </button>
            </div>
          ))}

          {pendingTasks.length === 0 && awaitingTasks.length === 0 && (
            <div className="text-center py-16 bg-white rounded-[40px] border-4 border-dashed border-green-200 shadow-inner">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy size={48} className="text-green-500" />
              </div>
              <p className="text-slate-800 font-kids font-bold text-2xl">Incrível! Você é um herói exemplar!</p>
              <p className="text-slate-500 mt-2">Todas as missões do dia foram realizadas. Descanse um pouco!</p>
            </div>
          )}

          {awaitingTasks.map(task => (
            <div key={task.id} className="bg-slate-100 rounded-[32px] p-6 border-2 border-slate-200 opacity-80">
               <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="bg-white p-3 rounded-2xl text-slate-400 shadow-sm">
                    <Loader2 className="animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-kids font-bold text-xl text-slate-500">{task.title}</h4>
                    <p className="text-slate-400 text-sm">O mestre dos pais está revisando sua missão...</p>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase bg-slate-200 text-slate-600 px-4 py-2 rounded-full tracking-widest">
                  Validando...
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KidDashboard;

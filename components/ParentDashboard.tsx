
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Settings, User, TrendingUp, HelpCircle, Sparkles, MessageCircle, ShieldAlert } from 'lucide-react';
import { Task, UserStats } from '../types';
import { getParentAdvice } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ParentDashboardProps {
  stats: UserStats;
  tasks: Task[];
  onApproveTask: (id: string) => void;
  onRejectTask: (id: string) => void;
  onUpdateChatPermission: (enabled: boolean) => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ stats, tasks, onApproveTask, onRejectTask, onUpdateChatPermission }) => {
  const [advice, setAdvice] = useState<string>("Carregando dicas estratégicas...");
  const awaitingApproval = tasks.filter(t => t.status === 'awaiting_approval');
  
  const chartData = [
    { day: 'Seg', tasks: 3 },
    { day: 'Ter', tasks: 5 },
    { day: 'Qua', tasks: 2 },
    { day: 'Qui', tasks: stats.xp > 100 ? 6 : 4 },
    { day: 'Sex', tasks: tasks.filter(t => t.status === 'done').length },
  ];

  useEffect(() => {
    const fetchAdvice = async () => {
      const msg = await getParentAdvice({ stats, taskCount: tasks.length });
      setAdvice(msg);
    };
    fetchAdvice();
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Painel de Controle</h2>
          <p className="text-slate-500">Monitorando o progresso de {stats.name}</p>
        </div>
        <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600">
          <Settings size={20} />
        </button>
      </div>

      {/* Permissions Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${stats.isChatEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Acesso ao Chat Social</h3>
              <p className="text-sm text-slate-500">Permitir que {stats.name} converse com amigos via código de sala</p>
            </div>
          </div>
          <button 
            onClick={() => onUpdateChatPermission(!stats.isChatEnabled)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
              stats.isChatEnabled ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                stats.isChatEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {!stats.isChatEnabled && (
          <div className="mt-4 flex items-center space-x-2 text-xs text-amber-600 font-bold bg-amber-50 p-2 rounded-lg">
            <ShieldAlert size={14} />
            <span>O chat está desativado. Ative para liberar o código de sala para a criança.</span>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-slate-500 font-medium">Produtividade</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">85%</p>
          <p className="text-xs text-green-600 font-bold">+12% em relação à última semana</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <Sparkles size={20} />
            </div>
            <span className="text-slate-500 font-medium">Nível Alcançado</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">Nível {stats.level}</p>
          <p className="text-xs text-slate-400 font-bold">{stats.xp} XP acumulado</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
              <HelpCircle size={20} />
            </div>
            <span className="text-slate-500 font-medium">Pendentes</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{awaitingApproval.length}</p>
          <p className="text-xs text-slate-400 font-bold">Para validar</p>
        </div>
      </div>

      {/* Approval Queue */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Fila de Aprovação</h3>
        <div className="space-y-3">
          {awaitingApproval.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">Nenhuma tarefa pendente para validar.</p>
            </div>
          ) : (
            awaitingApproval.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{task.title}</h4>
                  <p className="text-sm text-slate-500">Completado agora mesmo</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onRejectTask(task.id)}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                  <button 
                    onClick={() => onApproveTask(task.id)}
                    className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Advice Card */}
      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
        <div className="flex items-center space-x-2 mb-3 text-indigo-700">
          <Sparkles size={20} fill="currentColor" />
          <h3 className="font-bold">Dicas do Consultor KidsHelper</h3>
        </div>
        <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
          {advice}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

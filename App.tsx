
import React, { useState, useEffect } from 'react';
import { Layout, User, Shield, ShoppingCart, Home, Settings, MessageCircle, ArrowLeft, Swords, LineChart as ChartIcon, Gift, Gamepad2 } from 'lucide-react';
import KidDashboard from './components/KidDashboard';
import ParentDashboard from './components/ParentDashboard';
import RewardStore from './components/RewardStore';
import ParentRewardManager from './components/ParentRewardManager';
import KidChat from './components/KidChat';
import HeroGames from './components/HeroGames';
import { AppView, AppMode, Task, UserStats, Reward } from './types';
import { INITIAL_TASKS, INITIAL_REWARDS } from './constants';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.SELECT);
  const [currentView, setCurrentView] = useState<AppView>(AppView.KID_DASHBOARD);
  
  const [stats, setStats] = useState<UserStats>({
    name: "Arthur",
    stars: 120,
    xp: 350,
    level: 2,
    streak: 3,
    isChatEnabled: false
  });
  
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);

  useEffect(() => {
    if (appMode === AppMode.KID) setCurrentView(AppView.KID_DASHBOARD);
    if (appMode === AppMode.PARENT) setCurrentView(AppView.PARENT_DASHBOARD);
  }, [appMode]);

  useEffect(() => {
    const nextLevelXp = (stats.level + 1) * 500;
    if (stats.xp >= nextLevelXp) {
      setStats(prev => ({
        ...prev,
        level: prev.level + 1,
        xp: prev.xp - nextLevelXp
      }));
      alert("UPGRADE! Você subiu de nível! 🚀");
    }
  }, [stats.xp, stats.level]);

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'awaiting_approval' } : t));
  };

  const handleApproveTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setStats(prev => ({
        ...prev,
        stars: prev.stars + task.stars,
        xp: prev.xp + task.xp
      }));
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done', completed: true } : t));
    }
  };

  const handleRejectTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'pending' } : t));
  };

  const handleRedeemReward = (reward: Reward) => {
    if (stats.stars >= reward.cost) {
      setStats(prev => ({ ...prev, stars: prev.stars - reward.cost }));
      alert(`Você resgatou: ${reward.title}! Parabéns! 🎁`);
    }
  };

  const handleAddReward = (reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = { ...reward, id: Date.now().toString() };
    setRewards([...rewards, newReward]);
  };

  const handleRemoveReward = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateChatPermission = (enabled: boolean) => {
    setStats(prev => ({ ...prev, isChatEnabled: enabled }));
  };

  const handleGameWin = (stars: number, xp: number) => {
    setStats(prev => ({
      ...prev,
      stars: prev.stars + stars,
      xp: prev.xp + xp
    }));
  };

  if (appMode === AppMode.SELECT) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={() => setAppMode(AppMode.KID)}
            className="group relative bg-white rounded-[40px] p-10 shadow-2xl hover:scale-105 transition-all flex flex-col items-center text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
              <Swords size={160} />
            </div>
            <div className="bg-yellow-400 p-6 rounded-3xl text-yellow-900 mb-6 shadow-lg">
              <Swords size={48} />
            </div>
            <h2 className="text-4xl font-kids font-bold text-slate-800 mb-2">Portal do Herói</h2>
            <p className="text-slate-500 font-medium italic">Entre para cumprir missões e ganhar recompensas!</p>
            <div className="mt-8 px-8 py-3 bg-indigo-500 text-white rounded-2xl font-kids font-bold">Entrar agora!</div>
          </button>

          <button 
            onClick={() => setAppMode(AppMode.PARENT)}
            className="group relative bg-slate-800 rounded-[40px] p-10 shadow-2xl hover:scale-105 transition-all flex flex-col items-center text-center overflow-hidden border-4 border-slate-700"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform text-white">
              <ChartIcon size={160} />
            </div>
            <div className="bg-indigo-500 p-6 rounded-3xl text-white mb-6 shadow-lg">
              <Shield size={48} />
            </div>
            <h2 className="text-4xl font-kids font-bold text-white mb-2">Comando dos Pais</h2>
            <p className="text-slate-400 font-medium">Gerencie tarefas, aprove missões e veja o progresso.</p>
            <div className="mt-8 px-8 py-3 bg-white text-slate-800 rounded-2xl font-kids font-bold">Acessar Painel</div>
          </button>
        </div>
      </div>
    );
  }

  if (appMode === AppMode.PARENT) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <aside className="w-full lg:w-64 bg-white border-r border-slate-200 lg:fixed h-auto lg:h-full z-30 shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800 flex items-center">
              <Shield className="mr-2 text-indigo-600" />
              KidsHelper
            </h1>
            <button onClick={() => setAppMode(AppMode.SELECT)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <ArrowLeft size={20} />
            </button>
          </div>
          <nav className="px-4 py-2 space-y-2">
            <NavItem 
              active={currentView === AppView.PARENT_DASHBOARD} 
              onClick={() => setCurrentView(AppView.PARENT_DASHBOARD)}
              icon={<ChartIcon size={20} />} 
              label="Painel Geral" 
            />
            <NavItem 
              active={currentView === AppView.PARENT_REWARDS} 
              onClick={() => setCurrentView(AppView.PARENT_REWARDS)}
              icon={<Gift size={20} />} 
              label="Loja & Prêmios" 
            />
            <button 
              onClick={() => setAppMode(AppMode.SELECT)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium text-red-500 hover:bg-red-50 mt-10 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Sair do Painel</span>
            </button>
          </nav>
        </aside>
        <main className="flex-1 lg:ml-64 p-6 lg:p-10 max-w-5xl mx-auto w-full">
          {currentView === AppView.PARENT_DASHBOARD && (
            <ParentDashboard stats={stats} tasks={tasks} onApproveTask={handleApproveTask} onRejectTask={handleRejectTask} onUpdateChatPermission={handleUpdateChatPermission} />
          )}
          {currentView === AppView.PARENT_REWARDS && (
            <ParentRewardManager stats={stats} rewards={rewards} onAddReward={handleAddReward} onRemoveReward={handleRemoveReward} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50/50 pb-24 lg:pb-0 lg:pl-64">
      <button onDoubleClick={() => setAppMode(AppMode.SELECT)} className="fixed top-4 right-4 z-50 p-2 bg-white/50 backdrop-blur-sm rounded-full text-slate-300 hover:text-slate-500 transition-colors"><Settings size={16} /></button>
      <aside className="hidden lg:flex flex-col w-64 h-full bg-white border-r-4 border-indigo-100 fixed left-0 top-0 z-20">
        <div className="p-8"><h1 className="text-3xl font-kids font-bold text-indigo-600 flex items-center"><Swords className="mr-2" />Hero App</h1></div>
        <nav className="flex-1 px-4 space-y-4">
          <NavItem active={currentView === AppView.KID_DASHBOARD} onClick={() => setCurrentView(AppView.KID_DASHBOARD)} icon={<Home size={24} />} label="Missões" isKid />
          <NavItem active={currentView === AppView.GAMES} onClick={() => setCurrentView(AppView.GAMES)} icon={<Gamepad2 size={24} />} label="Treinos" isKid />
          <NavItem active={currentView === AppView.CHAT} onClick={() => setCurrentView(AppView.CHAT)} icon={<MessageCircle size={24} />} label="QG Amigos" isKid />
          <NavItem active={currentView === AppView.REWARD_STORE} onClick={() => setCurrentView(AppView.REWARD_STORE)} icon={<ShoppingCart size={24} />} label="Loja" isKid />
        </nav>
        <div className="p-6 bg-indigo-50 m-4 rounded-3xl flex items-center space-x-3">
          <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${stats.name}`} className="w-10 h-10 bg-white rounded-xl p-1" />
          <div><p className="font-kids font-bold text-slate-700">{stats.name}</p><p className="text-xs font-bold text-indigo-500 uppercase">Nível {stats.level}</p></div>
        </div>
      </aside>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentView === AppView.KID_DASHBOARD && <KidDashboard stats={stats} tasks={tasks} onCompleteTask={handleCompleteTask} />}
        {currentView === AppView.GAMES && <HeroGames onWin={handleGameWin} />}
        {currentView === AppView.CHAT && <KidChat stats={stats} />}
        {currentView === AppView.REWARD_STORE && <RewardStore stats={stats} rewards={rewards} onRedeem={handleRedeemReward} />}
      </main>
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border-4 border-indigo-100 p-2 rounded-[32px] flex justify-between items-center shadow-2xl z-50">
        <MobileNavItem active={currentView === AppView.KID_DASHBOARD} onClick={() => setCurrentView(AppView.KID_DASHBOARD)} icon={<Home size={28} />} />
        <MobileNavItem active={currentView === AppView.GAMES} onClick={() => setCurrentView(AppView.GAMES)} icon={<Gamepad2 size={28} />} />
        <MobileNavItem active={currentView === AppView.CHAT} onClick={() => setCurrentView(AppView.CHAT)} icon={<MessageCircle size={28} />} />
        <MobileNavItem active={currentView === AppView.REWARD_STORE} onClick={() => setCurrentView(AppView.REWARD_STORE)} icon={<ShoppingCart size={28} />} />
      </nav>
    </div>
  );
};

interface NavItemProps { active: boolean; icon: React.ReactNode; label: string; onClick: () => void; isKid?: boolean; }
const NavItem: React.FC<NavItemProps> = ({ active, icon, label, onClick, isKid }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-6 py-4 rounded-[24px] font-bold transition-all ${active ? isKid ? 'bg-indigo-500 text-white shadow-lg scale-[1.02]' : 'bg-indigo-50 text-indigo-600 shadow-sm' : isKid ? 'text-slate-400 hover:bg-slate-50 font-kids' : 'text-slate-500 hover:bg-slate-50'} ${isKid ? 'font-kids text-lg' : ''}`}>
    {icon}<span>{label}</span>
  </button>
);
const MobileNavItem: React.FC<Omit<NavItemProps, 'label'>> = ({ active, icon, onClick }) => (
  <button onClick={onClick} className={`p-4 rounded-3xl transition-all ${active ? 'bg-indigo-500 text-white scale-110 shadow-lg' : 'text-slate-400'}`}>{icon}</button>
);

export default App;

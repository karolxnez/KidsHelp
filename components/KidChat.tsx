
import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Hash, Lock, MessageCircle, Sparkles, LogOut } from 'lucide-react';
import { UserStats, Message } from '../types';

interface KidChatProps {
  stats: UserStats;
}

const KidChat: React.FC<KidChatProps> = ({ stats }) => {
  const [roomCode, setRoomCode] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitização: Apenas letras e números
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (value.length <= 4) {
      setRoomCode(value);
    }
  };

  if (!stats.isChatEnabled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200">
        <div className="bg-indigo-100 p-6 rounded-full mb-6 text-indigo-500">
          <Lock size={64} />
        </div>
        <h2 className="text-2xl font-kids font-bold text-slate-800 mb-2">Área Restrita! 🛑</h2>
        <p className="text-slate-500 max-w-xs mx-auto mb-6">
          O Chat dos Heróis ainda não foi liberado. Peça para seus pais ativarem o acesso no painel deles!
        </p>
      </div>
    );
  }

  if (!isInRoom) {
    return (
      <div className="max-w-md mx-auto space-y-8 animate-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 bg-indigo-500 text-white rounded-3xl shadow-lg shadow-indigo-200 mb-4">
            <Users size={48} />
          </div>
          <h2 className="text-3xl font-kids font-bold text-slate-800">QG dos Amigos</h2>
          <p className="text-slate-500">Digite o código secreto da sala para entrar</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-xl border-b-8 border-indigo-100 space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
              <Hash size={24} />
            </div>
            <input
              type="text"
              maxLength={4}
              value={roomCode}
              onChange={handleRoomCodeChange}
              placeholder="0000"
              className="w-full pl-12 pr-4 py-6 bg-slate-50 border-4 border-slate-100 focus:border-indigo-400 rounded-3xl text-4xl font-kids font-bold tracking-[1em] text-center focus:outline-none transition-all"
            />
          </div>

          <button
            disabled={roomCode.length < 4}
            onClick={() => setIsInRoom(true)}
            className="w-full py-5 bg-indigo-500 disabled:bg-slate-300 disabled:shadow-none text-white text-xl font-kids font-bold rounded-3xl shadow-xl shadow-indigo-200 hover:bg-indigo-600 active:scale-95 transition-all border-b-4 border-indigo-700"
          >
            Entrar na Sala 🚀
          </button>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl text-sm text-blue-700 flex items-start space-x-3">
          <Sparkles className="flex-shrink-0" size={20} />
          <p>Dica: Convide seus melhores amigos da escola e compartilhe o código com eles!</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: stats.name,
      text: inputText,
      timestamp: Date.now(),
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${stats.name}`
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom duration-500">
      {/* Chat Header */}
      <div className="bg-indigo-500 p-6 text-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-2 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-kids font-bold text-xl">Sala #{roomCode}</h3>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Missão: Diversão Total</p>
          </div>
        </div>
        <button 
          onClick={() => setIsInRoom(false)}
          className="p-2 hover:bg-white/20 rounded-xl transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 grayscale">
            <MessageCircle size={64} />
            <p className="font-kids font-bold text-xl">Seja o primeiro a dizer "Oi!"</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === stats.name ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.sender === stats.name ? 'flex-row-reverse' : 'flex-row'} items-end space-x-3`}>
                <img 
                  src={msg.avatar} 
                  alt={msg.sender} 
                  className={`w-10 h-10 rounded-2xl bg-white border-2 border-slate-100 ${msg.sender === stats.name ? 'ml-3' : 'mr-3'}`} 
                />
                <div className={`space-y-1 ${msg.sender === stats.name ? 'items-end' : 'items-start'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">
                    {msg.sender === stats.name ? 'Você' : msg.sender}
                  </p>
                  <div className={`px-5 py-3 rounded-3xl font-medium shadow-sm ${
                    msg.sender === stats.name 
                      ? 'bg-indigo-500 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Mande uma mensagem heróica..."
            className="flex-1 px-6 py-4 bg-slate-100 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-4 bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-100 hover:scale-110 active:scale-95 disabled:grayscale transition-all"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KidChat;
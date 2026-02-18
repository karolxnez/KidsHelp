
import React from 'react';
import { Book, Heart, Trash2, Zap } from 'lucide-react';
import { Task, Reward } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Arrumar a cama',
    description: 'Deixe sua cama lisinha para uma noite de sono real.',
    epicTitle: 'Organização do Trono Real',
    stars: 10,
    xp: 50,
    completed: false,
    category: 'cleaning',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Escovar os dentes',
    description: 'Expulse os monstros das cáries com sua escova mágica.',
    epicTitle: 'Batalha Contra as Bactérias',
    stars: 5,
    xp: 20,
    completed: false,
    category: 'health',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Ler 15 minutos',
    description: 'Viaje para outros mundos através das páginas.',
    epicTitle: 'Exploração de Pergaminhos Antigos',
    stars: 15,
    xp: 100,
    completed: false,
    category: 'learning',
    status: 'pending'
  }
];

export const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', title: '30 min de Video Game', cost: 50, icon: '🎮' },
  { id: 'r2', title: 'Escolher o Jantar', cost: 30, icon: '🍕' },
  { id: 'r3', title: 'Dormir 1 hora mais tarde', cost: 100, icon: '🌙' },
  { id: 'r4', title: 'Sorvete Especial', cost: 40, icon: '🍦' }
];

export const CATEGORY_ICONS = {
  cleaning: <Trash2 className="w-5 h-5" />,
  learning: <Book className="w-5 h-5" />,
  health: <Zap className="w-5 h-5" />,
  behavior: <Heart className="w-5 h-5" />
};

export const LEVEL_REQUIREMENTS = (level: number) => level * 500;

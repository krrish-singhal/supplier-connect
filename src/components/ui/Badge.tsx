import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const VARIANT_CLASSES = {
  default: 'bg-slate-100  text-slate-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50   text-amber-700',
  error:   'bg-red-50     text-red-600',
  info:    'bg-blue-50    text-blue-700',
};

const SIZE_CLASSES = {
  sm: { wrap: 'px-2 py-0.5 rounded-full',    text: 'text-xs' },
  md: { wrap: 'px-3 py-1 rounded-full',       text: 'text-xs font-medium' },
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', size = 'md', className = '' }) => {
  const v = VARIANT_CLASSES[variant];
  const s = SIZE_CLASSES[size];
  return (
    <View className={`self-start ${v.split(' ')[0]} ${s.wrap} ${className}`}>
      <Text className={`${v.split(' ').slice(1).join(' ')} ${s.text} font-medium`}>{label}</Text>
    </View>
  );
};

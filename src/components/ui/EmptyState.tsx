import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon, title, description, subtitle, actionLabel, onAction, action,
}) => (
  <View className="flex-1 items-center justify-center px-8 py-12">
    {icon && (
      <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
        <Ionicons name={icon as any} size={32} color="#94A3B8" />
      </View>
    )}
    <Text className="text-base font-bold text-slate-800 text-center mb-2">{title}</Text>
    {(description || subtitle) && (
      <Text className="text-sm text-slate-400 text-center leading-5">{description || subtitle}</Text>
    )}
    {actionLabel && onAction && (
      <TouchableOpacity
        onPress={onAction}
        className="mt-5 bg-blue-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-sm font-semibold text-white">{actionLabel}</Text>
      </TouchableOpacity>
    )}
    {action}
  </View>
);

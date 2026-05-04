import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Badge } from '../ui/Badge';
import type { Opportunity } from '@/src/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const STATUS_CONFIG = {
  open:          { variant: 'success' as const, label: 'Open',        icon: 'radio-button-on' as const },
  'in-progress': { variant: 'warning' as const, label: 'In Progress', icon: 'time-outline' as const },
  closed:        { variant: 'error'   as const, label: 'Closed',      icon: 'close-circle-outline' as const },
};

function formatBudget(min: number, max: number) {
  const fmt = (n: number) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toString();
  return `₹${fmt(min)} – ₹${fmt(max)}`;
}

function daysLeft(deadline: Date) {
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (d < 0) return 'Expired';
  if (d === 0) return 'Due today';
  return `${d}d left`;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity: opp }) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const status = STATUS_CONFIG[opp.status] ?? STATUS_CONFIG['closed'];
  const posterInitial = opp.postedBy.name[0].toUpperCase();
  const remaining = daysLeft(opp.deadline);
  const isExpired = remaining === 'Expired';

  return (
    <AnimatedTouchable
      onPress={() => router.push(`/opportunities/${opp.id}` as any)}
      onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      style={animStyle}
      activeOpacity={1}
      className="bg-white rounded-2xl p-4 border border-slate-100"
    >
      {/* Top row: category + status */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{opp.category}</Text>
        <Badge label={status.label} variant={status.variant} size="sm" />
      </View>
      {/* Title */}
      <Text className="text-sm font-bold text-slate-900 leading-5 mb-2" numberOfLines={2}>{opp.title}</Text>
      {/* Budget + deadline */}
      <View className="flex-row items-center gap-3 mb-3">
        <View className="flex-row items-center gap-1">
          <Ionicons name="cash-outline" size={13} color="#64748B" />
          <Text className="text-sm font-bold text-slate-900">{formatBudget(opp.budget.min, opp.budget.max)}</Text>
        </View>
        <View className={`flex-row items-center gap-1 ${isExpired ? 'opacity-60' : ''}`}>
          <Ionicons name="time-outline" size={13} color={isExpired ? '#EF4444' : '#64748B'} />
          <Text className={`text-xs font-medium ${isExpired ? 'text-red-500' : 'text-slate-500'}`}>{remaining}</Text>
        </View>
      </View>
      {/* Poster footer */}
      <View className="flex-row items-center justify-between pt-3 border-t border-slate-50">
        <View className="flex-row items-center gap-2">
          <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center">
            <Text className="text-xs font-bold text-blue-700">{posterInitial}</Text>
          </View>
          <Text className="text-xs text-slate-500">{opp.postedBy.businessName}</Text>
          {opp.postedBy.isVerified && <Ionicons name="checkmark-circle" size={13} color="#2563EB" />}
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="people-outline" size={13} color="#94A3B8" />
          <Text className="text-xs text-slate-400">{opp.applicantsCount} applied</Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

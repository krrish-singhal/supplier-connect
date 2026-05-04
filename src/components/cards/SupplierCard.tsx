import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Badge } from '../ui/Badge';
import type { Supplier } from '@/src/types';

interface SupplierCardProps {
  supplier: Supplier;
  variant?: 'default' | 'compact';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, variant = 'default' }) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const initials = supplier.businessName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  const minOrder = supplier.minimumOrderValue.toLocaleString('en-IN');

  if (variant === 'compact') {
    return (
      <AnimatedTouchable
        onPress={() => router.push(`/suppliers/${supplier.id}` as any)}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
        style={animStyle}
        activeOpacity={1}
        className="bg-white rounded-2xl p-4 border border-slate-100"
      >
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
            <Text className="text-blue-700 font-bold text-sm">{initials}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm font-semibold text-slate-900" numberOfLines={1}>{supplier.businessName}</Text>
              {supplier.isVerified && <Ionicons name="checkmark-circle" size={14} color="#2563EB" />}
            </View>
            <Text className="text-xs text-slate-400 mt-0.5">{supplier.city} · {supplier.region}</Text>
          </View>
          <View className="items-end gap-1">
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text className="text-xs font-semibold text-slate-700">{supplier.rating.toFixed(1)}</Text>
            </View>
            <Text className="text-xs text-slate-400">₹{minOrder}</Text>
          </View>
        </View>
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={() => router.push(`/suppliers/${supplier.id}` as any)}
      onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      style={animStyle}
      activeOpacity={1}
      className="bg-white rounded-2xl p-4 border border-slate-100"
    >
      {/* Header */}
      <View className="flex-row items-start gap-3 mb-3">
        <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center">
          <Text className="text-blue-700 font-bold text-base">{initials}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5 flex-wrap">
            <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>{supplier.businessName}</Text>
            {supplier.isVerified && <Ionicons name="checkmark-circle" size={15} color="#2563EB" />}
          </View>
          <Text className="text-xs text-slate-500 mt-0.5">{supplier.name}</Text>
        </View>
        <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text className="text-xs font-bold text-amber-700">{supplier.rating.toFixed(1)}</Text>
        </View>
      </View>
      {/* Location + years */}
      <View className="flex-row items-center gap-3 mb-3">
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={12} color="#94A3B8" />
          <Text className="text-xs text-slate-500">{supplier.city}, {supplier.region}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={12} color="#94A3B8" />
          <Text className="text-xs text-slate-500">{supplier.yearsInBusiness}y exp</Text>
        </View>
      </View>
      {/* Categories */}
      <View className="flex-row flex-wrap gap-1.5 mb-3">
        {supplier.categories.slice(0, 3).map((cat: string) => (
          <Badge key={cat} label={cat} size="sm" />
        ))}
        {supplier.categories.length > 3 && (
          <Badge label={`+${supplier.categories.length - 3}`} size="sm" />
        )}
      </View>
      {/* Footer */}
      <View className="flex-row items-center justify-between pt-3 border-t border-slate-50">
        <View>
          <Text className="text-xs text-slate-400">Min. Order</Text>
          <Text className="text-sm font-bold text-slate-900">₹{minOrder}</Text>
        </View>
        <View className="flex-row items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl">
          <Text className="text-xs font-semibold text-blue-700">View Profile</Text>
          <Ionicons name="arrow-forward" size={12} color="#2563EB" />
        </View>
      </View>
    </AnimatedTouchable>
  );
};

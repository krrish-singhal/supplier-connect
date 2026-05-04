import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';

interface SkeletonProps {
  className?: string;
  height?: number;
  width?: number | string;
  borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', height, width, borderRadius }) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 750 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[animStyle, height ? { height } : undefined, width ? { width: width as any } : undefined, borderRadius ? { borderRadius } : undefined]}
      className={`bg-slate-200 rounded-xl ${className}`}
    />
  );
};

export const SupplierCardSkeleton: React.FC = () => (
  <View className="bg-white rounded-2xl p-4 border border-slate-100">
    <View className="flex-row items-start gap-3 mb-3">
      <Skeleton height={48} width={48} borderRadius={16} />
      <View className="flex-1 gap-2">
        <Skeleton height={14} className="w-3/4" />
        <Skeleton height={11} className="w-1/2" />
      </View>
      <Skeleton height={28} width={52} borderRadius={8} />
    </View>
    <View className="gap-1.5 mb-3">
      <Skeleton height={11} className="w-2/3" />
      <Skeleton height={11} className="w-1/2" />
    </View>
    <View className="flex-row gap-1.5 mb-3">
      <Skeleton height={22} width={70} borderRadius={20} />
      <Skeleton height={22} width={80} borderRadius={20} />
      <Skeleton height={22} width={60} borderRadius={20} />
    </View>
    <View className="flex-row items-center justify-between pt-3 border-t border-slate-50">
      <Skeleton height={16} width={80} />
      <Skeleton height={30} width={90} borderRadius={12} />
    </View>
  </View>
);

export const OpportunityCardSkeleton: React.FC = () => (
  <View className="bg-white rounded-2xl p-4 border border-slate-100">
    <View className="flex-row items-center justify-between mb-2">
      <Skeleton height={11} width={80} />
      <Skeleton height={20} width={55} borderRadius={20} />
    </View>
    <Skeleton height={14} className="w-full mb-1" />
    <Skeleton height={14} className="w-4/5 mb-3" />
    <View className="flex-row gap-3 mb-3">
      <Skeleton height={16} width={100} />
      <Skeleton height={16} width={70} />
    </View>
    <View className="flex-row items-center justify-between pt-3 border-t border-slate-50">
      <Skeleton height={12} width={130} />
      <Skeleton height={12} width={80} />
    </View>
  </View>
);

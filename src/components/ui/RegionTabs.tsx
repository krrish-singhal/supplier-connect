import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Region } from '@/src/types';
import { REGIONS } from '@/src/constants';

interface RegionTabsProps {
  selectedRegion: Region | 'all';
  onSelectRegion: (region: Region | 'all') => void;
}

export const RegionTabs: React.FC<RegionTabsProps> = ({ selectedRegion, onSelectRegion }) => {
  const allRegions: (Region | 'all')[] = ['all', ...REGIONS];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {allRegions.map((region) => {
        const isActive = selectedRegion === region;
        return (
          <TouchableOpacity
            key={region}
            onPress={() => onSelectRegion(region)}
            className={`px-4 py-2.5 rounded-full ${isActive ? 'bg-blue-600' : 'bg-slate-100'}`}
            activeOpacity={0.8}
          >
            <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-600'}`}>
              {region === 'all' ? 'All Regions' : region}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

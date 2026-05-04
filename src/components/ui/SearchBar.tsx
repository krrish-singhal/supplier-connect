import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  showFilter?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value, onChangeText, placeholder = 'Search...', onFilterPress, showFilter = false,
}) => (
  <View className="flex-row items-center gap-2">
    <View className="flex-1 flex-row items-center bg-slate-100 rounded-xl px-3 py-2.5 gap-2">
      <Ionicons name="search-outline" size={16} color="#94A3B8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        className="flex-1 text-sm text-slate-900"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={16} color="#94A3B8" />
        </TouchableOpacity>
      )}
    </View>
    {showFilter && (
      <TouchableOpacity
        onPress={onFilterPress}
        className="w-10 h-10 items-center justify-center bg-blue-600 rounded-xl"
      >
        <Ionicons name="options-outline" size={18} color="#fff" />
      </TouchableOpacity>
    )}
  </View>
);

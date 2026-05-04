import React, { forwardRef, useState } from 'react';
import { View, TextInput, Text, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, style, className: _cls, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const borderClass = error ? 'border-red-400' : focused ? 'border-blue-500' : 'border-slate-200';
    const bgClass = focused ? 'bg-white' : 'bg-slate-50';

    return (
      <View className="w-full">
        {label && <Text className="text-sm font-semibold text-slate-700 mb-1.5">{label}</Text>}
        <View className={`flex-row items-center ${bgClass} ${borderClass} border-[1.5px] rounded-xl px-3.5`}>
          {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
          <TextInput
            ref={ref}
            className="flex-1 text-sm text-slate-900 py-3.5"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholderTextColor="#94A3B8"
            {...props}
          />
          {rightIcon && <View className="ml-2.5">{rightIcon}</View>}
        </View>
        {error ? (
          <Text className="text-xs text-red-500 mt-1.5 ml-0.5">{error}</Text>
        ) : hint ? (
          <Text className="text-xs text-slate-400 mt-1.5 ml-0.5">{hint}</Text>
        ) : null}
      </View>
    );
  }
);
Input.displayName = 'Input';

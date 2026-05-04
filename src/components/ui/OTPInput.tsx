import React, { useRef, useEffect } from "react";
import { View, TextInput, Pressable, Text } from "react-native";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  autoFocus = true,
}) => {
  const inputRef = useRef<TextInput>(null);
  const completedValueRef = useRef("");

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 100);
  }, [autoFocus]);

  useEffect(() => {
    if (value.length !== length) {
      completedValueRef.current = "";
      return;
    }

    if (onComplete && completedValueRef.current !== value) {
      completedValueRef.current = value;
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChange = (text: string) => {
    onChange(text.replace(/[^0-9]/g, "").slice(0, length));
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <Pressable onPress={focusInput} className="items-center">
      {/* Hidden real input */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        className="absolute w-px h-px opacity-0"
      />
      {/* Visual digit boxes */}
      <View className="flex-row gap-2.5">
        {Array.from({ length }).map((_, index) => {
          const digit = value[index];
          const isFilled = !!digit;
          const isActive =
            index === value.length ||
            (index === length - 1 && value.length === length);
          return (
            <Pressable
              key={index}
              onPress={focusInput}
              className={`w-12 h-14 rounded-2xl items-center justify-center ${isActive ? "bg-blue-50" : isFilled ? "bg-white" : "bg-slate-50"}`}
              style={{
                shadowColor: isActive ? "#2563EB" : "#0F172A",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: isActive ? 0.18 : 0.07,
                shadowRadius: 14,
                elevation: isActive ? 5 : 3,
              }}
            >
              {isFilled ? (
                <Text className="text-2xl font-bold text-slate-900">
                  {digit}
                </Text>
              ) : isActive ? (
                <View className="w-0.5 h-6 bg-blue-500 rounded-full" />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </Pressable>
  );
};

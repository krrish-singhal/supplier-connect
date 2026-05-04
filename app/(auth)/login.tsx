import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/src/store/authStore";
import { api } from "@/src/lib/api";
import { DEMO_MODE } from "@/src/constants";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setPhoneNumber = useAuthStore((state) => state.setPhoneNumber);

  const handleContinue = async () => {
    setError("");
    if (phone.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const mobile = `+91${phone.replace(/\D/g, "")}`;
      setPhoneNumber(mobile);

      if (__DEV__ || DEMO_MODE) {
        // Demo / dev mode: skip network, go straight to OTP screen
        // Use OTP: 123456
        router.push("/(auth)/verify");
        return;
      }

      await api.post("/api/auth/send-otp", { mobile });
      router.push("/(auth)/verify");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 10) setPhone(cleaned);
  };

  const isReady = phone.length >= 10 && !loading;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View className="items-center mb-12">
            <View
              className="w-16 h-16 rounded-[18px] bg-blue-600 items-center justify-center mb-3.5"
              style={{
                shadowColor: "#2563EB",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Ionicons name="business" size={32} color="#FFFFFF" />
            </View>
            <Text className="text-2xl font-bold text-slate-900">
              SupplierConnect
            </Text>
            <Text className="text-sm text-slate-400 mt-1">
              B2B Supplier Discovery Platform
            </Text>
          </View>

          {/* Heading */}
          <View className="mb-7">
            <Text className="text-[26px] font-bold text-slate-900 mb-1.5">
              Welcome Back
            </Text>
            <Text className="text-base text-slate-500">
              Enter your mobile number to continue
            </Text>
          </View>

          {/* Input */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">
              Mobile Number
            </Text>
            <View
              className={`flex-row items-center bg-slate-50 rounded-xl px-4 h-14 ${error ? "border border-red-400" : "border border-slate-200"}`}
            >
              <Text className="text-base font-semibold text-slate-700">
                +91
              </Text>
              <View className="w-px h-5 bg-slate-200 mx-3" />
              <TextInput
                placeholder="Enter 10-digit number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={formatPhone}
                maxLength={10}
                className="flex-1 text-base text-slate-900 py-0"
              />
            </View>
            {error ? (
              <Text className="text-xs text-red-500 mt-1.5">{error}</Text>
            ) : null}
          </View>

          {/* Terms */}
          <Text className="text-xs text-slate-400 text-center mb-7 leading-relaxed">
            By continuing, you agree to our{" "}
            <Text className="text-blue-600 font-medium">Terms of Service</Text>{" "}
            and{" "}
            <Text className="text-blue-600 font-medium">Privacy Policy</Text>
          </Text>

          {/* CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContinue}
            disabled={!isReady}
            className={`h-14 rounded-xl items-center justify-center ${isReady ? "bg-blue-600" : "bg-slate-200"}`}
            style={
              isReady
                ? {
                    shadowColor: "#2563EB",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 4,
                  }
                : undefined
            }
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                className={`text-base font-semibold ${isReady ? "text-white" : "text-slate-400"}`}
              >
                Continue
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-5 py-3 items-center"
            onPress={() => setPhone("9876543210")}
          >
            <Text className="text-sm text-slate-300">
              Demo: Tap to fill test number
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

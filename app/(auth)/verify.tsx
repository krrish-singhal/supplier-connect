import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, OTPInput } from "@/src/components";
import { useAuthStore } from "@/src/store/authStore";
import { api } from "@/src/lib/api";
import { DEMO_MODE } from "@/src/constants";

export default function VerifyScreen() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const verifyingRef = useRef(false);
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((x) => x - 1), 1000);
      return () => clearTimeout(t);
    } else setCanResend(true);
  }, [resendTimer]);

  const handleVerify = useCallback(
    async (code: string) => {
      if (code.length !== 6 || verifyingRef.current) return;
      verifyingRef.current = true;
      setError("");
      setLoading(true);
      try {
        if (__DEV__ || DEMO_MODE) {
          // Demo mode: OTP is always 123456, no backend needed
          if (code !== "123456") {
            throw new Error("Demo mode: use OTP 123456");
          }
          setToken("demo-token");
          router.replace("/(auth)/onboarding");
          return;
        }

        const res = await api.post<{
          token: string;
          isNewUser: boolean;
          user: unknown;
        }>("/api/auth/verify-otp", { mobile: phoneNumber, otp: code });
        if (res.isNewUser) {
          setToken(res.token);
          router.replace("/(auth)/onboarding");
        } else {
          setUser(res.user as Parameters<typeof setUser>[0], res.token);
          router.replace("/(tabs)/home");
        }
      } catch (err: unknown) {
        verifyingRef.current = false;
        setError(
          err instanceof Error ? err.message : "OTP verification failed",
        );
      } finally {
        setLoading(false);
      }
    },
    [phoneNumber, setUser, setToken],
  );

  const handleResend = async () => {
    if (!canResend) return;
    verifyingRef.current = false;
    setCanResend(false);
    setResendTimer(30);
    setOtp("");
    try {
      await api.post("/api/auth/send-otp", { mobile: phoneNumber });
    } catch {}
  };

  const formatPhone = (p: string) => `+91 ${p.slice(2, 7)} ${p.slice(7)}`;

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
            paddingTop: 16,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mb-8"
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>

          <View className="mb-9">
            <Text className="text-[26px] font-bold text-slate-900 mb-2">
              Verify Your Number
            </Text>
            <Text className="text-base text-slate-500">
              We sent a 6-digit code to{" "}
              <Text className="font-semibold text-slate-700">
                {formatPhone(phoneNumber)}
              </Text>
            </Text>
          </View>

          <View className="mb-7">
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
            />
            {error ? (
              <Text className="text-sm text-red-500 text-center mt-3">
                {error}
              </Text>
            ) : null}
          </View>

          <View className="items-center mb-8">
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text className="text-base font-semibold text-blue-600">
                  Resend Code
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-sm text-slate-400">
                Resend code in{" "}
                <Text className="font-semibold text-slate-700">
                  {resendTimer}s
                </Text>
              </Text>
            )}
          </View>

          <Button
            title="Verify"
            onPress={() => handleVerify(otp)}
            loading={loading}
            fullWidth
            disabled={otp.length < 6}
          />

          <TouchableOpacity
            className="mt-5 py-3 items-center"
            onPress={() => setOtp("123456")}
          >
            <Text className="text-sm text-slate-300">
              Demo: Tap to fill test OTP (123456)
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

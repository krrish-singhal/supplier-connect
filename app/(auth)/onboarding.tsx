import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input } from "@/src/components";
import { useAuthStore } from "@/src/store/authStore";
import { REGIONS, CATEGORIES } from "@/src/constants";
import { Region, Category, User } from "@/src/types";
import { api } from "@/src/lib/api";

type Step = "profile" | "region" | "categories";

export default function OnboardingScreen() {
  const { height } = useWindowDimensions();
  const [step, setStep] = useState<Step>("profile");
  const [loading, setLoading] = useState(false);
  const { phoneNumber, setUser, token } = useAuthStore();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const handleNext = () => {
    if (step === "profile") setStep("region");
    else if (step === "region") setStep("categories");
  };
  const handleBack = () => {
    if (step === "region") setStep("profile");
    else if (step === "categories") setStep("region");
  };
  const toggleCategory = (cat: Category) => {
    if (selectedCategories.includes(cat))
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    else if (selectedCategories.length < 5)
      setSelectedCategories([...selectedCategories, cat]);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await api.post<{ user: User }>("/api/users/onboarding", {
        name,
        company_name: businessName,
        type: "buyer",
        city: selectedRegion || "",
        categories: selectedCategories,
      });
      setUser(res.user, token ?? undefined);
    } catch {
      const user: User = {
        id: "local-" + Date.now(),
        phone: phoneNumber,
        name,
        businessName,
        email,
        region: selectedRegion!,
        categories: selectedCategories,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(user, token ?? undefined);
    } finally {
      setLoading(false);
      router.replace("/(tabs)/home");
    }
  };

  const canProceed = () => {
    if (step === "profile") return name.length >= 2 && businessName.length >= 2;
    if (step === "region") return selectedRegion !== null;
    if (step === "categories") return selectedCategories.length >= 1;
    return false;
  };

  const stepNumber = { profile: 1, region: 2, categories: 3 }[step];

  return (
    <SafeAreaView
      style={[s.safe, { minHeight: height }]}
      edges={["top", "bottom"]}
    >
      <View style={s.root}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerRow}>
            {step !== "profile" ? (
              <TouchableOpacity
                style={s.backBtn}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="#334155" />
              </TouchableOpacity>
            ) : (
              <View style={s.backBtnPlaceholder} />
            )}
            <Text style={s.stepLabel}>Step {stepNumber} of 3</Text>
            <View style={s.backBtnPlaceholder} />
          </View>
          <View style={s.progressRow}>
            {[1, 2, 3].map((n) => (
              <View
                key={n}
                style={[
                  s.progressBar,
                  n <= stepNumber ? s.progressActive : s.progressInactive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Scrollable content */}
        <KeyboardAvoidingView
          style={s.content}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === "profile" && (
              <View style={s.stepContainer}>
                <Text style={s.title}>Create Your Profile</Text>
                <Text style={s.subtitle}>
                  Tell us about yourself and your business
                </Text>
                <View style={s.fieldGap}>
                  <Input
                    label="Your Name"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                  <Input
                    label="Business Name"
                    placeholder="Enter your company name"
                    value={businessName}
                    onChangeText={setBusinessName}
                    autoCapitalize="words"
                  />
                  <Input
                    label="Email (Optional)"
                    placeholder="Enter your email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}

            {step === "region" && (
              <View style={s.stepContainer}>
                <Text style={s.title}>Select Your Region</Text>
                <Text style={s.subtitle}>
                  Choose your primary business region in India
                </Text>
                <View style={s.regionList}>
                  {REGIONS.map((region) => {
                    const sel = selectedRegion === region;
                    return (
                      <TouchableOpacity
                        key={region}
                        onPress={() => setSelectedRegion(region)}
                        activeOpacity={0.7}
                        style={[
                          s.regionItem,
                          sel ? s.regionSelected : s.regionDefault,
                        ]}
                      >
                        <Text
                          style={[
                            s.regionText,
                            sel ? s.regionTextSel : s.regionTextDef,
                          ]}
                        >
                          {region}
                        </Text>
                        {sel && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#2563EB"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {step === "categories" && (
              <View style={s.stepContainer}>
                <Text style={s.title}>Select Categories</Text>
                <Text style={s.subtitle}>
                  Choose up to 5 categories you are interested in
                </Text>
                <View style={s.catGrid}>
                  {CATEGORIES.map((cat) => {
                    const sel = selectedCategories.includes(cat);
                    const dis = !sel && selectedCategories.length >= 5;
                    return (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => toggleCategory(cat)}
                        disabled={dis}
                        activeOpacity={0.7}
                        style={[
                          s.catChip,
                          sel ? s.catSel : dis ? s.catDis : s.catDef,
                        ]}
                      >
                        <Text
                          style={[s.catText, sel ? s.catTextSel : s.catTextDef]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={s.catCount}>
                  {selectedCategories.length}/5 selected
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Fixed bottom CTA — only one Button rendered here */}
        <View style={s.cta}>
          <Button
            title={step === "categories" ? "Get Started" : "Continue"}
            onPress={step === "categories" ? handleComplete : handleNext}
            loading={loading}
            fullWidth
            disabled={!canProceed()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", position: "relative" },
  root: { flex: 1, position: "relative" },
  content: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnPlaceholder: { width: 40 },
  stepLabel: { fontSize: 14, fontWeight: "500", color: "#64748B" },
  progressRow: { flexDirection: "row", gap: 8 },
  progressBar: { flex: 1, height: 4, borderRadius: 99 },
  progressActive: { backgroundColor: "#2563EB" },
  progressInactive: { backgroundColor: "#E2E8F0" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 128 },
  stepContainer: { paddingTop: 8 },
  title: { fontSize: 26, fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 32,
    lineHeight: 22,
  },
  fieldGap: { gap: 20 },
  regionList: { gap: 12 },
  regionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  regionDefault: { borderColor: "#E2E8F0", backgroundColor: "#fff" },
  regionSelected: { borderColor: "#3B82F6", backgroundColor: "#EFF6FF" },
  regionText: { fontSize: 16, fontWeight: "500" },
  regionTextDef: { color: "#334155" },
  regionTextSel: { color: "#1D4ED8" },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  catDef: { borderColor: "#E2E8F0", backgroundColor: "#fff" },
  catSel: { borderColor: "#3B82F6", backgroundColor: "#EFF6FF" },
  catDis: { borderColor: "#F1F5F9", backgroundColor: "#F8FAFC", opacity: 0.5 },
  catText: { fontSize: 14, fontWeight: "500" },
  catTextDef: { color: "#334155" },
  catTextSel: { color: "#1D4ED8" },
  catCount: { fontSize: 14, color: "#94A3B8", marginTop: 16 },
  cta: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
});

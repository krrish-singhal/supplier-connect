import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Badge, Button } from "@/src/components";
import { getOpportunityById } from "@/src/data/mockData";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useAuthStore } from "@/src/store/authStore";
import { api } from "@/src/lib/api";
import type { Opportunity } from "@/src/types";

const STATUS_CONFIG: Record<string, { badge: string; label: string }> = {
  open: { badge: "bg-green-100 text-green-700", label: "Open" },
  "in-progress": { badge: "bg-amber-100 text-amber-700", label: "In Progress" },
  closed: { badge: "bg-red-100 text-red-600", label: "Closed" },
};

function formatBudget(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 100000
      ? `${(n / 100000).toFixed(1)}L`
      : n >= 1000
        ? `${(n / 1000).toFixed(0)}K`
        : n.toLocaleString("en-IN");
  return `₹${fmt(min)} – ₹${fmt(max)}`;
}

function daysLeft(deadline: Date) {
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (d < 0) return "Expired";
  if (d === 0) return "Due today";
  return `${d} days left`;
}

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [opp, setOpp] = useState<Opportunity | null | undefined>(undefined);
  const { applyToOpportunity, hasApplied } = useUserDataStore();
  const user = useAuthStore((s) => s.user);
  const [showApply, setShowApply] = useState(false);
  const [appMessage, setAppMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<{ opportunity: Opportunity }>(`/api/opportunities/${id}`)
      .then((r) => setOpp(r.opportunity ?? null))
      .catch(() => setOpp(getOpportunityById(id) ?? null));
  }, [id]);

  if (opp === undefined) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={["top", "bottom"]}>
        <ActivityIndicator color="#3B82F6" />
      </SafeAreaView>
    );
  }

  if (!opp) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={["top", "bottom"]}>
        <Text className="text-base text-slate-400">Opportunity not found</Text>
      </SafeAreaView>
    );
  }

  const status = STATUS_CONFIG[opp.status] ?? STATUS_CONFIG["closed"];
  const posterInitial = opp.postedBy.name[0].toUpperCase();
  const remaining = daysLeft(opp.deadline);
  const alreadyApplied = hasApplied(opp.id);

  const handleApply = async () => {
    if (!appMessage.trim()) {
      Alert.alert(
        "Required",
        "Please enter a message to express your interest.",
      );
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    applyToOpportunity({
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      message: appMessage.trim(),
    });
    setSubmitting(false);
    setAppMessage("");
    setShowApply(false);
    Alert.alert(
      "Application Submitted!",
      `Your interest in "${opp.title}" has been recorded. The buyer will review your profile.`,
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="#334155" />
        </TouchableOpacity>
        <Text
          className="flex-1 text-base font-semibold text-slate-900 mx-3"
          numberOfLines={1}
        >
          {opp.title}
        </Text>
        <View
          className={`px-2.5 py-1 rounded-full ${status.badge.split(" ")[0]}`}
        >
          <Text className={`text-xs font-bold ${status.badge.split(" ")[1]}`}>
            {status.label}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        {/* Hero */}
        <View className="bg-white px-5 py-5 border-b border-slate-100">
          <Text className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1.5">
            {opp.category}
          </Text>
          <Text className="text-xl font-bold text-slate-900 leading-[27px]">
            {opp.title}
          </Text>
          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-[18px] font-bold text-slate-900">
              {formatBudget(opp.budget.min, opp.budget.max)}
            </Text>
            <View className="flex-row items-center gap-1 bg-red-50 px-2.5 py-1 rounded-full">
              <Ionicons name="time-outline" size={13} color="#DC2626" />
              <Text className="text-xs font-semibold text-red-600">
                {remaining}
              </Text>
            </View>
          </View>
        </View>

        {/* Posted By */}
        <View className="px-5 mt-5">
          <Text className="text-base font-bold text-slate-900 mb-2.5">
            Posted By
          </Text>
          <View className="flex-row items-center bg-white rounded-2xl p-3.5 border border-slate-100">
            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
              <Text className="text-lg font-bold text-blue-600">
                {posterInitial}
              </Text>
            </View>
            <View className="flex-1 ml-3">
              <View className="flex-row items-center">
                <Text className="text-base font-semibold text-slate-900">
                  {opp.postedBy.name}
                </Text>
                {opp.postedBy.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#2563EB"
                    style={{ marginLeft: 6 }}
                  />
                )}
              </View>
              <Text className="text-sm text-slate-500 mt-0.5">
                {opp.postedBy.businessName}
              </Text>
              <Text className="text-xs text-slate-400 mt-0.5">
                {opp.region}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="px-5 mt-5">
          <Text className="text-base font-bold text-slate-900 mb-2.5">
            Description
          </Text>
          <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <Text className="text-sm text-slate-600 leading-relaxed">
              {opp.description}
            </Text>
          </View>
        </View>

        {/* Requirements */}
        <View className="px-5 mt-5">
          <Text className="text-base font-bold text-slate-900 mb-2.5">
            Requirements
          </Text>
          <View className="bg-white rounded-2xl p-4 border border-slate-100">
            {opp.requirements.map((req: string, i: number) => (
              <View key={i} className="flex-row items-start gap-2.5 py-1.5">
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                <Text className="flex-1 text-sm text-slate-700 leading-5">
                  {req}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Details */}
        <View className="px-5 mt-5">
          <Text className="text-base font-bold text-slate-900 mb-2.5">
            Details
          </Text>
          <View className="bg-white rounded-2xl p-4 border border-slate-100">
            {[
              { icon: "location-outline", label: "Region", value: opp.region },
              { icon: "cube-outline", label: "Quantity", value: opp.quantity },
              {
                icon: "calendar-outline",
                label: "Deadline",
                value: new Date(opp.deadline).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              },
            ].map((row, i) => (
              <View
                key={row.label}
                className={`flex-row items-center py-2.5 ${i > 0 ? "border-t border-slate-50" : ""}`}
              >
                <View className="w-7 items-center">
                  <Ionicons name={row.icon as any} size={16} color="#64748B" />
                </View>
                <Text className="flex-1 text-sm text-slate-500 ml-2">
                  {row.label}
                </Text>
                <Text className="text-sm font-semibold text-slate-900">
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View className="px-5 mt-8">
          {alreadyApplied ? (
            <View className="h-14 rounded-xl bg-green-50 border border-green-200 items-center justify-center flex-row gap-2">
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
              <Text className="text-base font-semibold text-green-700">
                Interest Already Submitted
              </Text>
            </View>
          ) : (
            <Button
              title={
                opp.status === "closed"
                  ? "Opportunity Closed"
                  : "Express Interest"
              }
              onPress={() => setShowApply(true)}
              fullWidth
              size="lg"
              disabled={opp.status === "closed"}
            />
          )}
        </View>
      </ScrollView>

      {/* Apply Modal */}
      <Modal
        visible={showApply}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowApply(false)}
      >
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
              <Text className="text-xl font-bold text-slate-900">
                Express Interest
              </Text>
              <TouchableOpacity
                onPress={() => setShowApply(false)}
                className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              >
                <Ionicons name="close" size={22} color="#475569" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1 px-5"
              contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Opportunity info */}
              <View className="bg-blue-50 rounded-2xl p-4 mb-6">
                <Text className="text-xs font-semibold text-blue-600 uppercase mb-1">
                  {opp.category}
                </Text>
                <Text
                  className="text-base font-bold text-slate-900"
                  numberOfLines={2}
                >
                  {opp.title}
                </Text>
                <Text className="text-sm text-slate-500 mt-1">
                  {opp.postedBy.businessName} · {opp.region}
                </Text>
              </View>

              {/* Message */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-700 mb-2">
                  Why are you a good fit? *
                </Text>
                <TextInput
                  value={appMessage}
                  onChangeText={setAppMessage}
                  placeholder="Describe your capabilities, experience, and how you can fulfil this requirement..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 min-h-[140px]"
                />
              </View>

              {/* Your info */}
              <View className="bg-slate-50 rounded-xl p-3.5 mb-6">
                <Text className="text-xs font-semibold text-slate-500 mb-1">
                  Submitting as
                </Text>
                <Text className="text-sm text-slate-700">
                  {user?.name || "Guest"} · {user?.businessName || ""}
                </Text>
                <Text className="text-xs text-slate-400 mt-1">
                  {user?.phone || ""}
                </Text>
              </View>

              <Button
                title={submitting ? "Submitting..." : "Submit Application"}
                onPress={handleApply}
                fullWidth
                size="lg"
                disabled={submitting || !appMessage.trim()}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

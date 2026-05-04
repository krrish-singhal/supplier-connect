import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Badge, Button } from "@/src/components";
import { getSupplierById } from "@/src/data/mockData";
import { useUserDataStore } from "@/src/store/userDataStore";
import { useAuthStore } from "@/src/store/authStore";
import { api } from "@/src/lib/api";
import type { Supplier } from "@/src/types";

export default function SupplierDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null | undefined>(
    undefined,
  );
  const { isSaved, saveSupplier, unsaveSupplier, sendInquiry } =
    useUserDataStore();
  const user = useAuthStore((s) => s.user);
  const [showInquiry, setShowInquiry] = useState(false);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api
      .get<{ supplier: Supplier }>(`/api/suppliers/${id}`)
      .then((r) => setSupplier(r.supplier ?? null))
      .catch(() => setSupplier(getSupplierById(id) ?? null));
  }, [id]);

  if (supplier === undefined) {
    return (
      <SafeAreaView
        className="flex-1 bg-white items-center justify-center"
        edges={["top", "bottom"]}
      >
        <ActivityIndicator color="#3B82F6" />
      </SafeAreaView>
    );
  }

  if (!supplier) {
    return (
      <SafeAreaView
        className="flex-1 bg-white items-center justify-center"
        edges={["top", "bottom"]}
      >
        <Text className="text-base text-slate-400">Supplier not found</Text>
      </SafeAreaView>
    );
  }

  const saved = isSaved(supplier.id);
  const initials = supplier.businessName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const stars = Array.from(
    { length: 5 },
    (_, i) => i < Math.round(supplier.rating),
  );

  const toggleSave = () => {
    if (saved) {
      unsaveSupplier(supplier.id);
    } else {
      saveSupplier(supplier);
      Alert.alert(
        "Saved!",
        `${supplier.businessName} added to your saved suppliers.`,
      );
    }
  };

  const handleSendInquiry = async () => {
    if (!message.trim()) {
      Alert.alert("Required", "Please enter a message.");
      return;
    }
    setSending(true);
    // Simulate network delay (replace with real Firebase call)
    await new Promise((r) => setTimeout(r, 1000));
    sendInquiry({
      supplierId: supplier.id,
      supplierName: supplier.name,
      businessName: supplier.businessName,
      message: message.trim(),
      quantity: quantity.trim() || "Not specified",
      contactName: user?.name || "Guest",
      contactPhone: user?.phone || "",
    });
    setSending(false);
    setMessage("");
    setQuantity("");
    setShowInquiry(false);
    Alert.alert(
      "Inquiry Sent!",
      `Your inquiry has been sent to ${supplier.businessName}. They will contact you shortly.`,
      [{ text: "OK" }],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      {/* Top bar */}
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
          {supplier.businessName}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            try {
              await Share.share({
                message: `Check out ${supplier.businessName} on SupplierConnect!\nContact: ${supplier.phone}`,
              });
            } catch {}
          }}
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
        >
          <Ionicons name="share-social-outline" size={20} color="#334155" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        {/* Hero */}
        <View className="bg-white items-center py-7 px-5 border-b border-slate-100">
          <View className="w-[88px] h-[88px] rounded-full bg-blue-100 items-center justify-center mb-3.5">
            <Text className="text-[30px] font-bold text-blue-600">
              {initials}
            </Text>
          </View>
          <Text className="text-xl font-bold text-slate-900 text-center">
            {supplier.businessName}
          </Text>
          <Text className="text-sm text-slate-500 mt-1">{supplier.name}</Text>
          <View className="flex-row items-center gap-0.5 mt-2.5">
            {stars.map((filled, i) => (
              <Ionicons
                key={i}
                name={filled ? "star" : "star-outline"}
                size={16}
                color={filled ? "#F59E0B" : "#CBD5E1"}
              />
            ))}
            <Text className="text-sm text-slate-500 ml-1.5">
              {supplier.rating.toFixed(1)} ({supplier.reviewCount})
            </Text>
          </View>
          <View className="flex-row items-center gap-1 mt-2">
            <Ionicons name="location-outline" size={14} color="#94A3B8" />
            <Text className="text-sm text-slate-400">
              {supplier.city}, {supplier.region}
            </Text>
          </View>
          {supplier.isVerified && (
            <View className="flex-row items-center gap-1 mt-2 bg-blue-50 px-3 py-1 rounded-full">
              <Ionicons name="checkmark-circle" size={14} color="#2563EB" />
              <Text className="text-xs font-semibold text-blue-600">
                Verified Supplier
              </Text>
            </View>
          )}
        </View>

        {/* Quick actions */}
        <View className="flex-row bg-white py-4 px-2 border-b border-slate-100">
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${supplier.phone}`)}
            className="flex-1 items-center gap-1.5"
          >
            <Ionicons name="call" size={22} color="#2563EB" />
            <Text className="text-xs font-medium text-blue-600">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:${supplier.email}`)}
            className="flex-1 items-center gap-1.5"
          >
            <Ionicons name="mail" size={22} color="#2563EB" />
            <Text className="text-xs font-medium text-blue-600">Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleSave}
            className="flex-1 items-center gap-1.5"
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={22}
              color={saved ? "#2563EB" : "#2563EB"}
            />
            <Text className="text-xs font-medium text-blue-600">
              {saved ? "Saved" : "Save"}
            </Text>
          </TouchableOpacity>
          {supplier.website && (
            <TouchableOpacity
              onPress={() => Linking.openURL(supplier.website!)}
              className="flex-1 items-center gap-1.5"
            >
              <Ionicons name="globe-outline" size={22} color="#2563EB" />
              <Text className="text-xs font-medium text-blue-600">Website</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* About */}
        <View className="px-5 mt-5">
          <Text className="text-base font-bold text-slate-900 mb-2.5">
            About
          </Text>
          <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <Text className="text-sm text-slate-600 leading-relaxed">
              {supplier.description}
            </Text>
          </View>
        </View>

        {/* Business Details */}
        <View className="px-5 mt-5">
          <Text className="text-base font-bold text-slate-900 mb-2.5">
            Business Details
          </Text>
          <View className="bg-white rounded-2xl p-4 border border-slate-100">
            {[
              {
                icon: "time-outline",
                label: "Years in Business",
                value: `${supplier.yearsInBusiness} years`,
              },
              {
                icon: "cube-outline",
                label: "Min. Order Value",
                value: `₹${supplier.minimumOrderValue.toLocaleString("en-IN")}`,
              },
              {
                icon: "location-outline",
                label: "Location",
                value: `${supplier.city}, ${supplier.region}`,
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

        {/* Categories */}
        <View className="px-5 mt-5">
          <Text className="text-base font-bold text-slate-900 mb-2.5">
            Categories
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {supplier.categories.map((cat: string) => (
              <Badge key={cat} label={cat} size="sm" />
            ))}
          </View>
        </View>

        {/* CTA Buttons */}
        <View className="px-5 mt-8 gap-3">
          <Button
            title="Send Inquiry"
            onPress={() => setShowInquiry(true)}
            fullWidth
            size="lg"
          />
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${supplier.phone}`)}
            className="h-12 rounded-xl border border-slate-200 bg-white items-center justify-center"
          >
            <Text className="text-base font-semibold text-slate-700">
              Call Directly
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Inquiry Modal */}
      <Modal
        visible={showInquiry}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInquiry(false)}
      >
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
              <Text className="text-xl font-bold text-slate-900">
                Send Inquiry
              </Text>
              <TouchableOpacity
                onPress={() => setShowInquiry(false)}
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
              {/* Supplier info */}
              <View className="flex-row items-center bg-blue-50 rounded-2xl p-3.5 mb-6">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                  <Text className="text-sm font-bold text-blue-600">
                    {initials}
                  </Text>
                </View>
                <View className="ml-3">
                  <Text className="text-sm font-bold text-slate-900">
                    {supplier.businessName}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {supplier.city}, {supplier.region}
                  </Text>
                </View>
              </View>

              {/* Message */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-700 mb-2">
                  Message *
                </Text>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Describe what you need — product specs, quantity, delivery timeline..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 min-h-[120px]"
                />
              </View>

              {/* Quantity */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-700 mb-2">
                  Required Quantity
                </Text>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="e.g. 50 units, 5 tons, 10,000 pcs/month"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-sm text-slate-900"
                />
              </View>

              {/* Contact info display */}
              <View className="bg-slate-50 rounded-xl p-3.5 mb-6">
                <Text className="text-xs font-semibold text-slate-500 mb-1">
                  Your contact details
                </Text>
                <Text className="text-sm text-slate-700">
                  {user?.name || "Guest"} · {user?.phone || "No phone"}
                </Text>
                <Text className="text-xs text-slate-400 mt-1">
                  {user?.businessName || ""}
                </Text>
              </View>

              <Button
                title={sending ? "Sending..." : "Send Inquiry"}
                onPress={handleSendInquiry}
                fullWidth
                size="lg"
                disabled={sending || !message.trim()}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

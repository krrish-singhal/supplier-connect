import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "@/src/components";
import { useAuthStore } from "@/src/store/authStore";
import { useUserDataStore } from "@/src/store/userDataStore";
import { mockSuppliers } from "@/src/data/mockData";
import { api } from "@/src/lib/api";

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showBadge?: boolean;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onPress,
  showBadge,
  danger,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="flex-row items-center bg-white rounded-2xl px-3.5 py-3.5 mb-2"
  >
    <View
      className={`w-9 h-9 rounded-[19px] items-center justify-center ${danger ? "bg-red-100" : "bg-slate-100"}`}
    >
      <Ionicons name={icon} size={20} color={danger ? "#DC2626" : "#475569"} />
    </View>
    <Text
      className={`flex-1 text-base font-medium ml-3 ${danger ? "text-red-600" : "text-slate-900"}`}
    >
      {label}
    </Text>
    {showBadge && <View className="w-2 h-2 rounded-full bg-blue-600 mr-2.5" />}
    <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { savedSupplierIds, inquiries, applications, unsaveSupplier } =
    useUserDataStore();
  const [showSaved, setShowSaved] = useState(false);
  const [showInquiries, setShowInquiries] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [apiSavedSuppliers, setApiSavedSuppliers] = useState<typeof mockSuppliers | null>(null);
  const [apiInquiriesCount, setApiInquiriesCount] = useState<number | null>(null);

  useEffect(() => {
    api.get<{ saved: typeof mockSuppliers }>('/api/saved')
      .then((r) => { if (r.saved) setApiSavedSuppliers(r.saved); })
      .catch(() => {});
    api.get<{ inquiries: unknown[] }>('/api/inquiries/mine')
      .then((r) => { if (Array.isArray(r.inquiries)) setApiInquiriesCount(r.inquiries.length); })
      .catch(() => {});
  }, []);

  const savedSuppliers = apiSavedSuppliers ?? mockSuppliers.filter((s) => savedSupplierIds.includes(s.id));
  const inquiriesCount = apiInquiriesCount ?? inquiries.length;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  const comingSoon = () =>
    Alert.alert("Coming Soon", "This feature is coming soon!");

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 104 }}
      >
        {/* Header */}
        <View className="bg-white px-5 pt-3 pb-5 border-b border-slate-100">
          <Text className="text-2xl font-bold text-slate-900 mb-5">
            Profile
          </Text>
          <View className="flex-row items-center">
            <View className="w-[72px] h-[72px] rounded-full bg-blue-100 items-center justify-center">
              <Text className="text-2xl font-bold text-blue-600">
                {user ? getInitials(user.name) : "G"}
              </Text>
            </View>
            <View className="flex-1 ml-4">
              <View className="flex-row items-center">
                <Text
                  className="text-[19px] font-bold text-slate-900 flex-shrink"
                  numberOfLines={1}
                >
                  {user?.name || "Guest User"}
                </Text>
                {user?.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#2563EB"
                    style={{ marginLeft: 6 }}
                  />
                )}
              </View>
              <Text className="text-sm text-slate-500 mt-0.5">
                {user?.businessName || "No business name"}
              </Text>
              <Text className="text-sm text-slate-400 mt-0.5">
                {user?.phone || "No phone"}
              </Text>
            </View>
          </View>
          {user && (
            <View className="mt-4 pt-4 border-t border-slate-100">
              <View className="flex-row items-center mb-2.5">
                <Ionicons name="location-outline" size={14} color="#94A3B8" />
                <Text className="text-sm text-slate-600 ml-1.5">
                  {user.region}
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-1.5">
                {user.categories.map((cat) => (
                  <Badge key={cat} label={cat} size="sm" />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Activity Stats */}
        <View className="flex-row px-5 gap-3 mt-5">
          <TouchableOpacity
            onPress={() => setShowSaved(true)}
            className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 items-center"
          >
            <Text className="text-2xl font-bold text-slate-900">
              {savedSupplierIds.length}
            </Text>
            <Text className="text-xs text-slate-400 mt-0.5">Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowInquiries(true)}
            className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 items-center"
          >
            <Text className="text-2xl font-bold text-slate-900">
              {inquiries.length}
            </Text>
            <Text className="text-xs text-slate-400 mt-0.5">Inquiries</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowApplications(true)}
            className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 items-center"
          >
            <Text className="text-2xl font-bold text-slate-900">
              {applications.length}
            </Text>
            <Text className="text-xs text-slate-400 mt-0.5">Applied</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] mb-2.5">
            Account
          </Text>
          <MenuItem
            icon="person-outline"
            label="Edit Profile"
            onPress={comingSoon}
          />
          <MenuItem
            icon="business-outline"
            label="Business Details"
            onPress={comingSoon}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            label="Verification"
            onPress={comingSoon}
            showBadge={!user?.isVerified}
          />
        </View>

        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] mb-2.5">
            My Activity
          </Text>
          <MenuItem
            icon="bookmark-outline"
            label={`Saved Suppliers (${savedSupplierIds.length})`}
            onPress={() => setShowSaved(true)}
          />
          <MenuItem
            icon="mail-outline"
            label={`Sent Inquiries (${inquiries.length})`}
            onPress={() => setShowInquiries(true)}
          />
          <MenuItem
            icon="briefcase-outline"
            label={`Opportunity Applications (${applications.length})`}
            onPress={() => setShowApplications(true)}
          />
        </View>

        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] mb-2.5">
            Preferences
          </Text>
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={comingSoon}
          />
          <MenuItem
            icon="location-outline"
            label="Region Preferences"
            onPress={comingSoon}
          />
          <MenuItem
            icon="grid-outline"
            label="Category Preferences"
            onPress={comingSoon}
          />
        </View>

        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.8px] mb-2.5">
            Support
          </Text>
          <MenuItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={comingSoon}
          />
          <MenuItem
            icon="chatbubble-outline"
            label="Contact Support"
            onPress={comingSoon}
          />
          <MenuItem
            icon="document-text-outline"
            label="Terms & Privacy"
            onPress={comingSoon}
          />
        </View>

        <View className="px-5 mt-6">
          <MenuItem
            icon="log-out-outline"
            label="Logout"
            onPress={handleLogout}
            danger
          />
        </View>

        <Text className="text-center text-xs text-slate-300 mt-6">
          SupplierConnect v1.0.0
        </Text>
      </ScrollView>

      {/* Saved Suppliers Modal */}
      <Modal
        visible={showSaved}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSaved(false)}
      >
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
            <Text className="text-xl font-bold text-slate-900">
              Saved Suppliers
            </Text>
            <TouchableOpacity
              onPress={() => setShowSaved(false)}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
            >
              <Ionicons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>
          {savedSuppliers.length === 0 ? (
            <View className="flex-1 items-center justify-center px-8">
              <Ionicons name="bookmark-outline" size={48} color="#CBD5E1" />
              <Text className="text-base font-semibold text-slate-500 mt-4 text-center">
                No saved suppliers yet
              </Text>
              <Text className="text-sm text-slate-400 mt-2 text-center">
                Tap the bookmark icon on any supplier to save them here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={savedSuppliers}
              keyExtractor={(s) => s.id}
              contentContainerStyle={{ padding: 16 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <View className="bg-white rounded-2xl p-4 border border-slate-100 flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                    <Text className="text-sm font-bold text-blue-600">
                      {item.businessName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text
                      className="text-base font-semibold text-slate-900"
                      numberOfLines={1}
                    >
                      {item.businessName}
                    </Text>
                    <Text className="text-xs text-slate-400 mt-0.5">
                      {item.city} · {item.region}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setShowSaved(false);
                      router.push(`/suppliers/${item.id}`);
                    }}
                    className="px-3 py-2 bg-blue-50 rounded-xl"
                  >
                    <Text className="text-xs font-semibold text-blue-600">
                      View
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => unsaveSupplier(item.id)}
                    className="ml-2 w-8 h-8 rounded-full bg-red-50 items-center justify-center"
                  >
                    <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Inquiries Modal */}
      <Modal
        visible={showInquiries}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInquiries(false)}
      >
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
            <Text className="text-xl font-bold text-slate-900">
              Sent Inquiries
            </Text>
            <TouchableOpacity
              onPress={() => setShowInquiries(false)}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
            >
              <Ionicons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>
          {inquiries.length === 0 ? (
            <View className="flex-1 items-center justify-center px-8">
              <Ionicons name="mail-outline" size={48} color="#CBD5E1" />
              <Text className="text-base font-semibold text-slate-500 mt-4 text-center">
                No inquiries sent yet
              </Text>
              <Text className="text-sm text-slate-400 mt-2 text-center">
                Open a supplier profile and tap "Send Inquiry" to get started.
              </Text>
            </View>
          ) : (
            <FlatList
              data={inquiries}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ padding: 16 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <View className="bg-white rounded-2xl p-4 border border-slate-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text
                      className="text-base font-semibold text-slate-900"
                      numberOfLines={1}
                    >
                      {item.businessName}
                    </Text>
                    <View className="px-2.5 py-0.5 bg-amber-100 rounded-full">
                      <Text className="text-xs font-semibold text-amber-700 capitalize">
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="text-sm text-slate-600 leading-5"
                    numberOfLines={3}
                  >
                    {item.message}
                  </Text>
                  {item.quantity !== "Not specified" && (
                    <Text className="text-xs text-slate-400 mt-1.5">
                      Qty: {item.quantity}
                    </Text>
                  )}
                  <Text className="text-xs text-slate-300 mt-2">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Applications Modal */}
      <Modal
        visible={showApplications}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowApplications(false)}
      >
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
            <Text className="text-xl font-bold text-slate-900">
              My Applications
            </Text>
            <TouchableOpacity
              onPress={() => setShowApplications(false)}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
            >
              <Ionicons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>
          {applications.length === 0 ? (
            <View className="flex-1 items-center justify-center px-8">
              <Ionicons name="briefcase-outline" size={48} color="#CBD5E1" />
              <Text className="text-base font-semibold text-slate-500 mt-4 text-center">
                No applications yet
              </Text>
              <Text className="text-sm text-slate-400 mt-2 text-center">
                Browse Opportunities and tap "Express Interest" to apply.
              </Text>
            </View>
          ) : (
            <FlatList
              data={applications}
              keyExtractor={(a) => a.id}
              contentContainerStyle={{ padding: 16 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <View className="bg-white rounded-2xl p-4 border border-slate-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text
                      className="text-base font-semibold text-slate-900 flex-1 mr-2"
                      numberOfLines={2}
                    >
                      {item.opportunityTitle}
                    </Text>
                    <View className="px-2.5 py-0.5 bg-green-100 rounded-full">
                      <Text className="text-xs font-semibold text-green-700 capitalize">
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="text-sm text-slate-600 leading-5"
                    numberOfLines={2}
                  >
                    {item.message}
                  </Text>
                  <Text className="text-xs text-slate-300 mt-2">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

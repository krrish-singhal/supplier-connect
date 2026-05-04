import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  SearchBar,
  RegionTabs,
  SupplierCard,
  EmptyState,
} from "@/src/components";
import { useFiltersStore } from "@/src/store/filtersStore";
import { mockSuppliers } from "@/src/data/mockData";
import { CATEGORIES } from "@/src/constants";
import { Category, Supplier } from "@/src/types";
import { useDebounce } from "@/src/hooks/useDebounce";
import { api } from "@/src/lib/api";

export default function SuppliersScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>(mockSuppliers);
  const {
    supplierFilters,
    setSupplierSearch,
    setSupplierRegion,
    setSupplierCategories,
    setSupplierSortBy,
    resetSupplierFilters,
  } = useFiltersStore();
  const debounced = useDebounce(supplierFilters.search);

  const fetchSuppliers = useCallback(async () => {
    try {
      const regionMap: Record<string, string> = {
        'North India': 'North', 'South India': 'South',
        'West India': 'West', 'East India': 'East',
      };
      const params: Record<string, string> = {};
      if (supplierFilters.region !== 'all') {
        params.region = regionMap[supplierFilters.region] || supplierFilters.region;
      }
      const res = await api.get<{ suppliers: Supplier[] }>('/api/suppliers', params);
      if (res.suppliers?.length) setAllSuppliers(res.suppliers);
    } catch {
      // fallback to mockData
    }
  }, [supplierFilters.region]);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSuppliers();
    setRefreshing(false);
  }, [fetchSuppliers]);

  const filteredSuppliers = useMemo(() => {
    let s = [...allSuppliers];
    if (supplierFilters.region !== "all")
      s = s.filter((x) => x.region === supplierFilters.region);
    if (debounced) {
      const q = debounced.toLowerCase();
      s = s.filter(
        (x) =>
          x.businessName.toLowerCase().includes(q) ||
          x.name.toLowerCase().includes(q) ||
          x.categories.some((c: string) => c.toLowerCase().includes(q)),
      );
    }
    if (supplierFilters.categories.length > 0)
      s = s.filter((x) =>
        x.categories.some((c: string) =>
          supplierFilters.categories.includes(c as Category),
        ),
      );
    if (supplierFilters.minRating > 0)
      s = s.filter((x) => x.rating >= supplierFilters.minRating);
    switch (supplierFilters.sortBy) {
      case "rating":
        s.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        s.sort((a, b) => a.businessName.localeCompare(b.businessName));
        break;
      case "recent":
        s.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }
    return s;
  }, [supplierFilters, debounced]);

  const toggleCategory = (category: Category) => {
    const cur = supplierFilters.categories;
    setSupplierCategories(
      cur.includes(category)
        ? cur.filter((c) => c !== category)
        : [...cur, category],
    );
  };
  const activeFilters =
    supplierFilters.categories.length + (supplierFilters.minRating > 0 ? 1 : 0);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <View className="bg-white px-5 pt-3 pb-3.5 border-b border-slate-100">
        <Text className="text-2xl font-bold text-slate-900 mb-3">
          Suppliers
        </Text>
        <SearchBar
          value={supplierFilters.search}
          onChangeText={setSupplierSearch}
          placeholder="Search suppliers..."
          showFilter
          onFilterPress={() => setShowFilters(true)}
        />
        {activeFilters > 0 && (
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-xs text-blue-600">
              {activeFilters} filter{activeFilters > 1 ? "s" : ""} active
            </Text>
            <TouchableOpacity onPress={resetSupplierFilters}>
              <Text className="text-xs text-red-500 font-semibold">
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="bg-white border-b border-slate-100 py-2">
        <RegionTabs
          selectedRegion={supplierFilters.region}
          onSelectRegion={setSupplierRegion}
        />
      </View>

      {supplierFilters.categories.length > 0 && (
        <View className="bg-white border-b border-slate-100 py-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              gap: 8,
              flexDirection: "row",
            }}
          >
            {supplierFilters.categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => toggleCategory(cat)}
                className="flex-row items-center gap-1 bg-blue-100 px-3 py-1.5 rounded-full"
              >
                <Text className="text-sm font-medium text-blue-700">{cat}</Text>
                <Ionicons name="close" size={13} color="#1D4ED8" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View className="px-5 py-2.5">
        <Text className="text-sm text-slate-500">
          {filteredSuppliers.length} suppliers found
        </Text>
      </View>

      <FlatList
        data={filteredSuppliers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SupplierCard supplier={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No suppliers found"
            description="Try adjusting your search or filters"
            actionLabel="Clear Filters"
            onAction={resetSupplierFilters}
          />
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
          />
        }
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
            <Text className="text-xl font-bold text-slate-900">Filters</Text>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
            >
              <Ionicons name="close" size={22} color="#475569" />
            </TouchableOpacity>
          </View>
          <ScrollView
            className="flex-1 px-5"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View className="mt-6 mb-1">
              <Text className="text-base font-semibold text-slate-900 mb-3">
                Categories
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const sel = supplierFilters.categories.includes(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => toggleCategory(cat)}
                      className={`px-3.5 py-2 rounded-full border-[1.5px] ${sel ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`}
                    >
                      <Text
                        className={`text-sm font-medium ${sel ? "text-blue-700" : "text-slate-500"}`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View className="mt-6">
              <Text className="text-base font-semibold text-slate-900 mb-3">
                Sort By
              </Text>
              {[
                { value: "rating", label: "Highest Rated" },
                { value: "name", label: "Name (A–Z)" },
                { value: "recent", label: "Most Recent" },
              ].map((opt) => {
                const sel = supplierFilters.sortBy === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setSupplierSortBy(opt.value as any)}
                    className={`flex-row items-center justify-between p-4 rounded-xl border-[1.5px] mb-2 ${sel ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`}
                  >
                    <Text
                      className={`text-base font-medium ${sel ? "text-blue-700" : "text-slate-700"}`}
                    >
                      {opt.label}
                    </Text>
                    {sel && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#2563EB"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <View className="flex-row gap-3 px-5 py-4 border-t border-slate-100">
            <TouchableOpacity
              onPress={resetSupplierFilters}
              className="flex-1 py-3.5 rounded-xl border-[1.5px] border-slate-200 items-center"
            >
              <Text className="text-base font-semibold text-slate-500">
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              className="flex-1 py-3.5 rounded-xl bg-blue-600 items-center"
            >
              <Text className="text-base font-semibold text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

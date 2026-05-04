import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar, RegionTabs, SupplierCard, OpportunityCard } from '@/src/components';
import { useAuthStore } from '@/src/store/authStore';
import { useFiltersStore } from '@/src/store/filtersStore';
import { mockSuppliers, mockOpportunities } from '@/src/data/mockData';
import { useDebounce } from '@/src/hooks/useDebounce';
import { api } from '@/src/lib/api';
import type { Supplier, Opportunity } from '@/src/types';

const STATS = [
  { label: 'Suppliers', value: 0, icon: 'business-outline' as const },
  { label: 'Opportunities', value: 0, icon: 'briefcase-outline' as const },
  { label: 'Regions', value: 6, icon: 'location-outline' as const },
];

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const { supplierFilters, setSupplierRegion, setSupplierSearch } = useFiltersStore();
  const [refreshing, setRefreshing] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const debounced = useDebounce(supplierFilters.search);

  const fetchData = useCallback(async () => {
    try {
      const [suppRes, oppRes] = await Promise.all([
        api.get<{ suppliers: Supplier[] }>('/api/suppliers', { limit: 20 }),
        api.get<{ opportunities: Opportunity[] }>('/api/opportunities', { limit: 10 }),
      ]);
      if (suppRes.suppliers?.length) setSuppliers(suppRes.suppliers);
      if (oppRes.opportunities?.length) setOpportunities(oppRes.opportunities);
    } catch {
      // silently fall back to mockData
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const filteredSuppliers = useMemo(() => {
    let s = [...suppliers];
    if (supplierFilters.region !== 'all') s = s.filter((x) => x.region === supplierFilters.region);
    if (debounced) { const q = debounced.toLowerCase(); s = s.filter((x) => x.businessName.toLowerCase().includes(q) || x.name.toLowerCase().includes(q) || x.categories.some((c: string) => c.toLowerCase().includes(q))); }
    return s.slice(0, 5);
  }, [suppliers, supplierFilters.region, debounced]);

  const recentOpportunities = useMemo(() => opportunities.filter((o) => o.status === 'open').slice(0, 3), [opportunities]);
  STATS[0].value = suppliers.length;
  STATS[1].value = opportunities.length;

  const getGreeting = () => { const h = new Date().getHours(); if (h < 12) return 'Good Morning'; if (h < 17) return 'Good Afternoon'; return 'Good Evening'; };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}>
        {/* Header */}
        <View className="bg-white px-5 pt-3 pb-4 border-b border-slate-100">
          <View className="flex-row items-center justify-between mb-3.5">
            <View className="flex-row items-center gap-3">
              <Image source={require('../../assets/app_logo.png')} style={{ width: 38, height: 38, borderRadius: 10 }} />
              <View>
                <Text className="text-sm text-slate-500">{getGreeting()}</Text>
                <Text className="text-xl font-bold text-slate-900">{user?.name || 'Guest'} 👋</Text>
              </View>
            </View>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
              <Ionicons name="notifications-outline" size={22} color="#475569" />
            </TouchableOpacity>
          </View>
          <SearchBar value={supplierFilters.search} onChangeText={setSupplierSearch} placeholder="Search suppliers, categories..." />
        </View>

        {/* Stats */}
        <View className="px-5 py-4">
          <View className="flex-row gap-3">
            {STATS.map((stat) => (
              <View key={stat.label} className="flex-1 bg-white rounded-2xl p-4 border border-slate-100">
                <Ionicons name={stat.icon} size={20} color="#2563EB" />
                <Text className="text-[22px] font-bold text-slate-900 mt-2">{stat.value}</Text>
                <Text className="text-xs text-slate-400 mt-0.5">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Region Tabs */}
        <View className="px-5">
          <Text className="text-[17px] font-bold text-slate-900 mb-1 mt-4">Browse by Region</Text>
        </View>
        <RegionTabs selectedRegion={supplierFilters.region} onSelectRegion={setSupplierRegion} />

        {/* Top Suppliers */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mt-5 mb-3">
            <Text className="text-[17px] font-bold text-slate-900">Top Suppliers</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/suppliers')}>
              <Text className="text-sm font-semibold text-blue-600">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-2.5">
            {filteredSuppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} variant="compact" />
            ))}
          </View>
        </View>

        {/* Recent Opportunities */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mt-5 mb-3">
            <Text className="text-[17px] font-bold text-slate-900">Recent Opportunities</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/opportunities')}>
              <Text className="text-sm font-semibold text-blue-600">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-2.5">
            {recentOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

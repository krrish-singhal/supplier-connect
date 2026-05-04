import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar, OpportunityCard, EmptyState } from '@/src/components';
import { useFiltersStore } from '@/src/store/filtersStore';
import { mockOpportunities } from '@/src/data/mockData';
import { Opportunity, OpportunityStatus } from '@/src/types';
import { useDebounce } from '@/src/hooks/useDebounce';
import { api } from '@/src/lib/api';

const STATUS_TABS: { value: OpportunityStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
];

export default function OpportunitiesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const { opportunityFilters, setOpportunitySearch, setOpportunityStatus, resetOpportunityFilters } = useFiltersStore();
  const debounced = useDebounce(opportunityFilters.search);

  const fetchOpportunities = useCallback(async () => {
    try {
      const res = await api.get<{ opportunities: Opportunity[] }>('/api/opportunities');
      if (res.opportunities?.length) setAllOpportunities(res.opportunities);
    } catch { /* fallback to mockData */ }
  }, []);

  useEffect(() => { fetchOpportunities(); }, [fetchOpportunities]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOpportunities();
    setRefreshing(false);
  }, [fetchOpportunities]);

  const filtered = useMemo(() => {
    let o = [...allOpportunities];
    if (opportunityFilters.status !== 'all') o = o.filter((x) => x.status === opportunityFilters.status);
    if (debounced) { const q = debounced.toLowerCase(); o = o.filter((x) => x.title.toLowerCase().includes(q) || x.description.toLowerCase().includes(q) || x.category.toLowerCase().includes(q)); }
    if (opportunityFilters.region !== 'all') o = o.filter((x) => x.region === opportunityFilters.region);
    o.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return o;
  }, [allOpportunities, opportunityFilters, debounced]);

  const countFor = (s: OpportunityStatus | 'all') => s === 'all' ? allOpportunities.length : allOpportunities.filter((x) => x.status === s).length;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
      <View className="bg-white px-5 pt-3 pb-3.5 border-b border-slate-100">
        <Text className="text-2xl font-bold text-slate-900 mb-3">Opportunities</Text>
        <SearchBar value={opportunityFilters.search} onChangeText={setOpportunitySearch} placeholder="Search opportunities..." />
      </View>

      <View className="bg-white border-b border-slate-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
          {STATUS_TABS.map((tab) => {
            const sel = opportunityFilters.status === tab.value;
            const cnt = countFor(tab.value);
            return (
              <TouchableOpacity key={tab.value} onPress={() => setOpportunityStatus(tab.value)}
                className={`flex-row items-center gap-2 px-3.5 py-2.5 rounded-3xl ${sel ? 'bg-blue-600' : 'bg-slate-100'}`}>
                <Text className={`text-sm font-semibold ${sel ? 'text-white' : 'text-slate-600'}`}>{tab.label}</Text>
                <View className={`px-1.5 py-0.5 rounded-xl ${sel ? 'bg-blue-700' : 'bg-slate-200'}`}>
                  <Text className={`text-[11px] font-bold ${sel ? 'text-white' : 'text-slate-500'}`}>{cnt}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View className="px-5 py-2.5">
        <Text className="text-sm text-slate-500">{filtered.length} opportunities found</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OpportunityCard opportunity={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={<EmptyState icon="briefcase-outline" title="No opportunities found" description="Try adjusting your search or filters" actionLabel="Clear Filters" onAction={resetOpportunityFilters} />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      />
    </SafeAreaView>
  );
}

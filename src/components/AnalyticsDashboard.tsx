import { Card } from '@/components/ui/card';
import { BarChart, Globe, Clock, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const AnalyticsDashboard = () => {
  const { data: translations } = useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });

  const totalTranslations = translations?.length || 0;
  const totalWords = translations?.reduce((sum, t) => sum + (t.word_count || 0), 0) || 0;
  
  const languagePairs = translations?.reduce((acc, t) => {
    const pair = `${t.source_language}-${t.target_language}`;
    acc[pair] = (acc[pair] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedPair = languagePairs
    ? Object.entries(languagePairs).sort(([, a], [, b]) => b - a)[0]
    : null;

  const todayTranslations = translations?.filter(t => {
    const today = new Date().toDateString();
    return new Date(t.created_at).toDateString() === today;
  }).length || 0;

  const stats = [
    {
      icon: BarChart,
      label: 'Total Translations',
      value: totalTranslations,
      color: 'text-primary',
    },
    {
      icon: Globe,
      label: 'Total Words',
      value: totalWords,
      color: 'text-accent',
    },
    {
      icon: Clock,
      label: 'Today',
      value: todayTranslations,
      color: 'text-blue-500',
    },
    {
      icon: TrendingUp,
      label: 'Top Pair',
      value: mostUsedPair ? mostUsedPair[0].toUpperCase() : 'N/A',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color} opacity-50`} />
          </div>
        </Card>
      ))}
    </div>
  );
};
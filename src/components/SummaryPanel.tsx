import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SummaryPanel = () => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: translations } = useQuery({
    queryKey: ['translations-for-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  const generateSummary = async () => {
    if (!translations || translations.length === 0) {
      toast({
        title: 'No Data',
        description: 'No translations available to summarize',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: { translations },
      });

      if (error) throw error;

      setSummary(data.summary);
      toast({
        title: 'Summary Generated',
        description: 'AI-powered insights are ready',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 backdrop-blur-sm border-accent/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Summary
        </h2>
        <Button
          onClick={generateSummary}
          disabled={isGenerating}
          className="bg-gradient-to-r from-accent to-primary hover:shadow-[var(--glow-purple)]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Summary'
          )}
        </Button>
      </div>
      
      {summary ? (
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{summary}</p>
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Click "Generate Summary" to get AI-powered insights about your translation sessions
        </p>
      )}
    </Card>
  );
};
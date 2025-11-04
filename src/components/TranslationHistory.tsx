import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const TranslationHistory = () => {
  const { toast } = useToast();

  const { data: translations, refetch } = useQuery({
    queryKey: ['translation-history'],
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

  const deleteTranslation = async (id: string) => {
    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete translation',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Deleted',
      description: 'Translation removed from history',
    });
    refetch();
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h2 className="text-xl font-bold mb-4">Recent Translations</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {translations?.map((translation) => (
            <div
              key={translation.id}
              className="p-4 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-primary/20 rounded">
                      {translation.source_language.toUpperCase()}
                    </span>
                    <span>→</span>
                    <span className="px-2 py-1 bg-accent/20 rounded">
                      {translation.target_language.toUpperCase()}
                    </span>
                    <span className="ml-auto">
                      {formatDistanceToNow(new Date(translation.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80">{translation.source_text}</p>
                  <p className="text-sm text-primary">{translation.translated_text}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteTranslation(translation.id)}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {(!translations || translations.length === 0) && (
            <p className="text-center text-muted-foreground py-8">No translations yet</p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
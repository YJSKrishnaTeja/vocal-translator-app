import { useState } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { TranslationDisplay } from '@/components/TranslationDisplay';
import { LanguageSelector } from '@/components/LanguageSelector';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { TranslationHistory } from '@/components/TranslationHistory';
import { SummaryPanel } from '@/components/SummaryPanel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Languages, BarChart3, Clock, Sparkles } from 'lucide-react';

const Index = () => {
  const [sourceLang, setSourceLang] = useState('es');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const { toast } = useToast();

  const handleTranscript = async (text: string) => {
    setSourceText(text);
    
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          text,
          sourceLang,
          targetLang,
        },
      });

      if (error) throw error;

      setTranslatedText(data.translatedText);

      // Save to database
      await supabase.from('translations').insert({
        source_language: sourceLang,
        target_language: targetLang,
        source_text: text,
        translated_text: data.translatedText,
        word_count: text.split(' ').length,
      });

      toast({
        title: 'Translation Complete',
        description: 'Your text has been translated successfully',
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Translation Failed',
        description: 'Failed to translate text. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--glow-cyan)]">
              <Languages className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VoiceTranslate
              </h1>
              <p className="text-sm text-muted-foreground">Real-time voice translation powered by AI</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="translate" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="translate" className="data-[state=active]:bg-primary/20">
              <Languages className="h-4 w-4 mr-2" />
              Translate
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary/20">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translate" className="space-y-8">
            <div className="max-w-3xl mx-auto space-y-8">
              <LanguageSelector
                sourceLang={sourceLang}
                targetLang={targetLang}
                onSourceChange={setSourceLang}
                onTargetChange={setTargetLang}
              />

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">Click the microphone to start recording</p>
                <VoiceRecorder onTranscript={handleTranscript} sourceLang={sourceLang} />
              </div>

              {sourceText && translatedText && (
                <TranslationDisplay
                  sourceText={sourceText}
                  translatedText={translatedText}
                  sourceLang={sourceLang}
                  targetLang={targetLang}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-4xl mx-auto">
              <TranslationHistory />
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="max-w-4xl mx-auto">
              <SummaryPanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
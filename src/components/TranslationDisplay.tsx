import { Card } from '@/components/ui/card';
import { Copy, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TranslationDisplayProps {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

export const TranslationDisplay = ({
  sourceText,
  translatedText,
  sourceLang,
  targetLang,
}: TranslationDisplayProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Text copied to clipboard',
    });
  };

  const speakText = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            Original ({sourceLang.toUpperCase()})
          </h3>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => speakText(sourceText, sourceLang)}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copyToClipboard(sourceText)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-foreground min-h-[100px]">{sourceText}</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">
            Translation ({targetLang.toUpperCase()})
          </h3>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => speakText(translatedText, targetLang)}
              className="hover:bg-primary/20"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copyToClipboard(translatedText)}
              className="hover:bg-primary/20"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-foreground min-h-[100px]">{translatedText}</p>
      </Card>
    </div>
  );
};
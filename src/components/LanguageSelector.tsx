import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
];

interface LanguageSelectorProps {
  sourceLang: string;
  targetLang: string;
  onSourceChange: (lang: string) => void;
  onTargetChange: (lang: string) => void;
}

export const LanguageSelector = ({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
}: LanguageSelectorProps) => {
  const swapLanguages = () => {
    onSourceChange(targetLang);
    onTargetChange(sourceLang);
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1">
        <Label htmlFor="source-lang" className="text-sm font-medium mb-2 block">
          From
        </Label>
        <Select value={sourceLang} onValueChange={onSourceChange}>
          <SelectTrigger id="source-lang" className="bg-card/50 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={swapLanguages}
        size="icon"
        variant="ghost"
        className="mb-1 hover:bg-primary/20"
      >
        <ArrowRightLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1">
        <Label htmlFor="target-lang" className="text-sm font-medium mb-2 block">
          To
        </Label>
        <Select value={targetLang} onValueChange={onTargetChange}>
          <SelectTrigger id="target-lang" className="bg-card/50 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
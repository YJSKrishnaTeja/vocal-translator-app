import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  sourceLang: string;
}

export const VoiceRecorder = ({ onTranscript, sourceLang }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = sourceLang;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      toast({
        title: 'Recording Started',
        description: 'Speak now...',
      });
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: 'Recognition Error',
        description: event.error,
        variant: 'destructive',
      });
      setIsRecording(false);
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        title: 'Recording Stopped',
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      {!isRecording ? (
        <Button
          onClick={startRecording}
          size="lg"
          className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary to-blue-500 hover:shadow-[var(--glow-cyan)] transition-all duration-300"
        >
          <Mic className="h-8 w-8" />
        </Button>
      ) : (
        <Button
          onClick={stopRecording}
          size="lg"
          variant="destructive"
          className="relative h-20 w-20 rounded-full animate-pulse"
        >
          <Square className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
};
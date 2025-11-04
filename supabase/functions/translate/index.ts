import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !sourceLang || !targetLang) {
      throw new Error('Missing required parameters');
    }

    console.log('Translating:', { text, sourceLang, targetLang });

    // Use MyMemory Translation API (free, no API key required)
    const langPair = `${sourceLang}|${targetLang}`;
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      console.error('Translation API error:', error);
      throw new Error('Translation failed');
    }

    const data = await response.json();
    console.log('Translation response:', data);

    if (data.responseStatus !== 200) {
      console.error('Translation error:', data.responseDetails);
      throw new Error('Translation failed: ' + data.responseDetails);
    }

    return new Response(
      JSON.stringify({ translatedText: data.responseData.translatedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in translate function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
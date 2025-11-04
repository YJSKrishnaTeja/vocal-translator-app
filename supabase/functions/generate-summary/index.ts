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
    const { translations } = await req.json();

    if (!translations || !Array.isArray(translations)) {
      throw new Error('Invalid translations data');
    }

    console.log('Generating summary for translations:', translations.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Prepare translation data for summary
    const translationText = translations.map((t, i) => 
      `${i + 1}. From ${t.source_language} to ${t.target_language}:\n   Original: "${t.source_text}"\n   Translation: "${t.translated_text}"`
    ).join('\n\n');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise summaries of translation sessions. Focus on key insights, language patterns, and main topics discussed.'
          },
          {
            role: 'user',
            content: `Please create a concise summary of these translations:\n\n${translationText}\n\nProvide insights about: 1) Main topics/themes, 2) Language patterns, 3) Key phrases or terms that appeared frequently.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      throw new Error('Summary generation failed');
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content || 'Unable to generate summary';

    console.log('Summary generated successfully');

    return new Response(
      JSON.stringify({ summary }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-summary function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
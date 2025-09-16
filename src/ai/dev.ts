import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-issue-categories.ts';
import '@/ai/flows/transcribe-audio-flow.ts';
import '@/ai/flows/translate-text-flow.ts';

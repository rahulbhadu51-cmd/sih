'use server';

import { z } from 'zod';
import { suggestIssueCategories as suggestIssueCategoriesFlow, SuggestIssueCategoriesOutput } from '@/ai/flows/suggest-issue-categories';
import { transcribeAudio as transcribeAudioFlow, TranscribeAudioOutput } from '@/ai/flows/transcribe-audio-flow';
import { translateText as translateTextFlow, TranslateTextOutput } from '@/ai/flows/translate-text-flow';

// In-memory user store (replace with a database in a real app)
const users: { [key: string]: string } = {};

const reportSchema = z.object({
  issueType: z.string().min(1, 'Please select an issue type.'),
  description: z.string().optional(),
  latitude: z.number({ required_error: 'Please capture your location.' }),
  longitude: z.number({ required_error: 'Please capture your location.' }),
  photoDataUri: z.string().min(1, 'Please upload a photo.'),
});

type ReportInput = z.infer<typeof reportSchema>;

export async function submitReportAction(data: ReportInput) {
  try {
    const validatedData = reportSchema.parse(data);
    
    // In a real app, you would save this to a database like Firestore.
    console.log('New Report Submitted:', {
      ...validatedData,
      status: 'Submitted',
      timestamp: new Date(),
      userId: 'anonymous', // Placeholder for authenticated user ID
    });
    
    return { success: true, message: 'Report submitted successfully!' };
  } catch (error) {
    console.error('Submission Error:', error);
    return { success: false, message: 'Failed to submit report. Please try again.' };
  }
}

export async function suggestCategoriesAction(photoDataUri: string, description: string): Promise<SuggestIssueCategoriesOutput | { error: string }> {
  if (!photoDataUri) {
    return { error: 'A photo is required for AI suggestions.' };
  }

  try {
    const result = await suggestIssueCategoriesFlow({
      photoDataUri,
      description: description || 'No description provided.',
    });
    return result;
  } catch (error) {
    console.error('AI suggestion error:', error);
    return { error: 'Failed to get AI suggestions. The model may be unavailable.' };
  }
}

export async function transcribeAudioAction(audioDataUri: string): Promise<TranscribeAudioOutput | { error: string }> {
  if (!audioDataUri) {
    return { error: 'Audio data is missing.' };
  }

  try {
    const result = await transcribeAudioFlow({ audioDataUri });
    return result;
  } catch (error) {
    console.error('Transcription error:', error);
    return { error: 'Failed to transcribe audio. The model may be unavailable.' };
  }
}

export async function translateTextAction(text: string, targetLanguage: string): Promise<TranslateTextOutput | { error: string }> {
  if (!text) {
    return { error: 'Text to translate is missing.' };
  }
  if (!targetLanguage) {
    return { error: 'Target language is missing.' };
  }

  try {
    const result = await translateTextFlow({ text, targetLanguage });
    return result;
  } catch (error) {
    console.error('Translation error:', error);
    return { error: 'Failed to translate text. The model may be unavailable.' };
  }
}

// --- Auth Actions ---

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignupInput = z.infer<typeof signupSchema>;

export async function signupUserAction(data: SignupInput) {
  try {
    const { username, password } = signupSchema.parse(data);

    if (users[username]) {
      return { success: false, message: "Username already exists." };
    }
    
    // In a real app, you would hash the password
    users[username] = password;
    console.log("New user signed up:", username);
    
    return { success: true, message: "Signup successful!" };
  } catch (error) {
    console.error('Signup Error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

type LoginInput = z.infer<typeof loginSchema>;

export async function loginUserAction(data: LoginInput) {
  try {
    const { username, password } = loginSchema.parse(data);

    if (!users[username] || users[username] !== password) {
      return { success: false, message: "Invalid username or password." };
    }
    
    console.log("User logged in:", username);
    return { success: true, message: "Login successful!" };
  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

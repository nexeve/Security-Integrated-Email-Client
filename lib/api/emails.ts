import { useQuery } from '@tanstack/react-query';
import { EmailWithAnalysis, RawEmail, AnalysisResult, ExtendedAnalysisResult } from '@/lib/types';

interface EmailListItem {
  id: string;
  from: { name: string; email: string };
  to: { name: string; email: string }[];
  subject: string;
  date: Date;
  preview: string;
  analysis: AnalysisResult;
}

interface EmailDetailResponse {
  email: RawEmail;
  analysis: ExtendedAnalysisResult;
}

/**
 * Fetch all emails from the API
 */
async function fetchEmails(): Promise<EmailListItem[]> {
  const response = await fetch('/api/emails');
  if (!response.ok) {
    throw new Error('Failed to fetch emails');
  }
  return response.json();
}

/**
 * Fetch a single email by ID from the API
 */
async function fetchEmail(id: string): Promise<EmailDetailResponse> {
  const response = await fetch(`/api/emails/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch email');
  }
  return response.json();
}

/**
 * React Query hook for fetching all emails
 */
export function useEmails() {
  return useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
  });
}

/**
 * React Query hook for fetching a single email
 */
export function useEmail(id: string) {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => fetchEmail(id),
    enabled: !!id && id !== '',
  });
}

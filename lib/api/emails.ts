import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RawEmail, ExtendedAnalysisResult } from '@/lib/types';

export interface EmailListItem {
  id: string;
  from: { name: string; email: string };
  to: { name: string; email: string }[];
  subject: string;
  date: Date;
  preview: string;
  isUnread?: boolean;
  isStarred?: boolean;
  labels?: string[];
  analysis: ExtendedAnalysisResult;
}

export interface EmailDetailResponse {
  email: RawEmail;
  analysis: ExtendedAnalysisResult;
}

// ── Fetchers ────────────────────────────────────────────────────────────────

async function fetchEmails(folder: string = 'inbox'): Promise<EmailListItem[]> {
  const response = await fetch(`/api/emails?folder=${folder}`);
  if (!response.ok) throw new Error('Failed to fetch emails');
  return response.json();
}

async function fetchEmail(id: string): Promise<EmailDetailResponse> {
  const response = await fetch(`/api/emails/${id}`);
  if (!response.ok) throw new Error('Failed to fetch email');
  return response.json();
}

type EmailAction = 'read' | 'unread' | 'star' | 'unstar' | 'archive' | 'trash';

async function performEmailAction(id: string, action: EmailAction) {
  const response = await fetch(`/api/emails/${id}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) throw new Error(`Failed to ${action} email`);
  return response.json();
}

async function sendEmailApi(to: string, subject: string, text: string) {
  const response = await fetch(`/api/emails/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, text }),
  });
  if (!response.ok) throw new Error('Failed to send email');
  return response.json();
}

// ── Query hooks ─────────────────────────────────────────────────────────────

/**
 * Fetch all emails for a given folder.
 * staleTime: 60 s — avoids re-fetching on every focus/navigation.
 * gcTime:   5 min — keeps the data alive while switching folders.
 */
export function useEmails(folder: string = 'inbox') {
  return useQuery({
    queryKey: ['emails', folder],
    queryFn: () => fetchEmails(folder),
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

/**
 * Fetch a single email by ID.
 * staleTime: 5 min — individual email content rarely changes while open.
 */
export function useEmail(id: string) {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => fetchEmail(id),
    enabled: !!id && id !== '',
    staleTime: 300_000,
    gcTime: 600_000,
  });
}

// ── Mutation hooks ───────────────────────────────────────────────────────────

/**
 * Perform an action (read, star, trash, …) on an email.
 *
 * Star/unstar use an optimistic update: the affected email row flips
 * immediately, and the change is rolled back if the Gmail API call fails.
 *
 * Read/unread only need lightweight cache invalidation because the inbox
 * already re-fetched unread state from Gmail; we don't need a full refetch
 * for every folder — just the currently visible one.
 */
export function useEmailAction() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { id: string; action: EmailAction; folder?: string },
    { previousData: Map<string, EmailListItem[]> }
  >({
    mutationFn: ({ id, action }) => performEmailAction(id, action),

    onMutate: async ({ id, action, folder }) => {
      // Only apply optimistic updates for star/unstar toggling
      if (action !== 'star' && action !== 'unstar') return { previousData: new Map() };

      const targetFolders = folder ? [folder] : ['inbox', 'promotions', 'social', 'starred'];
      const previousData = new Map<string, EmailListItem[]>();

      for (const f of targetFolders) {
        const queryKey = ['emails', f];
        await queryClient.cancelQueries({ queryKey });
        const snapshot = queryClient.getQueryData<EmailListItem[]>(queryKey);
        if (snapshot) {
          previousData.set(f, snapshot);
          queryClient.setQueryData<EmailListItem[]>(queryKey, old =>
            old?.map(email =>
              email.id === id
                ? { ...email, isStarred: action === 'star' }
                : email
            ) ?? []
          );
        }
      }

      return { previousData };
    },

    onError: (_err, { action }, context) => {
      if ((action === 'star' || action === 'unstar') && context?.previousData) {
        // Roll back every folder that was optimistically updated
        context.previousData.forEach((data, folder) => {
          queryClient.setQueryData(['emails', folder], data);
        });
      }
    },

    onSuccess: (_data, { action, folder }) => {
      if (action === 'read' || action === 'unread') {
        // Invalidate only the current folder (and the single-email cache)
        if (folder) {
          queryClient.invalidateQueries({ queryKey: ['emails', folder] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['emails'] });
        }
        queryClient.invalidateQueries({ queryKey: ['email'] });
      } else if (action === 'star' || action === 'unstar') {
        // Starred folder list changes; invalidate it so it re-fetches from Gmail
        queryClient.invalidateQueries({ queryKey: ['emails', 'starred'] });
        // Also invalidate the folder the email lives in (covered by optimistic update
        // but we want a background reconciliation with real Gmail state)
        if (folder) queryClient.invalidateQueries({ queryKey: ['emails', folder] });
      } else {
        // archive / trash — invalidate broadly
        queryClient.invalidateQueries({ queryKey: ['emails'] });
        queryClient.invalidateQueries({ queryKey: ['email'] });
      }
    },
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ to, subject, text }: { to: string; subject: string; text: string }) =>
      sendEmailApi(to, subject, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'sent'] });
    },
  });
}

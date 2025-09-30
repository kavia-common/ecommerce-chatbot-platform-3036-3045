import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { ChatMessage, ChatRequest, ChatResponse } from '../models/product.model';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = inject(ApiService);

  private conversationId?: string;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  // PUBLIC_INTERFACE
  /** Stream of chat messages for the current conversation. */
  readonly messages$ = this.messagesSubject.asObservable();

  // PUBLIC_INTERFACE
  /** Sends a user message to the backend and appends assistant response. */
  async send(message: string) {
    const userMsg: ChatMessage = {
      id: cryptoId(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    this.messagesSubject.next([...this.messagesSubject.value, userMsg]);

    const req: ChatRequest = {
      message,
      conversationId: this.conversationId,
    };

    // eslint-disable-next-line no-console
    console.debug('[ChatService] sending chat request', { req });

    this.api.chat(req).subscribe({
      next: (resp: ChatResponse) => {
        // eslint-disable-next-line no-console
        console.debug('[ChatService] received chat response', { resp });
        this.conversationId = resp.conversationId;
        const merged = [...this.messagesSubject.value, ...resp.messages];
        this.messagesSubject.next(merged);
      },
      error: (err) => {
        // eslint-disable-next-line no-console
        console.error('[ChatService] chat error', { error: err, apiBase: this.api.baseUrl, req });

        const userFriendly = toUserMessage(err);
        const errMsg: ChatMessage = {
          id: cryptoId(),
          role: 'assistant',
          content: userFriendly,
          timestamp: new Date().toISOString(),
        };
        this.messagesSubject.next([...this.messagesSubject.value, errMsg]);
      }
    });
  }

  // PUBLIC_INTERFACE
  /** Resets the conversation state. */
  reset() {
    this.conversationId = undefined;
    this.messagesSubject.next([]);
  }
}

function cryptoId() {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      // @ts-ignore
      return crypto.randomUUID();
    }
  } catch {}
  return Math.random().toString(36).slice(2);
}

/** Map common HTTP/network errors to clearer user messages without exposing internal details. */
function toUserMessage(err: unknown): string {
  const isNetworkError = typeof window !== 'undefined' && typeof navigator !== 'undefined' && !navigator.onLine;
  if (isNetworkError) {
    return 'Network is offline. Please check your internet connection and try again.';
  }
  try {
    const anyErr = err as any;
    const status = anyErr?.status as number | undefined;
    if (status === 0) {
      return 'Cannot reach the server. Please ensure the service is running and try again.';
    }
    if (status && status >= 500) {
      return 'The server encountered an error. Please try again shortly.';
    }
    if (status === 404) {
      return 'Service endpoint not found. Please contact support.';
    }
  } catch {}
  return 'Sorry, I ran into an issue. Please try again.';
}

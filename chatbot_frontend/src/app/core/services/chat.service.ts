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

    this.api.chat(req).subscribe({
      next: (resp: ChatResponse) => {
        this.conversationId = resp.conversationId;
        const merged = [...this.messagesSubject.value, ...resp.messages];
        this.messagesSubject.next(merged);
      },
      error: () => {
        const errMsg: ChatMessage = {
          id: cryptoId(),
          role: 'assistant',
          content: 'Sorry, I ran into an issue. Please try again.',
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

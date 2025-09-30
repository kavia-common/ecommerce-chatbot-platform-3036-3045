import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../core/services/chat.service';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="overlay" (click)="close()">
    <section class="panel" (click)="$event.stopPropagation()">
      <header>
        <div class="title">Shopping Assistant</div>
        <button class="close" (click)="close()">✕</button>
      </header>

      <div class="messages" #scrollContainer>
        <div class="msg" *ngFor="let m of vm.messages" [class.user]="m.role==='user'" [class.assistant]="m.role==='assistant'">
          <div class="bubble">
            <div class="role" *ngIf="m.role!=='user'">Assistant</div>
            <div class="content">{{ m.content }}</div>
          </div>
        </div>
      </div>

      <footer>
        <input [(ngModel)]="vm.input" placeholder="Ask about products, deals, or help..." (keydown.enter)="send()" />
        <button class="btn primary" (click)="send()">Send</button>
      </footer>
    </section>
  </div>
  `,
  styles: [`
  .overlay { position:fixed; inset:0; background: rgba(17,24,39,0.45); display:flex; align-items:center; justify-content:center; z-index:80; padding:1rem; }
  .panel { width:100%; max-width: 680px; height: 80vh; background:#fff; border-radius: 1rem; display:flex; flex-direction:column; border:1px solid rgba(0,0,0,0.06); box-shadow: 0 24px 60px rgba(0,0,0,0.25); }
  header { display:flex; justify-content:space-between; align-items:center; padding: .75rem 1rem; border-bottom:1px solid rgba(0,0,0,0.06); }
  .title { font-weight: 800; color:#111827; }
  .close { border:none; background:transparent; cursor:pointer; padding:.5rem; }
  .messages { flex:1; overflow:auto; padding: 1rem; display:flex; flex-direction:column; gap:.5rem; background: linear-gradient(180deg, rgba(37,99,235,0.06), rgba(249,250,251,1)); }
  .msg { display:flex; }
  .msg.user { justify-content: flex-end; }
  .msg.assistant { justify-content: flex-start; }
  .bubble { max-width: 80%; background:#fff; border-radius: .75rem; padding:.6rem .8rem; box-shadow: 0 6px 18px rgba(0,0,0,0.08); border:1px solid rgba(0,0,0,0.06); }
  .msg.user .bubble { background:#2563EB; color:#fff; border-color: transparent; }
  .role { font-size:.75rem; color:#6b7280; margin-bottom: .25rem; }
  footer { padding: .75rem; display:flex; gap:.5rem; border-top:1px solid rgba(0,0,0,0.06); }
  footer input { flex:1; padding:.6rem .8rem; border-radius:.75rem; border:1px solid rgba(0,0,0,0.08); outline:none; }
  .btn.primary { background:#2563EB; color:#fff; border:none; border-radius:.75rem; padding:.6rem 1rem; font-weight:700; cursor:pointer; }
  `]
})
export class ChatPanelComponent implements OnInit, OnDestroy {
  private chat = inject(ChatService);

  @ViewChild('scrollContainer') private scroller?: ElementRef<HTMLDivElement>;
  vm = { messages: [] as any[], input: '' };

  private sub = this.chat.messages$.subscribe(m => {
    this.vm.messages = m;
    if (typeof queueMicrotask !== 'undefined') {
      queueMicrotask(() => this.scrollToBottom());
    } else {
      setTimeout(() => this.scrollToBottom());
    }
  });

  ngOnInit(): void {
    // Add a welcome message for first-time view if empty
    if (!this.vm.messages.length) {
      this.chat.reset();
      this.chat.send('Hello! I need assistance shopping.');
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  send() {
    const text = this.vm.input.trim();
    if (!text) return;
    this.chat.send(text);
    this.vm.input = '';
  }

  close() {
    if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
      const evt = new CustomEvent('app:chat-close');
      window.dispatchEvent(evt);
    }
  }

  private scrollToBottom() {
    const el = this.scroller?.nativeElement;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }
}

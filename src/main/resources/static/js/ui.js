/**
 * SmartChat UI Rendering and Interaction Engine
 */
const UI = {
    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    formatTime(timestamp) {
        if (!timestamp) timestamp = Date.now();
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    },

    /**
     * Renders Markdown-like syntax cleanly into secure HTML.
     */
    renderMarkdown(text) {
        if (!text) return '';

        // Check for special MERN flow diagram tag
        if (text.includes(':::mern-flow:::')) {
            const flowHtml = `
            <div class="tech-flow-container">
                <div class="tech-card">
                    <div class="tech-card-icon mongo-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                    </div>
                    <div class="tech-card-title">MongoDB</div>
                    <div class="tech-card-desc">Database</div>
                </div>
                <div class="tech-arrow">➔</div>
                <div class="tech-card">
                    <div class="tech-card-icon express-icon">
                        <span class="ex-logo">ex</span>
                    </div>
                    <div class="tech-card-title">Express.js</div>
                    <div class="tech-card-desc">Backend Framework</div>
                </div>
                <div class="tech-arrow">➔</div>
                <div class="tech-card">
                    <div class="tech-card-icon react-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
                            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" stroke="#06b6d4"/>
                            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" stroke="#06b6d4"/>
                            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" stroke="#06b6d4"/>
                            <circle cx="12" cy="12" r="2" fill="#06b6d4"/>
                        </svg>
                    </div>
                    <div class="tech-card-title tech-title-react">React</div>
                    <div class="tech-card-desc tech-desc-react">Frontend Library</div>
                </div>
                <div class="tech-arrow">➔</div>
                <div class="tech-card">
                    <div class="tech-card-icon node-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2L12 2zm0 2.3L5 8.3v7.4l7 4 7-4V8.3l-7-4z" fill="#22c55e"/>
                        </svg>
                    </div>
                    <div class="tech-card-title">Node.js</div>
                    <div class="tech-card-desc">Runtime Environment</div>
                </div>
            </div>`;
            text = text.replace(':::mern-flow:::', flowHtml);
        }

        // Code blocks: ```lang ... ```
        text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const escapedCode = this.escapeHtml(code.trim());
            return `
            <div class="code-block-container">
                <div class="code-block-header">
                    <span class="code-lang-label">${lang || 'code'}</span>
                    <button class="code-copy-btn" onclick="UI.copyCodeBlock(this)">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy
                    </button>
                </div>
                <pre><code>${escapedCode}</code></pre>
            </div>`;
        });

        // Inline code `code`
        text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Bold **text**
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Italic *text*
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Process line by line for lists, paragraphs, headers
        const lines = text.split('\n');
        let html = '';
        let inUl = false;
        let inOl = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            if (!line) {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                continue;
            }

            // Headers
            if (line.startsWith('### ')) {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                html += `<h3>${line.substring(4)}</h3>`;
            } else if (line.startsWith('## ')) {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                html += `<h2>${line.substring(3)}</h2>`;
            } else if (line.startsWith('# ')) {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                html += `<h1>${line.substring(2)}</h1>`;
            }
            // Numbered list
            else if (/^\d+\.\s/.test(line)) {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (!inOl) { html += '<ol class="msg-ordered-list">'; inOl = true; }
                const content = line.replace(/^\d+\.\s/, '');
                html += `<li>${content}</li>`;
            }
            // Bullet list
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                if (inOl) { html += '</ol>'; inOl = false; }
                if (!inUl) { html += '<ul class="msg-bullet-list">'; inUl = true; }
                const content = line.substring(2);
                html += `<li>${content}</li>`;
            }
            // If already HTML element like div or pre
            else if (line.startsWith('<div') || line.startsWith('</div') || line.startsWith('<pre') || line.startsWith('</pre')) {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                html += line;
            }
            // Standard Paragraph
            else {
                if (inUl) { html += '</ul>'; inUl = false; }
                if (inOl) { html += '</ol>'; inOl = false; }
                html += `<p class="msg-paragraph">${line}</p>`;
            }
        }

        if (inUl) html += '</ul>';
        if (inOl) html += '</ol>';

        return html;
    },

    copyCodeBlock(btn) {
        const container = btn.closest('.code-block-container');
        const code = container.querySelector('code').innerText;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Copied!
            `;
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    },

    copyMessageText(btn, messageId) {
        const conv = StorageService.getActiveConversation();
        if (!conv) return;
        const msg = conv.messages.find(m => m.id === messageId);
        if (!msg) return;

        // Clean out internal tag if any
        const cleanContent = msg.content.replace(':::mern-flow:::', '').trim();
        navigator.clipboard.writeText(cleanContent).then(() => {
            UI.showToast(I18N.t('copiedTooltip'));
        });
    },

    toggleReaction(btn, type) {
        btn.classList.toggle('active');
        const parent = btn.parentElement;
        if (type === 'like') {
            const dislikeBtn = parent.querySelector('.btn-dislike');
            if (dislikeBtn) dislikeBtn.classList.remove('active');
        } else {
            const likeBtn = parent.querySelector('.btn-like');
            if (likeBtn) likeBtn.classList.remove('active');
        }
    },

    showToast(message, duration = 2500) {
        const toast = document.getElementById('globalToast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('visible');
        setTimeout(() => {
            toast.classList.remove('visible');
        }, duration);
    }
};


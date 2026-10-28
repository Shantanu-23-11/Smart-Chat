/**
 * SmartChat Main Application Controller
 */
const App = {
    isGenerating: false,
    attachedFile: null,
    pendingDeleteId: null,
    lastFailedPrompt: null,

    init() {
        StorageService.init();
        this.initTheme();
        I18N.applyTranslations();
        this.bindEvents();
        this.checkApiStatus();
        this.renderSidebar();
        this.renderActiveChat();
    },

    initTheme() {
        const savedTheme = localStorage.getItem(StorageService.THEME_KEY) || 'light';
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(StorageService.THEME_KEY, theme);
        const icon = document.getElementById('themeToggleBtn');
        if (icon) {
            icon.innerHTML = theme === 'dark' 
                ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
                : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
    },

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
    },

    bindEvents() {
        // New Chat Button
        const newChatBtn = document.getElementById('newChatBtn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => this.handleNewChat());
        }

        // Search Input
        const searchInput = document.getElementById('searchChatsInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.renderSidebar(e.target.value);
            });
        }

        // Theme Toggle Button
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Language Dropdown
        const langDropdownBtn = document.getElementById('languageDropdownBtn');
        const langMenu = document.getElementById('languageMenu');
        if (langDropdownBtn && langMenu) {
            langDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langMenu.classList.toggle('open');
            });
            document.addEventListener('click', () => langMenu.classList.remove('open'));
        }

        // Language Options
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = btn.getAttribute('data-lang');
                I18N.setLang(lang);
                this.renderSidebar();
                this.renderActiveChat();
                if (langMenu) langMenu.classList.remove('open');
            });
        });

        // Composer Input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                this.autoResizeTextarea(messageInput);
                this.updateSendButtonState();
            });

            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // File Attachment
        const attachBtn = document.getElementById('attachBtn');
        const fileInput = document.getElementById('fileAttachmentInput');
        if (attachBtn && fileInput) {
            attachBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Mobile Menu Drawer
        const mobileMenuBtn = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (mobileMenuBtn && sidebar && backdrop) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                backdrop.classList.toggle('active');
            });
            backdrop.addEventListener('click', () => {
                sidebar.classList.remove('open');
                backdrop.classList.remove('active');
            });
        }

        // Settings Modal
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => {
                this.checkApiStatus();
                settingsModal.classList.add('open');
            });
        }
        if (closeSettingsBtn && settingsModal) {
            closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('open'));
        }

        // Delete Confirmation Modal
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const deleteModal = document.getElementById('deleteConfirmModal');
        if (cancelDeleteBtn && deleteModal) {
            cancelDeleteBtn.addEventListener('click', () => {
                deleteModal.classList.remove('open');
                this.pendingDeleteId = null;
            });
        }
        if (confirmDeleteBtn && deleteModal) {
            confirmDeleteBtn.addEventListener('click', () => {
                if (this.pendingDeleteId) {
                    StorageService.deleteConversation(this.pendingDeleteId);
                    this.pendingDeleteId = null;
                    deleteModal.classList.remove('open');
                    this.renderSidebar();
                    this.renderActiveChat();
                }
            });
        }

        // Clear Current Chat
        const clearChatBtn = document.getElementById('clearChatBtn');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                const activeId = StorageService.getActiveId();
                if (activeId) {
                    StorageService.clearCurrentConversation(activeId);
                    this.renderSidebar();
                    this.renderActiveChat();
                }
            });
        }

        // Clear All Chats Button inside Settings
        const clearAllBtn = document.getElementById('clearAllChatsBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm(I18N.t('clearAllConfirmMessage'))) {
                    StorageService.clearAllConversations();
                    if (settingsModal) settingsModal.classList.remove('open');
                    this.renderSidebar();
                    this.renderActiveChat();
                }
            });
        }
    },

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    },

    updateSendButtonState() {
        const input = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        if (!input || !sendBtn) return;
        const hasText = (input.value.trim().length > 0) || this.attachedFile != null;
        sendBtn.disabled = !hasText || this.isGenerating;
    },

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.attachedFile = {
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                content: e.target.result
            };
            this.renderAttachmentChip();
            this.updateSendButtonState();
        };
        reader.readAsText(file);
    },

    renderAttachmentChip() {
        const container = document.getElementById('attachmentPreviewContainer');
        if (!container) return;
        if (!this.attachedFile) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';
        container.innerHTML = `
            <div class="attachment-chip">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                <span class="attachment-name">${UI.escapeHtml(this.attachedFile.name)} (${this.attachedFile.size})</span>
                <button class="attachment-remove-btn" title="${I18N.t('attachmentRemove')}" onclick="App.removeAttachment()">✕</button>
            </div>
        `;
    },

    removeAttachment() {
        this.attachedFile = null;
        const fileInput = document.getElementById('fileAttachmentInput');
        if (fileInput) fileInput.value = '';
        this.renderAttachmentChip();
        this.updateSendButtonState();
    },

    handleNewChat() {
        const conversations = StorageService.getConversations();
        const active = StorageService.getActiveConversation();
        
        // If current active conversation is already empty, just keep it
        if (active && active.messages.length === 0) {
            this.focusMessageInput();
            this.closeMobileSidebar();
            return;
        }

        const newChat = StorageService.createConversation('New Chat');
        this.renderSidebar();
        this.renderActiveChat();
        this.focusMessageInput();
        this.closeMobileSidebar();
    },

    focusMessageInput() {
        const input = document.getElementById('messageInput');
        if (input) {
            input.focus();
        }
    },

    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
    },

    async checkApiStatus() {
        try {
            const res = await fetch('/api/config');
            if (res.ok) {
                const data = await res.json();
                const statusBadge = document.getElementById('apiStatusBadge');
                const helpText = document.getElementById('apiHelpText');
                if (statusBadge) {
                    if (data.apiKeyConfigured) {
                        statusBadge.className = 'status-badge connected';
                        statusBadge.textContent = I18N.t('apiConnected') + ` (${data.model})`;
                        if (helpText) helpText.style.display = 'none';
                    } else {
                        statusBadge.className = 'status-badge missing';
                        statusBadge.textContent = I18N.t('apiMissing');
                        if (helpText) {
                            helpText.style.display = 'block';
                            helpText.textContent = I18N.t('apiHelpText');
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Could not reach /api/config', e);
        }
    },

    renderSidebar(searchQuery = '') {
        const container = document.getElementById('conversationList');
        if (!container) return;

        const grouped = StorageService.getGroupedConversations(searchQuery);
        const activeId = StorageService.getActiveId();

        let html = '';

        const renderGroup = (title, items) => {
            if (!items || items.length === 0) return '';
            let groupHtml = `<div class="sidebar-group">
                <div class="sidebar-group-title">${title}</div>
                <div class="sidebar-group-items">`;
            
            items.forEach(c => {
                const isActive = c.id === activeId ? 'active' : '';
                groupHtml += `
                <div class="sidebar-chat-item ${isActive}" data-id="${c.id}" onclick="App.selectConversation('${c.id}')">
                    <div class="chat-item-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <span class="chat-item-title" title="${UI.escapeHtml(c.title)}">${UI.escapeHtml(c.title)}</span>
                    <div class="chat-item-actions">
                        <button class="chat-menu-btn" onclick="App.toggleItemMenu(event, '${c.id}')" title="Options">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                                <circle cx="12" cy="5" r="2"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                                <circle cx="12" cy="19" r="2"></circle>
                            </svg>
                        </button>
                    </div>
                </div>`;
            });

            groupHtml += `</div></div>`;
            return groupHtml;
        };

        const todayHtml = renderGroup(I18N.t('groupToday'), grouped.today);
        const yesterdayHtml = renderGroup(I18N.t('groupYesterday'), grouped.yesterday);
        const thisWeekHtml = renderGroup(I18N.t('groupThisWeek'), grouped.thisWeek);

        if (!todayHtml && !yesterdayHtml && !thisWeekHtml) {
            html = `<div class="no-chats-placeholder">${I18N.t('noChatsFound')}</div>`;
        } else {
            html = todayHtml + yesterdayHtml + thisWeekHtml;
        }

        container.innerHTML = html;
    },

    selectConversation(id) {
        StorageService.setActiveId(id);
        this.renderSidebar();
        this.renderActiveChat();
        this.closeMobileSidebar();
    },

    toggleItemMenu(event, conversationId) {
        event.stopPropagation();
        
        // Remove existing open menus
        document.querySelectorAll('.chat-dropdown-menu').forEach(m => m.remove());

        const targetBtn = event.currentTarget;
        const rect = targetBtn.getBoundingClientRect();

        const menu = document.createElement('div');
        menu.className = 'chat-dropdown-menu';
        menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
        menu.style.left = `${rect.right + window.scrollX - 140}px`;

        menu.innerHTML = `
            <button class="menu-item" onclick="App.promptRename('${conversationId}')">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                ${I18N.t('renameChat')}
            </button>
            <button class="menu-item danger" onclick="App.openDeleteModal('${conversationId}')">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                ${I18N.t('deleteChat')}
            </button>
        `;

        document.body.appendChild(menu);

        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target !== targetBtn) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    },

    promptRename(conversationId) {
        const conv = StorageService.getConversations().find(c => c.id === conversationId);
        if (!conv) return;
        const newTitle = prompt('Enter new conversation title:', conv.title);
        if (newTitle && newTitle.trim()) {
            StorageService.updateConversationTitle(conversationId, newTitle.trim());
            this.renderSidebar();
        }
    },

    openDeleteModal(conversationId) {
        this.pendingDeleteId = conversationId;
        const modal = document.getElementById('deleteConfirmModal');
        if (modal) modal.classList.add('open');
    },

    renderActiveChat() {
        const messagesContainer = document.getElementById('chatMessagesContainer');
        const welcomeContainer = document.getElementById('welcomeScreenContainer');
        const conv = StorageService.getActiveConversation();

        if (!conv || conv.messages.length === 0) {
            if (welcomeContainer) welcomeContainer.style.display = 'flex';
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
                messagesContainer.style.display = 'none';
            }
            return;
        }

        if (welcomeContainer) welcomeContainer.style.display = 'none';
        if (messagesContainer) {
            messagesContainer.style.display = 'flex';
            let html = '';

            conv.messages.forEach(msg => {
                const timeStr = UI.formatTime(msg.timestamp);

                if (msg.role === 'user') {
                    html += `
                    <div class="message-wrapper user-message-wrapper" id="${msg.id}">
                        <div class="user-message-row">
                            <div class="user-message-bubble">
                                <div class="message-text">${UI.renderMarkdown(msg.content)}</div>
                            </div>
                            <div class="user-avatar-circle" title="User">
                                <span>S</span>
                            </div>
                        </div>
                        <div class="message-timestamp right-aligned">${timeStr}</div>
                    </div>`;
                } else {
                    html += `
                    <div class="message-wrapper ai-message-wrapper" id="${msg.id}">
                        <div class="ai-message-row">
                            <div class="ai-avatar-circle" title="SmartChat AI">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#aiSparkleGrad)"/>
                                    <defs>
                                        <linearGradient id="aiSparkleGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#3b82f6"/>
                                            <stop offset="1" stop-color="#8b5cf6"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div class="ai-message-body">
                                <div class="ai-actions-bar">
                                    <button class="ai-action-btn" title="${I18N.t('copyBtn')}" onclick="UI.copyMessageText(this, '${msg.id}')">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                    <button class="ai-action-btn btn-like" title="${I18N.t('likeBtn')}" onclick="UI.toggleReaction(this, 'like')">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                        </svg>
                                    </button>
                                    <button class="ai-action-btn btn-dislike" title="${I18N.t('dislikeBtn')}" onclick="UI.toggleReaction(this, 'dislike')">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div class="ai-message-text">${UI.renderMarkdown(msg.content)}</div>
                            </div>
                        </div>
                        <div class="message-timestamp left-aligned">${timeStr}</div>
                    </div>`;
                }
            });

            messagesContainer.innerHTML = html;
            this.scrollToBottom();
        }
    },

    scrollToBottom() {
        const scrollArea = document.getElementById('chatScrollArea');
        if (scrollArea) {
            scrollArea.scrollTo({
                top: scrollArea.scrollHeight,
                behavior: 'smooth'
            });
        }
    },

    selectPromptSuggestion(text) {
        const input = document.getElementById('messageInput');
        if (input) {
            input.value = text;
            this.autoResizeTextarea(input);
            this.updateSendButtonState();
            this.sendMessage();
        }
    },

    async sendMessage() {
        if (this.isGenerating) return;

        const input = document.getElementById('messageInput');
        let promptText = input ? input.value.trim() : '';

        // If file attached, append file content to prompt
        if (this.attachedFile) {
            promptText = (promptText ? promptText + "\n\n" : "") +
                `[Attached File: ${this.attachedFile.name}]\n\`\`\`\n${this.attachedFile.content}\n\`\`\``;
        }

        if (!promptText) return;

        // Ensure active conversation exists
        let activeConv = StorageService.getActiveConversation();
        if (!activeConv) {
            activeConv = StorageService.createConversation(promptText);
        }

        // Add user message to UI & storage
        StorageService.saveMessage(activeConv.id, 'user', promptText);
        this.renderSidebar();
        this.renderActiveChat();

        // Clear input & attachment
        if (input) {
            input.value = '';
            this.autoResizeTextarea(input);
        }
        this.attachedFile = null;
        this.renderAttachmentChip();
        this.updateSendButtonState();

        // Prepare History Context (last 10 messages)
        const currentConv = StorageService.getActiveConversation();
        const historyForApi = (currentConv.messages || [])
            .slice(0, -1) // Exclude current prompt
            .slice(-10)
            .map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                content: m.content
            }));

        // Show thinking/loading state
        this.isGenerating = true;
        this.updateSendButtonState();
        this.showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: promptText,
                    history: historyForApi,
                    conversationId: activeConv.id
                })
            });

            this.removeTypingIndicator();

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const errorMsg = errData.message || `Server returned error (${response.status})`;
                this.showErrorCard(errorMsg, promptText);
                return;
            }

            const data = await response.json();
            if (data.success && data.response) {
                StorageService.saveMessage(activeConv.id, 'model', data.response);
                if (data.title && activeConv.title === 'New Chat') {
                    StorageService.updateConversationTitle(activeConv.id, data.title);
                }
                this.renderSidebar();
                this.renderActiveChat();
            } else {
                this.showErrorCard('Received invalid response from server.', promptText);
            }

        } catch (error) {
            this.removeTypingIndicator();
            console.error('Fetch error:', error);
            this.showErrorCard('Unable to reach the SmartChat server. Please verify your connection.', promptText);
        } finally {
            this.isGenerating = false;
            this.updateSendButtonState();
        }
    },

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessagesContainer');
        if (!messagesContainer) return;
        messagesContainer.style.display = 'flex';

        const typingEl = document.createElement('div');
        typingEl.className = 'message-wrapper ai-message-wrapper typing-wrapper';
        typingEl.id = 'activeTypingIndicator';
        typingEl.innerHTML = `
            <div class="ai-message-row">
                <div class="ai-avatar-circle">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#aiSparkleGrad)"/>
                    </svg>
                </div>
                <div class="ai-message-body">
                    <div class="typing-dots-container">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-label">${I18N.t('thinking')}</span>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingEl);
        this.scrollToBottom();
    },

    removeTypingIndicator() {
        const typingEl = document.getElementById('activeTypingIndicator');
        if (typingEl) typingEl.remove();
    },

    showErrorCard(errorMessage, originalPrompt) {
        this.lastFailedPrompt = originalPrompt;
        const messagesContainer = document.getElementById('chatMessagesContainer');
        if (!messagesContainer) return;

        const errorEl = document.createElement('div');
        errorEl.className = 'message-wrapper ai-message-wrapper error-wrapper';
        errorEl.innerHTML = `
            <div class="ai-message-row">
                <div class="error-avatar-circle">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <div class="ai-message-body error-bubble">
                    <div class="error-text">${UI.escapeHtml(errorMessage)}</div>
                    <button class="retry-action-btn" onclick="App.retryLastPrompt(this)">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                        ${I18N.t('retryBtn')}
                    </button>
                </div>
            </div>
        `;
        messagesContainer.appendChild(errorEl);
        this.scrollToBottom();
    },

    retryLastPrompt(btn) {
        if (!this.lastFailedPrompt) return;
        const bubble = btn.closest('.error-wrapper');
        if (bubble) bubble.remove();

        const input = document.getElementById('messageInput');
        if (input) {
            input.value = this.lastFailedPrompt;
            this.sendMessage();
        }
    }
};

// Initialize App once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});


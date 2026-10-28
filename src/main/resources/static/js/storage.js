/**
 * SmartChat Persistence & Storage Layer
 * Manages localStorage conversations with auto-seeding matching the reference design.
 */
const StorageService = {
    CONVERSATIONS_KEY: 'smartchat_conversations',
    ACTIVE_ID_KEY: 'smartchat_active_id',
    THEME_KEY: 'smartchat_theme',

    init() {
        const existing = localStorage.getItem(this.CONVERSATIONS_KEY);
        if (!existing || JSON.parse(existing).length === 0) {
            this.seedInitialConversations();
        }
    },

    seedInitialConversations() {
        const now = Date.now();
        const oneHourAgo = now - 3600 * 1000;
        const yesterday = now - 24 * 3600 * 1000;
        const twoDaysAgo = now - 48 * 3600 * 1000;
        const fourDaysAgo = now - 96 * 3600 * 1000;

        const mernResponseContent = `The **MERN Stack** is a popular set of technologies used to build full-stack web applications using JavaScript.

It includes:

1. **MongoDB** – A NoSQL database to store data in a flexible, JSON-like format.
2. **Express.js** – A backend framework for Node.js that helps in building APIs and handling server-side logic.
3. **React** – A frontend JavaScript library for building user interfaces (UI).
4. **Node.js** – A JavaScript runtime environment to run the backend server.

**In simple words:**
MERN stack allows you to build complete web applications using only JavaScript, from database to user interface.

:::mern-flow:::`;

        const seedChats = [
            {
                id: 'seed-mern',
                title: 'Explain MERN Stack',
                createdAt: oneHourAgo,
                updatedAt: oneHourAgo,
                messages: [
                    {
                        id: 'msg-seed-1',
                        role: 'user',
                        content: 'Explain MERN Stack in simple words',
                        timestamp: oneHourAgo - 10000
                    },
                    {
                        id: 'msg-seed-2',
                        role: 'model',
                        content: mernResponseContent,
                        timestamp: oneHourAgo
                    }
                ]
            },
            {
                id: 'seed-dsa',
                title: 'DSA Study Plan',
                createdAt: now - 7200 * 1000,
                updatedAt: now - 7200 * 1000,
                messages: [
                    {
                        id: 'msg-dsa-1',
                        role: 'user',
                        content: 'Give me a 3-month DSA study plan for technical interviews.',
                        timestamp: now - 7200 * 1000
                    },
                    {
                        id: 'msg-dsa-2',
                        role: 'model',
                        content: `Here is a structured 3-month plan to master Data Structures and Algorithms:\n\n**Month 1: Fundamentals & Linear Structures**\n- Arrays, Strings, Two Pointers, Sliding Window\n- Linked Lists, Stacks, and Queues\n\n**Month 2: Non-Linear Structures & Recursion**\n- Binary Trees, BSTs, and Tree Traversals (DFS/BFS)\n- Heaps / Priority Queues and Hash Maps\n- Basic Recursion and Backtracking\n\n**Month 3: Advanced Topics & Interview Practice**\n- Dynamic Programming (1D and 2D)\n- Graphs (BFS, DFS, Dijkstra)\n- Timed Mock Tests on LeetCode Mediums`,
                        timestamp: now - 7100 * 1000
                    }
                ]
            },
            {
                id: 'seed-cloud',
                title: 'Cloud Computing Basics',
                createdAt: now - 14400 * 1000,
                updatedAt: now - 14400 * 1000,
                messages: [
                    {
                        id: 'msg-cloud-1',
                        role: 'user',
                        content: 'What are the three main service models of Cloud Computing?',
                        timestamp: now - 14400 * 1000
                    },
                    {
                        id: 'msg-cloud-2',
                        role: 'model',
                        content: `The three fundamental cloud computing models are:\n\n1. **IaaS (Infrastructure as a Service)**: Provides virtualized computing resources over the internet (e.g., AWS EC2, Google Compute Engine).\n2. **PaaS (Platform as a Service)**: Provides hardware and software tools over the internet, typically for application development (e.g., Heroku, Google App Engine).\n3. **SaaS (Software as a Service)**: Delivers software applications over the internet on a subscription basis (e.g., Google Workspace, Microsoft 365).`,
                        timestamp: now - 14300 * 1000
                    }
                ]
            },
            {
                id: 'seed-resume',
                title: 'Resume Review',
                createdAt: now - 20000 * 1000,
                updatedAt: now - 20000 * 1000,
                messages: [
                    {
                        id: 'msg-resume-1',
                        role: 'user',
                        content: 'How can I make my software engineer resume stand out to recruiters?',
                        timestamp: now - 20000 * 1000
                    },
                    {
                        id: 'msg-resume-2',
                        role: 'model',
                        content: `To make your resume stand out in tech:\n\n- **Quantify Impact**: Use the XYZ formula (*Accomplished [X], as measured by [Y], by doing [Z]*).\n- **Highlight Projects**: Include GitHub links and live demos for 2-3 prominent full-stack applications.\n- **Keep It Clean**: 1 page, ATS-friendly typography, no complex multi-column graphics.\n- **Tailor Skills**: List languages and frameworks relevant to the job posting.`,
                        timestamp: now - 19900 * 1000
                    }
                ]
            },
            {
                id: 'seed-java-python',
                title: 'Java vs Python',
                createdAt: yesterday,
                updatedAt: yesterday,
                messages: [
                    {
                        id: 'msg-jp-1',
                        role: 'user',
                        content: 'Compare Java vs Python for enterprise software development.',
                        timestamp: yesterday
                    },
                    {
                        id: 'msg-jp-2',
                        role: 'model',
                        content: `**Java**:\n- Statically typed, compiled to bytecode.\n- Exceptional concurrency, high throughput, and memory management.\n- Dominates enterprise backend ecosystems (Spring Boot, banking, microservices).\n\n**Python**:\n- Dynamically typed, interpreted.\n- Rapid prototyping and leading ecosystem for AI/ML/Data Science (PyTorch, TensorFlow, Pandas).\n- Slightly slower raw runtime performance compared to compiled Java.`,
                        timestamp: yesterday + 5000
                    }
                ]
            },
            {
                id: 'seed-project-ideas',
                title: 'Project Ideas',
                createdAt: yesterday - 3600 * 1000,
                updatedAt: yesterday - 3600 * 1000,
                messages: [
                    {
                        id: 'msg-pi-1',
                        role: 'user',
                        content: 'Suggest 3 impressive full-stack projects for my portfolio.',
                        timestamp: yesterday - 3600 * 1000
                    },
                    {
                        id: 'msg-pi-2',
                        role: 'model',
                        content: `1. **Collaborative Real-Time Workspace** (WebSockets, Spring Boot, Canvas/Quill, Redis).\n2. **AI-Powered Customer Support Hub** (Gemini API, Spring AI, Vector Search).\n3. **Distributed Job Scheduler & Monitoring Dashboard** (Kafka/RabbitMQ, Docker, Prometheus).`,
                        timestamp: yesterday - 3500 * 1000
                    }
                ]
            },
            {
                id: 'seed-db-norm',
                title: 'Database Normalization',
                createdAt: yesterday - 7200 * 1000,
                updatedAt: yesterday - 7200 * 1000,
                messages: [
                    {
                        id: 'msg-db-1',
                        role: 'user',
                        content: 'Explain 1NF, 2NF, and 3NF simply.',
                        timestamp: yesterday - 7200 * 1000
                    },
                    {
                        id: 'msg-db-2',
                        role: 'model',
                        content: `- **1NF**: Atomic values per cell, unique column names, primary key identified.\n- **2NF**: In 1NF + no partial dependency on a composite primary key.\n- **3NF**: In 2NF + no transitive dependencies (non-key columns must depend only on the primary key).`,
                        timestamp: yesterday - 7100 * 1000
                    }
                ]
            },
            {
                id: 'seed-os',
                title: 'Operating System Concepts',
                createdAt: twoDaysAgo,
                updatedAt: twoDaysAgo,
                messages: [
                    {
                        id: 'msg-os-1',
                        role: 'user',
                        content: 'What is the difference between a Process and a Thread?',
                        timestamp: twoDaysAgo
                    },
                    {
                        id: 'msg-os-2',
                        role: 'model',
                        content: `A **Process** is an independent executing program with its own memory address space.\nA **Thread** is a lightweight unit of execution within a process that shares memory and resources with sibling threads.`,
                        timestamp: twoDaysAgo + 2000
                    }
                ]
            },
            {
                id: 'seed-web-roadmap',
                title: 'Web Development Roadmap',
                createdAt: fourDaysAgo,
                updatedAt: fourDaysAgo,
                messages: [
                    {
                        id: 'msg-wr-1',
                        role: 'user',
                        content: 'What is the modern web development roadmap for 2026?',
                        timestamp: fourDaysAgo
                    },
                    {
                        id: 'msg-wr-2',
                        role: 'model',
                        content: `1. **Foundations**: Semantic HTML5, Modern CSS (Grid/Flex/Custom Props), JavaScript ES6+.\n2. **Frontend UI**: React, Vue, or Web Components with state management.\n3. **Backend & APIs**: Spring Boot, Node.js, RESTful design, GraphQL.\n4. **Database & Cloud**: PostgreSQL, Redis, Docker containers, CI/CD pipelines.`,
                        timestamp: fourDaysAgo + 4000
                    }
                ]
            },
            {
                id: 'seed-ai-edu',
                title: 'AI in Education',
                createdAt: fourDaysAgo - 86400 * 1000,
                updatedAt: fourDaysAgo - 86400 * 1000,
                messages: [
                    {
                        id: 'msg-ai-1',
                        role: 'user',
                        content: 'How is generative AI transforming personalized student learning?',
                        timestamp: fourDaysAgo - 86400 * 1000
                    },
                    {
                        id: 'msg-ai-2',
                        role: 'model',
                        content: `Generative AI acts as a 24/7 personal tutor that adapts explanations to the student's learning speed, breaks down complex mathematical proofs, generates customized practice quizzes, and provides instant actionable feedback.`,
                        timestamp: fourDaysAgo - 86400 * 1000 + 3000
                    }
                ]
            }
        ];

        localStorage.setItem(this.CONVERSATIONS_KEY, JSON.stringify(seedChats));
        localStorage.setItem(this.ACTIVE_ID_KEY, 'seed-mern');
    },

    getConversations() {
        try {
            const data = localStorage.getItem(this.CONVERSATIONS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to parse conversations from localStorage', e);
            return [];
        }
    },

    saveConversations(conversations) {
        localStorage.setItem(this.CONVERSATIONS_KEY, JSON.stringify(conversations));
    },

    getActiveId() {
        return localStorage.getItem(this.ACTIVE_ID_KEY) || null;
    },

    setActiveId(id) {
        if (id) {
            localStorage.setItem(this.ACTIVE_ID_KEY, id);
        } else {
            localStorage.removeItem(this.ACTIVE_ID_KEY);
        }
    },

    getActiveConversation() {
        const id = this.getActiveId();
        if (!id) return null;
        return this.getConversations().find(c => c.id === id) || null;
    },

    createConversation(title = 'New Chat') {
        const conversations = this.getConversations();
        const newChat = {
            id: 'chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            title: title,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: []
        };
        conversations.unshift(newChat);
        this.saveConversations(conversations);
        this.setActiveId(newChat.id);
        return newChat;
    },

    saveMessage(conversationId, role, content) {
        const conversations = this.getConversations();
        const conv = conversations.find(c => c.id === conversationId);
        if (!conv) return null;

        const message = {
            id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            role: role,
            content: content,
            timestamp: Date.now()
        };

        conv.messages.push(message);
        conv.updatedAt = Date.now();

        // If title is default or first message, update title
        if (conv.messages.filter(m => m.role === 'user').length === 1 && role === 'user') {
            conv.title = this.formatTitle(content);
        }

        // Keep active conversation at top
        const index = conversations.indexOf(conv);
        if (index > 0) {
            conversations.splice(index, 1);
            conversations.unshift(conv);
        }

        this.saveConversations(conversations);
        return message;
    },

    updateConversationTitle(conversationId, newTitle) {
        if (!newTitle || !newTitle.trim()) return;
        const conversations = this.getConversations();
        const conv = conversations.find(c => c.id === conversationId);
        if (conv) {
            conv.title = newTitle.trim();
            this.saveConversations(conversations);
        }
    },

    deleteConversation(conversationId) {
        let conversations = this.getConversations();
        conversations = conversations.filter(c => c.id !== conversationId);
        this.saveConversations(conversations);

        if (this.getActiveId() === conversationId) {
            const nextActive = conversations.length > 0 ? conversations[0].id : null;
            this.setActiveId(nextActive);
        }
    },

    clearCurrentConversation(conversationId) {
        const conversations = this.getConversations();
        const conv = conversations.find(c => c.id === conversationId);
        if (conv) {
            conv.messages = [];
            conv.updatedAt = Date.now();
            this.saveConversations(conversations);
        }
    },

    clearAllConversations() {
        localStorage.removeItem(this.CONVERSATIONS_KEY);
        localStorage.removeItem(this.ACTIVE_ID_KEY);
    },

    formatTitle(prompt) {
        if (!prompt) return 'New Chat';
        const clean = prompt.trim().replace(/^[\W_]+/, '').replace(/[\r\n]+/g, ' ');
        const words = clean.split(/\s+/);
        if (words.length <= 4) {
            return clean.length > 28 ? clean.substring(0, 25) + '...' : clean;
        }
        return words.slice(0, 4).join(' ');
    },

    /**
     * Groups conversations into "Today", "Yesterday", and "This Week" (or older).
     */
    getGroupedConversations(searchQuery = '') {
        const conversations = this.getConversations();
        const query = (searchQuery || '').trim().toLowerCase();

        const filtered = conversations.filter(c => {
            if (!query) return true;
            if (c.title && c.title.toLowerCase().includes(query)) return true;
            // Search inside message content
            return c.messages.some(m => m.content && m.content.toLowerCase().includes(query));
        });

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfYesterday = startOfToday - 24 * 3600 * 1000;
        const startOfWeek = startOfToday - 6 * 24 * 3600 * 1000;

        const groups = {
            today: [],
            yesterday: [],
            thisWeek: []
        };

        filtered.forEach(c => {
            const time = c.updatedAt || c.createdAt || 0;
            if (time >= startOfToday) {
                groups.today.push(c);
            } else if (time >= startOfYesterday) {
                groups.yesterday.push(c);
            } else {
                groups.thisWeek.push(c);
            }
        });

        return groups;
    }
};


/**
 * SmartChat Internationalization (i18n)
 * Supports English (en), Hindi (hi), and Marathi (mr)
 */
const I18N = {
    currentLang: localStorage.getItem('smartchat_lang') || 'en',

    translations: {
        en: {
            appName: 'SmartChat',
            poweredBy: 'Powered by Gemini',
            newChat: 'New Chat',
            searchPlaceholder: 'Search chats...',
            groupToday: 'Today',
            groupYesterday: 'Yesterday',
            groupThisWeek: 'This Week',
            noChatsFound: 'No chats found',
            welcomeHeading: 'How can I help you today?',
            welcomeSubheading: 'Ask anything, explore ideas, or select a suggested topic to get started.',
            promptMern: 'Explain MERN Stack in simple words',
            promptDsa: 'DSA Study Plan for 3 months',
            promptCloud: 'Cloud Computing Basics explained',
            promptResume: 'Tips for a standout Resume Review',
            composerPlaceholder: 'Type your message here...',
            composerDisclaimer: 'SmartChat can make mistakes. Consider checking important information.',
            copiedTooltip: 'Copied to clipboard!',
            copyBtn: 'Copy response',
            retryBtn: 'Retry response',
            likeBtn: 'Good response',
            dislikeBtn: 'Poor response',
            renameChat: 'Rename conversation',
            deleteChat: 'Delete conversation',
            clearChat: 'Clear current conversation',
            clearAllChats: 'Clear all conversations',
            settingsTitle: 'Settings',
            themeLabel: 'Appearance',
            themeLight: 'Light Theme',
            themeDark: 'Dark Theme',
            languageLabel: 'Language',
            apiStatusLabel: 'Gemini API Status',
            apiConnected: 'API Connected',
            apiMissing: 'API Key Required',
            apiHelpText: 'Set your GEMINI_API_KEY environment variable on the server.',
            cancel: 'Cancel',
            confirm: 'Confirm',
            deleteConfirmTitle: 'Delete Conversation?',
            deleteConfirmMessage: 'Are you sure you want to delete this conversation? This action cannot be undone.',
            clearAllConfirmTitle: 'Clear All Conversations?',
            clearAllConfirmMessage: 'This will delete all saved chat history permanently.',
            thinking: 'SmartChat is thinking...',
            attachmentRemove: 'Remove file',
            fileAttached: 'File attached:'
        },
        hi: {
            appName: 'SmartChat',
            poweredBy: 'Gemini द्वारा संचालित',
            newChat: 'नई चैट',
            searchPlaceholder: 'चैट खोजें...',
            groupToday: 'आज',
            groupYesterday: 'कल',
            groupThisWeek: 'इस सप्ताह',
            noChatsFound: 'कोई चैट नहीं मिली',
            welcomeHeading: 'आज मैं आपकी क्या सहायता कर सकता हूँ?',
            welcomeSubheading: 'कुछ भी पूछें, नए विचार तलाशें या शुरुआत करने के लिए नीचे दिए गए सुझाव चुनें।',
            promptMern: 'सरल शब्दों में MERN Stack समझाएं',
            promptDsa: '3 महीने की DSA अध्ययन योजना',
            promptCloud: 'क्लाउड कंप्यूटिंग के मूलभूत सिद्धांत',
            promptResume: 'शानदार रिज़्यूमे के लिए महत्वपूर्ण सुझाव',
            composerPlaceholder: 'यहाँ अपना संदेश लिखें...',
            composerDisclaimer: 'SmartChat से गलतियाँ हो सकती हैं। महत्वपूर्ण जानकारी की पुष्टि अवश्य करें।',
            copiedTooltip: 'क्लिपबोर्ड पर कॉपी किया गया!',
            copyBtn: 'उत्तर कॉपी करें',
            retryBtn: 'पुनः प्रयास करें',
            likeBtn: 'अच्छा उत्तर',
            dislikeBtn: 'असंतोषजनक उत्तर',
            renameChat: 'चैट का नाम बदलें',
            deleteChat: 'चैट हटाएं',
            clearChat: 'वर्तमान चैट साफ़ करें',
            clearAllChats: 'सभी चैट हटाएं',
            settingsTitle: 'सेटिंग्स',
            themeLabel: 'थीम',
            themeLight: 'लाइट थीम',
            themeDark: 'डार्क थीम',
            languageLabel: 'भाषा',
            apiStatusLabel: 'Gemini API स्थिति',
            apiConnected: 'API कनेक्टेड',
            apiMissing: 'API की आवश्यक है',
            apiHelpText: 'सर्वर पर GEMINI_API_KEY एनवायरनमेंट वेरिएबल सेट करें।',
            cancel: 'रद्द करें',
            confirm: 'पुष्टि करें',
            deleteConfirmTitle: 'चैट हटाएं?',
            deleteConfirmMessage: 'क्या आप वाकई इस चैट को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
            clearAllConfirmTitle: 'सभी चैट हटाएं?',
            clearAllConfirmMessage: 'यह सभी सुरक्षित चैट इतिहास को हमेशा के लिए हटा देगा।',
            thinking: 'SmartChat सोच रहा है...',
            attachmentRemove: 'फ़ाइल हटाएं',
            fileAttached: 'फ़ाइल संलग्न:'
        },
        mr: {
            appName: 'SmartChat',
            poweredBy: 'Gemini द्वारे समर्थित',
            newChat: 'नवीन चॅट',
            searchPlaceholder: 'चॅट शोधा...',
            groupToday: 'आज',
            groupYesterday: 'काल',
            groupThisWeek: 'या आठवड्यात',
            noChatsFound: 'कोणतीही चॅट सापडली नाही',
            welcomeHeading: 'आज मी तुम्हाला कशी मदत करू शकतो?',
            welcomeSubheading: 'काहीही विचारा, नवीन कल्पना शोधा किंवा सुरुवात करण्यासाठी खालील विषय निवडा.',
            promptMern: 'सोप्या भाषेत MERN Stack स्पष्ट करा',
            promptDsa: '३ महिन्यांचा DSA अभ्यास आराखडा',
            promptCloud: 'क्लाउड कम्प्यूटिंगच्या मूलभूत गोष्टी',
            promptResume: 'उत्कृष्ट रेझ्युमेसाठी महत्त्वाच्या टिप्स',
            composerPlaceholder: 'तुमचा संदेश येथे टाईप करा...',
            composerDisclaimer: 'SmartChat कडून चुका होऊ शकतात. कृपया महत्त्वाची माहिती तपासा.',
            copiedTooltip: 'क्लिपबोर्डवर कॉपी केले!',
            copyBtn: 'उत्तर कॉपी करा',
            retryBtn: 'पुन्हा प्रयत्न करा',
            likeBtn: 'चांगले उत्तर',
            dislikeBtn: 'असमाधानकारक उत्तर',
            renameChat: 'चॅटचे नाव बदला',
            deleteChat: 'चॅट हटवा',
            clearChat: 'चालू चॅट साफ करा',
            clearAllChats: 'सर्व चॅट्स हटवा',
            settingsTitle: 'सेटिंग्ज',
            themeLabel: 'थीम',
            themeLight: 'लाइट थीम',
            themeDark: 'डार्क थीम',
            languageLabel: 'भाषा',
            apiStatusLabel: 'Gemini API स्थिती',
            apiConnected: 'API जोडलेले आहे',
            apiMissing: 'API Key आवश्यक आहे',
            apiHelpText: 'सर्व्हरवर GEMINI_API_KEY एन्व्हायर्नमेंट व्हेरिएबल सेट करा.',
            cancel: 'रद्द करा',
            confirm: 'नक्की करा',
            deleteConfirmTitle: 'चॅट हटवायची आहे का?',
            deleteConfirmMessage: 'तुम्हाला खात्री आहे की ही चॅट हटवायची आहे? ही क्रिया पूर्ववत करता येणार नाही.',
            clearAllConfirmTitle: 'सर्व चॅट्स हटवायच्या आहेत का?',
            clearAllConfirmMessage: 'यामुळे तुमचा सर्व जतन केलेला इतिहास कायमचा हटवला जाईल.',
            thinking: 'SmartChat विचार करत आहे...',
            attachmentRemove: 'फाईल काढा',
            fileAttached: 'फाईल जोडली:'
        }
    },

    t(key) {
        const langDict = this.translations[this.currentLang] || this.translations.en;
        return langDict[key] || this.translations.en[key] || key;
    },

    setLang(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('smartchat_lang', lang);
            this.applyTranslations();
        }
    },

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                el.textContent = translation;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                el.placeholder = translation;
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation) {
                el.title = translation;
            }
        });

        // Update active language indicator in UI
        const langDisplay = document.getElementById('currentLanguageLabel');
        if (langDisplay) {
            const langNames = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' };
            langDisplay.textContent = langNames[this.currentLang] || 'English';
        }
    }
};


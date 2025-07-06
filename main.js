// 🎯 MAIN.JS - Coordinatore principale del sistema AI
// Gestisce l'inizializzazione e coordina tutte le modalità

console.log('🚀 Caricamento Main.js - Sistema AI Modulare');

class VirtualFriend {
    constructor() {
        console.log('🔧 Inizializzazione VirtualFriend Modulare...');
        
        // 🏗️ Configurazione base
        this.isChatVisible = true;
        this.currentCategory = 'amico';
        
        // 🧠 Memoria conversazionale
        this.conversationHistory = [];
        this.maxHistoryLength = 10;
        
        // 🧠 Sistema memoria per modalità
        this.modalityMemory = {
            musica: [],
            programmatore: [],
            ricercatore: [],
            amico: []
        };
        this.previousCategory = null;
        
        // 🧠 Sistema di apprendimento continuo
        this.learningSystem = null;
        this.learningEnabled = true;
        
        // 🔍 Sistema ricerca online
        this.searchEnabled = false;
        try {
            this.searchEnabled = AI_CONFIG?.search?.enabled || false;
        } catch (error) {
            console.warn('⚠️ Configurazione ricerca non disponibile');
        }
        
        // 🎨 Inizializzazione DOM e interfaccia
        this.initializeDOMElements();
        this.initializeModes();
        this.initializeEventListeners();
        this.initializeInterface();
        
        // 🧠 Inizializza sistema apprendimento
        this.initializeLearningSystem();
        
        // 🚀 Avvio sistema
        this.startSystem();
        
        // 🎯 Inizializza splash screen di benvenuto (alla fine)
        setTimeout(() => {
            this.initializeWelcomeSplash();
            
            // 🧪 Test per debug (rimuovere in produzione)
            this.testSplashFunctionality();
            
            // Esponi istanza per debug
            window.bittronAI = this;
            window.debugBlockers = () => this.debugBlockingElements();
            window.forceClean = () => this.forceRemoveBlockers();
            console.log('🔧 Istanza esposta in window.bittronAI per debug');
            console.log('🔧 Comandi debug: window.debugBlockers() e window.forceClean()');
        }, 100);
    }
    
    // 🏗️ Inizializza elementi DOM
    initializeDOMElements() {
        console.log('🔧 Inizializzazione elementi DOM...');
        
        // Crea indicatore di debug
        this.createDebugIndicator();
        
        // Elementi principali
        this.avatar = document.getElementById('avatar');
        this.mouth = document.getElementById('mouth');
        this.aiStatus = document.getElementById('ai-status');
        this.transcript = document.getElementById('transcript');
        this.testAIBtn = document.getElementById('test-ai');
        this.toggleChatBtn = document.getElementById('toggle-chat');
        this.clearMemoryBtn = document.getElementById('clear-memory');
        this.memoryStatus = document.getElementById('memory-status');
        this.searchStatus = document.getElementById('search-status');
        this.testSearchBtn = document.getElementById('test-search');
        this.chatSection = document.getElementById('chat-section');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-message');
        
        // Elementi modalità
        this.modeIndicator = document.getElementById('mode-indicator');
        this.tagBtns = document.querySelectorAll('.tag-btn, .mode-tag');
        
        // Verifica elementi critici
        this.verifyDOMElements();
    }
    
    // ✅ Verifica elementi DOM critici
    verifyDOMElements() {
        const criticalElements = {
            'avatar': this.avatar,
            'chatSection': this.chatSection,
            'chatMessages': this.chatMessages,
            'chatInput': this.chatInput,
            'sendBtn': this.sendBtn
        };
        
        console.log('🔧 Verifica elementi critici:');
        let missingElements = [];
        
        Object.entries(criticalElements).forEach(([name, element]) => {
            const found = element !== null;
            console.log(`  ${name}: ${found ? '✅' : '❌'}`);
            if (!found) missingElements.push(name);
        });
        
        if (missingElements.length > 0) {
            const errorMsg = `Elementi DOM critici non trovati: ${missingElements.join(', ')}`;
            this.updateDebugIndicator('❌ ' + errorMsg, true);
            throw new Error(errorMsg);
        }
        
        this.updateDebugIndicator('✅ Elementi DOM trovati');
    }
    
    // 🎭 Inizializza modalità AI
    initializeModes() {
        console.log('🎭 Inizializzazione modalità AI...');
        
        // Configurazioni modalità
        this.modes = {
            amico: {
                name: 'Modalità: Amico',
                icon: '💬',
                avatar: 'mode-amico',
                description: 'Conversazione amichevole e giochi',
                color: '#f39c12',
                handler: null // Sarà assegnato quando il modulo viene caricato
            },
            musica: {
                name: 'Modalità: Musica',
                icon: '🎵',
                avatar: 'mode-musica',
                description: 'Cerca musica, artisti e brani',
                color: '#e74c3c',
                handler: null
            },
            programmatore: {
                name: 'Modalità: Programmatore',
                icon: '💻',
                avatar: 'mode-programmatore',
                description: 'Assistenza tecnica e programmazione',
                color: '#2ecc71',
                handler: null
            },
            ricercatore: {
                name: 'Modalità: Ricercatore',
                icon: '🔍',
                avatar: 'mode-ricercatore',
                description: 'Ricerca informazioni online',
                color: '#3498db',
                handler: null
            }
        };
        
        // Inizializza modalità di default
        this.changeMode(this.currentCategory);
    }
    
    // 🎮 Inizializza event listeners
    initializeEventListeners() {
        console.log('🔧 Inizializzazione event listeners...');
        
        // Invio messaggi
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendChatMessage());
        }
        
        // Enter per inviare
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendChatMessage();
            });
            
            // Abilita/disabilita bottone invio
            this.chatInput.addEventListener('input', () => {
                this.sendBtn.disabled = this.chatInput.value.trim() === '';
            });
        }
        
        // Tag buttons per modalità
        this.tagBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // Rimuovi active da tutti
                this.tagBtns.forEach(b => b.classList.remove('active', 'is-active'));
                // Aggiungi active al cliccato
                btn.classList.add('active', 'is-active');
                
                const category = btn.dataset.category;
                const message = btn.dataset.message;
                
                if (message) {
                    // Precompila input
                    this.chatInput.value = message;
                    this.sendBtn.disabled = false;
                    this.chatInput.focus();
                } else if (category) {
                    // Cambia modalità
                    this.changeMode(category);
                }
            });
        });
        
        this.updateDebugIndicator('✅ Event listeners inizializzati');
    }
    
    // 🚀 Avvia il sistema
    startSystem() {
        console.log('🚀 Avvio sistema AI...');
        
        // Test connessione AI
        this.testAIConnection();
        
        // Aggiorna stati
        this.updateMemoryStatus();
        this.updateSearchStatus();
        this.updateAIStatus();
        
        // Inizializza stili YouTube se disponibili
        if (typeof initializeYouTubePlayerStyles === 'function') {
            initializeYouTubePlayerStyles();
        }
        
        // Non cambiare modalità automaticamente - lascia che l'utente scelga dal splash screen
        // this.switchChatBackground(this.currentCategory);
        
        this.updateDebugIndicator('✅ Sistema avviato - In attesa selezione modalità');
        console.log('✅ VirtualFriend inizializzato - Splash screen attivo');
    }
    
    // 🔄 Cambia modalità AI
    async changeMode(mode, showWelcomeMessage = true) {
        console.log('🔄 Cambio modalità:', mode);
        
        if (!this.modes[mode]) {
            console.warn('⚠️ Modalità non riconosciuta:', mode);
            return;
        }
        
        // Salva chat della modalità corrente
        if (this.currentCategory && this.currentCategory !== mode) {
            this.saveChatForCurrentMode();
            this.previousCategory = this.currentCategory;
        }
        
        // Animazione transizione
        if (this.avatar) {
            this.avatar.style.transform = 'scale(0.8)';
            this.avatar.style.opacity = '0.7';
        }
        
        // Carica il modulo della modalità se non già caricato
        await this.loadModeHandler(mode);
        
        setTimeout(() => {
            this.currentCategory = mode;
            const modeConfig = this.modes[mode];
            
            // Ripristina chat
            this.clearAndRestoreChat(mode);
            
            // Aggiorna avatar
            this.updateAvatarForMode(modeConfig);
            
            // Aggiorna indicatore modalità
            this.updateModeIndicator(modeConfig);
            
            // 🎨 Cambia sfondo animato della chat
            this.switchChatBackground(mode);
            
            // Messaggio benvenuto solo se richiesto
            if (showWelcomeMessage) {
                this.addChatMessage(`${modeConfig.icon} Modalità ${mode} attivata! ${modeConfig.description}`, 'ai');
            }
            
            console.log(`✅ Modalità cambiata a: ${mode}`);
        }, 300);
    }
    
    // 📦 Carica il gestore della modalità
    async loadModeHandler(mode) {
        if (this.modes[mode].handler) {
            return; // Già caricato
        }
        
        try {
            switch (mode) {
                case 'amico':
                    if (typeof AmicoHandler !== 'undefined') {
                        this.modes[mode].handler = new AmicoHandler(this);
                    }
                    break;
                case 'musica':
                    if (typeof MusicaHandler !== 'undefined') {
                        this.modes[mode].handler = new MusicaHandler(this);
                    }
                    break;
                case 'programmatore':
                    if (typeof ProgrammatoreHandler !== 'undefined') {
                        this.modes[mode].handler = new ProgrammatoreHandler(this);
                    }
                    break;
                case 'ricercatore':
                    if (typeof RicercatoreHandler !== 'undefined') {
                        this.modes[mode].handler = new RicercatoreHandler(this);
                    }
                    break;
            }
            
            console.log(`📦 Gestore modalità ${mode} caricato`);
        } catch (error) {
            console.error(`❌ Errore caricamento gestore ${mode}:`, error);
        }
    }
    
    // 💬 Invia messaggio chat
    async sendChatMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Aggiungi messaggio utente
        this.addChatMessage(message, 'user');
        this.chatInput.value = '';
        this.sendBtn.disabled = true;
        
        // Mostra indicatore digitazione
        this.showTypingIndicator();
        
        try {
            let response = '';
            
            // 🧠 Ottieni contesto personalizzazione se apprendimento attivo
            let personalizationContext = {};
            if (this.learningSystem) {
                personalizationContext = this.learningSystem.getPersonalizationContext();
                
                // Cerca pattern di successo simili
                const similarPattern = this.learningSystem.findSimilarSuccessPattern(message, {
                    mode: this.currentCategory
                });
                
                if (similarPattern) {
                    console.log('🎯 Pattern simile trovato:', similarPattern);
                }
            }
            
            // Ottieni il gestore della modalità corrente
            const currentHandler = this.modes[this.currentCategory]?.handler;
            
            if (currentHandler && typeof currentHandler.handleMessage === 'function') {
                // Usa il gestore specifico della modalità con contesto personalizzazione
                response = await currentHandler.handleMessage(message, personalizationContext);
            } else {
                // Fallback: risposta AI generica
                response = await this.getAIResponse(message, personalizationContext);
            }
            
            this.hideTypingIndicator();
            
            // 🧠 Registra interazione per apprendimento
            let messageId = null;
            if (this.learningSystem) {
                messageId = this.learningSystem.recordInteraction(message, response, {
                    mode: this.currentCategory,
                    timestamp: Date.now()
                });
            }
            
            this.addChatMessage(response, 'ai', messageId);
            this.addToConversationHistory(message, response);
            
        } catch (error) {
            console.error('❌ Errore nel processare il messaggio:', error);
            this.hideTypingIndicator();
            this.addChatMessage('❌ Errore nel processare la richiesta. Riprova.', 'ai');
        }
        
        this.chatInput.focus();
    }
    
    // 💾 Salva chat modalità corrente
    saveChatForCurrentMode() {
        if (!this.currentCategory) return;
        
        const chatMessages = document.querySelectorAll('.chat-message');
        const messages = Array.from(chatMessages).map(msg => ({
            content: msg.querySelector('.message-content')?.innerHTML || '',
            sender: msg.classList.contains('user-message') ? 'user' : 'ai',
            timestamp: Date.now()
        }));
        
        this.modalityMemory[this.currentCategory] = messages;
        console.log(`💾 Chat salvata per modalità: ${this.currentCategory}`, messages.length, 'messaggi');
    }
    
    // 🔄 Ripristina chat modalità
    clearAndRestoreChat(mode) {
        if (this.chatMessages) {
            this.chatMessages.innerHTML = '';
        }
        
        const savedMessages = this.modalityMemory[mode] || [];
        savedMessages.forEach(msg => {
            this.addChatMessage(msg.content, msg.sender);
        });
        
        console.log(`🔄 Chat ripristinata per modalità: ${mode}`, savedMessages.length, 'messaggi');
    }
    
    // 🎨 Aggiorna avatar per modalità
    updateAvatarForMode(modeConfig) {
        if (this.avatar) {
            // Rimuovi classi modalità precedenti
            Object.keys(this.modes).forEach(m => {
                this.avatar.classList.remove(this.modes[m].avatar);
            });
            
            // Aggiungi nuova classe
            this.avatar.classList.add(modeConfig.avatar);
            
            // Ripristina animazione
            this.avatar.style.transform = 'scale(1)';
            this.avatar.style.opacity = '1';
        }
    }
    
    // 🔧 Aggiorna indicatore modalità
    updateModeIndicator(modeConfig) {
        if (this.modeIndicator) {
            const modeIconElement = this.modeIndicator.querySelector('.mode-icon');
            const modeTextElement = this.modeIndicator.querySelector('.mode-text');
            
            if (modeIconElement && modeTextElement) {
                modeIconElement.textContent = modeConfig.icon;
                modeTextElement.textContent = modeConfig.name;
            }
        }
    }
    
    // 🎨 Cambia sfondo animato della chat per la modalità
    switchChatBackground(mode) {
        const chatSection = document.getElementById('chat-section');
        
        if (!chatSection) {
            console.warn('⚠️ Elemento chat-section non trovato per cambio sfondo');
            return;
        }
        
        // Rimuovi tutte le classi tema precedenti
        chatSection.classList.remove('theme-amico', 'theme-musica', 'theme-programmatore', 'theme-ricercatore');
        
        // Applica nuovo tema con piccolo delay per transizione fluida
        setTimeout(() => {
            chatSection.classList.add(`theme-${mode}`);
            console.log(`🎨 Sfondo chat cambiato a tema: ${mode}`);
        }, 150);
    }
    
    // 💬 Aggiungi messaggio alla chat
    addChatMessage(message, sender, messageId = null) {
        if (!this.chatMessages) {
            console.error('❌ chatMessages non disponibile');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        // Avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        const avatarIcon = document.createElement('i');
        avatarIcon.className = sender === 'ai' ? 'fas fa-robot' : 'fas fa-user';
        avatarDiv.appendChild(avatarIcon);
        
        // Contenuto messaggio
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Formattazione specializzata per modalità
        let formattedMessage = message;
        
        // Modalità musica: gestisce i player YouTube
        if (this.currentCategory === 'musica' && sender === 'ai' && message.includes('neural-media-player')) {
            contentDiv.innerHTML = formattedMessage;
        } 
        // Modalità programmatore: gestisce i container di codice
        else if (this.currentCategory === 'programmatore' && sender === 'ai' && message.includes('neural-code-container')) {
            contentDiv.innerHTML = formattedMessage;
        }
        // Altre modalità o messaggi normali
        else {
            // Formattazione base con paragrafi
            formattedMessage = formattedMessage.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            formattedMessage = formattedMessage.replace(/\*([^*]+)\*/g, '<em>$1</em>');
            
            // Dividi in paragrafi se ci sono più righe
            const paragraphs = formattedMessage.split('\n').filter(p => p.trim() !== '');
            if (paragraphs.length > 1) {
                contentDiv.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
            } else {
                contentDiv.innerHTML = `<p>${formattedMessage}</p>`;
            }
        }
        
        // 🧠 Aggiungi pulsanti feedback per messaggi AI
        if (sender === 'ai' && messageId && this.learningSystem) {
            const feedbackContainer = this.createFeedbackButtons(messageId);
            contentDiv.appendChild(feedbackContainer);
        }
        
        // Assemblaggio messaggio (ordine corretto per CSS esistente)
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        // Animazione di entrata
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        this.chatMessages.appendChild(messageDiv);
        
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.3s ease-out';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
        
        this.scrollToBottom();
    }
    
    // 🎯 Crea pulsanti feedback per apprendimento
    createFeedbackButtons(messageId) {
        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'feedback-container';
        feedbackContainer.id = `feedback-${messageId}`;
        
        const feedbackButtons = document.createElement('div');
        feedbackButtons.className = 'feedback-buttons';
        
        const buttons = [
            { icon: '👍', text: 'Utile', rating: 5, reason: 'helpful' },
            { icon: '👌', text: 'OK', rating: 3, reason: 'acceptable' },
            { icon: '👎', text: 'Non utile', rating: 2, reason: 'not-helpful' },
            { icon: '⭐', text: 'Perfetto', rating: 5, reason: 'perfect' }
        ];
        
        buttons.forEach(btnData => {
            const btn = document.createElement('button');
            btn.className = 'feedback-btn';
            btn.innerHTML = `${btnData.icon} ${btnData.text}`;
            btn.addEventListener('click', () => this.handleFeedback(messageId, btnData.rating, btnData.reason, btn));
            feedbackButtons.appendChild(btn);
        });
        
        feedbackContainer.appendChild(feedbackButtons);
        return feedbackContainer;
    }
    
    // 📊 Gestisci feedback utente
    handleFeedback(messageId, rating, reason, buttonElement) {
        if (!this.learningSystem) return;
        
        // Elabora feedback
        this.learningSystem.processFeedback({
            messageId: messageId,
            rating: rating,
            reason: reason,
            context: this.currentCategory,
            details: null
        });
        
        // Mostra conferma visiva
        buttonElement.classList.add('selected');
        buttonElement.textContent = '✅ Grazie!';
        
        // Disabilita altri pulsanti
        const feedbackContainer = document.getElementById(`feedback-${messageId}`);
        const allButtons = feedbackContainer.querySelectorAll('.feedback-btn');
        allButtons.forEach(btn => {
            if (btn !== buttonElement) {
                btn.style.opacity = '0.5';
                btn.disabled = true;
            }
        });
        
        // Nascondi dopo 2 secondi
        setTimeout(() => {
            feedbackContainer.style.opacity = '0.7';
            feedbackContainer.style.transform = 'scale(0.9)';
        }, 2000);
        
        console.log(`📊 Feedback ricevuto: ${rating}/5 (${reason}) per messaggio ${messageId}`);
    }
    
    // ⬇️ Scorri in basso nella chat
    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
    
    // 🤖 Ottieni risposta AI generica
    async getAIResponse(message, searchResults = null, mode = null) {
        try {
            // Prima prova con AI esterno se configurato
            if (AI_CONFIG?.apiUrl && AI_CONFIG.apiUrl !== 'offline') {
                try {
                    return await this.getExternalAIResponse(message, searchResults, mode);
                } catch (error) {
                    console.warn('⚠️ AI esterno non disponibile, uso fallback offline');
                }
            }
            
            // Fallback offline
            return this.getOfflineAIResponse(message, mode, searchResults);
            
        } catch (error) {
            console.error('❌ Errore AI completo:', error);
            return 'Mi dispiace, non riesco a elaborare la tua richiesta al momento. Riprova più tardi.';
        }
    }
    
    // 🌐 Risposta AI esterna
    async getExternalAIResponse(message, searchResults = null, mode = null) {
        const currentMode = mode || this.currentCategory;
        const personality = AI_CONFIG?.personalities?.[currentMode] || AI_CONFIG?.personalities?.amico || {};
        
        let systemPrompt = personality.systemPrompt || 'Sei un assistente virtuale amichevole che risponde in italiano.';
        let userMessage = message;
        
        if (searchResults) {
            userMessage += `\n\n🌐 INFORMAZIONI DAL WEB:\n${searchResults}\n\nUsa queste informazioni per rispondere.`;
        }
        
        const apiUrl = AI_CONFIG?.apiUrl || 'http://localhost:11434/v1/chat/completions';
        const model = AI_CONFIG?.model || 'mistral:latest';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'Mi dispiace, non sono riuscito a elaborare una risposta.';
    }
    
    // 💻 Risposta AI offline
    getOfflineAIResponse(message, mode = null, searchResults = null) {
        const currentMode = mode || this.currentCategory;
        
        const responses = {
            amico: '😊 Ciao! Sono la modalità amico. Mi piace chiacchierare! Di cosa vuoi parlare?',
            musica: '🎵 Sono la modalità musica! Posso aiutarti a trovare canzoni, artisti e tutto quello che riguarda la musica.',
            programmatore: '💻 Modalità programmatore attiva! Sono qui per aiutarti con codice, debug e sviluppo software.',
            ricercatore: '🔍 Modalità ricercatore pronta! Posso aiutarti a trovare informazioni e fare ricerche online.'
        };
        
        return responses[currentMode] || responses.amico;
    }
    
    // 🧠 Gestione memoria
    addToConversationHistory(userMessage, aiResponse) {
        this.conversationHistory.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: Date.now(),
            mode: this.currentCategory
        });
        
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }
        
        this.updateMemoryStatus();
    }
    
    // 📊 Aggiorna stato memoria
    updateMemoryStatus() {
        if (this.memoryStatus) {
            const totalMessages = this.conversationHistory.length;
            const memoryCountElement = this.memoryStatus.querySelector('.memory-count');
            
            if (memoryCountElement) {
                memoryCountElement.textContent = `${totalMessages}/${this.maxHistoryLength}`;
            }
        }
    }
    
    // 🔍 Aggiorna stato ricerca
    updateSearchStatus() {
        if (this.searchStatus) {
            this.searchStatus.textContent = this.searchEnabled ? 'Ricerca: Attiva' : 'Ricerca: Disattivata';
            this.searchStatus.style.color = this.searchEnabled ? 'green' : 'orange';
        }
    }
    
    // 🤖 Aggiorna stato AI
    updateAIStatus() {
        const isOffline = !AI_CONFIG?.apiUrl || AI_CONFIG.apiUrl === 'offline';
        
        if (this.aiStatus) {
            const statusDot = this.aiStatus.querySelector('.status-dot');
            const statusText = this.aiStatus.querySelector('.status-text');
            
            if (statusDot && statusText) {
                if (isOffline) {
                    statusDot.className = 'status-dot is-warning';
                    statusText.textContent = 'AI Offline';
                } else {
                    statusDot.className = 'status-dot is-success';
                    statusText.textContent = 'AI Online';
                }
            }
        }
    }
    
    // 🧪 Test connessione AI
    async testAIConnection() {
        try {
            const testResponse = await this.getAIResponse('Test connessione');
            console.log('✅ Test AI riuscito');
        } catch (error) {
            console.warn('⚠️ Test AI fallito:', error.message);
        }
    }
    
    // 🔧 Indicatori e utilità
    showTypingIndicator() {
        if (!this.chatMessages) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'message-item ai-message typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-bubble">
                <div class="message-text">🤖 Sto scrivendo...</div>
            </div>
        `;
        
        this.chatMessages.appendChild(indicator);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }
    
    createDebugIndicator() {
        const debugDiv = document.createElement('div');
        debugDiv.id = 'js-debug-status';
        debugDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: #27ae60;
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;
        debugDiv.innerHTML = '✅ JavaScript ATTIVO<br>🔧 VirtualFriend Modulare in inizializzazione...';
        document.body.appendChild(debugDiv);
        
        this.debugIndicator = debugDiv;
    }
    
    updateDebugIndicator(message, isError = false) {
        if (this.debugIndicator) {
            if (isError) {
                this.debugIndicator.style.background = '#e74c3c';
            }
            this.debugIndicator.innerHTML = `✅ JavaScript ATTIVO<br>${message}`;
        }
    }
    
    initializeInterface() {
        // Placeholder per inizializzazione interfaccia
        console.log('🎨 Interfaccia inizializzata');
    }
    
    // 🎯 Inizializza splash screen di benvenuto
    initializeWelcomeSplash() {
        console.log('🎯 Inizializzazione splash screen...');
        
        const welcomeSplash = document.getElementById('welcome-splash');
        if (!welcomeSplash) {
            console.warn('⚠️ Splash screen non trovato');
            return;
        }
        
        // Event listeners per i pulsanti "Scopri le funzioni"
        const discoverButtons = document.querySelectorAll('.discover-btn');
        console.log(`📱 Trovati ${discoverButtons.length} pulsanti "Scopri le funzioni"`);
        discoverButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const mode = btn.dataset.mode;
                console.log(`🔍 Scopri funzioni per modalità: ${mode}`);
                this.toggleModeFeatures(mode);
            });
        });
        
        // Event listeners per i pulsanti "Inizia Chat"
        const selectButtons = document.querySelectorAll('.select-mode-btn');
        console.log(`🚀 Trovati ${selectButtons.length} pulsanti "Inizia Chat"`);
        
        if (selectButtons.length === 0) {
            console.warn('⚠️ Nessun pulsante "Inizia Chat" trovato! Verifica HTML.');
        }
        
        selectButtons.forEach((btn, index) => {
            const mode = btn.dataset.mode;
            console.log(`� Configurando pulsante ${index + 1} per modalità: ${mode}`);
            
            if (!mode) {
                console.error(`❌ Pulsante ${index + 1} non ha data-mode!`);
                return;
            }
            
            // Event listener semplificato
            btn.onclick = (e) => {
                console.log(`🎯 CLICK! Avvio modalità: ${mode}`);
                e.preventDefault();
                e.stopPropagation();
                
                // Chiamata diretta al metodo
                this.selectModeAndStart(mode);
            };
            
            console.log(`✅ Event listener aggiunto per: ${mode}`);
        });
        
        // Mostra il splash screen
        this.showWelcomeSplash();
    }
    
    // 🔍 Toggle funzionalità modalità
    toggleModeFeatures(mode) {
        const featuresDiv = document.getElementById(`features-${mode}`);
        const discoverBtn = document.querySelector(`.discover-btn[data-mode="${mode}"]`);
        
        if (featuresDiv && discoverBtn) {
            if (featuresDiv.classList.contains('hidden')) {
                // Mostra funzionalità
                featuresDiv.classList.remove('hidden');
                discoverBtn.textContent = '🔼 Nascondi funzioni';
                discoverBtn.style.background = 'rgba(74, 144, 226, 0.4)';
            } else {
                // Nascondi funzionalità
                featuresDiv.classList.add('hidden');
                discoverBtn.textContent = '🔍 Scopri le funzioni';
                discoverBtn.style.background = 'rgba(74, 144, 226, 0.2)';
            }
        }
    }
    
    // 🚀 Seleziona modalità e avvia chat - VERSIONE SEMPLIFICATA
    selectModeAndStart(mode) {
        console.log(`🚀 AVVIO: Modalità selezionata: ${mode}`);
        
        // STEP 1: Nasconde immediatamente lo splash screen
        const welcomeSplash = document.getElementById('welcome-splash');
        if (welcomeSplash) {
            console.log('🎭 Chiudendo splash screen...');
            
            // Rimuovi completamente dal DOM invece di nascondere
            welcomeSplash.style.transition = 'opacity 0.3s ease-out';
            welcomeSplash.style.opacity = '0';
            welcomeSplash.style.pointerEvents = 'none';
            welcomeSplash.style.zIndex = '-9999';
            
            setTimeout(() => {
                // Rimuovi completamente l'elemento dal DOM
                if (welcomeSplash.parentNode) {
                    welcomeSplash.parentNode.removeChild(welcomeSplash);
                    console.log('✅ Splash screen rimosso dal DOM');
                } else {
                    welcomeSplash.style.display = 'none';
                    console.log('✅ Splash screen nascosto');
                }
                
                // Assicurati che l'interfaccia principale sia visibile
                this.showMainInterface();
            }, 300);
        } else {
            console.warn('⚠️ Splash screen non trovato');
            this.showMainInterface();
        }
        
        // STEP 2: Imposta la modalità corrente
        console.log(`🔄 Impostando modalità: ${mode}`);
        this.currentCategory = mode;
        
        // STEP 3: Aggiorna l'interfaccia per la modalità
        setTimeout(() => {
            try {
                // Aggiorna avatar e indicatori
                if (this.modes && this.modes[mode]) {
                    const modeConfig = this.modes[mode];
                    this.updateAvatarForMode(modeConfig);
                    this.updateModeIndicator(modeConfig);
                    
                    if (typeof this.switchChatBackground === 'function') {
                        this.switchChatBackground(mode);
                    }
                }
                
                // STEP 4: Aggiungi messaggio di benvenuto
                this.addSimpleWelcomeMessage(mode);
                
                console.log(`✅ Modalità ${mode} attivata con successo!`);
                
            } catch (error) {
                console.error('❌ Errore durante attivazione modalità:', error);
            }
        }, 400);
    }
    
    // 📱 Mostra interfaccia principale
    showMainInterface() {
        console.log('📱 Mostrando interfaccia principale...');
        
        // Rimuovi qualsiasi elemento che potrebbe bloccare l'interazione
        const potentialBlockers = document.querySelectorAll('[style*="z-index"][style*="9999"], [style*="position: fixed"]');
        potentialBlockers.forEach(element => {
            if (element.id !== 'welcome-splash' && element.style.zIndex > 1000) {
                console.log('⚠️ Elemento con z-index alto rilevato:', element);
                element.style.zIndex = 'auto';
                element.style.pointerEvents = 'auto';
            }
        });
        
        // Assicurati che il body sia completamente interattivo
        document.body.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        
        // Trova e mostra i principali elementi dell'interfaccia
        const mainElements = [
            '.navbar',
            '.chat-container', 
            '.main-container',
            '.container',
            'nav',
            'main'
        ];
        
        mainElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = '';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                element.style.pointerEvents = 'auto';
                console.log(`✅ Elemento mostrato: ${selector}`);
            }
        });
        
        // Rimuovi eventuali overlay residui
        const overlays = document.querySelectorAll('.overlay, .modal-overlay, .splash-overlay');
        overlays.forEach(overlay => {
            if (overlay.id !== 'welcome-splash') {
                overlay.style.display = 'none';
                overlay.style.pointerEvents = 'none';
            }
        });
        
        // Assicurati che la chat sia funzionale
        setTimeout(() => {
            const chatInput = document.querySelector('#user-input, .user-input, input[type="text"]');
            if (chatInput) {
                chatInput.focus();
                console.log('✅ Focus su input chat');
            }
            
            // Test di interattività
            console.log('🧪 Test interattività completato');
            console.log('Body pointer-events:', getComputedStyle(document.body).pointerEvents);
            console.log('Document overflow:', getComputedStyle(document.body).overflow);
        }, 100);
    }

    // 🔄 Metodo fallback per chiudere splash e avviare chat
    closeSplashAndStartChat(mode) {
        console.log(`🔄 FALLBACK: closeSplashAndStartChat per modalità: ${mode}`);
        
        // Nasconde il splash screen
        const welcomeSplash = document.getElementById('welcome-splash');
        if (welcomeSplash) {
            console.log('🎭 Nascondendo splash screen...');
            welcomeSplash.style.display = 'none';
        }
        
        // Cambia modalità se disponibile
        if (typeof this.changeMode === 'function') {
            console.log('🔄 Cambio modalità...');
            this.changeMode(mode, false);
        }
        
        // Aggiunge messaggio di benvenuto se disponibile
        setTimeout(() => {
            if (typeof this.addWelcomeMessage === 'function') {
                console.log('👋 Aggiungendo messaggio di benvenuto...');
                this.addWelcomeMessage(mode);
            } else if (typeof this.addChatMessage === 'function') {
                console.log('👋 Usando addChatMessage come fallback...');
                this.addChatMessage(`🚀 Modalità ${mode} attivata!`, 'ai');
            }
        }, 500);
    }

    // 👋 Messaggio di benvenuto personalizzato
    addWelcomeMessage(mode) {
        const welcomeMessages = {
            amico: `👋 Ciao! Sono Bittron, il tuo amico AI! 😊\n\n🎮 Possiamo giocare a scacchi, chiacchierare o divertirci insieme!\n\n💡 **Suggerimenti:**\n• Scrivi "Giochiamo a scacchi!" per una partita\n• Fammi qualsiasi domanda\n• Usa i pulsanti feedback per aiutarmi a migliorare!`,
            
            musica: `🎵 Benvenuto nella modalità Musica! 🎧\n\n🎶 Sono qui per far suonare la tua musica preferita direttamente da YouTube!\n\n💡 **Prova questi comandi:**\n• "Suona Bohemian Rhapsody dei Queen"\n• "Fammi sentire jazz rilassante"\n• "Top 10 hit del momento"\n• "Parlami dei Beatles"`,
            
            programmatore: `💻 Modalità Programmatore attivata! 🚀\n\n⚙️ Sono qui per aiutarti con codice, debug e sviluppo software!\n\n💡 **Esempi di utilizzo:**\n• "Crea una funzione JavaScript per..."\n• "Aiutami a correggere questo errore"\n• "Come implementare React hooks?"\n• "Progetta un database per un e-commerce"`,
            
            ricercatore: `🔬 Modalità Ricercatore pronta! 📊\n\n🌐 Posso aiutarti a trovare informazioni, analizzare dati e fare ricerche approfondite!\n\n💡 **Cosa posso fare:**\n• "Cerca informazioni recenti su..."\n• "Analizza questi dati"\n• "Ultime notizie su..."\n• "Statistiche di mercato per..."`
        };
        
        const message = welcomeMessages[mode] || welcomeMessages.amico;
        this.addChatMessage(message, 'ai');
    }
    
    // 👋 Messaggio di benvenuto semplificato
    addSimpleWelcomeMessage(mode) {
        console.log(`👋 Aggiungendo messaggio di benvenuto per: ${mode}`);
        
        const welcomeMessages = {
            amico: `👋 Ciao! Sono Bittron, il tuo amico AI! 😊\n\n🎮 Possiamo giocare a scacchi, chiacchierare o divertirci insieme!\n\nProva a scrivere "Giochiamo a scacchi!" o fai qualsiasi domanda!`,
            
            musica: `🎵 Benvenuto nella modalità Musica! 🎧\n\n🎶 Sono qui per far suonare la tua musica preferita!\n\nProva: "Suona Bohemian Rhapsody dei Queen" o "Fammi sentire jazz rilassante"`,
            
            programmatore: `💻 Modalità Programmatore attivata! 🚀\n\n⚙️ Sono qui per aiutarti con codice e sviluppo!\n\nProva: "Crea una funzione JavaScript" o "Aiutami a correggere questo errore"`,
            
            ricercatore: `🔬 Modalità Ricercatore pronta! 📊\n\n🌐 Posso aiutarti a trovare informazioni e fare ricerche!\n\nProva: "Cerca informazioni su..." o "Ultime notizie su..."`
        };
        
        const message = welcomeMessages[mode] || welcomeMessages.amico;
        
        // Usa il metodo addChatMessage se esiste
        if (typeof this.addChatMessage === 'function') {
            this.addChatMessage(message, 'ai');
            console.log('✅ Messaggio di benvenuto aggiunto');
        } else {
            console.warn('⚠️ Metodo addChatMessage non disponibile');
        }
    }
    
    // 📱 Mostra splash screen
    showWelcomeSplash() {
        const welcomeSplash = document.getElementById('welcome-splash');
        if (welcomeSplash) {
            welcomeSplash.style.display = 'flex';
            welcomeSplash.style.animation = 'fadeIn 0.5s ease-out';
        }
    }
    
    // 🧠 Inizializza sistema di apprendimento continuo
    async initializeLearningSystem() {
        if (!this.learningEnabled) {
            console.log('📚 Sistema di apprendimento disabilitato');
            return;
        }
        
        try {
            console.log('🧠 Inizializzazione sistema di apprendimento...');
            
            // Aspetta che le classi siano caricate
            while (typeof AdaptiveLearningSystem === 'undefined') {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            this.learningSystem = new AdaptiveLearningSystem();
            
            // Aggiungi pulsante per visualizzare statistiche
            this.addLearningStatsButton();
            
            console.log('✅ Sistema di apprendimento inizializzato');
        } catch (error) {
            console.error('❌ Errore inizializzazione learning system:', error);
            this.learningEnabled = false;
        }
    }
    
    // 📊 Aggiungi pulsante statistiche apprendimento
    addLearningStatsButton() {
        const controlsSection = document.querySelector('.controls-section');
        if (!controlsSection) return;
        
        const statsBtn = document.createElement('button');
        statsBtn.className = 'control-btn';
        statsBtn.innerHTML = `
            <i class="btn-icon fas fa-chart-line"></i>
            <span class="btn-text">Statistiche AI</span>
        `;
        
        statsBtn.addEventListener('click', () => this.showLearningStats());
        controlsSection.appendChild(statsBtn);
    }
    
    // 📊 Mostra statistiche apprendimento
    showLearningStats() {
        if (!this.learningSystem) return;
        
        const stats = this.learningSystem.showLearningStats();
        const metricsHTML = this.learningSystem.metrics.displayMetrics();
        
        // Crea modal con statistiche
        const modal = document.createElement('div');
        modal.className = 'learning-stats-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🧠 Statistiche Apprendimento AI</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="stats-summary">
                        <div class="stat-item">
                            <div class="stat-label">Interazioni Totali</div>
                            <div class="stat-value">${stats.interactions}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Rating Medio</div>
                            <div class="stat-value">${stats.avgRating}/5</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Livello Apprendimento</div>
                            <div class="stat-value">${stats.learningLevel}</div>
                        </div>
                    </div>
                    ${metricsHTML}
                    <div class="learning-actions">
                        <button class="action-btn export-btn">📤 Esporta Dati</button>
                        <button class="action-btn reset-btn">🔄 Reset Apprendimento</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.export-btn').addEventListener('click', () => {
            this.learningSystem.storage.exportData();
            modal.remove();
        });
        modal.querySelector('.reset-btn').addEventListener('click', () => {
            this.learningSystem.resetLearning();
            modal.remove();
        });
        
        // Chiudi cliccando fuori
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    // 🧪 Metodo di test per debug
    testSplashFunctionality() {
        console.log('🧪 Test funzionalità splash screen...');
        
        const welcomeSplash = document.getElementById('welcome-splash');
        console.log('Splash screen element:', welcomeSplash);
        
        const selectButtons = document.querySelectorAll('.select-mode-btn');
        console.log(`Pulsanti "Inizia Chat" trovati: ${selectButtons.length}`);
        
        selectButtons.forEach((btn, index) => {
            console.log(`Pulsante ${index + 1}:`, btn);
            console.log(`- data-mode: ${btn.dataset.mode}`);
            console.log(`- visible: ${btn.offsetParent !== null}`);
        });
        
        console.log('Metodi disponibili:');
        console.log('- changeMode:', typeof this.changeMode);
        console.log('- addWelcomeMessage:', typeof this.addWelcomeMessage);
        console.log('- selectModeAndStart:', typeof this.selectModeAndStart);
        
        // Debug per elementi che potrebbero bloccare l'interazione
        this.debugBlockingElements();
    }
    
    // 🔍 Debug elementi che bloccano l'interazione
    debugBlockingElements() {
        console.log('🔍 Ricerca elementi bloccanti...');
        
        // Cerca elementi con z-index alto
        const highZElements = [];
        document.querySelectorAll('*').forEach(el => {
            const zIndex = getComputedStyle(el).zIndex;
            if (zIndex !== 'auto' && parseInt(zIndex) > 1000) {
                highZElements.push({
                    element: el,
                    zIndex: zIndex,
                    id: el.id,
                    className: el.className
                });
            }
        });
        
        console.log('Elementi con z-index alto:', highZElements);
        
        // Cerca elementi fixed che coprono la pagina
        const fixedElements = [];
        document.querySelectorAll('*').forEach(el => {
            const styles = getComputedStyle(el);
            if (styles.position === 'fixed' && 
                (el.offsetWidth > window.innerWidth * 0.5 || el.offsetHeight > window.innerHeight * 0.5)) {
                fixedElements.push({
                    element: el,
                    id: el.id,
                    className: el.className,
                    width: el.offsetWidth,
                    height: el.offsetHeight
                });
            }
        });
        
        console.log('Elementi fixed grandi:', fixedElements);
        
        // Test pointer-events
        console.log('Body pointer-events:', getComputedStyle(document.body).pointerEvents);
        console.log('HTML pointer-events:', getComputedStyle(document.documentElement).pointerEvents);
    }

    // 🛠️ Rimozione forzata elementi bloccanti (per debug)
    forceRemoveBlockers() {
        console.log('🛠️ Rimozione forzata elementi bloccanti...');
        
        // Rimuovi splash screen se ancora presente
        const splash = document.getElementById('welcome-splash');
        if (splash) {
            splash.remove();
            console.log('✅ Splash screen rimosso forzatamente');
        }
        
        // Rimuovi tutti gli elementi con z-index > 9000
        document.querySelectorAll('*').forEach(el => {
            const zIndex = getComputedStyle(el).zIndex;
            if (zIndex !== 'auto' && parseInt(zIndex) > 9000) {
                el.style.zIndex = '1';
                el.style.pointerEvents = 'auto';
                console.log('🔧 Z-index ridotto per:', el);
            }
        });
        
        // Ripristina pointer-events
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        
        // Rimuovi qualsiasi overlay
        document.querySelectorAll('.overlay, [class*="overlay"], [id*="overlay"]').forEach(el => {
            if (el.id !== 'welcome-splash') {
                el.style.display = 'none';
                console.log('🔧 Overlay nascosto:', el);
            }
        });
        
        console.log('✅ Pulizia completata!');
        this.debugBlockingElements();
    }
}

// 🌐 Variabili globali per compatibilità
let virtualFriend;
let vf;

// 🚀 Inizializzazione quando DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM caricato, inizializzazione VirtualFriend...');
    
    try {
        virtualFriend = new VirtualFriend();
        vf = virtualFriend;
        
        // Rendi disponibili globalmente per compatibilità
        window.virtualFriend = virtualFriend;
        window.vf = vf;
        
        console.log('✅ VirtualFriend Modulare inizializzato con successo');
    } catch (error) {
        console.error('❌ Errore nell\'inizializzazione:', error);
    }
});

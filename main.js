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
        
        // 🚀 Avvio sistema
        this.startSystem();
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
        
        // 🎨 Inizializza sfondo tema di default
        setTimeout(() => {
            this.switchChatBackground(this.currentCategory);
        }, 500);
        
        this.updateDebugIndicator('✅ Sistema avviato');
        console.log('✅ VirtualFriend inizializzato con successo');
    }
    
    // 🔄 Cambia modalità AI
    async changeMode(mode) {
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
            
            // Messaggio benvenuto
            this.addChatMessage(`${modeConfig.icon} Modalità ${mode} attivata! ${modeConfig.description}`, 'ai');
            
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
            
            // Ottieni il gestore della modalità corrente
            const currentHandler = this.modes[this.currentCategory]?.handler;
            
            if (currentHandler && typeof currentHandler.handleMessage === 'function') {
                // Usa il gestore specifico della modalità
                response = await currentHandler.handleMessage(message);
            } else {
                // Fallback: risposta AI generica
                response = await this.getAIResponse(message);
            }
            
            this.hideTypingIndicator();
            this.addChatMessage(response, 'ai');
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
        
        const chatMessages = document.querySelectorAll('.message-item');
        const messages = Array.from(chatMessages).map(msg => ({
            content: msg.querySelector('.message-text')?.innerHTML || '',
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
    addChatMessage(message, sender, customElement = null) {
        if (!this.chatMessages) {
            console.error('❌ chatMessages non disponibile');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-item ${sender}-message`;
        
        // Avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        const avatarIcon = document.createElement('i');
        avatarIcon.className = sender === 'ai' ? 'fas fa-robot' : 'fas fa-user';
        avatarDiv.appendChild(avatarIcon);
        
        // Bubble messaggio
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        
        // Header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        
        const senderName = document.createElement('span');
        senderName.className = 'sender-name';
        senderName.textContent = sender === 'ai' ? 'BITTRON' : 'USER';
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        headerDiv.appendChild(senderName);
        headerDiv.appendChild(messageTime);
        
        // Contenuto
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        // Formattazione specializzata per modalità
        let formattedMessage = message;
        
        // Modalità musica: gestisce i player YouTube
        if (this.currentCategory === 'musica' && sender === 'ai' && message.includes('neural-media-player')) {
            textDiv.innerHTML = formattedMessage;
        } 
        // Modalità programmatore: gestisce i container di codice
        else if (this.currentCategory === 'programmatore' && sender === 'ai' && message.includes('neural-code-container')) {
            textDiv.innerHTML = formattedMessage;
        }
        // Altre modalità o messaggi normali
        else {
            // Formattazione base
            formattedMessage = formattedMessage.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            formattedMessage = formattedMessage.replace(/\*([^*]+)\*/g, '<em>$1</em>');
            formattedMessage = formattedMessage.replace(/\n/g, '<br>');
            textDiv.innerHTML = formattedMessage;
        }
        
        // Elemento personalizzato
        if (customElement) {
            textDiv.appendChild(customElement);
        }
        
        // Assembla
        bubbleDiv.appendChild(headerDiv);
        bubbleDiv.appendChild(textDiv);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(bubbleDiv);
        
        // Animazione
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        this.chatMessages.appendChild(messageDiv);
        
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.5s ease-out';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
        
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
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
    
    // 🔍 Controlla se l'AI è configurata
    isAIConfigured() {
        try {
            // Controlla se esiste configurazione AI
            if (!AI_CONFIG) {
                return false;
            }
            
            // Controlla se è configurato per funzionamento offline
            if (AI_CONFIG.apiUrl === 'offline') {
                return true;
            }
            
            // Controlla se ha URL API valido
            if (AI_CONFIG.apiUrl && AI_CONFIG.apiUrl.trim() !== '') {
                return true;
            }
            
            return false;
        } catch (error) {
            console.warn('⚠️ Errore controllo configurazione AI:', error);
            return false;
        }
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

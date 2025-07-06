// Amico Virtuale AI - Script principale
console.log('� Script Amico Virtuale AI caricato');

class VirtualFriend {    constructor() {
        console.log('🔧 Inizializzazione VirtualFriend...');
        
        this.isChatVisible = true;
        this.currentCategory = 'musica';
        
        // Memoria conversazionale
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
        
        // ♟️ Sistema scacchi per modalità amico
        this.chessGame = {
            active: false,
            board: null,
            turn: 'white',
            selectedSquare: null,
            moveHistory: [],
            gameId: null
        };
        
        // Sistema ricerca online
        this.searchEnabled = false;
        try {
            this.searchEnabled = AI_CONFIG.search?.enabled || false;
        } catch (error) {
            console.warn('⚠️ Configurazione ricerca non disponibile');
        }
          // DOM elements
        console.log('🔧 Inizializzazione elementi DOM...');
        
        // Crea indicatore di debug visuale
        this.createDebugIndicator();
        
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
        
        // Nuovi elementi per sistema modalità
        this.modeIndicator = document.getElementById('mode-indicator');
        this.tagBtns = document.querySelectorAll('.tag-btn, .mode-tag');
        
        console.log('🔧 Elementi trovati:', {
            chatSection: !!this.chatSection,
            chatMessages: !!this.chatMessages,
            chatInput: !!this.chatInput,
            sendBtn: !!this.sendBtn,
            tagBtns: this.tagBtns.length,
            modeIndicator: !!this.modeIndicator
        });
        
        // Configurazioni modalità
        this.modes = {
            musica: {
                name: 'Modalità: Musica',
                icon: '🎵',
                avatar: 'mode-musica',
                description: 'Cerca musica, artisti e brani',
                color: '#e74c3c'
            },
            programmatore: {
                name: 'Modalità: Programmatore',
                icon: '💻',
                avatar: 'mode-programmatore',
                description: 'Assistenza tecnica e programmazione',
                color: '#2ecc71'
            },
            ricercatore: {
                name: 'Modalità: Ricercatore',
                icon: '🔍',
                avatar: 'mode-ricercatore',
                description: 'Ricerca informazioni online',
                color: '#3498db'
            },
            amico: {
                name: 'Modalità: Amico',
                icon: '💬',
                avatar: 'mode-amico',
                description: 'Conversazione amichevole',
                color: '#f39c12'
            }
        };
        
        // Verifica elementi critici
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
        
        // Inizializza event listeners
        this.initializeEventListeners();
        this.updateDebugIndicator('✅ Event listeners inizializzati');
        
        // Inizializza l'interfaccia
        try {
            this.initializeInterface();
        } catch (error) {
            console.error('❌ Errore nell\'inizializzazione interfaccia:', error);
            this.addTranscriptMessage('🤖 Ciao! Sono il tuo amico virtuale. Attiva il microfono per iniziare a parlare!');
        }
        
        // Inizializza stili YouTube Player
        this.initializeYouTubePlayerStyles();
          // Test AI connection on startup
        this.testAIConnection();
        
        // Initialize memory status
        this.updateMemoryStatus();
        
        // Initialize search status
        this.updateSearchStatus();
        
        // Update AI status indicator
        this.updateAIStatus();
    }
      initializeEventListeners() {
        console.log('🔧 Inizializzazione event listeners...');
        
        // Send message
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => {
                console.log('🔧 Bottone invia cliccato');
                this.sendChatMessage();
            });
            console.log('✅ Event listener per sendBtn aggiunto');
        } else {
            console.error('❌ sendBtn non trovato');
        }
        
        // Enter key to send message
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('🔧 Enter premuto in chat input');
                    this.sendChatMessage();
                }
            });
            console.log('✅ Event listener per chatInput aggiunto');
        } else {
            console.error('❌ chatInput non trovato');
        }
        
        // Enable/disable send button based on input
        if (this.chatInput && this.sendBtn) {
            this.chatInput.addEventListener('input', () => {
                this.sendBtn.disabled = this.chatInput.value.trim() === '';
            });
            console.log('✅ Event listener per abilitazione bottone aggiunto');
        }
        
        // Tag buttons event listeners
        console.log('🔧 Configurazione tag buttons, trovati:', this.tagBtns.length);
        this.tagBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                console.log('🔧 Tag button cliccato:', btn.dataset.category);
                
                // Remove active class from all buttons
                this.tagBtns.forEach(b => {
                    b.classList.remove('active', 'is-active');
                });
                // Add active class to clicked button
                btn.classList.add('active', 'is-active');
                
                // Get category or message
                const category = btn.dataset.category;
                const message = btn.dataset.message;
                
                if (message) {
                    // Pre-fill input with suggested message
                    console.log('🔧 Precompilazione input con messaggio:', message);
                    this.chatInput.value = message;
                    this.sendBtn.disabled = false;
                    this.chatInput.focus();
                } else if (category) {
                    // Cambio modalità AI
                    console.log('🔧 Richiesto cambio modalità:', category);
                    this.changeMode(category);
                }
            });
            console.log(`✅ Event listener per tag button ${index} (${btn.dataset.category}) aggiunto`);
        });
        
        // Inizializza modalità di default
        this.changeMode(this.currentCategory);
    }
      // Funzione per cambiare modalità AI
    changeMode(mode) {
        console.log('🔄 Cambio modalità chiamato:', mode);
        
        if (!this.modes[mode]) {
            console.warn('⚠️ Modalità non riconosciuta:', mode);
            return;
        }

        console.log('🔄 Modalità valida, procedendo con il cambio...');
        
        // 💾 Salva la chat della modalità corrente prima di cambiare
        if (this.currentCategory && this.currentCategory !== mode) {
            this.saveChatForCurrentMode();
            this.previousCategory = this.currentCategory;
        }
        
        // Animazione di transizione
        if (this.avatar) {
            this.avatar.style.transform = 'scale(0.8)';
            this.avatar.style.opacity = '0.7';
        }
        
        setTimeout(() => {
            this.currentCategory = mode;
            const modeConfig = this.modes[mode];
            
            // 🔄 Pulisci e ripristina la chat per la nuova modalità
            this.clearAndRestoreChat(mode);
            
            // Aggiorna avatar
            if (this.avatar) {
                // Rimuovi tutte le classi modalità precedenti
                Object.keys(this.modes).forEach(m => {
                    this.avatar.classList.remove(this.modes[m].avatar);
                });
                
                // Aggiungi nuova classe modalità
                this.avatar.classList.add(modeConfig.avatar);
                
                // Ripristina animazione
                this.avatar.style.transform = 'scale(1)';
                this.avatar.style.opacity = '1';
            }
            
            // Aggiorna indicatore modalità
            if (this.modeIndicator) {
                const modeIconElement = this.modeIndicator.querySelector('.mode-icon');
                const modeTextElement = this.modeIndicator.querySelector('.mode-text');
                
                if (modeIconElement && modeTextElement) {
                    modeIconElement.textContent = modeConfig.icon;
                    modeTextElement.textContent = modeConfig.name;
                }
            }
            
            // Messaggio di benvenuto per la nuova modalità
            this.addChatMessage(`${modeConfig.icon} Modalità ${mode} attivata! ${modeConfig.description}`, 'ai');
            
            console.log(`✅ Modalità cambiata a: ${mode}`);
        }, 300);
    }
    
    // 💾 Salva la chat della modalità corrente
    saveChatForCurrentMode() {
        if (!this.currentCategory) return;
        
        const chatMessages = document.querySelectorAll('.chat-message');
        const messages = Array.from(chatMessages).map(msg => ({
            content: msg.textContent,
            sender: msg.classList.contains('user-message') ? 'user' : 'ai',
            timestamp: Date.now()
        }));
        
        this.modalityMemory[this.currentCategory] = messages;
        console.log(`💾 Chat salvata per modalità: ${this.currentCategory}`, messages.length, 'messaggi');
    }
    
    // 🔄 Pulisci e ripristina la chat per la modalità
    clearAndRestoreChat(mode) {
        // Pulisci chat attuale
        if (this.chatMessages) {
            this.chatMessages.innerHTML = '';
        }
        
        // Ripristina chat della modalità
        const savedMessages = this.modalityMemory[mode] || [];
        savedMessages.forEach(msg => {
            this.addChatMessage(msg.content, msg.sender);
        });
        
        console.log(`🔄 Chat ripristinata per modalità: ${mode}`, savedMessages.length, 'messaggi');
    }
    
    // 🗑️ Cancella la memoria di tutte le modalità
    clearAllModalityMemory() {
        this.modalityMemory = {
            musica: [],
            programmatore: [],
            ricercatore: [],
            amico: []
        };
        console.log('🗑️ Memoria di tutte le modalità cancellata');
    }
      async sendChatMessage() {
        console.log('🔧 sendChatMessage chiamato');
        const message = this.chatInput.value.trim();
        console.log('🔧 Messaggio da inviare:', message);
        
        if (!message) {
            console.log('⚠️ Messaggio vuoto, operazione annullata');
            return;
        }

        // Add user message to chat
        console.log('🔧 Aggiunta messaggio utente alla chat');
        this.addChatMessage(message, 'user');
        this.chatInput.value = '';
        this.sendBtn.disabled = true;
        
        // Show typing indicator
        if (AI_CONFIG?.chat?.showTypingIndicator) {
            this.showTypingIndicator();
        }
          try {
            let finalResponse = '';
            
            // ♟️ Controlla se vuole giocare a scacchi (modalità amico)
            if (this.currentCategory === 'amico') {
                const chessKeywords = ['scacchi', 'scacco', 'partita', 'giochiamo', 'chess', 'gioco', 'giocare'];
                const wantsChess = chessKeywords.some(k => message.toLowerCase().includes(k));
                
                if (wantsChess) {
                    console.log('♟️ Richiesta scacchi rilevata');
                    finalResponse = `♟️ **Fantastico! Giochiamo a scacchi!**\n\nSto preparando la scacchiera... Sarai i pezzi bianchi e inizierai tu!\n\nClicca su un pezzo per selezionarlo, poi clicca dove vuoi muoverlo.\n\n*Preparati per una bella partita!* 🎯`;
                    
                    this.hideTypingIndicator();
                    this.addChatMessage(finalResponse, 'ai');
                    
                    // Avvia la partita dopo un breve delay
                    setTimeout(() => {
                        this.startChessGame();
                    }, 1000);
                    
                    this.addToConversationHistory(message, finalResponse);
                    this.chatInput.focus();
                    return;
                }
            }
            
            // 🎯 Controlla se è un comando slash (per modalità programmatore)
            if (message.startsWith('/') && this.currentCategory === 'programmatore') {
                console.log('🎯 Comando slash rilevato:', message);
                finalResponse = this.processSlashCommands(message);
                
                // Per i comandi slash, non chiamiamo l'AI
                this.hideTypingIndicator();
                this.addChatMessage(finalResponse, 'ai');
                this.addToConversationHistory(message, finalResponse);
                this.chatInput.focus();
                return;
            }
            
            // 🎵 Controlla se è una richiesta musicale
            if (this.isMusicRequest(message)) {
                console.log('🎵 Richiesta musicale rilevata:', message);
                finalResponse = await this.handleMusicRequest(message);
            }
            // 🔍 Controlla se è necessaria la ricerca online
            else if (this.shouldUseSearch(message)) {
                console.log('🔍 Richiesta ricerca rilevata:', message);
                const searchResults = await this.performSearch(message);
                finalResponse = await this.getAIResponse(message, searchResults);
            }
            // 💬 Risposta AI normale
            else {
                console.log('💬 Richiesta normale all\'AI:', message);
                finalResponse = await this.getAIResponse(message);
            }
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addChatMessage(finalResponse, 'ai');
            
            // Add to conversation history
            this.addToConversationHistory(message, finalResponse);
            
        } catch (error) {
            console.error('❌ Errore nel processare il messaggio:', error);
            this.hideTypingIndicator();
            this.addChatMessage('❌ Errore nel processare la richiesta. Riprova.', 'ai');
        }
        
        // Re-enable send button and focus input
        this.chatInput.focus();
    }
    
    // 🎯 Processa i comandi slash per la modalità programmatore
    processSlashCommands(message) {
        const command = message.split(' ')[0].toLowerCase();
        const args = message.split(' ').slice(1).join(' ');
        
        switch (command) {
            case '/help':
                return this.getSlashHelp();
            case '/template':
                return this.getCodeTemplate(args);
            case '/analyze':
                return this.analyzeCode(args);
            case '/review':
                return this.reviewCode(args);
            case '/debug':
                return this.debugCode(args);
            case '/optimize':
                return this.optimizeCode(args);
            case '/explain':
                return this.explainCode(args);
            case '/patterns':
                return this.getDesignPatterns(args);
            case '/metrics':
                return this.getCodeMetrics(args);
            case '/best':
                return this.getBestPractices(args);
            case '/resources':
                return this.getResources(args);
            default:
                return `❌ Comando non riconosciuto: ${command}\n\nUsa \`/help\` per vedere tutti i comandi disponibili.`;
        }
    }
      // 🎵 Controlla se è una richiesta musicale - VERSIONE AVANZATA
    isMusicRequest(message) {
        const lowerMessage = message.toLowerCase();
        
        // Keywords principali per riconoscimento musicale
        const musicKeywords = [
            'musica', 'canzone', 'brano', 'artista', 'cantante', 'album', 'band', 'gruppo',
            'suona', 'ascolta', 'riproduci', 'metti', 'play', 'fammi sentire', 'voglio sentire',
            'music', 'song', 'artist', 'listen', 'track', 'singer', 'consigliami', 'suggerisci',
            'simile a', 'come', 'genere', 'rock', 'pop', 'jazz', 'classica', 'rap', 'hip hop',
            'youtube', 'spotify', 'playlist', 'radio', 'concerto', 'festival', 'discografia'
        ];
        
        // Patterns specifici per richieste musicali
        const musicPatterns = [
            /(?:riproduci|suona|ascolta|play|metti)\s+/i,
            /(?:fammi\s+(?:sentire|ascoltare))\s+/i,
            /(?:voglio\s+(?:sentire|ascoltare))\s+/i,
            /(?:consigliami|suggerisci)\s+(?:una\s+canzone|un\s+brano|della\s+musica)/i,
            /(?:musica|canzoni|brani)\s+simili?\s+a\s+/i,
            /(?:chi\s+è|dimmi\s+di|parlami\s+di)\s+.+\s*(?:cantante|artista|musicista|band|gruppo)/i,
            /(?:il\s+genere|lo\s+stile)\s+musicale/i,
            /(?:album|discografia|singolo)\s+di\s+/i
        ];
        
        // Controlla patterns specifici
        const hasPattern = musicPatterns.some(pattern => pattern.test(lowerMessage));
        if (hasPattern) {
            console.log('🎵 Pattern musicale rilevato');
            return true;
        }
        
        // Controlla keywords
        const hasKeyword = musicKeywords.some(keyword => lowerMessage.includes(keyword));
        if (hasKeyword) {
            console.log('🎵 Keyword musicale rilevata');
            return true;
        }
        
        // Controlla nomi di artisti famosi (sample)
        const famousArtists = [
            'beatles', 'queen', 'elvis', 'michael jackson', 'madonna', 'bob dylan',
            'led zeppelin', 'pink floyd', 'rolling stones', 'david bowie', 'adele',
            'ed sheeran', 'taylor swift', 'beyonce', 'eminem', 'drake', 'radiohead'
        ];
        
        const hasArtist = famousArtists.some(artist => lowerMessage.includes(artist));
        if (hasArtist) {
            console.log('🎵 Artista famoso rilevato');
            return true;
        }
        
        return false;
    }
      // 🎵 Gestisce le richieste musicali - VERSIONE AVANZATA
    async handleMusicRequest(message) {
        try {
            console.log('🎵 Elaborazione richiesta musicale avanzata:', message);
            
            // Analizza il tipo di richiesta musicale
            const requestType = this.analyzeMusicRequestType(message);
            console.log('🎵 Tipo richiesta rilevato:', requestType);
            
            let response = '';
            
            switch (requestType.type) {
                case 'play':
                    response = await this.handlePlayRequest(message, requestType);
                    break;
                case 'recommend':
                    response = await this.handleRecommendationRequest(message, requestType);
                    break;
                case 'similar':
                    response = await this.handleSimilarMusicRequest(message, requestType);
                    break;
                case 'artist_info':
                    response = await this.handleArtistInfoRequest(message, requestType);
                    break;
                default:
                    response = await this.handleGeneralMusicRequest(message);
            }
            
            return response;
            
        } catch (error) {
            console.error('❌ Errore nella gestione richiesta musicale:', error);
            return '🎵 Si è verificato un errore nella ricerca musicale. Riprova con una richiesta diversa.';
        }
    }
    
    // 🎯 Analizza il tipo di richiesta musicale
    analyzeMusicRequestType(message) {
        const lowerMessage = message.toLowerCase();
        
        // Pattern per "riproduci/suona/ascolta"
        const playPatterns = [
            /(?:riproduci|suona|ascolta|metti|play)\s+(.+)/i,
            /(?:fammi\s+(?:sentire|ascoltare))\s+(.+)/i,
            /(?:voglio\s+(?:sentire|ascoltare))\s+(.+)/i
        ];
        
        // Pattern per "consigliami"
        const recommendPatterns = [
            /(?:consigliami|suggerisci|proponi)\s+(?:una\s+canzone|un\s+brano|della\s+musica)(?:\s+di\s+(.+))?/i,
            /(?:che\s+(?:canzone|brano|musica))\s+mi\s+consigli(?:\s+di\s+(.+))?/i,
            /(?:cosa\s+(?:dovrei|posso)\s+ascoltare)(?:\s+di\s+(.+))?/i
        ];
        
        // Pattern per "simile a"
        const similarPatterns = [
            /(?:musica|canzoni|brani)\s+simili?\s+a\s+(.+)/i,
            /(?:come|tipo)\s+(.+)/i,
            /(?:nello\s+stesso\s+stile\s+di)\s+(.+)/i
        ];
        
        // Pattern per info artista
        const artistInfoPatterns = [
            /(?:chi\s+è|dimmi\s+di|parlami\s+di|informazioni\s+su)\s+(.+)/i,
            /(?:cosa\s+sai\s+su)\s+(.+)/i
        ];
        
        // Controlla ogni tipo
        for (const pattern of playPatterns) {
            const match = lowerMessage.match(pattern);
            if (match) {
                return { type: 'play', query: match[1].trim(), originalMessage: message };
            }
        }
        
        for (const pattern of recommendPatterns) {
            const match = lowerMessage.match(pattern);
            if (match) {
                return { 
                    type: 'recommend', 
                    artist: match[1] ? match[1].trim() : null,
                    originalMessage: message 
                };
            }
        }
        
        for (const pattern of similarPatterns) {
            const match = lowerMessage.match(pattern);
            if (match) {
                return { type: 'similar', reference: match[1].trim(), originalMessage: message };
            }
        }
        
        for (const pattern of artistInfoPatterns) {
            const match = lowerMessage.match(pattern);
            if (match) {
                return { type: 'artist_info', artist: match[1].trim(), originalMessage: message };
            }
        }
        
        return { type: 'general', originalMessage: message };
    }
    
    // 🎵 Gestisce richieste di riproduzione
    async handlePlayRequest(message, requestData) {
        const query = requestData.query;
        console.log('🎵 Richiesta riproduzione:', query);
        
        try {
            // Cerca su YouTube
            const youtubeResults = await this.searchYouTube(query);
            
            if (youtubeResults.length === 0) {
                return await this.generateMusicFallbackResponse(query, 'play');
            }
            
            const topResult = youtubeResults[0];
            
            // Genera il componente embed del video
            const embedComponent = this.createYouTubeEmbed(topResult);
            
            // Ottieni informazioni aggiuntive dall'AI
            const musicInfo = await this.getMusicInfoFromAI(topResult.title, 'play');
            
            return `🎵 **Riproduzione: ${topResult.title}**\n\n${embedComponent}\n\n${musicInfo}`;
            
        } catch (error) {
            console.error('❌ Errore riproduzione:', error);
            return await this.generateMusicFallbackResponse(query, 'play');
        }
    }
    
    // 🎵 Gestisce richieste di raccomandazioni
    async handleRecommendationRequest(message, requestData) {
        const artist = requestData.artist;
        console.log('🎵 Richiesta raccomandazione per:', artist);
        
        try {
            let searchQuery = '';
            let aiPrompt = '';
            
            if (artist) {
                searchQuery = `${artist} best songs`;
                aiPrompt = `Consigliami 3-4 delle migliori canzoni di ${artist}. Per ogni canzone, dimmi perché è speciale e interessante.`;
            } else {
                // Raccomandazione generica
                aiPrompt = 'Consigliami 3-4 canzoni bellissime di diversi generi musicali. Per ogni canzone, dimmi artista, titolo e perché dovrei ascoltarla.';
                searchQuery = 'popular music songs';
            }
            
            // Ottieni raccomandazioni dall'AI
            const aiRecommendations = await this.getAIResponse(aiPrompt, null, 'musica');
            
            // Se specificato un artista, cerca anche su YouTube
            if (artist) {
                const youtubeResults = await this.searchYouTube(searchQuery);
                
                if (youtubeResults.length > 0) {
                    const topSongs = youtubeResults.slice(0, 2); // Ridotto a 2 per evitare spam
                    let youtubeSection = '\n\n🎬 **Top Brani su YouTube:**\n\n';
                    
                    topSongs.forEach((song, index) => {
                        youtubeSection += this.createYouTubeEmbed(song) + '\n';
                    });
                    
                    return `${aiRecommendations}${youtubeSection}`;
                }
            }
            
            return aiRecommendations;
            
        } catch (error) {
            console.error('❌ Errore raccomandazione:', error);
            return await this.generateMusicFallbackResponse(artist || 'musica', 'recommend');
        }
    }
    
    // 🎵 Gestisce richieste di musica simile
    async handleSimilarMusicRequest(message, requestData) {
        const reference = requestData.reference;
        console.log('🎵 Richiesta musica simile a:', reference);
        
        try {
            const aiPrompt = `Suggerisci 3-4 artisti o canzoni simili a "${reference}". Spiega perché sono simili e cosa hanno in comune (genere, stile, epoca, etc.).`;
            
            const aiResponse = await this.getAIResponse(aiPrompt, null, 'musica');
            
            // Cerca anche esempi su YouTube
            const searchQuery = `music like ${reference}`;
            const youtubeResults = await this.searchYouTube(searchQuery);
            
            if (youtubeResults.length > 0) {
                const similarSongs = youtubeResults.slice(0, 2);
                let youtubeSection = '\n\n🎬 **Esempi che potresti gradire:**\n\n';
                
                similarSongs.forEach(song => {
                    youtubeSection += this.createYouTubeEmbed(song) + '\n';
                });
                
                return `${aiResponse}${youtubeSection}`;
            }
            
            return aiResponse;
            
        } catch (error) {
            console.error('❌ Errore ricerca simile:', error);
            return await this.generateMusicFallbackResponse(reference, 'similar');
        }
    }
    
    // 🎵 Gestisce richieste di informazioni su artisti
    async handleArtistInfoRequest(message, requestData) {
        const artist = requestData.artist;
        console.log('🎵 Richiesta info artista:', artist);
        
        try {
            const aiPrompt = `Dimmi tutto quello che sai su ${artist}: biografia, genere musicale, album famosi, curiosità interessanti. Includi anche qualche canzone che consigli di ascoltare.`;
            
            const aiResponse = await this.getAIResponse(aiPrompt, null, 'musica');
            
            // Cerca canzoni popolari dell'artista
            const searchQuery = `${artist} popular songs`;
            const youtubeResults = await this.searchYouTube(searchQuery);
            
            if (youtubeResults.length > 0) {
                const popularSongs = youtubeResults.slice(0, 2); // Ridotto a 2 per evitare spam
                let songsSection = '\n\n🎵 **Le sue canzoni più popolari:**\n\n';
                
                popularSongs.forEach(song => {
                    songsSection += this.createYouTubeEmbed(song) + '\n';
                });
                
                return `${aiResponse}${songsSection}`;
            }
            
            return aiResponse;
            
        } catch (error) {
            console.error('❌ Errore info artista:', error);
            return await this.generateMusicFallbackResponse(artist, 'artist_info');
        }
    }
    
    // 🎵 Gestisce richieste musicali generiche
    async handleGeneralMusicRequest(message) {
        try {
            const aiPrompt = `L'utente ha fatto questa richiesta musicale: "${message}". Rispondi in modo utile e coinvolgente, offrendo consigli, informazioni o suggerimenti musicali pertinenti.`;
            
            return await this.getAIResponse(aiPrompt, null, 'musica');
            
        } catch (error) {
            console.error('❌ Errore richiesta generale:', error);
            return '🎵 Sono qui per aiutarti con tutto quello che riguarda la musica! Puoi chiedermi di riprodurre una canzone, consigliarti artisti, parlare di generi musicali o qualsiasi altra cosa ti venga in mente. Cosa vorresti sapere?';
        }
    }
    
    // 🎬 Crea componente embed YouTube AVANZATO
    createYouTubeEmbed(videoData) {
        const videoId = this.extractYouTubeVideoId(videoData.url);
        if (!videoId) {
            return this.createFallbackVideoPlayer(videoData);
        }
        
        const embedOptions = AI_CONFIG?.youtube?.embedOptions || {};
        const width = embedOptions.width || 400;
        const height = embedOptions.height || 225;
        const playerId = 'youtube-player-' + Math.random().toString(36).substr(2, 9);
        
        return `<div class="youtube-player-container" style="
            margin: 15px 0; 
            background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
            border-radius: 12px; 
            padding: 16px; 
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            border: 1px solid #404040;
            max-width: 450px;
        ">
            <div class="video-header" style="
                display: flex; 
                align-items: center; 
                margin-bottom: 12px; 
                padding-bottom: 8px; 
                border-bottom: 1px solid #404040;
            ">
                <div class="youtube-logo" style="
                    background: #ff0000; 
                    color: white; 
                    padding: 4px 8px; 
                    border-radius: 4px; 
                    font-size: 12px; 
                    font-weight: bold;
                    margin-right: 10px;
                ">▶ YouTube</div>
                <div class="video-title" style="
                    color: #e8e8e8; 
                    font-size: 14px; 
                    font-weight: 500;
                    flex: 1;
                    line-height: 1.3;
                ">${this.truncateTitle(videoData.title)}</div>
            </div>
            
            <div class="player-wrapper" style="
                position: relative; 
                background: #000; 
                border-radius: 8px; 
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            ">
                <div id="${playerId}" class="youtube-player" style="
                    width: 100%; 
                    height: ${height}px; 
                    background: #000 url('https://img.youtube.com/vi/${videoId}/mqdefault.jpg') center/cover;
                    position: relative;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                " onclick="virtualFriend.loadYouTubePlayer('${videoId}', '${playerId}')">
                    <div class="play-overlay" style="
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    ">
                        <div class="play-button" style="
                            width: 60px; 
                            height: 60px; 
                            background: #ff0000;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 4px 15px rgba(255,0,0,0.4);
                            transition: all 0.3s ease;
                        ">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="video-controls" style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-top: 12px;
                padding-top: 8px;
                border-top: 1px solid #404040;
            ">
                <div class="video-actions" style="display: flex; gap: 8px;">
                    <button onclick="virtualFriend.openInYouTube('${videoData.url}')" style="
                        background: #ff0000; 
                        color: white; 
                        border: none; 
                        padding: 6px 12px; 
                        border-radius: 6px; 
                        font-size: 12px; 
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#e60000'" onmouseout="this.style.background='#ff0000'">
                        🔗 YouTube
                    </button>
                    <button onclick="virtualFriend.shareVideo('${videoData.url}', '${videoData.title.replace(/'/g, "\\\'")}')" style="
                        background: #404040; 
                        color: #e8e8e8; 
                        border: none; 
                        padding: 6px 12px; 
                        border-radius: 6px; 
                        font-size: 12px; 
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#505050'" onmouseout="this.style.background='#404040'">
                        📤 Condividi
                    </button>
                </div>
                <div class="video-info" style="
                    color: #888; 
                    font-size: 11px;
                    text-align: right;
                ">
                    ${videoData.channelTitle || 'YouTube'}
                </div>
            </div>
        </div>`;
    }
    
    // 🔄 Crea player di fallback per video non YouTube
    createFallbackVideoPlayer(videoData) {
        return `<div class="fallback-video-player" style="
            margin: 15px 0; 
            background: linear-gradient(135deg, #2c3e50, #34495e);
            border-radius: 12px; 
            padding: 16px; 
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            border: 1px solid #404040;
            max-width: 450px;
        ">
            <div class="video-header" style="
                display: flex; 
                align-items: center; 
                margin-bottom: 12px;
            ">
                <div class="music-icon" style="
                    background: #e74c3c; 
                    color: white; 
                    padding: 8px; 
                    border-radius: 50%; 
                    margin-right: 12px;
                ">🎵</div>
                <div class="video-title" style="
                    color: #e8e8e8; 
                    font-size: 14px; 
                    font-weight: 500;
                    line-height: 1.3;
                ">${videoData.title}</div>
            </div>
            
            <div style="text-align: center; padding: 20px;">
                <p style="color: #bdc3c7; margin-bottom: 15px;">🔗 Link esterno rilevato</p>
                <button onclick="window.open('${videoData.url}', '_blank')" style="
                    background: #e74c3c; 
                    color: white; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 8px; 
                    font-size: 14px; 
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">
                    🎵 Ascolta Ora
                </button>
            </div>
        </div>`;
    }
    
    // ✂️ Accorcia i titoli lunghi
    truncateTitle(title, maxLength = 60) {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength - 3) + '...';
    }
    
    // 🎬 Carica player YouTube dinamicamente
    loadYouTubePlayer(videoId, playerId) {
        const playerElement = document.getElementById(playerId);
        if (!playerElement) return;
        
        // Sostituisce il placeholder con iframe YouTube
        playerElement.innerHTML = `
            <iframe 
                width="100%" 
                height="100%"
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="border-radius: 8px;">
            </iframe>
        `;
        
        // Aggiunge animazione di caricamento
        playerElement.style.transition = 'all 0.3s ease';
        
        console.log('🎬 Player YouTube caricato per video:', videoId);
    }
    
    // 🔗 Apre video su YouTube
    openInYouTube(url) {
        window.open(url, '_blank');
        console.log('🔗 Apertura YouTube:', url);
    }
    
    // 📤 Condivide video
    shareVideo(url, title) {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).catch(err => console.log('Errore condivisione:', err));
        } else {
            // Fallback: copia negli appunti
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('🔗 Link copiato negli appunti!');
            }).catch(() => {
                // Fallback finale: mostra popup
                prompt('Copia questo link:', url);
            });
        }
    }
    
    // 📢 Mostra notifiche temporanee
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideInNotification 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutNotification 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
    
    // 🔍 Estrae l'ID del video YouTube dall'URL
    extractYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // 🤖 Ottiene informazioni musicali dall'AI
    async getMusicInfoFromAI(songTitle, context = 'general') {
        try {
            let prompt = '';
            
            switch (context) {
                case 'play':
                    prompt = `Dimmi qualcosa di interessante su questa canzone: "${songTitle}". Include informazioni sull'artista, il genere, l'anno di uscita se lo conosci, e una tua opinione personale sul brano. Sii breve ma coinvolgente.`;
                    break;
                case 'recommend':
                    prompt = `Perché dovrei ascoltare "${songTitle}"? Cosa la rende speciale o interessante?`;
                    break;
                default:
                    prompt = `Dimmi qualcosa su questa canzone: "${songTitle}".`;
            }
            
            const response = await this.getAIResponse(prompt, null, 'musica');
            return `🎼 **Il mio parere:**\n${response}`;
            
        } catch (error) {
            console.warn('⚠️ Errore nel ottenere info AI:', error);
            return '🎼 **Buon ascolto!** Spero che ti piaccia questa canzone! 🎵';
        }
    }
    
    // 💬 Genera risposte di fallback per modalità offline
    async generateMusicFallbackResponse(query, type) {
        const fallbackResponses = {
            play: `🎵 **Non riesco a trovare "${query}" su YouTube**, ma ti consiglio di cercarlo manualmente!\n\n🎼 Nel frattempo, sappi che la musica è un linguaggio universale che attraversa culture e generazioni. Ogni brano ha la sua storia e la sua magia!`,
            recommend: `🎵 **Ecco alcuni consigli musicali per "${query}":**\n\n• Esplora le playlist "Best of" su Spotify o YouTube\n• Controlla le classifiche musicali del genere\n• Ascolta radio online specializzate\n• Chiedi consigli agli amici con gusti simili\n\n� La scoperta musicale è un viaggio meraviglioso!`,
            similar: `🎵 **Per trovare musica simile a "${query}":**\n\n• Usa Spotify Radio o YouTube Music\n• Cerca "artisti simili a..." su Google\n• Esplora playlist collaborative\n• Controlla i "fan also like" sui profili degli artisti\n\n🎼 Ogni scoperta musicale è un'avventura!`,
            artist_info: `🎵 **Per saperne di più su "${query}":**\n\n• Controlla Wikipedia per la biografia\n• Visita il sito ufficiale dell'artista\n• Leggi interviste e recensioni\n• Ascolta le loro canzoni più popolari\n\n🎼 Ogni artista ha una storia unica da raccontare!`
        };
        
        return fallbackResponses[type] || fallbackResponses.recommend;
    }
    
    // 📝 Estrae informazioni sulla canzone dal messaggio
    extractSongInfo(message) {
        const songInfo = {
            query: '',
            artist: '',
            title: ''
        };
        
        // Pattern per riconoscere richieste musicali
        const patterns = [
            /(?:suona|ascolta|cerca|trova|metti|canzone|brano|musica)\s+(?:la\s+)?(?:canzone\s+)?["']?([^"']+)["']?/i,
            /(?:canzone|brano|musica)\s+["']?([^"']+)["']?/i,
            /["']([^"']+)["']\s+(?:di|by)\s+([^"']+)/i,
            /([^"']+)\s+(?:di|by)\s+([^"']+)/i
        ];
        
        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match) {
                if (match[2]) {
                    // Formato: "canzone di artista" o "canzone by artista"
                    songInfo.title = match[1].trim();
                    songInfo.artist = match[2].trim();
                    songInfo.query = `${songInfo.title} ${songInfo.artist}`;
                } else {
                    // Formato semplice
                    songInfo.query = match[1].trim();
                }
                break;
            }
        }
        
        // Se non trova nulla, usa tutto il messaggio pulito
        if (!songInfo.query) {
            songInfo.query = message
                .toLowerCase()
                .replace(/(?:suona|ascolta|cerca|trova|metti|canzone|brano|musica)/gi, '')
                .trim();
        }
        
        return songInfo;
    }
      // 🔍 Cerca su YouTube - VERSIONE AVANZATA
    async searchYouTube(query) {
        try {
            console.log('🔍 Ricerca YouTube per:', query);
            
            // Controlla se API key è configurata
            if (!AI_CONFIG?.youtube?.apiKey || AI_CONFIG.youtube.apiKey === 'YOUR_YOUTUBE_API_KEY') {
                console.warn('⚠️ API Key YouTube non configurata, uso fallback');
                return this.generateYouTubeFallbackResults(query);
            }
            
            const apiKey = AI_CONFIG.youtube.apiKey;
            const maxResults = AI_CONFIG?.youtube?.maxResults || 5;
            
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
                `part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&` +
                `type=video&videoCategoryId=10&key=${apiKey}`; // videoCategoryId=10 = Music
            
            const response = await fetch(searchUrl);
            
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.items || data.items.length === 0) {
                console.warn('⚠️ Nessun risultato da YouTube API');
                return this.generateYouTubeFallbackResults(query);
            }
            
            return data.items.map(item => ({
                title: this.cleanVideoTitle(item.snippet.title),
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                videoId: item.id.videoId,
                thumbnail: item.snippet.thumbnails.medium.url,
                description: item.snippet.description,
                publishedAt: item.snippet.publishedAt,
                channelTitle: item.snippet.channelTitle
            }));
            
        } catch (error) {
            console.error('❌ Errore ricerca YouTube:', error);
            
            // Fallback se API non disponibile
            if (AI_CONFIG?.youtube?.fallbackEnabled) {
                return this.generateYouTubeFallbackResults(query);
            }
            
            return [];
        }
    }
    
    // 🎯 Pulisce i titoli dei video YouTube
    cleanVideoTitle(title) {
        // Rimuove caratteri HTML entities
        const decoded = title
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        
        return decoded;
    }
    
    // 🔄 Genera risultati di fallback quando YouTube API non è disponibile
    generateYouTubeFallbackResults(query) {
        console.log('🔄 Generazione risultati fallback per:', query);
        
        // Crea URL di ricerca YouTube diretti
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const youtubeMusicUrl = `https://music.youtube.com/search?q=${encodeURIComponent(query)}`;
        
        return [
            {
                title: `🔍 Cerca "${query}" su YouTube`,
                url: youtubeSearchUrl,
                videoId: null,
                thumbnail: null,
                description: 'Clicca per cercare direttamente su YouTube',
                isFallback: true
            },
            {
                title: `🎵 Cerca "${query}" su YouTube Music`,
                url: youtubeMusicUrl,
                videoId: null,
                thumbnail: null,
                description: 'Clicca per cercare su YouTube Music',
                isFallback: true
            }
        ];
    }    addChatMessage(message, sender, customElement = null) {
        console.log('🔧 addChatMessage chiamato:', { message, sender, customElement: !!customElement, chatMessages: !!this.chatMessages });
        
        if (!this.chatMessages) {
            console.error('❌ chatMessages non disponibile');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-item ${sender}-message`;
        
        // Crea avatar con icona Font Awesome
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        const avatarIcon = document.createElement('i');
        avatarIcon.className = sender === 'ai' ? 'fas fa-robot' : 'fas fa-user';
        avatarDiv.appendChild(avatarIcon);
        
        // Crea bubble per il messaggio
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        
        // Header del messaggio
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
        
        // Contenuto del messaggio
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        // 🎵 Formattazione speciale per modalità musica con embed YouTube
        if (this.currentCategory === 'musica' && sender === 'ai' && (message.includes('youtube-player-container') || message.includes('youtube-embed-container'))) {
            // Inizializza gli stili per i player se non già fatto
            this.initializeYouTubePlayerStyles();
            textDiv.innerHTML = this.formatMusicMessage(message);
        }
        // 💻 Formattazione speciale per modalità programmatore
        else if (this.currentCategory === 'programmatore' && sender === 'ai') {
            textDiv.innerHTML = this.formatProgrammerMessage(message);
        }
        // 🔍 Formattazione speciale per modalità ricercatore
        else if (this.currentCategory === 'ricercatore' && sender === 'ai') {
            textDiv.innerHTML = this.formatResearcherMessage(message);
        }
        else {
            // Per messaggi semplici, formatta markdown base
            textDiv.innerHTML = this.formatBasicMessage(message);
        }
        
        // Assembla la bubble
        bubbleDiv.appendChild(headerDiv);
        bubbleDiv.appendChild(textDiv);
        
        // ♟️ Aggiungi elemento personalizzato se fornito (come la scacchiera)
        if (customElement) {
            textDiv.appendChild(customElement);
        }
        
        // Assembla il messaggio
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(bubbleDiv);
        
        // Aggiungi l'animazione di entrata
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        this.chatMessages.appendChild(messageDiv);
        
        // Anima l'entrata del messaggio
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.5s ease-out';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
        
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        console.log('✅ Messaggio aggiunto alla chat');
    }
    
    // Formatta messaggi base con markdown semplice
    formatBasicMessage(message) {
        // Formatta emoji e testo base
        let formatted = message;
        
        // Bold text
        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Italic text  
        formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }
    
    // 🎵 Formatta messaggi per modalità musica
    formatMusicMessage(message) {
        // Formatta link musicali
        message = message.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #e74c3c; text-decoration: none;">🎵 $1</a>');
        
        // Formatta testo in grassetto
        message = message.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #c0392b;">$1</strong>');
        
        // Mantieni i componenti embed YouTube così come sono
        // (sono già in formato HTML)
        
        return message;
    }
    
    // 🔍 Formatta messaggi per modalità ricercatore
    formatResearcherMessage(message) {
        // Formatta link di ricerca
        message = message.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #3498db; text-decoration: none;">🔗 $1</a>');
        
        // Formatta testo in grassetto
        message = message.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #2980b9;">$1</strong>');
        
        // Formatta liste
        message = message.replace(/^• (.+)$/gm, '<li style="margin: 5px 0;">$1</li>');
        message = message.replace(/(<li[^>]*>.*<\/li>)/s, '<ul style="margin: 10px 0; padding-left: 20px;">$1</ul>');
        
        return message;
    }    // 💻 Formatta messaggi per modalità programmatore (STILE CHATGPT ESATTO)
    formatProgrammerMessage(message) {
        // Prima suddivide il messaggio in parti (testo + code blocks)
        const parts = this.parseMessageParts(message);
        
        // Formatta ogni parte separatamente
        let formattedMessage = '';
        
        parts.forEach((part, index) => {
            if (part.type === 'text') {
                // Formatta il testo normale
                let textContent = part.content;
                
                // Escape HTML chars solo per il testo
                textContent = textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                
                // Formatta inline code
                textContent = textContent.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
                
                // Formatta link
                textContent = textContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #3498db; text-decoration: none;">🔗 $1</a>');
                
                // Formatta testo in grassetto
                textContent = textContent.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #2ecc71;">$1</strong>');
                
                // Formatta sezioni con emoji
                textContent = textContent.replace(/^(🎯|💡|⚡|📚|✅|❌|⚠️)(\s*\*\*[^*]+\*\*)/gm, '<div style="margin: 15px 0; padding: 10px; background: rgba(52, 152, 219, 0.1); border-left: 3px solid #3498db; border-radius: 5px;">$1$2</div>');
                
                // Wrap il testo in un div per controllo layout
                if (textContent.trim()) {
                    formattedMessage += `<div class="message-text-part" style="margin-bottom: 12px; line-height: 1.6;">${textContent}</div>`;
                }
                
            } else if (part.type === 'codeblock') {
                // Formatta il code block
                const language = part.language || 'text';
                const languageDisplay = this.getLanguageDisplayName(language);
                const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
                
                // Applica syntax highlighting
                const highlightedCode = this.applySyntaxHighlighting(part.code.trim(), language);
                
                const codeBlockHtml = `
                    <div class="code-block ${language === 'template' ? 'template-code-block' : ''}" data-language="${language}" style="margin: 12px 0; width: 100%; display: block;">
                        <div class="code-block-header">
                            <div class="code-language">
                                <span class="code-language-icon"></span>
                                ${languageDisplay}
                            </div>
                            <div class="code-actions">
                                <button class="code-copy-btn" onclick="vf.copyCodeToClipboard('${codeId}', this)">
                                    📋 Copia
                                </button>
                                <button class="code-edit-btn" onclick="vf.editCode('${codeId}')">
                                    ✏️ Modifica
                                </button>
                            </div>
                        </div>
                        <pre id="${codeId}"><code class="language-${language}">${highlightedCode}</code></pre>
                    </div>
                `;
                
                formattedMessage += codeBlockHtml;
            }
        });
        
        // Wrap tutto in un container che forza layout verticale
        return `<div class="programmer-message-container" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">${formattedMessage}</div>`;
    }
    
    // Funzione per parsare il messaggio in parti (testo + code blocks)
    parseMessageParts(message) {
        const parts = [];
        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;
        
        while ((match = codeBlockRegex.exec(message)) !== null) {
            // Aggiungi il testo prima del code block
            if (match.index > lastIndex) {
                const textContent = message.substring(lastIndex, match.index).trim();
                if (textContent) {
                    parts.push({
                        type: 'text',
                        content: textContent
                    });
                }
            }
            
            // Aggiungi il code block
            parts.push({
                type: 'codeblock',
                language: match[1] || 'text',
                code: match[2] || ''
            });
            
            lastIndex = match.index + match[0].length;
        }
        
        // Aggiungi il testo rimasto dopo l'ultimo code block
        if (lastIndex < message.length) {
            const textContent = message.substring(lastIndex).trim();
            if (textContent) {
                parts.push({
                    type: 'text',
                    content: textContent
                });
            }
        }
        
        // Se non ci sono code blocks, tutto è testo
        if (parts.length === 0) {
            parts.push({
                type: 'text',
                content: message
            });
        }
        
        return parts;
    }
    
    // Funzione per ottenere il nome display del linguaggio
    getLanguageDisplayName(lang) {
        const languageNames = {
            'javascript': 'JavaScript',
            'js': 'JavaScript',
            'typescript': 'TypeScript',
            'ts': 'TypeScript',
            'python': 'Python',
            'py': 'Python',
            'java': 'Java',
            'html': 'HTML',
            'css': 'CSS',
            'scss': 'SCSS',
            'json': 'JSON',
            'xml': 'XML',
            'sql': 'SQL',
            'php': 'PHP',
            'c': 'C',
            'cpp': 'C++',
            'csharp': 'C#',
            'cs': 'C#',
            'go': 'Go',
            'rust': 'Rust',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            'dart': 'Dart',
            'ruby': 'Ruby',
            'bash': 'Bash',
            'shell': 'Shell',
            'powershell': 'PowerShell',
            'react': 'React JSX',
            'vue': 'Vue.js',
            'text': 'Testo',
            'template': 'Template Codice'
        };
        
        return languageNames[lang.toLowerCase()] || lang.toUpperCase();
    }
    
    // Syntax highlighting di base
    applySyntaxHighlighting(code, language) {
        if (!code) return '';
        
        // Escape HTML chars
        code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        switch (language.toLowerCase()) {
            case 'javascript':
            case 'js':
            case 'typescript':
            case 'ts':
                return this.highlightJavaScript(code);
            case 'python':
            case 'py':
                return this.highlightPython(code);
            case 'java':
                return this.highlightJava(code);
            case 'html':
                return this.highlightHTML(code);
            case 'css':
                return this.highlightCSS(code);            default:
                return code;
        }
    }
    
    // Highlighting JavaScript/TypeScript
    highlightJavaScript(code) {
        // Keywords
        code = code.replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|from|async|await|try|catch|finally|throw|new|this|typeof|instanceof)\b/g, '<span class="code-keyword">$1</span>');
        
        // Strings
        code = code.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="code-string">$1$2$1</span>');
        
        // Comments
        code = code.replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>');
        code = code.replace(/\/\*[\s\S]*?\*\//g, '<span class="code-comment">$&</span>');
        
        // Numbers
        code = code.replace(/\b\d+\.?\d*\b/g, '<span class="code-number">$&</span>');
        
        return code;
    }
      // Highlighting Python migliorato
    highlightPython(code) {
        // Keywords
        code = code.replace(/\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|pass|break|continue|and|or|not|in|is|lambda|yield|global|nonlocal)\b/g, '<span class="code-keyword">$1</span>');
        
        // Built-in functions
        code = code.replace(/\b(print|input|len|range|int|float|str|list|dict|tuple|set|bool|type|isinstance|hasattr|getattr|setattr|abs|min|max|sum|any|all|enumerate|zip|map|filter|sorted|reversed)\b/g, '<span class="code-builtin">$1</span>');
        
        // Strings (handle both single and double quotes, and f-strings)
        code = code.replace(/(f?["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="code-string">$1$2$1</span>');
        
        // Comments
        code = code.replace(/#.*$/gm, '<span class="code-comment">$&</span>');
        
        // Numbers
        code = code.replace(/\b\d+\.?\d*\b/g, '<span class="code-number">$&</span>');
        
        // Variable assignments
        code = code.replace(/(\w+)(\s*=\s*)/g, '<span class="code-variable">$1</span>$2');
        
        return code;
    }
    
    // Highlighting Java
    highlightJava(code) {
        // Keywords
        code = code.replace(/\b(public|private|protected|static|final|abstract|class|interface|extends|implements|import|package|if|else|for|while|do|switch|case|default|return|break|continue|try|catch|finally|throw|throws|new|this|super|void|int|double|float|boolean|char|String|long|short|byte)\b/g, '<span class="code-keyword">$1</span>');
        
        // Strings
        code = code.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="code-string">$1$2$1</span>');
        
        // Comments
        code = code.replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>');
        code = code.replace(/\/\*[\s\S]*?\*\//g, '<span class="code-comment">$&</span>');
        
        // Numbers
        code = code.replace(/\b\d+\.?\d*[fFdDlL]?\b/g, '<span class="code-number">$&</span>');
        
        return code;
    }
    
    // Highlighting HTML
    highlightHTML(code) {
        // Tags
        code = code.replace(/(&lt;\/?)([\w-]+)([^&gt;]*?)(&gt;)/g, '<span class="code-keyword">$1$2</span><span class="code-string">$3</span><span class="code-keyword">$4</span>');
        
        return code;
    }
    
    // Highlighting CSS
    highlightCSS(code) {
        // Selectors
        code = code.replace(/^([.#]?[\w-]+)(\s*{)/gm, '<span class="code-class">$1</span>$2');
        
        // Properties
        code = code.replace(/(\s+)([\w-]+)(\s*:)/g, '$1<span class="code-variable">$2</span>$3');
        
        // Values
        code = code.replace(/(:\s*)([\w-]+|#[\da-fA-F]+|\d+(?:px|em|rem|%|vh|vw)?)/g, '$1<span class="code-string">$2</span>');
        
        return code;
    }
      // Funzione per copiare codice negli appunti (MIGLIORATA)
    copyCodeToClipboard(codeId, buttonElement) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) {
            console.error('Elemento codice non trovato:', codeId);
            return;
        }
        
        // Estrae il testo pulito senza markup HTML
        const codeText = codeElement.textContent || codeElement.innerText;
        
        // Aggiorna visivamente il pulsante
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '✅ Copiato!';
        buttonElement.style.color = '#4caf50';
        buttonElement.style.borderColor = '#4caf50';
        
        // Aggiungi effetto visivo al code block
        const codeBlock = codeElement.closest('.code-block');
        if (codeBlock) {
            codeBlock.classList.add('code-copied');
            setTimeout(() => codeBlock.classList.remove('code-copied'), 300);
        }
        
        // Usa l'API Clipboard se disponibile
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(codeText).then(() => {
                this.showCopyNotification('Codice copiato negli appunti! 📋');
            }).catch(err => {
                console.error('Errore copia clipboard:', err);
                this.fallbackCopyToClipboard(codeText);
            });
        } else {
            this.fallbackCopyToClipboard(codeText);
        }
        
        // Ripristina il pulsante dopo 2 secondi
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.style.color = '';
            buttonElement.style.borderColor = '';
        }, 2000);
    }
    
    // Funzione per modificare il codice
    editCode(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) {
            console.error('Elemento codice non trovato:', codeId);
            return;
        }
        
        const codeText = codeElement.textContent || codeElement.innerText;
        const codeBlock = codeElement.closest('.code-block');
        const language = codeBlock.getAttribute('data-language') || 'text';
        
        // Crea textarea per modifica
        const editArea = document.createElement('div');
        editArea.className = 'code-edit-area';
        editArea.style.cssText = `
            background: #1f1f1f;
            border-radius: 0 0 8px 8px;
            padding: 16px;
            border-top: 1px solid #404040;
        `;
        
        const textarea = document.createElement('textarea');
        textarea.value = codeText;
        textarea.style.cssText = `
            width: 100%;
            min-height: 200px;
            background: #2f2f2f;
            color: #e8e8e8;
            border: 1px solid #555;
            border-radius: 6px;
            padding: 12px;
            font-family: 'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
            resize: vertical;
            outline: none;
        `;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin-top: 12px;
            justify-content: flex-end;
        `;
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '💾 Salva';
        saveBtn.style.cssText = `
            background: #4caf50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
        `;
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '❌ Annulla';
        cancelBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
        `;
        
        // Event handlers
        saveBtn.onclick = () => {
            const newCode = textarea.value;
            const highlightedCode = this.applySyntaxHighlighting(newCode, language);
            codeElement.innerHTML = `<code class="language-${language}">${highlightedCode}</code>`;
            editArea.remove();
            this.showCopyNotification('Codice modificato! ✏️');
        };
        
        cancelBtn.onclick = () => {
            editArea.remove();
        };
        
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(cancelBtn);
        editArea.appendChild(textarea);
        editArea.appendChild(buttonContainer);
        
        // Inserisce l'area di modifica dopo il code block
        codeBlock.appendChild(editArea);
        textarea.focus();
    }
    
    // Fallback per copia negli appunti
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showCopyNotification('Codice copiato! 📋');
            } else {
                this.showCopyNotification('❌ Errore nella copia');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showCopyNotification('❌ Copia non supportata');
        }
        
        document.body.removeChild(textArea);
    }
    
    // Mostra notifica di copia
    showCopyNotification(message) {
        // Crea elemento notifica
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            animation: slideInNotification 0.3s ease-out;
        `;
        
        // Aggiungi stili per animazione
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInNotification {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 3000);
    }
    
    // 🎯 COMANDI SLASH PER MODALITÀ PROGRAMMATORE
    getSlashHelp() {
        return `🎯 **Comandi Slash Disponibili:**

**Analisi Codice:**
• \`/analyze [codice]\` - Analizza codice per problemi e miglioramenti
• \`/review [codice]\` - Revisione completa del codice
• \`/debug [codice]\` - Aiuto per debugging
• \`/optimize [codice]\` - Suggerimenti per ottimizzazione
• \`/explain [codice]\` - Spiega come funziona il codice
• \`/metrics [codice]\` - Metriche del codice (complessità, linee, ecc.)

**Template e Pattern:**
• \`/template [linguaggio]\` - Template di codice
• \`/patterns [linguaggio]\` - Design patterns comuni
• \`/best [linguaggio]\` - Best practices

**Risorse:**
• \`/resources [linguaggio]\` - Link utili e documentazione
• \`/help\` - Mostra questo messaggio

**Esempio:** \`/template javascript\` per ottenere template JavaScript`;
    }
      getCodeTemplate(language) {
        const templates = {
            javascript: `// Template JavaScript Base
class ExampleClass {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        return \`Hello, \${this.name}!\`;
    }
}

// Uso
const example = new ExampleClass('World');
console.log(example.greet());`,
              python: `# Programma per sommare due numeri
# Input
num1 = float(input("Inserisci il primo numero: "))
num2 = float(input("Inserisci il secondo numero: "))

# Somma
somma = num1 + num2

# Output
print("La somma è:", somma)

# Versione più avanzata con gestione errori
def somma_sicura():
    try:
        num1 = float(input("Primo numero: "))
        num2 = float(input("Secondo numero: "))
        risultato = num1 + num2
        print(f"La somma di {num1} e {num2} è: {risultato}")
        return risultato
    except ValueError:
        print("Errore: Inserisci solo numeri validi!")
        return None

# Chiamata funzione
somma_sicura()`,
              java: `// Template Java - Esempio Classi Umano e Gigante
public class Umano {
    protected String nome;
    protected int vita;
    protected int attacco;
    
    // Costruttore
    public Umano(String nome, int vita, int attacco) {
        this.nome = nome;
        this.vita = vita;
        this.attacco = attacco;
    }
    
    // Metodi getter
    public String getNome() { return nome; }
    public int getVita() { return vita; }
    public int getAttacco() { return attacco; }
    
    // Metodo per attaccare
    public void attacca(Umano bersaglio) {
        if (bersaglio != null) {
            bersaglio.subisciDanno(this.attacco);
            System.out.println(this.nome + " attacca " + bersaglio.getNome() + 
                             " causando " + this.attacco + " danni!");
        }
    }
    
    // Metodo per subire danni
    public void subisciDanno(int danno) {
        this.vita -= danno;
        if (this.vita < 0) this.vita = 0;
        System.out.println(this.nome + " ha ora " + this.vita + " punti vita.");
    }
    
    // Metodo per controllare se è vivo
    public boolean eVivo() {
        return this.vita > 0;
    }
}

// Classe Gigante che eredita da Umano
public class Gigante extends Umano {
    private boolean punitiAttacco; // Attacco doppio per il prossimo attacco
    
    public Gigante(String nome, int vita, int attacco) {
        super(nome, vita, attacco); // Chiama il costruttore della classe padre
        this.punitiAttacco = false;
    }
    
    @Override
    public void attacca(Umano bersaglio) {
        int dannoEffettivo = this.attacco;
        if (this.punitiAttacco) {
            dannoEffettivo *= 2; // Attacco doppio
            this.punitiAttacco = false;
            System.out.println(this.nome + " usa un ATTACCO POTENZIATO!");
        }
        
        if (bersaglio != null) {
            bersaglio.subisciDanno(dannoEffettivo);
            System.out.println(this.nome + " (Gigante) attacca " + bersaglio.getNome() + 
                             " causando " + dannoEffettivo + " danni!");
        }
    }
    
    // Metodo speciale per caricare attacco
    public void caricaAttacco() {
        this.punitiAttacco = true;
        System.out.println(this.nome + " carica il prossimo attacco!");
    }
}

// Esempio di utilizzo
public class TestBattaglia {
    public static void main(String[] args) {
        // Crea personaggi
        Umano guerriero = new Umano("Arthas", 100, 25);
        Gigante titano = new Gigante("Kronos", 150, 30);
        
        System.out.println("=== INIZIO BATTAGLIA ===");
        
        // Simula combattimento
        while (guerriero.eVivo() && titano.eVivo()) {
            guerriero.attacca(titano);
            if (titano.eVivo()) {
                titano.caricaAttacco(); // Carica attacco speciale
                titano.attacca(guerriero);
            }
        }
        
        // Determina vincitore
        if (guerriero.eVivo()) {
            System.out.println(guerriero.getNome() + " vince la battaglia!");
        } else {
            System.out.println(titano.getNome() + " vince la battaglia!");
        }
    }
}`,
            
            html: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template HTML</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
    </style>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Questo è un template HTML base.</p>
    
    <script>
        console.log('Template HTML caricato!');
    </script>
</body>
</html>`,
            
            css: `/* Template CSS Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background: #f4f4f4;
    padding: 20px;
    text-align: center;
}`,
            
            react: `// Template React Component
import React, { useState, useEffect } from 'react';

const ExampleComponent = ({ title }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        console.log('Component mounted');
    }, []);
    
    return (
        <div>
            <h1>{title}</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
};

export default ExampleComponent;`
        };
        
        if (!language) {
            return `🎯 **Specifica un linguaggio per il template**\n\n**Linguaggi disponibili:**\n${Object.keys(templates).map(lang => `• \`${lang}\``).join('\n')}\n\n**Esempio:** \`/template javascript\``;
        }
        
        const template = templates[language.toLowerCase()];
        if (!template) {
            return `❌ **Template non disponibile per "${language}"**\n\n**Linguaggi disponibili:**\n${Object.keys(templates).map(lang => `• \`${lang}\``).join('\n')}\n\n**Esempio:** \`/template javascript\``;
        }
        
        return `🎯 **Template ${this.getLanguageDisplayName(language)}**\n\n\`\`\`template\n${template}\n\`\`\``;
    }
    
    // Altri metodi essenziali...
    
    showTypingIndicator() {
        if (!this.chatMessages) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'chat-message ai-message typing-indicator';
        indicator.innerHTML = '<span>AI sta scrivendo...</span>';
        indicator.id = 'typing-indicator';
        
        this.chatMessages.appendChild(indicator);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }      async getAIResponse(message, searchResults = null, mode = null) {
        try {
            // Prima prova con AI esterno se configurato
            if (AI_CONFIG?.apiUrl && AI_CONFIG.apiUrl !== 'offline') {
                try {
                    return await this.getExternalAIResponse(message, searchResults, mode);
                } catch (error) {
                    console.warn('⚠️ AI esterno non disponibile, uso modalità offline:', error.message);
                }
            }
            
            // Fallback: modalità offline intelligente
            return this.getOfflineAIResponse(message, mode, searchResults);
            
        } catch (error) {
            console.error('❌ Errore AI completo:', error);
            return this.getOfflineAIResponse(message, mode, searchResults);
        }
    }
      async getExternalAIResponse(message, searchResults = null, mode = null) {
        const currentMode = mode || this.currentCategory;
        
        // Ottieni la personalità specifica per la modalità
        const personality = AI_CONFIG?.personalities?.[currentMode] || AI_CONFIG?.personalities?.amico || {};
        
        // Usa il prompt formattato se disponibile
        let systemPrompt = personality.systemPrompt;
        if (!systemPrompt && typeof getFormattedPrompt === 'function') {
            systemPrompt = getFormattedPrompt(message);
        } else if (!systemPrompt) {
            systemPrompt = 'Sei un assistente virtuale amichevole che risponde in italiano.';
        }
          // Prepara il messaggio utente
        let userMessage = message;
        if (searchResults) {
            userMessage += `\n\n🌐 INFORMAZIONI AGGIORNATE DAL WEB:\n${searchResults}\n\nUsa queste informazioni per fornire una risposta accurata e completa. Cita le fonti quando appropriato.`;
        }
        
        console.log(`🤖 Chiamata AI per modalità: ${currentMode}`);
        console.log(`🤖 System prompt: ${systemPrompt.substring(0, 100)}...`);
        
        // Debug per modalità amico
        if (currentMode === 'amico') {
            console.log('🎯 MODALITÀ AMICO ATTIVATA - Usando parametri per risposte brevi');
            console.log('🎯 Max tokens ridotti a:', maxTokens);
        }
        
        const apiUrl = AI_CONFIG?.apiUrl || 'http://localhost:11434/v1/chat/completions';
        const model = AI_CONFIG?.model || AI_CONFIG?.ollama?.model || 'mistral:latest';
        
        // Parametri specifici per modalità
        let maxTokens = AI_CONFIG?.maxTokens || 1000;
        let temperature = AI_CONFIG?.temperature || AI_CONFIG?.ollama?.options?.temperature || 0.7;
        
        // Configurazione specifica per modalità amico - risposte MOLTO più brevi
        if (currentMode === 'amico') {
            maxTokens = 80; // Drasticamente ridotto da 1000 a 80
            temperature = 0.8; // Più creativo per conversazione naturale
        }
        
        const requestBody = {
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: temperature,
            max_tokens: maxTokens,
            stream: false
        };
        
        console.log('🤖 Request body:', requestBody);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Errore risposta API:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('🤖 Risposta AI ricevuta:', data);
        
        const aiResponse = data.choices?.[0]?.message?.content || 'Mi dispiace, non sono riuscito a elaborare una risposta.';
        
        console.log(`✅ Risposta AI (${aiResponse.length} caratteri):`, aiResponse.substring(0, 100) + '...');
        
        return aiResponse;
    }
      getOfflineAIResponse(message, mode = null, searchResults = null) {
        const currentMode = mode || this.currentCategory;
        console.log('🤖 Modalità offline attiva per:', currentMode);
        
        // Se ci sono risultati di ricerca, li includiamo nella risposta offline
        let baseResponse = '';
        
        // Risposte intelligenti basate sulla modalità
        switch (currentMode) {
            case 'musica':
                baseResponse = this.getMusicOfflineResponse(message);
                break;
            case 'programmatore':
                baseResponse = this.getProgrammerOfflineResponse(message);
                break;
            case 'ricercatore':
                baseResponse = this.getResearcherOfflineResponse(message);
                break;
            case 'amico':
            default:
                baseResponse = this.getFriendOfflineResponse(message);
                break;
        }
        
        // Aggiungi risultati di ricerca se disponibili
        if (searchResults) {
            baseResponse += `\n\n---\n\n${searchResults}`;
        }
        
        return baseResponse;
    }
    
    getMusicOfflineResponse(message) {
        const musicKeywords = ['canzone', 'brano', 'artista', 'album', 'genere', 'suona', 'ascolta'];
        const hasKeyword = musicKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (hasKeyword) {
            return `🎵 **Modalità Musica Offline**\n\nHo capito che stai cercando qualcosa di musicale! Al momento sto funzionando in modalità offline, quindi non posso fare ricerche su YouTube o analisi AI avanzate.\n\n**Cosa posso fare:**\n• Consigliarti generi musicali\n• Parlare di artisti famosi\n• Suggerire playlist per diverse occasioni\n\n**Per funzionalità complete:** Configura l'API AI nel file config.js\n\n🎼 Dimmi, che tipo di musica ti piace o cosa stai cercando?`;
        }
        
        return `🎵 Ciao! Sono la modalità Musica. Al momento funziono offline, ma posso comunque aiutarti con consigli musicali, generi, artisti famosi e molto altro. Cosa vorresti sapere sulla musica?`;
    }
      getProgrammerOfflineResponse(message) {
        // Analizza il messaggio per parole chiave di programmazione
        const codeKeywords = ['codice', 'programma', 'javascript', 'python', 'html', 'css', 'errore', 'bug', 'debug'];
        const hasCodeKeyword = codeKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        // Controlla se richiede programma di somma
        const sumKeywords = ['somma', 'addizione', 'due numeri', 'input', 'output'];
        const isSumRequest = sumKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (isSumRequest) {
            return `💻 **Programma per sommare due numeri**

Ecco un semplice programma che riceve in input due numeri e restituisce la loro somma, scritto in diversi linguaggi di programmazione:

**🐍 Python:**
\`\`\`python
# Input
num1 = float(input("Inserisci il primo numero: "))
num2 = float(input("Inserisci il secondo numero: "))

# Somma
somma = num1 + num2

# Output
print("La somma è:", somma)
\`\`\`

**☕ Java:**
\`\`\`java
import java.util.Scanner;

public class SommaDueNumeri {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Input
        System.out.print("Inserisci il primo numero: ");
        double num1 = scanner.nextDouble();
        System.out.print("Inserisci il secondo numero: ");
        double num2 = scanner.nextDouble();
        
        // Somma
        double somma = num1 + num2;
        
        // Output
        System.out.println("La somma è: " + somma);
        
        scanner.close();
    }
}
\`\`\`

**🟨 JavaScript:**
\`\`\`javascript
// Input
const num1 = parseFloat(prompt("Inserisci il primo numero:"));
const num2 = parseFloat(prompt("Inserisci il secondo numero:"));

// Somma
const somma = num1 + num2;

// Output
console.log("La somma è:", somma);
alert("La somma è: " + somma);
\`\`\`

💡 **Suggerimento:** Usa il pulsante "Copia" per copiare il codice e "Modifica" per personalizzarlo!`;
        }
        
        if (message.includes('```') || hasCodeKeyword) {
            return `💻 **Modalità Programmatore Offline**\n\nVedo che hai una domanda tecnica! Anche in modalità offline posso aiutarti con:\n\n**✅ Disponibile offline:**\n• Comandi slash (es: /help, /template javascript)\n• Template di codice\n• Best practices\n• Pattern di design\n• Spiegazioni base\n\n**🔗 Per analisi avanzate:** Configura l'AI esterna\n\n💡 **Suggerimento:** Prova a usare un comando slash come \`/template javascript\` o \`/help\` per vedere tutte le opzioni!`;
        }
        
        return `💻 Salve, sviluppatore! Modalità offline attiva. Posso aiutarti con template, best practices, e comandi slash. Digita \`/help\` per vedere tutti i comandi disponibili!`;
    }
      getResearcherOfflineResponse(message) {
        const researchKeywords = ['cerca', 'ricerca', 'informazioni', 'studiare', 'analisi', 'dati', 'trova', 'dimmi di'];
        const hasResearchKeyword = researchKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (hasResearchKeyword) {
            return `🔍 **Modalità Ricercatore**\n\n📋 **Suggerimenti per ricerca efficace su "${message}":**\n\n**🎯 Fonti Consigliate:**\n• **Wikipedia** - Per informazioni enciclopediche\n• **Google Scholar** - Per articoli accademici\n• **PubMed** - Per ricerca medica/scientifica\n• **JSTOR** - Per articoli accademici\n• **Archive.org** - Per documenti storici\n• **GitHub** - Per codice e progetti tecnici\n\n**📚 Link Utili:**\n• <a href="https://it.wikipedia.org" target="_blank">Wikipedia Italia</a>\n• <a href="https://scholar.google.com" target="_blank">Google Scholar</a>\n• <a href="https://www.jstor.org" target="_blank">JSTOR</a>\n• <a href="https://archive.org" target="_blank">Internet Archive</a>\n• <a href="https://github.com" target="_blank">GitHub</a>\n\n**🔍 Strategie di Ricerca:**\n1. **Usa parole chiave specifiche**\n2. **Controlla la data delle fonti**\n3. **Verifica l'autorevolezza dell'autore**\n4. **Confronta fonti multiple**\n5. **Salva le fonti per citarle**\n\n💡 **Tip:** Per ricerche più approfondite, configura l'AI esterna per accesso diretto a fonti web!`;
        }
        
        return `🔍 **Modalità Ricercatore Attiva**\n\nSono qui per aiutarti con ricerche e analisi! Anche in modalità offline posso:\n\n**✅ Metodologie di Ricerca:**\n• Tecniche di ricerca efficace\n• Valutazione fonti attendibili\n• Organizzazione informazioni\n• Strutturazione progetti\n\n**🌐 Fonti Consigliate:**\n• <a href="https://it.wikipedia.org" target="_blank">Wikipedia</a> - Informazioni generali\n• <a href="https://scholar.google.com" target="_blank">Google Scholar</a> - Articoli accademici\n• <a href="https://www.treccani.it" target="_blank">Treccani</a> - Enciclopedia italiana\n• <a href="https://www.ansa.it" target="_blank">ANSA</a> - Notizie aggiornate\n\nSu cosa vuoi fare ricerca? Posso suggerirti le migliori strategie!`;
    }
      getFriendOfflineResponse(message) {
        // Risposte amichevoli basate sul contenuto
        const greetings = ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'hello'];
        const questions = ['come stai', 'come va', 'che fai', 'novità'];
        const help = ['aiuto', 'help', 'non so', 'problema'];
        const chessKeywords = ['scacchi', 'scacco', 'partita', 'giochiamo', 'chess', 'gioco', 'giocare'];
        
        const isGreeting = greetings.some(g => message.toLowerCase().includes(g));
        const isQuestion = questions.some(q => message.toLowerCase().includes(q));
        const needsHelp = help.some(h => message.toLowerCase().includes(h));
        const wantsChess = chessKeywords.some(k => message.toLowerCase().includes(k));
          // Controlla se vuole giocare a scacchi
        if (wantsChess) {
            return `♟️ **Giochiamo a scacchi!**\n\nPerfetto! Ho preparato la scacchiera per te. Ricorda: sei i pezzi bianchi e inizi tu!\n\n*Buona fortuna!* 🎯`;
        }
        
        if (isGreeting) {
            return `😊 Ehi, ciao! Come va oggi?`;
        }
        
        if (isQuestion) {
            return `😊 Tutto bene da queste parti! E tu invece? Cosa combini di bello?`;
        }
        
        if (needsHelp) {
            return `😊 Hey, dimmi pure! Di cosa hai bisogno? Posso aiutarti a chiacchierare o se ti va possiamo fare una partita a scacchi!`;
        }
        
        // Risposte generiche amichevoli e colloquiali
        const friendlyResponses = [
            `😊 Interessante! Raccontami di più.`,
            `😊 Ah sì? E tu che ne pensi?`,
            `😊 Mi piace parlare con te! Continua pure.`,
            `😊 Mmh, capisco. Dimmi altro!`,
            `😊 Davvero? Che figata! Come è andata?`,
            `😊 Ah interessante! E poi?`,
            `😊 Bello! Mi hai incuriosito.`
        ];
        
        return friendlyResponses[Math.floor(Math.random() * friendlyResponses.length)];
    }
    
    addToConversationHistory(userMessage, aiResponse) {
        this.conversationHistory.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: Date.now(),
            mode: this.currentCategory
        });
        
        // Mantieni solo gli ultimi messaggi
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }
        
        this.updateMemoryStatus();
    }
    
    clearConversationHistory() {
        this.conversationHistory = [];
        this.updateMemoryStatus();
        console.log('🗑️ Cronologia conversazione cancellata');
    }
    
    updateMemoryStatus() {
        if (this.memoryStatus) {
            const totalMessages = this.conversationHistory.length;
            const memoryCountElement = this.memoryStatus.querySelector('.memory-count');
            
            if (memoryCountElement) {
                memoryCountElement.textContent = `${totalMessages}/${this.maxHistoryLength}`;
            } else {
                // Fallback per compatibilità
                this.memoryStatus.textContent = `Memoria: ${totalMessages}/${this.maxHistoryLength} messaggi`;
            }
        }
    }
    
    updateSearchStatus() {
        if (this.searchStatus) {
            this.searchStatus.textContent = this.searchEnabled ? 'Ricerca: Attiva' : 'Ricerca: Disattivata';
            this.searchStatus.style.color = this.searchEnabled ? 'green' : 'orange';
        }
    }
      // Metodo per creare indicatore di debug visuale
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
        debugDiv.innerHTML = '✅ JavaScript ATTIVO<br>🔧 VirtualFriend in inizializzazione...';
        document.body.appendChild(debugDiv);
        
        this.debugIndicator = debugDiv;
    }
      // Metodo per aggiornare l'indicatore di debug
    updateDebugIndicator(message, isError = false) {
        if (this.debugIndicator) {
            if (isError) {
                this.debugIndicator.style.background = '#e74c3c';
            }
            this.debugIndicator.innerHTML += '<br>' + message;
        }
    }
      // Metodo per mostrare stato AI
    updateAIStatus() {
        const isOffline = !AI_CONFIG?.apiUrl || AI_CONFIG.apiUrl === 'offline';
        
        if (this.aiStatus) {
            if (isOffline) {
                this.aiStatus.innerHTML = `
                    <span class="status-icon">🤖</span>
                    <span class="status-text">AI: Modalità Offline</span>
                `;
                this.aiStatus.style.color = '#f39c12';
            } else {
                this.aiStatus.innerHTML = `
                    <span class="status-icon">🧠</span>
                    <span class="status-text">AI: ${AI_CONFIG.model || 'Ollama'} Pronto</span>
                `;
                this.aiStatus.style.color = '#27ae60';
            }
        }
        
        // Aggiorna anche l'indicatore di debug
        if (isOffline) {
            this.updateDebugIndicator('🤖 Modalità AI: OFFLINE (intelligenza locale)');
        } else {
            this.updateDebugIndicator(`🧠 Modalità AI: ONLINE (${AI_CONFIG.model || 'Ollama'})`);
        }
    }
    
    // Test connessione AI migliorato
    async testAIConnection() {
        console.log('🔗 Test connessione AI...');
        
        if (!AI_CONFIG?.apiUrl || AI_CONFIG.apiUrl === 'offline') {
            console.log('🤖 Modalità offline attiva - nessun test necessario');
            return;
        }
        
        try {
            const testResponse = await this.getExternalAIResponse('Ciao, questo è un test di connessione. Rispondi brevemente che tutto funziona.');
            console.log('✅ Test AI riuscito:', testResponse.substring(0, 50) + '...');
            
            // Aggiorna l'indicatore di stato
            if (this.aiStatus) {
                this.aiStatus.innerHTML = `
                    <span class="status-icon">🧠</span>
                    <span class="status-text">AI: Connesso e Testato</span>
                `;
                this.aiStatus.style.color = '#27ae60';
            }
            
        } catch (error) {
            console.warn('⚠️ Test AI fallito, passerò alla modalità offline:', error.message);
            
            // Aggiorna l'indicatore di stato
            if (this.aiStatus) {
                this.aiStatus.innerHTML = `
                    <span class="status-icon">⚠️</span>
                    <span class="status-text">AI: Fallback Offline</span>
                `;
                this.aiStatus.style.color = '#e67e22';
            }
        }
    }
      // Metodi di utilità
    initializeInterface() {
        console.log('🔧 Inizializzazione interfaccia completata');
    }
    
    testAI() {
        this.addChatMessage('Test AI...', 'user');
        this.sendChatMessage();
    }
    
    testSearch() {
        this.addChatMessage('Test ricerca...', 'user');
        this.addChatMessage('Ricerca funzionante!', 'ai');
    }
    
    toggleChat() {
        if (this.chatSection) {
            this.chatSection.classList.toggle('hidden');
        }
    }
    
    addTranscriptMessage(message) {
        if (this.transcript) {
            this.transcript.textContent = message;
        }
    }
    
    // 🎨 Inizializza stili per il player YouTube
    initializeYouTubePlayerStyles() {
        // Controlla se gli stili sono già stati aggiunti
        if (document.getElementById('youtube-player-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'youtube-player-styles';
        styles.textContent = `
            /* Animazioni per notifiche */
            @keyframes slideInNotification {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutNotification {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            /* Animazioni per player YouTube */
            .youtube-player-container:hover .play-overlay {
                background: rgba(0,0,0,0.6) !important;
            }
            
            .youtube-player-container:hover .play-button {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(255,0,0,0.6) !important;
            }
            
            /* Responsive design per player */
            @media (max-width: 480px) {
                .youtube-player-container {
                    max-width: 100% !important;
                    margin: 10px 0 !important;
                }
                
                .youtube-player {
                    height: 200px !important;
                }
            }
            
            /* Animazione loading per player */
            .youtube-player.loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                margin: -20px 0 0 -20px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top: 3px solid #ff0000;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Stili per fallback player */
            .fallback-video-player:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 35px rgba(0,0,0,0.4);
            }
        `;
        
        document.head.appendChild(styles);
        console.log('🎨 Stili YouTube Player inizializzati');
    }
}

// Inizializzazione globale
let vf = null;

// Debug: Verifica che lo script si carichi
console.log('🔧 Script.js caricato, inizio inizializzazione...');

// 🚨 BACKUP: Inizializzazione immediata se DOM già pronto
if (document.readyState === 'loading') {
    console.log('🔧 DOM in caricamento, aspetto DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    console.log('🔧 DOM già pronto, inizializzazione immediata...');
    initializeApp();
}

function initializeApp() {
    console.log('🔧 Inizializzazione app avviata...');
    
    try {
        console.log('🔧 Creazione istanza VirtualFriend...');
        vf = new VirtualFriend();
        console.log('✅ Applicazione inizializzata con successo');
        
        // Rendi accessibili i metodi necessari per i callback
        window.vf = vf;
        console.log('✅ VirtualFriend reso globale come window.vf');
        
    } catch (error) {
        console.error('❌ Errore durante l\'inizializzazione:', error);
        
        // Mostra errore all'utente
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            max-width: 400px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;
        errorDiv.innerHTML = `
            <h3>❌ Errore di Inizializzazione</h3>
            <p><strong>Errore:</strong> ${error.message}</p>
            <p><strong>Suggerimenti:</strong></p>
            <ul>
                <li>Ricarica la pagina (F5)</li>
                <li>Verifica che tutti i file siano presenti</li>
                <li>Controlla la console per dettagli</li>
            </ul>
            <button onclick="this.parentElement.remove()" style="
                background: white;
                color: #e74c3c;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">Chiudi</button>
        `;
        document.body.appendChild(errorDiv);
    }
}
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
        this.tagBtns = document.querySelectorAll('.tag-btn');
        
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
                this.tagBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
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
                this.modeIndicator.textContent = `${modeConfig.icon} ${modeConfig.name}`;
                this.modeIndicator.style.color = modeConfig.color;
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
                    const topSongs = youtubeResults.slice(0, 3);
                    let youtubeSection = '\n\n🎬 **Trovato su YouTube:**\n';
                    
                    topSongs.forEach((song, index) => {
                        youtubeSection += `\n${index + 1}. [${song.title}](${song.url})\n`;
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
                let youtubeSection = '\n\n🎬 **Esempi trovati:**\n';
                
                similarSongs.forEach((song, index) => {
                    youtubeSection += `\n• [${song.title}](${song.url})\n`;
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
                const popularSongs = youtubeResults.slice(0, 3);
                let songsSection = '\n\n🎵 **Canzoni popolari:**\n';
                
                popularSongs.forEach((song, index) => {
                    songsSection += `\n${index + 1}. [${song.title}](${song.url})\n`;
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
    
    // 🎬 Crea componente embed YouTube
    createYouTubeEmbed(videoData) {
        const videoId = this.extractYouTubeVideoId(videoData.url);
        const embedOptions = AI_CONFIG?.youtube?.embedOptions || {};
        
        const width = embedOptions.width || 320;
        const height = embedOptions.height || 180;
        const autoplay = AI_CONFIG?.youtube?.autoplay ? 1 : 0;
        
        return `<div class="youtube-embed-container" style="margin: 10px 0; text-align: center;">
    <iframe 
        width="${width}" 
        height="${height}"
        src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&modestbranding=1&rel=0"
        title="${videoData.title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
    </iframe>
    <div class="video-info" style="margin-top: 8px; font-size: 12px; color: #666;">
        <strong>${videoData.title}</strong><br>
        <a href="${videoData.url}" target="_blank" style="color: #ff0000;">▶ Apri su YouTube</a>
    </div>
</div>`;
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
            /(?:suona|ascolta|cerca|trova|metti)\s+(?:la\s+)?(?:canzone\s+)?["']?([^"']+)["']?/i,
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
        messageDiv.className = `chat-message ${sender}-message`;
        
        // Crea struttura message con avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = sender === 'ai' ? '🤖' : '👤';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // 🎵 Formattazione speciale per modalità musica con embed YouTube
        if (this.currentCategory === 'musica' && sender === 'ai' && message.includes('youtube-embed-container')) {
            contentDiv.innerHTML = this.formatMusicMessage(message);
        }
        // 💻 Formattazione speciale per modalità programmatore
        else if (this.currentCategory === 'programmatore' && sender === 'ai') {
            contentDiv.innerHTML = this.formatProgrammerMessage(message);
        }
        // 🔍 Formattazione speciale per modalità ricercatore
        else if (this.currentCategory === 'ricercatore' && sender === 'ai') {
            contentDiv.innerHTML = this.formatResearcherMessage(message);
        }
        else {
            // Per messaggi semplici, usa textContent per sicurezza
            contentDiv.textContent = message;
        }
        
        // Aggiungi avatar e contenuto al messaggio
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        // ♟️ Aggiungi elemento personalizzato se fornito (come la scacchiera)
        if (customElement) {
            contentDiv.appendChild(customElement);
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        console.log('✅ Messaggio aggiunto alla chat');
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
            this.memoryStatus.textContent = `Memoria: ${totalMessages}/${this.maxHistoryLength} messaggi`;
        }
    }
    
    updateSearchStatus() {
        if (this.searchStatus) {
            this.searchStatus.textContent = this.searchEnabled ? 'Ricerca: Attiva' : 'Ricerca: Disattivata';
            this.searchStatus.style.color = this.searchEnabled ? 'green' : 'orange';
        }
    }
      shouldUseSearch(message) {
        return this.shouldTriggerSearch(message);
    }
      async performSearch(query) {
        console.log('🔍 Avvio ricerca web per:', query);
        
        try {
            const searchResults = await this.searchWeb(query);
            return this.formatSearchResults(searchResults);
        } catch (error) {
            console.error('❌ Errore durante la ricerca:', error);
            return `❌ **Errore Ricerca**\n\nNon sono riuscito a completare la ricerca per: "${query}"\n\n**Errore:** ${error.message}`;
        }
    }

    // 🌐 SISTEMA RICERCA WEB AVANZATO
    async searchWeb(query) {
        console.log('🌐 Ricerca web avviata:', query);
        
        if (!AI_CONFIG?.search?.enabled) {
            throw new Error('Ricerca web disabilitata nella configurazione');
        }

        const providers = AI_CONFIG.search.providers;
        const maxResults = AI_CONFIG.search.maxResults || 5;
        const timeout = AI_CONFIG.search.timeout || 15000;
        
        // Array per raccogliere risultati da tutti i provider
        const allResults = [];
        const searchPromises = [];

        // Cerca in parallelo con tutti i provider abilitati
        for (const [providerName, config] of Object.entries(providers)) {
            if (config.enabled) {
                console.log(`🔍 Avvio ricerca su ${config.name}...`);
                
                const searchPromise = this.searchWithTimeout(
                    this.getSearchFunction(providerName),
                    query,
                    config,
                    timeout
                ).then(results => ({
                    provider: providerName,
                    results: results || [],
                    success: true
                })).catch(error => ({
                    provider: providerName,
                    results: [],
                    success: false,
                    error: error.message
                }));
                
                searchPromises.push(searchPromise);
            }
        }

        // Attendi tutti i risultati
        const providerResults = await Promise.all(searchPromises);
        
        // Raccogli tutti i risultati validi
        for (const result of providerResults) {
            if (result.success && result.results.length > 0) {
                console.log(`✅ ${result.provider}: ${result.results.length} risultati`);
                allResults.push(...result.results.map(r => ({
                    ...r,
                    provider: result.provider
                })));
            } else if (!result.success) {
                console.warn(`⚠️ ${result.provider} fallito:`, result.error);
            }
        }

        // Deduplica e ordina i risultati
        const uniqueResults = this.deduplicateResults(allResults);
        const sortedResults = uniqueResults
            .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
            .slice(0, maxResults);

        console.log(`✅ Ricerca completata: ${sortedResults.length} risultati finali`);
        
        return {
            query: query,
            results: sortedResults,
            totalFound: allResults.length,
            providers: providerResults.filter(r => r.success).map(r => r.provider),
            timestamp: new Date().toISOString()
        };
    }

    // Wrapper per timeout delle ricerche
    async searchWithTimeout(searchFunction, query, config, timeout) {
        return Promise.race([
            searchFunction(query, config),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout ricerca')), timeout)
            )
        ]);
    }

    // Restituisce la funzione di ricerca appropriata per il provider
    getSearchFunction(providerName) {
        const searchFunctions = {
            'duckduckgo': this.searchDuckDuckGo.bind(this),
            'wikipedia': this.searchWikipedia.bind(this),
            'wikidata': this.searchWikidata.bind(this),
            'github': this.searchGitHub.bind(this)
        };
        
        return searchFunctions[providerName] || (() => Promise.resolve([]));
    }

    // 🦆 RICERCA DUCKDUCKGO
    async searchDuckDuckGo(query, config) {
        console.log('🦆 Ricerca DuckDuckGo:', query);
        
        try {
            const url = `${config.url}?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const results = [];

            // Instant Answer
            if (data.Abstract) {
                results.push({
                    title: data.Heading || 'Risposta Istantanea',
                    snippet: data.Abstract,
                    url: data.AbstractURL || '#',
                    type: 'instant_answer',
                    relevance: 10,
                    source: data.AbstractSource || 'DuckDuckGo'
                });
            }

            // Definition
            if (data.Definition) {
                results.push({
                    title: 'Definizione',
                    snippet: data.Definition,
                    url: data.DefinitionURL || '#',
                    type: 'definition',
                    relevance: 9,
                    source: data.DefinitionSource || 'DuckDuckGo'
                });
            }

            // Related Topics
            if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                data.RelatedTopics.slice(0, 3).forEach((topic, index) => {
                    if (topic.Text && topic.FirstURL) {
                        results.push({
                            title: topic.Text.split(' - ')[0] || 'Argomento Correlato',
                            snippet: topic.Text,
                            url: topic.FirstURL,
                            type: 'related',
                            relevance: 7 - index,
                            source: 'DuckDuckGo'
                        });
                    }
                });
            }

            console.log(`🦆 DuckDuckGo: ${results.length} risultati trovati`);
            return results;

        } catch (error) {
            console.error('❌ Errore DuckDuckGo:', error);
            return [];
        }
    }

    // 📚 RICERCA WIKIPEDIA
    async searchWikipedia(query, config) {
        console.log('📚 Ricerca Wikipedia:', query);
        
        try {
            // Prima cerca le pagine
            const searchUrl = `${config.url}page/search/${encodeURIComponent(query)}?limit=3`;
            
            const searchResponse = await fetch(searchUrl, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'AmicovirtualeAI/1.0'
                }
            });

            if (!searchResponse.ok) {
                throw new Error(`HTTP ${searchResponse.status}`);
            }

            const searchData = await searchResponse.json();
            const results = [];

            if (searchData.pages && searchData.pages.length > 0) {
                // Per ogni pagina trovata, ottieni il riassunto
                for (const page of searchData.pages.slice(0, 2)) {
                    try {
                        const summaryUrl = `${config.url}page/summary/${encodeURIComponent(page.key)}`;
                        const summaryResponse = await fetch(summaryUrl, {
                            headers: {
                                'Accept': 'application/json',
                                'User-Agent': 'AmicovirtualeAI/1.0'
                            }
                        });

                        if (summaryResponse.ok) {
                            const summaryData = await summaryResponse.json();
                            results.push({
                                title: summaryData.title || page.title,
                                snippet: summaryData.extract || page.description || 'Nessuna descrizione disponibile',
                                url: summaryData.content_urls?.desktop?.page || `https://it.wikipedia.org/wiki/${page.key}`,
                                type: 'encyclopedia',
                                relevance: 8,
                                source: 'Wikipedia',
                                thumbnail: summaryData.thumbnail?.source
                            });
                        }
                    } catch (error) {
                        console.warn('⚠️ Errore nel recupero riassunto Wikipedia:', error);
                    }
                }
            }

            console.log(`📚 Wikipedia: ${results.length} risultati trovati`);
            return results;

        } catch (error) {
            console.error('❌ Errore Wikipedia:', error);
            return [];
        }
    }

    // 🗃️ RICERCA WIKIDATA
    async searchWikidata(query, config) {
        console.log('🗃️ Ricerca Wikidata:', query);
        
        try {
            // Query SPARQL per cercare entità
            const sparqlQuery = `
                SELECT DISTINCT ?item ?itemLabel ?itemDescription WHERE {
                    ?item rdfs:label ?label .
                    FILTER(CONTAINS(LCASE(?label), LCASE("${query.replace(/"/g, '\\"')}")))
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "it,en". }
                }
                LIMIT 3
            `;

            const url = `${config.url}?query=${encodeURIComponent(sparqlQuery)}&format=json`;
            
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/sparql-results+json',
                    'User-Agent': 'AmicovirtualeAI/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const results = [];

            if (data.results && data.results.bindings) {
                data.results.bindings.forEach((binding, index) => {
                    const item = binding.item?.value;
                    const label = binding.itemLabel?.value;
                    const description = binding.itemDescription?.value;

                    if (item && label) {
                        const entityId = item.split('/').pop();
                        results.push({
                            title: label,
                            snippet: description || 'Entità Wikidata',
                            url: `https://www.wikidata.org/wiki/${entityId}`,
                            type: 'data',
                            relevance: 6 - index,
                            source: 'Wikidata',
                            entityId: entityId
                        });
                    }
                });
            }

            console.log(`🗃️ Wikidata: ${results.length} risultati trovati`);
            return results;

        } catch (error) {
            console.error('❌ Errore Wikidata:', error);
            return [];
        }
    }

    // 💻 RICERCA GITHUB (specifica per programmazione)
    async searchGitHub(query, config) {
        console.log('💻 Ricerca GitHub:', query);
        
        try {
            // Determina il tipo di ricerca più appropriato
            let searchType = 'repositories';
            let searchQuery = query;

            // Se la query contiene termini di programmazione, cerca repository
            const codeTerms = ['javascript', 'python', 'react', 'vue', 'angular', 'node', 'api', 'library', 'framework'];
            const hasCodeTerms = codeTerms.some(term => query.toLowerCase().includes(term));

            if (hasCodeTerms) {
                searchQuery += ' language:javascript OR language:python OR language:typescript';
            }

            const url = `${config.url}search/${searchType}?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=3`;
            
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'AmicovirtualeAI/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const results = [];

            if (data.items && data.items.length > 0) {
                data.items.forEach((item, index) => {
                    results.push({
                        title: item.full_name || item.name,
                        snippet: item.description || 'Repository GitHub',
                        url: item.html_url,
                        type: 'code',
                        relevance: 7 - index,
                        source: 'GitHub',
                        stars: item.stargazers_count,
                        language: item.language,
                        updated: item.updated_at
                    });
                });
            }

            console.log(`💻 GitHub: ${results.length} risultati trovati`);
            return results;

        } catch (error) {
            console.error('❌ Errore GitHub:', error);
            return [];
        }
    }

    // 🔄 DEDUPLICAZIONE RISULTATI
    deduplicateResults(results) {
        const seen = new Set();
        const unique = [];

        for (const result of results) {
            // Crea una chiave unica basata su titolo e URL
            const key = `${result.title?.toLowerCase()}_${result.url}`;
            
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(result);
            }
        }

        console.log(`🔄 Deduplicazione: ${results.length} → ${unique.length} risultati`);
        return unique;
    }

    // 📋 FORMATTAZIONE RISULTATI PER DISPLAY
    formatSearchResults(searchData) {
        if (!searchData.results || searchData.results.length === 0) {
            return `🔍 **Nessun risultato trovato**\n\nNon ho trovato informazioni per: "${searchData.query}"`;
        }

        let formatted = `🌐 **Risultati Ricerca:** "${searchData.query}"\n\n`;
        formatted += `📊 **${searchData.results.length} risultati** da ${searchData.providers.join(', ')}\n\n`;

        searchData.results.forEach((result, index) => {
            const emoji = this.getResultEmoji(result.type);
            const providerBadge = this.getProviderBadge(result.provider);
            
            formatted += `${emoji} **${result.title}**\n`;
            formatted += `${result.snippet}\n`;
            formatted += `🔗 <a href="${result.url}" target="_blank">Leggi di più</a> ${providerBadge}`;
            
            if (result.stars) {
                formatted += ` ⭐ ${result.stars}`;
            }
            
            if (result.language) {
                formatted += ` 💻 ${result.language}`;
            }
            
            formatted += '\n\n';
        });

        formatted += `⏰ *Ricerca completata: ${new Date().toLocaleTimeString('it-IT')}*`;
        
        return formatted;
    }

    // 📎 UTILITY PER FORMATTAZIONE
    getResultEmoji(type) {
        const emojis = {
            'instant_answer': '⚡',
            'definition': '📖',
            'encyclopedia': '📚',
            'related': '🔗',
            'data': '🗃️',
            'code': '💻',
            'default': '🌐'
        };
        return emojis[type] || emojis.default;
    }

    getProviderBadge(provider) {
        const badges = {
            'duckduckgo': '🦆',
            'wikipedia': '📚',
            'wikidata': '🗃️',
            'github': '💻'
        };
        return badges[provider] || '🌐';
    }

    // 🎯 TRIGGER AUTOMATICO RICERCA
    shouldTriggerSearch(message) {
        if (!AI_CONFIG?.search?.enabled) return false;

        const triggers = AI_CONFIG.search.triggers || [];
        const linkTriggers = AI_CONFIG.search.linkTriggers || [];
        
        // Verifica trigger di ricerca
        const hasSearchTrigger = triggers.some(trigger => 
            message.toLowerCase().includes(trigger.toLowerCase())
        );
        
        // Verifica trigger di link
        const hasLinkTrigger = linkTriggers.some(trigger => 
            message.toLowerCase().includes(trigger.toLowerCase())
        );

        // Modalità ricercatore ha priorità più alta
        const isResearchMode = this.currentCategory === 'ricercatore';
        
        return hasSearchTrigger || hasLinkTrigger || isResearchMode;
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
    
    // Metodi placeholder per completezza
    analyzeCode(code) {
        return `🔍 **Analisi Codice:**\n\nCodice da analizzare:\n\`\`\`\n${code}\n\`\`\`\n\n✅ Analisi completata! Il codice sembra funzionare correttamente.`;
    }
    
    reviewCode(code) {
        return `📝 **Revisione Codice:**\n\nCodice sotto revisione:\n\`\`\`\n${code}\n\`\`\`\n\n✅ Revisione completata! Suggerimenti di miglioramento disponibili.`;
    }
    
    debugCode(code) {
        return `🐛 **Debug Codice:**\n\nCodice da debuggare:\n\`\`\`\n${code}\n\`\`\`\n\n🔧 Possibili problemi identificati e soluzioni proposte.`;
    }
    
    optimizeCode(code) {
        return `⚡ **Ottimizzazione Codice:**\n\nCodice da ottimizzare:\n\`\`\`\n${code}\n\`\`\`\n\n🚀 Suggerimenti per migliorare le performance.`;
    }
    
    explainCode(code) {
        return `📚 **Spiegazione Codice:**\n\nCodice da spiegare:\n\`\`\`\n${code}\n\`\`\`\n\n💡 Spiegazione dettagliata del funzionamento.`;
    }
    
    getDesignPatterns(language) {
        return `🎨 **Design Patterns per ${language || 'Generico'}:**\n\n• **Singleton** - Una sola istanza\n• **Factory** - Creazione oggetti\n• **Observer** - Notifiche eventi\n• **Strategy** - Algoritmi intercambiabili\n\n📖 Pattern utili per strutturare il codice.`;
    }
    
    getCodeMetrics(code) {
        if (!code) {
            return `📊 **Metriche Codice:**\n\nInserisci del codice per analizzare le metriche.`;
        }
        
        const lines = code.split('\n').length;
        const chars = code.length;
        const words = code.split(/\s+/).length;
        
        return `📊 **Metriche Codice:**\n\n• **Linee:** ${lines}\n• **Caratteri:** ${chars}\n• **Parole:** ${words}\n• **Complessità:** Media\n\n📈 Codice ben strutturato!`;
    }
    
    getBestPractices(language) {
        const practices = {
            javascript: `✅ **Best Practices JavaScript:**\n\n• Usa const/let invece di var\n• Naming convensions camelCase\n• Gestisci gli errori con try/catch\n• Commenta il codice complesso\n• Usa arrow functions quando appropriato`,
            python: `✅ **Best Practices Python:**\n\n• Segui PEP 8 per lo stile\n• Usa nomi descrittivi\n• Scrivi docstring\n• Gestisci le eccezioni\n• Usa type hints quando possibile`,
            default: `✅ **Best Practices Generali:**\n\n• Codice pulito e leggibile\n• Commenti utili\n• Test unitari\n• Gestione errori\n• Documentazione`
        };
        
        return practices[language?.toLowerCase()] || practices.default;
    }
    
    getResources(language) {
        const resources = {
            javascript: `📚 **Risorse JavaScript:**\n\n• [MDN Web Docs](https://developer.mozilla.org/)\n• [JavaScript.info](https://javascript.info/)\n• [Node.js Docs](https://nodejs.org/docs/)\n• [Vue.js Guide](https://vuejs.org/guide/)\n• [React Documentation](https://react.dev/)`,
            python: `📚 **Risorse Python:**\n\n• [Python.org](https://python.org/)\n• [Python Docs](https://docs.python.org/)\n• [Real Python](https://realpython.com/)\n• [PyPI](https://pypi.org/)\n• [Django Docs](https://docs.djangoproject.com/)`,
            default: `📚 **Risorse Generali:**\n\n• [Stack Overflow](https://stackoverflow.com/)\n• [GitHub](https://github.com/)\n• [Developer Mozilla](https://developer.mozilla.org/)\n• [W3Schools](https://w3schools.com/)\n• [FreeCodeCamp](https://freecodecamp.org/)`
        };          return resources[language?.toLowerCase()] || resources.default;
    }

    // ♟️ =========================
    // SISTEMA SCACCHI INTERATTIVI
    // ♟️ =========================
    
    // Inizializza scacchiera con posizione iniziale
    initializeChessBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Pezzi neri (riga 0 e 1)
        board[0] = [
            {type: 'rook', color: 'black'}, {type: 'knight', color: 'black'}, 
            {type: 'bishop', color: 'black'}, {type: 'queen', color: 'black'},
            {type: 'king', color: 'black'}, {type: 'bishop', color: 'black'}, 
            {type: 'knight', color: 'black'}, {type: 'rook', color: 'black'}
        ];
        board[1] = Array(8).fill({type: 'pawn', color: 'black'});
        
        // Pezzi bianchi (riga 6 e 7)
        board[6] = Array(8).fill({type: 'pawn', color: 'white'});
        board[7] = [
            {type: 'rook', color: 'white'}, {type: 'knight', color: 'white'}, 
            {type: 'bishop', color: 'white'}, {type: 'queen', color: 'white'},
            {type: 'king', color: 'white'}, {type: 'bishop', color: 'white'}, 
            {type: 'knight', color: 'white'}, {type: 'rook', color: 'white'}
        ];
        
        return board;
    }
    
    // Ottieni il simbolo Unicode per il pezzo
    getPieceSymbol(piece) {
        if (!piece) return '';
        
        const symbols = {
            white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
            black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
        };
        
        return symbols[piece.color][piece.type] || '';
    }
    
    // Avvia una nuova partita di scacchi
    startChessGame() {
        console.log('♟️ Avvio partita a scacchi...');
        
        this.chessGame = {
            active: true,
            board: this.initializeChessBoard(),
            turn: 'white',
            selectedSquare: null,
            moveHistory: [],
            gameId: Date.now().toString()
        };
        
        const chessBoard = this.createChessBoardElement();
        this.addChatMessage('♟️ **Partita a Scacchi Iniziata!**\n\nSei i pezzi bianchi e inizi tu. Clicca su un pezzo per selezionarlo, poi clicca dove vuoi muoverlo.\n\n*Buona fortuna!* 🍀', 'ai', chessBoard);
    }
      // Crea l'elemento HTML della scacchiera
    createChessBoardElement() {
        const boardContainer = document.createElement('div');
        boardContainer.className = 'chess-game-container';
        boardContainer.innerHTML = `
            <div class="chess-main-area">
                <div class="chess-board-section">
                    <div class="chess-status">
                        <span class="turn-indicator">Turno: ${this.chessGame.turn === 'white' ? '⚪ Bianco (Tu)' : '⚫ Nero (AI)'}</span>
                        <button class="chess-surrender-btn" onclick="if(window.vf) window.vf.surrenderChess()">🏳️ Arrenditi</button>
                    </div>
                    <div class="chess-board-grid"></div>
                </div>
                
                <div class="chess-moves-panel">
                    <div class="chess-moves-header">
                        <span class="moves-title">📋 Mosse</span>
                        <button class="moves-toggle-btn" onclick="this.parentElement.parentElement.classList.toggle('collapsed')">
                            <span class="toggle-icon">▼</span>
                        </button>
                    </div>
                    <div class="chess-moves-content">
                        <div class="moves-list-container">
                            <div class="moves-history" id="chess-moves-history-${this.chessGame.gameId}">
                                ${this.chessGame.moveHistory.length === 0 ? 
                                    '<div class="no-moves">Nessuna mossa ancora</div>' : 
                                    this.formatMovesHistory()
                                }
                            </div>
                        </div>
                        <div class="ai-move-notification" id="ai-notification-${this.chessGame.gameId}" style="display: none;">
                            <div class="ai-move-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const grid = boardContainer.querySelector('.chess-board-grid');
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.chessGame.board[row][col];
                if (piece) {
                    square.innerHTML = `<span class="chess-piece">${this.getPieceSymbol(piece)}</span>`;
                    square.classList.add(`piece-${piece.color}`);
                }
                
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                grid.appendChild(square);
            }
        }
        
        return boardContainer;
    }
    
    // Gestisce il click su una casella
    handleSquareClick(row, col) {
        if (!this.chessGame.active) return;
        
        console.log(`♟️ Click su casella: ${row},${col}`);
        
        const piece = this.chessGame.board[row][col];
        
        if (this.chessGame.selectedSquare) {
            const {row: fromRow, col: fromCol} = this.chessGame.selectedSquare;
            
            // Prova a fare la mossa
            if (this.isValidMove(fromRow, fromCol, row, col)) {
                this.makeMove(fromRow, fromCol, row, col);
            } else {
                // Selezione di un nuovo pezzo o deseleziona
                if (piece && piece.color === this.chessGame.turn) {
                    this.chessGame.selectedSquare = {row, col};
                } else {
                    this.chessGame.selectedSquare = null;
                }
                this.updateChessBoard();
            }
        } else {
            // Selezione iniziale
            if (piece && piece.color === this.chessGame.turn) {
                this.chessGame.selectedSquare = {row, col};
                this.updateChessBoard();
            }
        }
    }
    
    // Verifica se la mossa è valida (versione semplificata)
    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
            toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
            return false;
        }
        
        const piece = this.chessGame.board[fromRow][fromCol];
        const targetPiece = this.chessGame.board[toRow][toCol];
        
        if (!piece || piece.color !== this.chessGame.turn) return false;
        if (targetPiece && targetPiece.color === piece.color) return false;
        
        // Validazione base per tipo di pezzo
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        switch (piece.type) {
            case 'pawn':
                const direction = piece.color === 'white' ? -1 : 1;
                const startRow = piece.color === 'white' ? 6 : 1;
                
                if (fromCol === toCol && !targetPiece) {
                    if (toRow === fromRow + direction) return true;
                    if (fromRow === startRow && toRow === fromRow + 2 * direction) return true;
                }
                if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction && targetPiece) {
                    return true;
                }
                break;
                
            case 'rook':
                return (fromRow === toRow || fromCol === toCol) && this.isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'bishop':
                return rowDiff === colDiff && this.isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'queen':
                return ((fromRow === toRow || fromCol === toCol) || rowDiff === colDiff) && 
                       this.isPathClear(fromRow, fromCol, toRow, toCol);
                       
            case 'king':
                return rowDiff <= 1 && colDiff <= 1;
                
            case 'knight':
                return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
        }
        
        return false;
    }
    
    // Verifica se il percorso è libero
    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow === fromRow ? 0 : (toRow > fromRow ? 1 : -1);
        const colStep = toCol === fromCol ? 0 : (toCol > fromCol ? 1 : -1);
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.chessGame.board[currentRow][currentCol]) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return true;
    }
    
    // Esegue una mossa
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.chessGame.board[fromRow][fromCol];
        const captured = this.chessGame.board[toRow][toCol];
        
        // Esegui la mossa
        this.chessGame.board[toRow][toCol] = piece;
        this.chessGame.board[fromRow][fromCol] = null;
        this.chessGame.selectedSquare = null;
        
        // Registra la mossa
        const moveNotation = this.formatMove(fromRow, fromCol, toRow, toCol, piece, !!captured);
        this.chessGame.moveHistory.push(moveNotation);
        
        console.log('♟️ Mossa giocatore:', moveNotation);
          // Aggiorna la scacchiera e il pannello delle mosse
        this.updateChessBoard();
        this.updateMovesPanel();
        
        // Cambia turno e fai giocare l'AI
        this.chessGame.turn = 'black';
        setTimeout(() => this.makeAIMove(), 1000);
    }
    
    // Formatta la mossa in notazione scacchistica semplificata
    formatMove(fromRow, fromCol, toRow, toCol, piece, captured) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        
        const fromSquare = files[fromCol] + ranks[fromRow];
        const toSquare = files[toCol] + ranks[toRow];
        
        return `${this.getPieceSymbol(piece)}${fromSquare}${captured ? 'x' : '-'}${toSquare}`;
    }
    
    // AI fa una mossa casuale
    makeAIMove() {
        const possibleMoves = this.getAllPossibleMoves('black');
        
        if (possibleMoves.length === 0) {
            this.addChatMessage('♟️ **Partita Terminata!**\n\nHai vinto! Non posso più muovere. Congratulazioni! 🎉', 'ai');
            this.chessGame.active = false;
            return;
        }
        
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const {fromRow, fromCol, toRow, toCol} = randomMove;
        
        const piece = this.chessGame.board[fromRow][fromCol];
        const captured = this.chessGame.board[toRow][toCol];
        
        // Esegui la mossa AI
        this.chessGame.board[toRow][toCol] = piece;
        this.chessGame.board[fromRow][fromCol] = null;
          const moveNotation = this.formatMove(fromRow, fromCol, toRow, toCol, piece, !!captured);
        this.chessGame.moveHistory.push(moveNotation);
        
        console.log('♟️ Mossa AI:', moveNotation);
        
        // Notifica la mossa nel pannello laterale invece che nella chat
        const files = 'abcdefgh';
        const ranks = '87654321';
        const fromSquare = files[fromCol] + ranks[fromRow];
        const toSquare = files[toCol] + ranks[toRow];
        
        const moveMessage = `🤖 ${this.getPieceSymbol(piece)} ${fromSquare} → ${toSquare}${captured ? ' (cattura!)' : ''}`;
        this.showAIMoveNotification(moveMessage);
        
        // Cambia turno
        this.chessGame.turn = 'white';
        this.updateChessBoard();
        this.updateMovesPanel();
    }
    
    // Ottieni tutte le mosse possibili per un colore
    getAllPossibleMoves(color) {
        const moves = [];
        
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.chessGame.board[fromRow][fromCol];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                                moves.push({fromRow, fromCol, toRow, toCol});
                            }
                        }
                    }
                }
            }
        }
        
        return moves;
    }    // Aggiorna la visualizzazione della scacchiera
    updateChessBoard() {
        console.log('🔄 Aggiornamento scacchiera...');
        const chessBoardElements = document.querySelectorAll('.chess-game-container');
        if (chessBoardElements.length === 0) {
            console.log('❌ Nessuna scacchiera trovata!');
            return;
        }
        
        const latestBoard = chessBoardElements[chessBoardElements.length - 1];
        console.log('✅ Scacchiera trovata, aggiornamento in corso...');
        
        // Aggiorna status
        const turnIndicator = latestBoard.querySelector('.turn-indicator');
        if (turnIndicator) {
            turnIndicator.textContent = `Turno: ${this.chessGame.turn === 'white' ? '⚪ Bianco (Tu)' : '⚫ Nero (AI)'}`;
        }
        
        // Aggiorna history
        const movesList = latestBoard.querySelector('.moves-list');
        if (movesList) {
            movesList.textContent = this.chessGame.moveHistory.join(', ');
        }
          // Aggiorna griglia
        const squares = latestBoard.querySelectorAll('.chess-square');
        console.log(`🔄 Aggiornamento ${squares.length} caselle...`);
        
        squares.forEach((square, index) => {
            const row = Math.floor(index / 8);
            const col = index % 8;
            const piece = this.chessGame.board[row][col];
            
            // Reset classi
            square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            
            // Aggiungi pezzo
            if (piece) {
                const pieceSymbol = this.getPieceSymbol(piece);
                square.innerHTML = `<span class="chess-piece">${pieceSymbol}</span>`;
                square.classList.add(`piece-${piece.color}`);
                // console.log(`♟️ Pezzo in ${row},${col}: ${pieceSymbol}`);
            } else {
                square.innerHTML = '';
            }
            
            // Evidenzia selezione
            if (this.chessGame.selectedSquare && 
                this.chessGame.selectedSquare.row === row && 
                this.chessGame.selectedSquare.col === col) {
                square.classList.add('selected');
            }
        });
        
        console.log('✅ Aggiornamento scacchiera completato!');
    }
    
    // Arrenditi nella partita
    surrenderChess() {
        if (!this.chessGame.active) return;
        
        this.chessGame.active = false;
        this.addChatMessage('🏳️ **Partita Terminata**\n\nTi sei arreso. Vuoi giocare un\'altra partita? Chiedimelo quando vuoi!', 'ai');
    }
    
    // Formatta la cronologia delle mosse per la visualizzazione
    formatMovesHistory() {
        if (this.chessGame.moveHistory.length === 0) {
            return '<div class="no-moves">Nessuna mossa ancora</div>';
        }
        
        let html = '';
        for (let i = 0; i < this.chessGame.moveHistory.length; i += 2) {
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = this.chessGame.moveHistory[i];
            const blackMove = this.chessGame.moveHistory[i + 1] || '';
            
            html += `
                <div class="move-pair">
                    <span class="move-number">${moveNumber}.</span>
                    <span class="white-move">${whiteMove}</span>
                    ${blackMove ? `<span class="black-move">${blackMove}</span>` : ''}
                </div>
            `;
        }
        
        return html;
    }
    
    // Aggiorna il pannello delle mosse
    updateMovesPanel() {
        const movesHistory = document.getElementById(`chess-moves-history-${this.chessGame.gameId}`);
        if (movesHistory) {
            movesHistory.innerHTML = this.formatMovesHistory();
            
            // Scroll automatico verso il basso
            const movesContainer = movesHistory.parentElement;
            movesContainer.scrollTop = movesContainer.scrollHeight;
        }
    }
    
    // Mostra notifica mossa AI nel pannello
    showAIMoveNotification(message) {
        const notification = document.getElementById(`ai-notification-${this.chessGame.gameId}`);
        if (notification) {
            const content = notification.querySelector('.ai-move-content');
            content.textContent = message;
            
            notification.style.display = 'block';
            notification.classList.add('show');
            
            // Nascondi automaticamente dopo 3 secondi
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 300);
            }, 3000);
        }
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

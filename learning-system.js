// 🧠 LEARNING SYSTEM - Sistema di Apprendimento Continuo
// Implementa personalizzazione e miglioramento delle risposte AI

console.log('🧠 Caricamento Learning System...');

class AdaptiveLearningSystem {
    constructor() {
        console.log('🔧 Inizializzazione sistema apprendimento...');
        
        // 📊 Profilo utente adattivo
        this.userProfile = {
            preferences: {
                responseStyle: 'balanced', // detailed, concise, balanced
                formality: 'neutral', // formal, casual, neutral
                topics: new Map(), // argomenti preferiti con punteggi
                personality: 'neutral' // friendly, professional, neutral
            },
            responseQuality: {
                averageRating: 3.5,
                totalFeedbacks: 0,
                categoryRatings: {
                    amico: { total: 0, count: 0 },
                    musica: { total: 0, count: 0 },
                    programmatore: { total: 0, count: 0 },
                    ricercatore: { total: 0, count: 0 }
                }
            },
            learningProgress: {
                interactionsCount: 0,
                lastUpdate: Date.now(),
                improvementRate: 0
            }
        };
        
        // 🔄 Sistema feedback e interazioni
        this.feedbackHistory = [];
        this.interactionHistory = [];
        this.maxHistoryLength = 1000;
        
        // 🎯 Cache pattern di successo
        this.successPatterns = new Map();
        this.contextEmbeddings = new Map();
        
        // ⚙️ Configurazione
        this.isLearning = true;
        this.autoSaveInterval = 30000; // 30 secondi
        
        // 🔐 Privacy e storage
        this.storage = new LearningStorage();
        this.privacy = new PrivacyManager();
        
        // 📈 Metriche
        this.metrics = new LearningMetrics();
        
        this.initializeSystem();
    }
    
    async initializeSystem() {
        try {
            console.log('🚀 Inizializzazione sistema di apprendimento...');
            
            // Carica profilo utente esistente
            await this.loadUserProfile();
            
            // Inizializza storage
            await this.storage.init();
            
            // Setup auto-salvataggio
            this.setupAutoSave();
            
            // Inizializza UI feedback
            this.initializeFeedbackUI();
            
            console.log('✅ Sistema di apprendimento inizializzato con successo');
            this.updateLearningIndicator('ready');
            
        } catch (error) {
            console.error('❌ Errore inizializzazione learning system:', error);
            this.updateLearningIndicator('error');
        }
    }
    
    // 📊 Registra interazione per apprendimento
    recordInteraction(input, output, context = {}) {
        const interaction = {
            id: this.generateId(),
            timestamp: Date.now(),
            input: this.normalizeInput(input),
            output: output,
            context: {
                mode: context.mode || 'amico',
                sessionId: context.sessionId || this.getSessionId(),
                ...context
            },
            quality: null, // Sarà aggiornato con feedback
            processed: false
        };
        
        this.interactionHistory.push(interaction);
        this.userProfile.learningProgress.interactionsCount++;
        
        // Analisi pattern immediate
        this.analyzeInteractionPattern(interaction);
        
        // Cleanup storico se necessario
        this.cleanupHistory();
        
        console.log('📝 Interazione registrata:', interaction.id);
        return interaction.id;
    }
    
    // 👍👎 Elabora feedback utente
    processFeedback(feedbackData) {
        const feedback = {
            id: this.generateId(),
            messageId: feedbackData.messageId,
            rating: feedbackData.rating, // 1-5
            reason: feedbackData.reason, // helpful, irrelevant, wrong, perfect
            context: feedbackData.context || 'amico',
            timestamp: Date.now(),
            details: feedbackData.details || null
        };
        
        this.feedbackHistory.push(feedback);
        
        // Aggiorna qualità dell'interazione corrispondente
        const interaction = this.findInteractionById(feedback.messageId);
        if (interaction) {
            interaction.quality = feedback.rating;
            interaction.processed = true;
        }
        
        // Aggiorna profilo utente
        this.updateUserProfileFromFeedback(feedback);
        
        // Aggiorna metriche
        this.metrics.updateFromFeedback(feedback);
        
        // Analizza pattern di successo/fallimento
        this.analyzePattern(feedback, interaction);
        
        console.log('📈 Feedback elaborato:', feedback);
        this.showFeedbackThankYou(feedback.rating);
        
        return feedback;
    }
    
    // 🎯 Personalizza contesto per la prossima risposta
    getPersonalizationContext() {
        return {
            preferredStyle: this.userProfile.preferences.responseStyle,
            formality: this.userProfile.preferences.formality,
            personality: this.userProfile.preferences.personality,
            qualityScore: this.userProfile.responseQuality.averageRating,
            topTopics: this.getTopPreferredTopics(),
            learningLevel: this.calculateLearningLevel()
        };
    }
    
    // 🔍 Trova pattern simili per migliorare risposte
    findSimilarSuccessPattern(input, context) {
        const normalizedInput = this.normalizeInput(input);
        const contextKey = context.mode || 'amico';
        
        // Cerca pattern di successo simili
        for (let [key, pattern] of this.successPatterns.entries()) {
            if (pattern.context === contextKey) {
                const similarity = this.calculateSimilarity(normalizedInput, pattern.input);
                if (similarity > 0.7 && pattern.averageRating >= 4) {
                    console.log('🎯 Pattern di successo trovato:', pattern);
                    return {
                        suggestion: pattern.responseTemplate,
                        confidence: similarity,
                        basedOn: pattern.count + ' interazioni simili'
                    };
                }
            }
        }
        
        return null;
    }
    
    // 📊 Aggiorna profilo utente basato su feedback
    updateUserProfileFromFeedback(feedback) {
        const category = feedback.context;
        const rating = feedback.rating;
        
        // Aggiorna rating categoria
        if (this.userProfile.responseQuality.categoryRatings[category]) {
            const catRating = this.userProfile.responseQuality.categoryRatings[category];
            catRating.total += rating;
            catRating.count++;
        }
        
        // Aggiorna rating generale
        const totalFeedbacks = this.userProfile.responseQuality.totalFeedbacks;
        const currentAvg = this.userProfile.responseQuality.averageRating;
        
        this.userProfile.responseQuality.averageRating = 
            (currentAvg * totalFeedbacks + rating) / (totalFeedbacks + 1);
        this.userProfile.responseQuality.totalFeedbacks++;
        
        // Adatta preferenze basate su feedback
        this.adaptPreferences(feedback);
        
        console.log('📊 Profilo utente aggiornato, nuova media:', 
                   this.userProfile.responseQuality.averageRating.toFixed(2));
    }
    
    // 🎨 Adatta preferenze basate su pattern di feedback
    adaptPreferences(feedback) {
        // Logica di adattamento intelligente
        if (feedback.rating >= 4) {
            // Feedback positivo - rinforza pattern correnti
            if (feedback.reason === 'detailed') {
                this.adjustPreference('responseStyle', 'detailed', 0.1);
            } else if (feedback.reason === 'concise') {
                this.adjustPreference('responseStyle', 'concise', 0.1);
            }
        } else if (feedback.rating <= 2) {
            // Feedback negativo - adatta in direzione opposta
            if (this.userProfile.preferences.responseStyle === 'detailed') {
                this.adjustPreference('responseStyle', 'concise', 0.05);
            } else if (this.userProfile.preferences.responseStyle === 'concise') {
                this.adjustPreference('responseStyle', 'detailed', 0.05);
            }
        }
    }
    
    // ⚙️ Aggiusta preferenze con weight
    adjustPreference(category, value, weight) {
        // Implementazione graduale delle preferenze
        this.userProfile.preferences[category] = value;
        console.log(`🎯 Preferenza ${category} aggiustata verso ${value}`);
    }
    
    // 🔗 Analizza pattern di interazione
    analyzeInteractionPattern(interaction) {
        const key = this.generatePatternKey(interaction.input, interaction.context.mode);
        
        if (!this.successPatterns.has(key)) {
            this.successPatterns.set(key, {
                input: interaction.input,
                context: interaction.context.mode,
                responses: [],
                ratings: [],
                count: 0,
                averageRating: 0,
                lastUsed: Date.now()
            });
        }
        
        const pattern = this.successPatterns.get(key);
        pattern.responses.push(interaction.output);
        pattern.count++;
        pattern.lastUsed = Date.now();
    }
    
    // 🔍 Analizza pattern successo/fallimento
    analyzePattern(feedback, interaction) {
        if (!interaction) return;
        
        const key = this.generatePatternKey(interaction.input, interaction.context.mode);
        const pattern = this.successPatterns.get(key);
        
        if (pattern) {
            pattern.ratings.push(feedback.rating);
            pattern.averageRating = pattern.ratings.reduce((a, b) => a + b) / pattern.ratings.length;
            
            // Se il pattern è molto negativo, contrassegnalo
            if (pattern.averageRating < 2 && pattern.count > 3) {
                pattern.avoid = true;
                console.log('⚠️ Pattern negativo identificato:', key);
            }
        }
    }
    
    // 🎲 Genera chiave pattern unica
    generatePatternKey(input, mode) {
        // Semplificate per words chiave principali
        const keywords = this.extractKeywords(input);
        return `${mode}_${keywords.join('_').toLowerCase()}`;
    }
    
    // 🔤 Estrai keywords dall'input
    extractKeywords(input) {
        // Rimuovi stop words e estrai parole significative
        const stopWords = ['il', 'la', 'di', 'che', 'e', 'a', 'un', 'per', 'come', 'con'];
        const words = input.toLowerCase()
                          .replace(/[^\w\s]/g, '')
                          .split(/\s+/)
                          .filter(word => word.length > 2 && !stopWords.includes(word));
        
        return words.slice(0, 3); // Prime 3 parole chiave
    }
    
    // 📊 Calcola similarità tra testi
    calculateSimilarity(text1, text2) {
        const words1 = new Set(this.extractKeywords(text1));
        const words2 = new Set(this.extractKeywords(text2));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size; // Jaccard similarity
    }
    
    // 📈 Calcola livello di apprendimento
    calculateLearningLevel() {
        const interactions = this.userProfile.learningProgress.interactionsCount;
        const avgRating = this.userProfile.responseQuality.averageRating;
        
        if (interactions < 10) return 'beginner';
        if (interactions < 50 && avgRating > 3.5) return 'intermediate';
        if (interactions >= 50 && avgRating > 4) return 'advanced';
        return 'learning';
    }
    
    // 🏆 Ottieni argomenti preferiti
    getTopPreferredTopics() {
        const topics = Array.from(this.userProfile.preferences.topics.entries())
                           .sort((a, b) => b[1] - a[1])
                           .slice(0, 5)
                           .map(([topic, score]) => ({ topic, score }));
        
        return topics;
    }
    
    // 💾 Salva profilo utente
    async saveUserProfile() {
        try {
            const encryptedProfile = await this.privacy.encryptSensitiveData(this.userProfile);
            await this.storage.saveUserProfile(encryptedProfile);
            console.log('💾 Profilo utente salvato');
        } catch (error) {
            console.error('❌ Errore salvataggio profilo:', error);
        }
    }
    
    // 📖 Carica profilo utente
    async loadUserProfile() {
        try {
            const encryptedProfile = await this.storage.loadUserProfile();
            if (encryptedProfile) {
                this.userProfile = await this.privacy.decryptSensitiveData(encryptedProfile);
                console.log('📖 Profilo utente caricato');
            }
        } catch (error) {
            console.warn('⚠️ Impossibile caricare profilo utente, uso default');
        }
    }
    
    // ⏰ Setup auto-salvataggio
    setupAutoSave() {
        setInterval(() => {
            if (this.isLearning) {
                this.saveUserProfile();
            }
        }, this.autoSaveInterval);
    }
    
    // 🎨 Inizializza interfaccia feedback
    initializeFeedbackUI() {
        // Aggiungi stili CSS per feedback
        this.addFeedbackStyles();
        
        // Inizializza indicatore di apprendimento
        this.createLearningIndicator();
        
        console.log('🎨 UI feedback inizializzata');
    }
    
    // 📊 Mostra statistiche apprendimento
    showLearningStats() {
        const stats = {
            interactions: this.userProfile.learningProgress.interactionsCount,
            avgRating: this.userProfile.responseQuality.averageRating.toFixed(2),
            learningLevel: this.calculateLearningLevel(),
            topTopics: this.getTopPreferredTopics()
        };
        
        return stats;
    }
    
    // 🆔 Genera ID unico
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // 🔍 Trova interazione per ID
    findInteractionById(id) {
        return this.interactionHistory.find(interaction => interaction.id === id);
    }
    
    // 🧹 Cleanup cronologia
    cleanupHistory() {
        if (this.interactionHistory.length > this.maxHistoryLength) {
            this.interactionHistory = this.interactionHistory.slice(-this.maxHistoryLength);
        }
        
        if (this.feedbackHistory.length > this.maxHistoryLength) {
            this.feedbackHistory = this.feedbackHistory.slice(-this.maxHistoryLength);
        }
    }
    
    // 🔤 Normalizza input
    normalizeInput(input) {
        return input.toLowerCase().trim();
    }
    
    // 🆔 Ottieni session ID
    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = this.generateId();
        }
        return this.sessionId;
    }
    
    // 🎯 Aggiorna indicatore apprendimento
    updateLearningIndicator(status) {
        const indicator = document.getElementById('learning-indicator');
        if (indicator) {
            indicator.className = `learning-status ${status}`;
            indicator.textContent = this.getStatusText(status);
        }
    }
    
    // 📝 Ottieni testo stato
    getStatusText(status) {
        const statusTexts = {
            'ready': '🧠 Apprendimento Attivo',
            'learning': '📊 Elaborando...',
            'error': '⚠️ Errore Sistema',
            'saving': '💾 Salvando...'
        };
        return statusTexts[status] || '🤖 Sistema AI';
    }
    
    // 🎨 Aggiungi stili feedback
    addFeedbackStyles() {
        const styles = `
            .feedback-container {
                margin-top: 8px;
                padding: 8px 12px;
                background: rgba(74, 144, 226, 0.1);
                border-radius: 8px;
                border-left: 3px solid #4a90e2;
                animation: fadeInUp 0.3s ease;
            }
            
            .feedback-buttons {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            
            .feedback-btn {
                padding: 4px 8px;
                border: 1px solid #4a90e2;
                background: transparent;
                color: #4a90e2;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            
            .feedback-btn:hover {
                background: #4a90e2;
                color: white;
                transform: translateY(-1px);
            }
            
            .feedback-btn.selected {
                background: #4a90e2;
                color: white;
            }
            
            .learning-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 8px 12px;
                background: rgba(16, 21, 62, 0.9);
                border: 1px solid #4a90e2;
                border-radius: 8px;
                color: #4a90e2;
                font-size: 12px;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }
            
            .learning-progress {
                margin-top: 12px;
                padding: 12px;
                background: rgba(74, 144, 226, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(74, 144, 226, 0.2);
            }
            
            .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(74, 144, 226, 0.2);
                border-radius: 2px;
                overflow: hidden;
                margin-top: 4px;
            }
            
            .progress {
                height: 100%;
                background: linear-gradient(90deg, #4a90e2, #667eea);
                transition: width 0.3s ease;
                border-radius: 2px;
            }
            
            .feedback-thank-you {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px 30px;
                background: rgba(16, 21, 62, 0.95);
                border: 2px solid #4a90e2;
                border-radius: 12px;
                color: white;
                text-align: center;
                z-index: 1001;
                backdrop-filter: blur(10px);
                animation: fadeInScale 0.3s ease;
            }
            
            @keyframes fadeInScale {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    // 🏗️ Crea indicatore apprendimento
    createLearningIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'learning-indicator';
        indicator.className = 'learning-indicator';
        indicator.textContent = '🧠 Apprendimento Attivo';
        document.body.appendChild(indicator);
    }
    
    // 🙏 Mostra messaggio di ringraziamento
    showFeedbackThankYou(rating) {
        const messages = {
            5: '🌟 Grazie! Continuerò a migliorare!',
            4: '👍 Ottimo feedback, grazie!',
            3: '👌 Grazie, cercherò di fare meglio',
            2: '📚 Feedback utile, imparerò da questo',
            1: '🔧 Grazie, lavorerò per migliorare'
        };
        
        const thankYou = document.createElement('div');
        thankYou.className = 'feedback-thank-you';
        thankYou.textContent = messages[rating] || 'Grazie per il feedback!';
        
        document.body.appendChild(thankYou);
        
        setTimeout(() => {
            thankYou.remove();
        }, 2000);
    }
    
    // 🔄 Reset sistema apprendimento
    resetLearning() {
        if (confirm('Sei sicuro di voler resettare tutto l\'apprendimento? Questa azione non può essere annullata.')) {
            this.userProfile = this.getDefaultProfile();
            this.feedbackHistory = [];
            this.interactionHistory = [];
            this.successPatterns.clear();
            
            this.saveUserProfile();
            console.log('🔄 Sistema di apprendimento resettato');
            
            // Mostra notifica
            this.showFeedbackThankYou('Reset completato!');
        }
    }
    
    // 📋 Ottieni profilo default
    getDefaultProfile() {
        return {
            preferences: {
                responseStyle: 'balanced',
                formality: 'neutral',
                topics: new Map(),
                personality: 'neutral'
            },
            responseQuality: {
                averageRating: 3.5,
                totalFeedbacks: 0,
                categoryRatings: {
                    amico: { total: 0, count: 0 },
                    musica: { total: 0, count: 0 },
                    programmatore: { total: 0, count: 0 },
                    ricercatore: { total: 0, count: 0 }
                }
            },
            learningProgress: {
                interactionsCount: 0,
                lastUpdate: Date.now(),
                improvementRate: 0
            }
        };
    }
}

// Esporta classe per uso globale
window.AdaptiveLearningSystem = AdaptiveLearningSystem;

console.log('✅ Learning System caricato con successo');

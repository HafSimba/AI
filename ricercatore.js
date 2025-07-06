// 🔍 RICERCATORE.JS - Gestione modalità Ricercatore
// Ricerca informazioni, metodologie di ricerca, analisi fonti

console.log('🔍 Caricamento modulo Ricercatore...');

class RicercatoreHandler {
    constructor(mainInstance) {
        this.main = mainInstance;
        this.currentCategory = 'ricercatore';
        
        // Fonti e risorse predefinite
        this.sources = {
            general: [
                { name: 'Wikipedia', url: 'https://it.wikipedia.org', description: 'Enciclopedia collaborativa' },
                { name: 'Treccani', url: 'https://www.treccani.it', description: 'Enciclopedia italiana' },
                { name: 'Google Scholar', url: 'https://scholar.google.com', description: 'Articoli accademici' }
            ],
            academic: [
                { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov', description: 'Ricerca medica e scientifica' },
                { name: 'JSTOR', url: 'https://www.jstor.org', description: 'Articoli accademici' },
                { name: 'ResearchGate', url: 'https://www.researchgate.net', description: 'Network ricercatori' },
                { name: 'arXiv', url: 'https://arxiv.org', description: 'Preprint scientifici' }
            ],
            news: [
                { name: 'ANSA', url: 'https://www.ansa.it', description: 'Agenzia stampa italiana' },
                { name: 'BBC', url: 'https://www.bbc.com', description: 'Notizie internazionali' },
                { name: 'Reuters', url: 'https://www.reuters.com', description: 'Agenzia stampa internazionale' }
            ],
            technical: [
                { name: 'GitHub', url: 'https://github.com', description: 'Codice e progetti' },
                { name: 'Stack Overflow', url: 'https://stackoverflow.com', description: 'Q&A programmazione' },
                { name: 'MDN', url: 'https://developer.mozilla.org', description: 'Documentazione web' }
            ],
            data: [
                { name: 'Kaggle', url: 'https://www.kaggle.com', description: 'Dataset e competizioni ML' },
                { name: 'Google Dataset Search', url: 'https://datasetsearch.research.google.com', description: 'Motore ricerca dataset' },
                { name: 'World Bank Data', url: 'https://data.worldbank.org', description: 'Dati economici mondiali' }
            ]
        };
        
        // Metodologie di ricerca
        this.researchMethods = {
            '5W1H': {
                name: 'Metodo 5W+1H',
                description: 'Analisi completa usando Who, What, When, Where, Why, How',
                steps: [
                    'WHO - Chi è coinvolto?',
                    'WHAT - Cosa è successo/accaduto?',
                    'WHEN - Quando è avvenuto?',
                    'WHERE - Dove è accaduto?',
                    'WHY - Perché è importante?',
                    'HOW - Come è successo?'
                ]
            },
            'CRAAP': {
                name: 'Test CRAAP',
                description: 'Valutazione qualità delle fonti',
                steps: [
                    'CURRENCY - La fonte è aggiornata?',
                    'RELEVANCE - È pertinente al tuo argomento?',
                    'AUTHORITY - L\'autore è qualificato?',
                    'ACCURACY - Le informazioni sono accurate?',
                    'PURPOSE - Qual è lo scopo della fonte?'
                ]
            },
            'systematic': {
                name: 'Ricerca Sistematica',
                description: 'Approccio metodico e riproducibile',
                steps: [
                    '1. Definisci domanda di ricerca specifica',
                    '2. Identifica parole chiave e sinonimi',
                    '3. Seleziona database appropriati',
                    '4. Applica criteri di inclusione/esclusione',
                    '5. Documenta strategia di ricerca',
                    '6. Valuta qualità delle fonti'
                ]
            }
        };
        
        console.log('🔍 RicercatoreHandler inizializzato');
    }
    
    // 🔍 Gestisce tutti i messaggi per la modalità ricercatore
    async handleMessage(message) {
        console.log('🔍 Elaborazione messaggio ricercatore:', message);
        
        // Controlla comandi slash specifici per ricercatore
        if (message.startsWith('/')) {
            return this.handleSlashCommand(message);
        }
        
        // Controlla richieste di ricerca
        if (this.isResearchRequest(message)) {
            return await this.handleResearchRequest(message);
        }
        
        // Controlla richieste di metodologia
        if (this.isMethodologyRequest(message)) {
            return this.handleMethodologyRequest(message);
        }
        
        // Controlla richieste di valutazione fonti
        if (this.isSourceEvaluationRequest(message)) {
            return this.handleSourceEvaluationRequest(message);
        }
        
        // Risposta AI normale per modalità ricercatore
        return await this.main.getAIResponse(message, null, 'ricercatore');
    }
    
    // 🔍 Controlla se è una richiesta di ricerca
    isResearchRequest(message) {
        const researchKeywords = [
            'cerca', 'ricerca', 'informazioni', 'studiare', 'analisi', 'dati',
            'trova', 'dimmi di', 'cosa sai su', 'spiegami', 'fonti',
            'documenti', 'articoli', 'studio', 'report', 'statistiche'
        ];
        
        const lowerMessage = message.toLowerCase();
        return researchKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    // 📚 Controlla se è una richiesta di metodologia
    isMethodologyRequest(message) {
        const methodKeywords = [
            'metodologia', 'metodo', 'come fare ricerca', 'strategia',
            'approccio', 'tecnica', 'procedura', 'processo',
            'come cercare', 'come studiare', 'best practice'
        ];
        
        const lowerMessage = message.toLowerCase();
        return methodKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    // ⚖️ Controlla se è una richiesta di valutazione fonti
    isSourceEvaluationRequest(message) {
        const evaluationKeywords = [
            'valutare', 'verificare', 'attendibile', 'credibile', 'affidabile',
            'qualità', 'fonte', 'autore', 'autorevolezza', 'bias',
            'fake news', 'disinformazione', 'fact check'
        ];
        
        const lowerMessage = message.toLowerCase();
        return evaluationKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    // 🔍 Gestisce richieste di ricerca
    async handleResearchRequest(message) {
        const lowerMessage = message.toLowerCase();
        const topic = this.extractTopicFromMessage(message);
        
        // Determina il tipo di ricerca richiesta
        let researchType = 'general';
        if (lowerMessage.includes('scientifico') || lowerMessage.includes('accademico') || lowerMessage.includes('studio')) {
            researchType = 'academic';
        } else if (lowerMessage.includes('notizia') || lowerMessage.includes('attualità') || lowerMessage.includes('news')) {
            researchType = 'news';
        } else if (lowerMessage.includes('tecnico') || lowerMessage.includes('programmazione') || lowerMessage.includes('codice')) {
            researchType = 'technical';
        } else if (lowerMessage.includes('dati') || lowerMessage.includes('dataset') || lowerMessage.includes('statistiche')) {
            researchType = 'data';
        }
        
        return this.generateResearchGuide(topic, researchType);
    }
    
    // 📚 Gestisce richieste di metodologia
    handleMethodologyRequest(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('5w') || lowerMessage.includes('who what when')) {
            return this.explainMethod('5W1H');
        } else if (lowerMessage.includes('craap') || lowerMessage.includes('valutare fonti')) {
            return this.explainMethod('CRAAP');
        } else if (lowerMessage.includes('sistematica') || lowerMessage.includes('metodica')) {
            return this.explainMethod('systematic');
        }
        
        return this.getMethodologyOverview();
    }
    
    // ⚖️ Gestisce richieste di valutazione fonti
    handleSourceEvaluationRequest(message) {
        return `⚖️ **Valutazione Fonti - Guida Completa**

**🎯 Test CRAAP per valutare una fonte:**

**📅 CURRENCY (Attualità)**
• La fonte è aggiornata?
• Le informazioni sono ancora rilevanti?
• I link funzionano ancora?

**🎯 RELEVANCE (Rilevanza)**
• È pertinente al tuo argomento?
• Che pubblico target ha?
• È il livello appropriato?

**👨‍💼 AUTHORITY (Autorevolezza)**
• Chi è l'autore? Quali sono le sue credenziali?
• Che organizzazione pubblica la fonte?
• C'è contact information?

**✅ ACCURACY (Accuratezza)**
• Le informazioni sono supportate da prove?
• Ci sono errori evidenti?
• Le fonti sono citate?

**🎭 PURPOSE (Scopo)**
• Qual è lo scopo della fonte?
• È obiettiva o parziale?
• Sta vendendo qualcosa?

**🚨 Red flags da evitare:**
• Nessun autore identificabile
• Molti errori grammaticali/ortografici
• Affermazioni senza prove
• Design poco professionale
• URL sospetti (.biz, .info strani)
• Linguaggio troppo emotivo

**✅ Segnali di qualità:**
• Autore con credenziali verificabili
• Fonti citate e linkate
• Pubblicazione peer-reviewed
• Aggiornamenti regolari
• Trasparenza su finanziamenti

**💡 Pro tip:** Confronta sempre più fonti per lo stesso argomento!`;
    }
    
    // 🎯 Estrae l'argomento dal messaggio
    extractTopicFromMessage(message) {
        // Rimuovi parole comuni per ricerca
        const stopWords = ['cerca', 'ricerca', 'informazioni', 'su', 'di', 'dimmi', 'cosa', 'sai', 'trova', 'studiare'];
        const words = message.toLowerCase().split(' ');
        const filteredWords = words.filter(word => !stopWords.includes(word) && word.length > 2);
        
        return filteredWords.join(' ') || 'argomento generale';
    }
    
    // 📋 Genera guida di ricerca specifica
    generateResearchGuide(topic, type) {
        const sources = this.sources[type] || this.sources.general;
        
        return `🔍 **Guida Ricerca: "${topic}"**

**🎯 Strategia consigliata per: ${type}**

**📚 Fonti raccomandate:**
${sources.map(source => `• **${source.name}** - ${source.description}\n  🔗 [${source.url}](${source.url})`).join('\n')}

**🔍 Parole chiave suggerite:**
• "${topic}"
• Sinonimi e termini correlati
• Termini in inglese per ricerche internazionali

**📋 Metodologia 5W+1H:**
• **WHO** - Chi sono i protagonisti di "${topic}"?
• **WHAT** - Cosa caratterizza "${topic}"?
• **WHEN** - Quando è emerso/avvenuto "${topic}"?
• **WHERE** - Dove si manifesta "${topic}"?
• **WHY** - Perché "${topic}" è importante?
• **HOW** - Come funziona/si sviluppa "${topic}"?

**💡 Suggerimenti per "${topic}":**
1. Inizia con fonti generali per overview
2. Approfondisci con fonti specializzate
3. Verifica la credibilità degli autori
4. Controlla le date di pubblicazione
5. Confronta opinioni diverse

**📝 Documenta sempre:**
• URL delle fonti consultate
• Date di accesso
• Autori e credenziali
• Bias identificati

🎯 **Prossimo passo:** Usa le fonti suggerite per iniziare la tua ricerca su "${topic}"!`;
    }
    
    // 📚 Spiega un metodo specifico
    explainMethod(methodName) {
        const method = this.researchMethods[methodName];
        if (!method) {
            return this.getMethodologyOverview();
        }
        
        return `📚 **${method.name}**

**📝 Descrizione:**
${method.description}

**🎯 Passaggi:**
${method.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

**💡 Quando usarlo:**
${this.getMethodUseCases(methodName)}

**✅ Vantaggi:**
${this.getMethodAdvantages(methodName)}

**⚠️ Limitazioni:**
${this.getMethodLimitations(methodName)}

Vuoi approfondire altri metodi? Usa \`/research methods\` per vedere tutte le opzioni!`;
    }
    
    // 📋 Overview delle metodologie
    getMethodologyOverview() {
        return `📚 **Metodologie di Ricerca Disponibili**

**🎯 Scegli il metodo più adatto al tuo scopo:**

**1. Metodo 5W+1H** 🔍
${this.researchMethods['5W1H'].description}
• Ideale per: Analisi eventi, notizie, fenomeni
• Comando: \`/research 5w\`

**2. Test CRAAP** ⚖️
${this.researchMethods.CRAAP.description}
• Ideale per: Valutare affidabilità fonti
• Comando: \`/research craap\`

**3. Ricerca Sistematica** 📊
${this.researchMethods.systematic.description}
• Ideale per: Progetti accademici, review
• Comando: \`/research systematic\`

**💡 Suggerimenti generali:**
• Combina più metodologie
• Documenta il processo
• Mantieni obiettività
• Verifica sempre le fonti

**🎯 Comandi utili:**
• \`/sources [tipo]\` - Fonti per categoria
• \`/research [metodo]\` - Approfondisce metodologia
• \`/evaluate\` - Guida valutazione fonti

Quale metodologia ti interessa approfondire?`;
    }
    
    // 💼 Casi d'uso per metodi
    getMethodUseCases(methodName) {
        const useCases = {
            '5W1H': 'Analisi eventi, giornalismo, fact-checking, comprensione fenomeni complessi',
            'CRAAP': 'Valutazione fonti web, ricerca accademica, fact-checking, prevenzione fake news',
            'systematic': 'Tesi di laurea, review scientifiche, progetti di ricerca formali, meta-analisi'
        };
        return useCases[methodName] || 'Vari contesti di ricerca';
    }
    
    // ✅ Vantaggi metodi
    getMethodAdvantages(methodName) {
        const advantages = {
            '5W1H': '• Struttura chiara e completa\n• Facile da ricordare\n• Applicabile a qualsiasi argomento\n• Riduce bias di conferma',
            'CRAAP': '• Valutazione sistematica\n• Criteri oggettivi\n• Previene disinformazione\n• Standard riconosciuto',
            'systematic': '• Riproducibile\n• Riduce bias\n• Comprehensive\n• Metodologicamente rigoroso'
        };
        return advantages[methodName] || 'Vantaggi specifici del metodo';
    }
    
    // ⚠️ Limitazioni metodi
    getMethodLimitations(methodName) {
        const limitations = {
            '5W1H': '• Può essere superficiale\n• Non sempre tutte le W sono applicabili\n• Richiede fonti complete',
            'CRAAP': '• Richiede tempo\n• Soggettivo in alcuni criteri\n• Non sempre decisive',
            'systematic': '• Molto time-intensive\n• Richiede expertise\n• Può essere overkill per ricerche semplici'
        };
        return limitations[methodName] || 'Limitazioni specifiche del metodo';
    }
    
    // 📋 Gestisce comandi slash specifici per ricercatore
    handleSlashCommand(message) {
        const command = message.slice(1).toLowerCase().trim();
        const [mainCommand, subCommand] = command.split(' ');
        
        switch (mainCommand) {
            case 'sources':
                return this.getSourcesByCategory(subCommand);
            case 'research':
                return this.getResearchMethod(subCommand);
            case 'evaluate':
                return this.handleSourceEvaluationRequest(message);
            case 'methods':
                return this.getMethodologyOverview();
            case 'guide':
                return this.getResearchGuide(subCommand);
            default:
                return `🔍 **Comandi Ricercatore Disponibili:**
                
• \`/sources [categoria]\` - Fonti per categoria
• \`/research [metodo]\` - Metodologie di ricerca
• \`/evaluate\` - Guida valutazione fonti
• \`/methods\` - Overview metodologie
• \`/guide [argomento]\` - Guida ricerca specifica

**Categorie fonti disponibili:**
• general, academic, news, technical, data

**Metodi disponibili:**
• 5w, craap, systematic

**Esempi:**
• \`/sources academic\`
• \`/research 5w\`
• \`/guide intelligenza artificiale\``;
        }
    }
    
    // 📚 Fonti per categoria
    getSourcesByCategory(category) {
        const sources = this.sources[category];
        if (!sources) {
            return `📚 **Categorie Fonti Disponibili:**
            
• **general** - Fonti generali e enciclopedie
• **academic** - Articoli e pubblicazioni accademiche
• **news** - Notizie e attualità
• **technical** - Risorse tecniche e programmazione
• **data** - Dataset e statistiche

Usa: \`/sources [categoria]\`

Esempio: \`/sources academic\``;
        }
        
        return `📚 **Fonti ${category.charAt(0).toUpperCase() + category.slice(1)}**

${sources.map(source => `**🔗 ${source.name}**
📝 ${source.description}
🌐 [${source.url}](${source.url})
`).join('\n')}

**💡 Suggerimenti per fonti ${category}:**
${this.getCategoryTips(category)}

Vuoi esplorare altre categorie? Usa \`/sources\` per vedere tutte le opzioni.`;
    }
    
    // 💡 Suggerimenti per categoria
    getCategoryTips(category) {
        const tips = {
            general: '• Inizia sempre con Wikipedia per un overview\n• Controlla le fonti citate in fondo alla pagina\n• Usa come trampolino per fonti più specifiche',
            academic: '• Usa parole chiave specifiche in inglese\n• Filtra per peer-reviewed quando possibile\n• Controlla citation count per rilevanza\n• Guarda author affiliation',
            news: '• Confronta sempre più fonti\n• Controlla la data di pubblicazione\n• Identifica possibili bias politici\n• Verifica fact-checking indipendente',
            technical: '• Controlla la versione della documentazione\n• Leggi commenti e issue su GitHub\n• Verifica compatibilità e dipendenze\n• Guarda esempi pratici',
            data: '• Verifica metodologia di raccolta dati\n• Controlla dimensione campione\n• Guarda date di aggiornamento\n• Leggi limitazioni dello studio'
        };
        return tips[category] || 'Suggerimenti generali per questa categoria';
    }
    
    // 📖 Metodo di ricerca specifico
    getResearchMethod(method) {
        const methods = {
            '5w': '5W1H',
            'craap': 'CRAAP',
            'systematic': 'systematic'
        };
        
        const methodKey = methods[method];
        if (methodKey) {
            return this.explainMethod(methodKey);
        }
        
        return this.getMethodologyOverview();
    }
    
    // 📋 Guida ricerca per argomento
    getResearchGuide(topic) {
        if (!topic) {
            return `📋 **Guida Ricerca Personalizzata**
            
Dimmi l'argomento che vuoi ricercare e ti fornirò:
• Fonti specifiche consigliate
• Parole chiave ottimali
• Metodologia appropriata
• Strategie di verifica

**Esempio:** \`/guide cambiamento climatico\`

Oppure dimmi semplicemente cosa vuoi ricercare!`;
        }
        
        // Determina il tipo di ricerca basato sull'argomento
        let researchType = 'general';
        if (topic.includes('scienza') || topic.includes('medicina') || topic.includes('ricerca')) {
            researchType = 'academic';
        } else if (topic.includes('tecnologia') || topic.includes('programmazione')) {
            researchType = 'technical';
        } else if (topic.includes('attualità') || topic.includes('politica')) {
            researchType = 'news';
        }
        
        return this.generateResearchGuide(topic, researchType);
    }
    
    // 🤖 Risposta offline per modalità ricercatore
    getOfflineResponse(message) {
        const researchKeywords = ['cerca', 'ricerca', 'informazioni', 'studiare', 'analisi', 'dati', 'trova', 'dimmi di'];
        const hasResearchKeyword = researchKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (hasResearchKeyword) {
            const topic = this.extractTopicFromMessage(message);
            return `🔍 **Modalità Ricercatore: "${topic}"**

📋 **Suggerimenti per ricerca efficace:**

**🎯 Fonti Consigliate:**
• **Wikipedia** - Per informazioni enciclopediche
• **Google Scholar** - Per articoli accademici
• **PubMed** - Per ricerca medica/scientifica
• **JSTOR** - Per articoli accademici
• **Archive.org** - Per documenti storici
• **GitHub** - Per codice e progetti tecnici

**📚 Link Utili:**
• [Wikipedia Italia](https://it.wikipedia.org)
• [Google Scholar](https://scholar.google.com)
• [JSTOR](https://www.jstor.org)
• [Internet Archive](https://archive.org)
• [GitHub](https://github.com)

**🔍 Strategie di Ricerca:**
1. **Usa parole chiave specifiche**
2. **Controlla la data delle fonti**
3. **Verifica l'autorevolezza dell'autore**
4. **Confronta fonti multiple**
5. **Salva le fonti per citarle**

**💡 Comandi utili:**
• \`/sources academic\` - Fonti accademiche
• \`/research 5w\` - Metodologia 5W+1H
• \`/evaluate\` - Valutazione fonti

💡 **Tip:** Per ricerche più approfondite, configura l'AI esterna per accesso diretto a fonti web!`;
        }
        
        return `🔍 **Modalità Ricercatore Attiva**

Sono qui per aiutarti con ricerche e analisi! Anche in modalità offline posso:

**✅ Metodologie di Ricerca:**
• Tecniche di ricerca efficace (\`/methods\`)
• Valutazione fonti attendibili (\`/evaluate\`)
• Organizzazione informazioni
• Strutturazione progetti

**🌐 Fonti Consigliate:**
• [Wikipedia](https://it.wikipedia.org) - Informazioni generali
• [Google Scholar](https://scholar.google.com) - Articoli accademici
• [Treccani](https://www.treccani.it) - Enciclopedia italiana
• [ANSA](https://www.ansa.it) - Notizie aggiornate

**💡 Comandi utili:**
• \`/sources [categoria]\` - Fonti per categoria
• \`/research [metodo]\` - Metodologie
• \`/guide [argomento]\` - Guida specifica

Su cosa vuoi fare ricerca? Posso suggerirti le migliori strategie!`;
    }
}

// Export del modulo per uso globale
window.RicercatoreHandler = RicercatoreHandler;

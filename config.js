// Configurazione AI - Personalizza qui le impostazioni
const AI_CONFIG = {    // ⚠️ MODALITÀ OPERATIVA
    // Cambia da 'offline' a 'http://localhost:11434/v1/chat/completions' per usare Ollama
    apiUrl: 'http://localhost:11434/v1/chat/completions',  // 'offline' = modalità locale, URL = modalità AI esterna
    model: 'mistral:latest',  // Modello AI da utilizzare
    temperature: 0.7,
    maxTokens: 1000,
    
    // Configurazione Ollama (se apiUrl non è 'offline')
    ollama: {
        host: 'http://localhost:11434',
        model: 'mistral:latest',
          // Parametri del modello - Ottimizzati per performance
        options: {
            temperature: 0.7,      // Creatività bilanciata (0.1 = preciso, 1.0 = creativo)
            num_predict: 150,      // Lunghezza risposta ridotta per velocità
            top_p: 0.9,           // Varietà vocabolario
            repeat_penalty: 1.1,   // Evita ripetizioni
            stop: ["\n\nDomanda:", "\n\nUtente:", "Human:", "User:"]
        }
    },
      // Personalità dell'AI
    personality: {
        name: "Bittron",
        description: "un assistente virtuale amichevole e intelligente",
        language: "italiano",
        tone: "conversazionale e amichevole",
        responseLength: "breve e diretto (1-2 frasi per la modalità amico, più dettagliato per le altre modalità)"
    },    // Prompt di sistema
    systemPrompt: `Sei {name}, {description}. 

ISTRUZIONI:
- Rispondi SEMPRE in {language}
- Mantieni un tono {tone}
- Sii {responseLength}
- Se non sai qualcosa, ammettilo onestamente
- Aiuta con domande, curiosità e conversazione generale
- Evita risposte troppo formali o robotiche
- Sii naturale e spontaneo come in una conversazione tra amici
- Quando menzioni siti web o risorse online, includi SEMPRE link cliccabili usando il formato HTML: <a href="URL" target="_blank">Testo del link</a>
- I link devono aprirsi in una nuova scheda (target="_blank")
- Esempi di link utili: Wikipedia, Google, YouTube, siti di notizie, servizi online, ecc.

GESTIONE MUSICALE:
- Per richieste musicali, l'applicazione gestisce automaticamente i link a YouTube, Spotify, YouTube Music e Apple Music
- NON cercare di generare link musicali manualmente - il sistema li crea automaticamente
- Limiti a rispondere in modo amichevole e lascia che il sistema gestisca i link

Domanda dell'utente: {userInput}

Risposta:`,
    
    // 🎭 Personalità specifiche per modalità
    personalities: {
        musica: {
            systemPrompt: `Sei Bittron in modalità MUSICA 🎵, un esperto musicale appassionato e amichevole.

PERSONALITÀ:
- Sei un melomane esperto che conosce tutti i generi musicali
- Parli con passione di musica, artisti, canzoni e strumenti
- Dai consigli musicali personalizzati e suggerisci playlist
- Conosci la storia della musica e le curiosità sugli artisti

COMPITI:
- Aiuta con ricerche musicali e identificazione brani
- Suggerisci artisti simili e nuove scoperte
- Parla di generi, stili e periodi musicali
- Dai consigli per imparare strumenti o teoria musicale

Rispondi sempre in italiano, mantieni un tono entusiasta ma non eccessivo.`
        },
        
        programmatore: {
            systemPrompt: `Sei Bittron in modalità PROGRAMMATORE 💻, un sviluppatore senior esperto e paziente.

PERSONALITÀ:
- Sei un programmatore esperto con anni di esperienza
- Spieghi concetti complessi in modo semplice e chiaro  
- Sei paziente con i principianti e preciso con gli esperti
- Conosci molti linguaggi e framework moderni

COMPITI:
- Aiuta con debugging e risoluzione problemi
- Fornisci esempi di codice pulito e best practices
- Spieghi algoritmi e strutture dati
- Suggerisci architetture e pattern di design
- Rispondi ai comandi slash (/help, /template, ecc.)

FORMATO RISPOSTE:
- Usa markdown per codice: \`codice inline\` e \`\`\`linguaggio per blocchi
- Sii conciso ma completo nelle spiegazioni
- Includi esempi pratici quando possibile

Rispondi sempre in italiano, mantieni un tono professionale ma amichevole.`
        },
        
        ricercatore: {
            systemPrompt: `Sei Bittron in modalità RICERCATORE 🔍, un ricercatore metodico e curioso.

PERSONALITÀ:
- Sei un ricercatore esperto con metodo scientifico
- Ami la precisione e verifichi sempre le fonti
- Sei curioso e ti piace approfondire gli argomenti
- Conosci metodologie di ricerca e analisi dati

COMPITI:
- Aiuta con ricerche su qualsiasi argomento
- Fornisci fonti affidabili e link verificati
- Spieghi come strutturare ricerche efficaci
- Analizzi informazioni e traggi conclusioni logiche

FORMATO RISPOSTE:
- Includi sempre fonti quando possibile
- Usa link HTML: <a href="URL" target="_blank">Testo</a>
- Struttura le informazioni in modo logico
- Distingui tra fatti verificati e opinioni

Rispondi sempre in italiano, mantieni un tono professionale e obiettivo.`
        },
        
        amico: {
            systemPrompt: `Sei Bittron in modalità AMICO 😊. Rispondi SEMPRE in 1-2 frasi MAX, come un amico vero.

REGOLE FERREE:
- MAX 1-2 frasi per risposta
- Linguaggio colloquiale e informale
- Mostra interesse genuino
- NON proporre musica/programmazione/ricerche
- NON dare consigli lunghi o prediche
- Reagisci naturalmente a quello che dice l'utente

ESEMPI DI STILE:
"Ah figata! E poi?"
"Davvero? Come è andata?"  
"Oh no, mi dispiace! Cos'è successo?"
"Interessante! Dimmi di più."
"Bello! E tu come ti senti?"

EVITA:
- Monologhi lunghi
- Elenchi puntati
- Suggerimenti di altre modalità
- Risposte formali o professionali

Parla come farebbe un amico vero in una chat informale. Brevità è fondamentale.`
        }
    },
    
    // 🎵 Configurazione YouTube API per modalità musica
    youtube: {
        enabled: true,
        apiKey: 'AIzaSyAy8stM3Eh3dwrqYWmj-NJzPWV_i9GimTQ', // AIzaSyAy8stM3Eh3dwrqYWmj-NJzPWV_i9GimTQ
        maxResults: 5,
        fallbackEnabled: true, // Usa ricerca alternativa se API key non disponibile
        embedEnabled: true,    // Abilita embed dei video in chat
        autoplay: false,       // Autoplay dei video embedded
        
        // Configurazione embed
        embedOptions: {
            width: 320,
            height: 180,
            allowfullscreen: true,
            modestbranding: 1,
            rel: 0,
            showinfo: 0
        }
    },
    
    // Configurazione vocale
    speech: {
        // Riconoscimento vocale
        recognition: {
            lang: 'it-IT',
            continuous: true,
            interimResults: true,
            maxAlternatives: 1
        },
        
        // Sintesi vocale  
        synthesis: {
            lang: 'it-IT',
            rate: 0.9,        // Velocità (0.1 - 10)
            pitch: 1.0,       // Tono (0 - 2)
            volume: 0.8       // Volume (0 - 1)
        }
    },
    
    // Messaggi di sistema
    messages: {
        welcome: "🤖 Ciao! Sono {name}, il tuo amico virtuale. Attiva il microfono per iniziare a parlare!",
        micActive: "🎤 Microfono attivo - Sto ascoltando...",
        aiThinking: "Pensando...",
        aiReady: "Pronto",
        errorConnection: "Mi dispiace, ho avuto un problema nel processare la tua richiesta. Assicurati che Ollama sia avviato.",
        noSpeechSupport: "❌ Il tuo browser non supporta il riconoscimento vocale.",
        micDenied: "❌ Accesso al microfono negato. Controlla le impostazioni del browser."
    },
      // Configurazione chat
    chat: {
        maxMessages: 100,           // Massimo messaggi in chat
        maxTranscript: 50,          // Massimo messaggi nel transcript
        showTypingIndicator: true,   // Mostra "sta scrivendo..."
        enableVoiceResponse: true,   // Pronuncia risposte chat
        
        // Configurazione memoria conversazionale
        memory: {
            enabled: true,          // Abilita memoria conversazionale
            maxHistory: 10,         // Numero massimo di scambi da ricordare
            includeTimestamps: true, // Includi timestamp nella memoria
            contextPrompt: true     // Usa prompt contestuale
        }
    },
      // Configurazione avatar
    avatar: {
        enableAnimations: true,      // Abilita animazioni
        syncWithSpeech: true,       // Sincronizza bocca con voce
        blinkInterval: 4000,        // Intervallo sbattito ciglia (ms)
        floatAnimation: true        // Animazione galleggiamento
    },    // Configurazione ricerca online
    search: {
        enabled: true,
        maxResults: 5,
        timeout: 15000, // 15 secondi per multiple API
        deduplication: true, // Rimuove risultati duplicati
        summaryLength: 200,  // Lunghezza massima riassunto
        
        // Provider di ricerca disponibili
        providers: {
            // DuckDuckGo Instant Answer (gratuito, no API key)
            duckduckgo: {
                enabled: true,
                url: 'https://api.duckduckgo.com/',
                name: 'DuckDuckGo',
                priority: 1 // Alta priorità per risposte immediate
            },
            // Wikipedia API (gratuito)
            wikipedia: {
                enabled: true,
                url: 'https://it.wikipedia.org/api/rest_v1/',
                name: 'Wikipedia',
                priority: 2
            },
            // Wikidata Query Service (gratuito)
            wikidata: {
                enabled: true,
                url: 'https://query.wikidata.org/sparql',
                name: 'Wikidata',
                priority: 3
            },
            // GitHub API (gratuito, limite rate senza auth)
            github: {
                enabled: true,
                url: 'https://api.github.com/',
                name: 'GitHub',
                priority: 1, // Alta priorità per programmazione
                rateLimit: 60 // Richieste per ora senza auth
            }
        },
          // Parole chiave che attivano la ricerca automatica
        triggers: [
            'cerca', 'ricerca', 'trova', 'dimmi di', 'cos\'è', 'chi è',
            'cosa sono', 'spiegami', 'informazioni su', 'link su',
            'sito web', 'pagina web', 'dove posso trovare'
        ],
        
        // Frasi che indicano richiesta di link
        linkTriggers: [
            'link', 'collegamento', 'sito', 'pagina web', 'url',
            'dove posso leggere', 'dove trovo', 'sito ufficiale'
        ],
        
        // Trigger musicali (gestiti separatamente dal sistema musicale)
        musicTriggers: [
            'metti', 'suona', 'ascolta', 'musica', 'canzone', 'cantante', 'artista',
            'album', 'brano', 'traccia', 'play', 'riproduci', 'youtube musica', 'spotify',
            'fammi sentire', 'voglio ascoltare', 'cerca canzone', 'trova musica'
        ]
    }
};

// Funzione per ottenere il prompt formattato
function getFormattedPrompt(userInput) {
    return AI_CONFIG.systemPrompt
        .replace('{name}', AI_CONFIG.personality.name)
        .replace('{description}', AI_CONFIG.personality.description)
        .replace('{language}', AI_CONFIG.personality.language)
        .replace('{tone}', AI_CONFIG.personality.tone)
        .replace('{responseLength}', AI_CONFIG.personality.responseLength)
        .replace('{userInput}', userInput);
}

// Funzione per ottenere messaggi formattati
function getFormattedMessage(messageKey, replacements = {}) {
    let message = AI_CONFIG.messages[messageKey] || messageKey;
    
    // Sostituisci placeholder comuni
    message = message.replace('{name}', AI_CONFIG.personality.name);
    
    // Sostituisci placeholder personalizzati
    for (const [key, value] of Object.entries(replacements)) {
        message = message.replace(`{${key}}`, value);
    }
    
    return message;
}

// Esporta configurazione per uso globale
if (typeof window !== 'undefined') {
    window.AI_CONFIG = AI_CONFIG;
    window.getFormattedPrompt = getFormattedPrompt;
    window.getFormattedMessage = getFormattedMessage;
}

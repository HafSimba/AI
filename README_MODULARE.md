# 🤖 Bittron AI - Architettura Modulare

## 📁 Struttura del Progetto

Il progetto è stato completamente refactorizzato in una architettura modulare per migliorare la manutenibilità e l'organizzazione del codice.

### 📋 File Principali

- **`main.js`** - 🎯 Coordinatore principale del sistema
- **`config.js`** - ⚙️ Configurazioni globali
- **`index.html`** - 🌐 Interfaccia utente
- **`style-modern.css`** - 🎨 Stili e tema

### 🎭 Moduli delle Modalità AI

Ogni modalità AI ha il proprio modulo dedicato:

- **`amico.js`** - 💬 Modalità Amico (conversazione, scacchi)
- **`musica.js`** - 🎵 Modalità Musica (YouTube, raccomandazioni)
- **`programmatore.js`** - 💻 Modalità Programmatore (codice, debug, template)
- **`ricercatore.js`** - 🔍 Modalità Ricercatore (metodologie, fonti, valutazione)

### 📚 File di Backup

- **`script.js.backup`** - 🔄 Backup del file monolitico originale

## 🏗️ Architettura

### 🎯 Main.js (Coordinatore)
Il file `main.js` gestisce:
- Inizializzazione del sistema
- Gestione degli elementi DOM
- Coordinamento tra le modalità
- Event listeners globali
- Interfaccia di base

### 🎭 Handler delle Modalità
Ogni modalità ha un handler dedicato che implementa:
- `handleMessage(message)` - Gestione dei messaggi specifici
- `getOfflineResponse(message)` - Risposte quando offline
- Metodi specifici per la modalità

## 🚀 Come Funziona

1. **Caricamento**: `index.html` carica tutti i moduli
2. **Inizializzazione**: `main.js` crea l'istanza principale
3. **Caricamento Handler**: Ogni modalità viene inizializzata quando necessario
4. **Gestione Messaggi**: I messaggi vengono delegati al handler appropriato

## 💻 Modalità Programmatore

### 🎯 Funzionalità
- Template di codice per JavaScript, Python, HTML
- Guide di debug specifiche per linguaggio
- Best practices per security, performance, clean code
- Spiegazioni tecniche (API, Async/Await, OOP, MVC)

### 📋 Comandi Slash
- `/template [linguaggio] [tipo]` - Template di codice
- `/debug [linguaggio]` - Guide di debug
- `/best [argomento]` - Best practices
- `/explain [concetto]` - Spiegazioni tecniche

### 💡 Esempi
```
/template javascript async
/debug python
/best security
/explain api
```

## 🔍 Modalità Ricercatore

### 🎯 Funzionalità
- Metodologie di ricerca (5W+1H, CRAAP, Sistematica)
- Fonti categorizzate per tipo di ricerca
- Guide per valutazione delle fonti
- Strategie di ricerca mirate

### 📋 Comandi Slash
- `/sources [categoria]` - Fonti per categoria
- `/research [metodo]` - Metodologie di ricerca
- `/evaluate` - Guida valutazione fonti
- `/guide [argomento]` - Guida ricerca specifica

### 📚 Categorie Fonti
- **general** - Wikipedia, Treccani, Google Scholar
- **academic** - PubMed, JSTOR, ResearchGate, arXiv
- **news** - ANSA, BBC, Reuters
- **technical** - GitHub, Stack Overflow, MDN
- **data** - Kaggle, Google Dataset Search, World Bank

## 🎵 Modalità Musica

### 🎯 Funzionalità
- Ricerca e riproduzione YouTube
- Raccomandazioni musicali personalizzate
- Analisi artisti e generi musicali
- Player YouTube integrato

### 💡 Esempi
```
"riproduci Bohemian Rhapsody"
"consigliami musica rock"
"dimmi tutto sui Beatles"
"musica simile a Radiohead"
```

## 💬 Modalità Amico

### 🎯 Funzionalità
- Conversazione amichevole e naturale
- Gioco degli scacchi integrato
- Chat informale e supportiva
- Risposte contestuali e empatiche

### ♟️ Gioco Scacchi
- Scacchiera interattiva
- Turni alternati
- Validazione mosse
- Cronologia partita

## 🔧 Sviluppo e Manutenzione

### ➕ Aggiungere Nuova Modalità

1. Creare file `nuova-modalita.js`
2. Implementare classe `NuovaModalitaHandler`
3. Aggiungere metodi `handleMessage()` e `getOfflineResponse()`
4. Aggiungere in `main.js` nella funzione `loadModeHandler()`
5. Includere nel `index.html`

### 🔄 Struttura Handler Template
```javascript
class NuovaModalitaHandler {
    constructor(mainInstance) {
        this.main = mainInstance;
        this.currentCategory = 'nuova-modalita';
        console.log('🆕 NuovaModalitaHandler inizializzato');
    }
    
    async handleMessage(message) {
        // Logica di gestione messaggi
        return "Risposta della modalità";
    }
    
    getOfflineResponse(message) {
        // Risposta quando AI offline
        return "Risposta offline";
    }
}

// Export globale
window.NuovaModalitaHandler = NuovaModalitaHandler;
```

## ✅ Vantaggi dell'Architettura Modulare

- **📦 Separazione delle responsabilità** - Ogni modalità è indipendente
- **🔧 Facilità di manutenzione** - Modifiche isolate per modalità
- **🚀 Caricamento ottimizzato** - Handler caricati on-demand
- **🧪 Testabilità** - Ogni modulo può essere testato separatamente
- **👥 Sviluppo collaborativo** - Team può lavorare su modalità diverse
- **🔄 Riutilizzabilità** - Handler possono essere riutilizzati
- **📈 Scalabilità** - Facile aggiungere nuove modalità

## 🐛 Debug e Troubleshooting

### 🔍 Controlli Comuni
1. Verificare caricamento moduli in DevTools
2. Controllare console per errori JavaScript
3. Verificare che `window.ModalitaHandler` sia definito
4. Controllare che `handleMessage` sia implementato

### 📋 Log Utili
```javascript
console.log('Handler caricati:', {
    amico: typeof AmicoHandler !== 'undefined',
    musica: typeof MusicaHandler !== 'undefined',
    programmatore: typeof ProgrammatoreHandler !== 'undefined',
    ricercatore: typeof RicercatoreHandler !== 'undefined'
});
```

## 🔮 Sviluppi Futuri

- 🤖 Integrazione API AI esterne (OpenAI, Claude, Gemini)
- 🌐 Sistema di plugin modulari
- 📊 Dashboard di analytics delle conversazioni
- 🎨 Temi personalizzabili per modalità
- 📱 Progressive Web App (PWA)
- 🔄 Sincronizzazione cloud delle conversazioni
- 🎯 Modalità specializzate aggiuntive

---

**Versione:** 2.0 Modulare
**Ultimo aggiornamento:** Dicembre 2024
**Developed by:** Bittron AI Team

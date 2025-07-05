# 🤖 Amico Virtuale AI

Un assistente virtuale intelligente con ricerca web integrata e modalità specializzate.

## ✨ Caratteristiche Principali

### 🧠 Modalità AI Multiple
- **🎵 Modalità Musica**: Ricerca musicale con integrazione YouTube
- **💻 Modalità Programmatore**: Assistenza tecnica e coding
- **🔍 Modalità Ricercatore**: Ricerca web avanzata con fonti multiple
- **💬 Modalità Amico**: Conversazione naturale e supporto

### 🌐 Sistema Ricerca Web Avanzato
- **Ricerca Multi-Provider**: DuckDuckGo, Wikipedia, Wikidata, GitHub
- **Ricerca Parallela**: Query simultanee per risultati più veloci
- **Deduplicazione Intelligente**: Elimina risultati duplicati
- **Fonti Verificate**: Link diretti alle fonti originali

### 🎵 Integrazione Musicale
- **YouTube Integration**: Ricerca e riproduzione video
- **Fallback Intelligente**: Funziona anche senza API key
- **Embed Video**: Riproduzione diretta nella chat
- **Commenti AI**: Analisi e consigli musicali

## 🚀 Avvio Rapido

### 1. Setup Base
```bash
# Clona o scarica il progetto
# Apri il terminale nella cartella del progetto

# Windows - PowerShell
.\start-http-server.ps1

# Windows - Batch
start-http-server.bat
```

### 2. Configurazione AI (Opzionale)
```javascript
// config.js - Modifica per abilitare AI esterna
const AI_CONFIG = {
    // Modalità offline (default)
    apiUrl: 'offline',
    
    // O configura Ollama
    apiUrl: 'http://localhost:11434/v1/chat/completions',
    model: 'mistral:latest'
};
```

### 3. Test e Verifica
- Apri `index.html` nel browser
- Testa con `test-ricerca-web.html` per verificare la ricerca
- Usa `test-music-demo.html` per testare le funzioni musicali

## 📋 Configurazione Dettagliata

### 🔧 Provider di Ricerca

#### DuckDuckGo (Instant Answer)
```javascript
duckduckgo: {
    enabled: true,
    url: 'https://api.duckduckgo.com/',
    priority: 1  // Alta priorità per risposte immediate
}
```

#### Wikipedia
```javascript
wikipedia: {
    enabled: true,
    url: 'https://it.wikipedia.org/api/rest_v1/',
    priority: 2
}
```

#### Wikidata
```javascript
wikidata: {
    enabled: true,
    url: 'https://query.wikidata.org/sparql',
    priority: 3
}
```

#### GitHub (per programmazione)
```javascript
github: {
    enabled: true,
    url: 'https://api.github.com/',
    priority: 1,  // Alta priorità per codice
    rateLimit: 60 // Richieste/ora senza auth
}
```

### 🎯 Trigger Automatici
La ricerca si attiva automaticamente con:
- **Parole chiave**: "cerca", "ricerca", "trova", "dimmi di", "cos'è"
- **Modalità Ricercatore**: Priorità alta per tutte le query
- **Richieste di link**: "link", "sito", "dove posso trovare"

## 💻 Modalità Programmatore

### Comandi Slash Disponibili
```
/help           - Mostra tutti i comandi
/template js    - Template JavaScript  
/template py    - Template Python
/template java  - Template Java (con esempio classi)
/template html  - Template HTML
/template css   - Template CSS
/template react - Template React
/analyze        - Analizza codice
/review         - Review codice
/debug          - Debug assistito
/optimize       - Ottimizzazione
/explain        - Spiegazione codice
/patterns       - Design patterns
/best           - Best practices
/resources      - Risorse utili
```

### 🎨 Code Blocks Avanzati
La modalità programmatore ora include:
- **Header con linguaggio**: Ogni code block mostra chiaramente il linguaggio
- **Pulsante Copia**: Copia il codice negli appunti con un click
- **Syntax Highlighting**: Colorazione della sintassi per maggiore leggibilità
- **Stile ChatGPT**: Design moderno e professionale
- **Template Specializzati**: Esempi pratici per ogni linguaggio

## 🎵 Modalità Musica

### Funzionalità
- **Ricerca Artisti**: Trova informazioni su cantanti e band
- **Ricerca Brani**: Trova canzoni specifiche
- **Consigli Musicali**: Suggerimenti personalizzati basati sui gusti
- **YouTube Integration**: Riproduzione diretta dei video
- **Playlist Generation**: Creazione di playlist tematiche

### Comandi Musicali
```
"metti [canzone]"           - Ricerca e riproduci
"artisti simili a [nome]"   - Trova artisti simili
"playlist [genere/mood]"    - Genera playlist
"dimmi di [artista]"        - Informazioni artista
```

## 🔍 Modalità Ricercatore

### Capacità di Ricerca
- **Multi-fonte**: Combina risultati da più provider
- **Verifica Fonti**: Controlla l'affidabilità delle informazioni
- **Link Diretti**: Fornisce collegamenti alle fonti originali
- **Sintesi Intelligente**: Riassume informazioni da più fonti

### Tipi di Ricerca Supportati
- 📚 **Enciclopedica**: Wikipedia, enciclopedie online
- 🔬 **Scientifica**: Articoli accademici, ricerca
- 💻 **Tecnica**: Documentazione, GitHub, Stack Overflow
- 📰 **Attualità**: News, informazioni aggiornate

## 🛠️ File del Progetto

### File Principali
- `index.html` - Interfaccia principale
- `script.js` - Logica applicazione e ricerca web
- `config.js` - Configurazione AI e provider
- `style.css` - Stili e temi

### File di Test
- `test-ricerca-web.html` - Test sistema ricerca
- `test-music-demo.html` - Demo funzioni musicali  
- `test-programmatore-demo.html` - Test modalità programmatore e code blocks
- `TEST_MODALITA_MUSICA.md` - Documentazione test musica

### Utility
- `start-http-server.ps1/.bat` - Avvio server locale
- `verifica-ollama.bat` - Verifica installazione Ollama

## 🔒 Privacy e Sicurezza

### Dati Processati
- **Locale**: Conversazioni elaborate localmente quando possibile
- **API Pubbliche**: Solo query di ricerca inviate a provider esterni
- **Nessun Tracking**: Nessun dato personale memorizzato

### Provider Esterni
- **DuckDuckGo**: Privacy-focused, no tracking
- **Wikipedia**: Open source, no tracking
- **Wikidata**: Open data, public domain
- **GitHub**: Solo ricerche pubbliche

## 📊 Performance e Limiti

### Ottimizzazioni
- **Ricerca Parallela**: Query simultanee per velocità
- **Timeout Intelligenti**: 15s max per evitare blocchi
- **Cache Locale**: Risultati recenti memorizzati temporaneamente
- **Deduplicazione**: Elimina risultati ridondanti

### Limiti Noti
- **GitHub API**: 60 richieste/ora senza autenticazione
- **CORS**: Alcune API potrebbero avere restrizioni
- **Timeout**: Connessioni lente potrebbero fallire

## 🆘 Risoluzione Problemi

### Problemi Comuni

#### Ricerca Non Funziona
1. Verifica connessione internet
2. Controlla console browser (F12)
3. Testa con `test-ricerca-web.html`
4. Controlla configurazione in `config.js`

#### AI Non Risponde
1. Verifica che Ollama sia avviato (se configurato)
2. Controlla URL in `config.js`
3. Modalità offline sempre disponibile

#### Musica Non Carica
1. Verifica API key YouTube in `config.js`
2. Fallback automatico disponibile
3. Controlla console per errori

### Debug e Test
```bash
# Apri console browser (F12)
# Verifica errori JavaScript
# Testa provider singolarmente
# Usa file test-*.html per diagnosi
```

## 🎯 Esempi d'Uso

### Ricerca Generale
```
"Dimmi cos'è l'intelligenza artificiale"
"Trova informazioni su Leonardo da Vinci"
"Cerca notizie recenti sul clima"
```

### Programmazione
```
"/template java"         - Template Java con esempi pratici
"/help"                  - Lista completa comandi  
"/best javascript"       - Best practices JavaScript
"Come debug questo codice: [codice]" - Analisi e debug
"Spiegami questo algoritmo: [codice]" - Spiegazione dettagliata
```

**Esempio Code Block:**
```
Utente: "/template java"
AI: Genera un code block con:
    - Header "Java" con pulsante copia
    - Syntax highlighting colorato
    - Esempio pratico classi Umano/Gigante
    - Funzione copia negli appunti
```

### Musica
```
"Metti Bohemian Rhapsody"
"Artisti simili ai Beatles"
"Playlist jazz rilassante"
"Dimmi di Ludovico Einaudi"
```

### Ricerca Specializzata
```
"Link al sito ufficiale di Python"
"Dove posso studiare machine learning"
"Documenti su [argomento specifico]"
```

## 🚀 Sviluppi Futuri

### Funzionalità Pianificate
- [ ] **Cache Persistente**: Memorizzazione risultati locali
- [ ] **Più Provider**: Integrazione con altre fonti
- [ ] **AI Models**: Supporto per più modelli AI
- [ ] **Export Risultati**: Salvataggio ricerche
- [ ] **Personalizzazione**: Preferenze utente

### Contributi
Il progetto è aperto a contributi per:
- Nuovi provider di ricerca
- Miglioramenti UI/UX
- Ottimizzazioni performance
- Correzioni bug
- Documentazione

---

## 📞 Supporto

Per problemi, suggerimenti o contributi, controlla:
1. La documentazione completa nel codice
2. I file di test per esempi pratici
3. La console browser per errori tecnici
4. Le configurazioni in `config.js`

**Buon utilizzo del tuo Amico Virtuale AI! 🤖✨**
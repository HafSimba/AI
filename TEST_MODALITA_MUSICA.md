# Test Modalità Musica - Amico Virtuale AI

## 🎵 Comandi di Test per Modalità Musica

### 1. Riproduzione diretta:
- "Riproduci Bohemian Rhapsody dei Queen"
- "Suona Imagine di John Lennon"
- "Fammi sentire Hotel California"
- "Ascolta The Sound of Silence"

### 2. Richieste di consigli:
- "Consigliami qualche canzone dei Beatles"
- "Suggerisci della musica rock"
- "Che canzone mi consigli?"
- "Proponi qualcosa di rilassante"

### 3. Musica simile:
- "Musica simile ai Pink Floyd"
- "Artisti come Bob Dylan"
- "Canzoni nello stesso stile di Led Zeppelin"
- "Qualcosa di simile a Radiohead"

### 4. Informazioni artisti:
- "Chi è David Bowie?"
- "Dimmi di Freddie Mercury"
- "Cosa sai sui Queen?"
- "Parlami dei Rolling Stones"

### 5. Richieste generiche:
- "Parlami di musica jazz"
- "Qual è la differenza tra rock e metal?"
- "Storia della musica pop"

## 🎬 Funzionalità Implementate:

✅ **Analisi intelligente** delle richieste musicali
✅ **Ricerca su YouTube** con API o fallback
✅ **Embed video** direttamente in chat
✅ **Commenti AI** personalizzati sui brani
✅ **Consigli musicali** basati su artisti
✅ **Informazioni** su artisti e generi
✅ **Fallback offline** quando API non disponibile

## 🔧 Configurazione YouTube API:

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona esistente
3. Abilita YouTube Data API v3
4. Crea credenziali (API Key)
5. Sostituisci `YOUR_YOUTUBE_API_KEY` nel file `config.js`

## 🎯 Note di Sviluppo:

- La modalità funziona anche **SENZA** API key (modalità fallback)
- I video vengono embedded direttamente in chat
- L'AI fornisce commenti personalizzati per ogni brano
- Supporta richieste in linguaggio naturale
- Gestione intelligente degli errori

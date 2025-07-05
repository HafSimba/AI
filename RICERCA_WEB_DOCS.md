# 🌐 Sistema Ricerca Web - Documentazione Tecnica

## Architettura del Sistema

### Overview
Il sistema di ricerca web dell'Amico Virtuale AI utilizza un approccio **multi-provider parallelo** per fornire informazioni accurate e aggiornate da fonti diverse e affidabili.

### Flusso di Esecuzione
```
Query Utente → Trigger Detection → Search Web → Provider Parallel → Deduplica → Format → AI Integration
```

## 🔧 Provider Implementati

### 1. DuckDuckGo Instant Answer API
**Endpoint**: `https://api.duckduckgo.com/`
**Vantaggi**:
- Privacy-focused (no tracking)
- Risposte immediate
- Nessuna API key richiesta
- Definizioni e abstract

**Tipi di Risultati**:
- `instant_answer`: Risposte immediate
- `definition`: Definizioni
- `related`: Argomenti correlati

**Limitazioni**:
- Risultati limitati
- Dipende dalla disponibilità del servizio

### 2. Wikipedia REST API
**Endpoint**: `https://it.wikipedia.org/api/rest_v1/`
**Vantaggi**:
- Contenuti enciclopedici
- Multilingua (italiano preferito)
- Affidabile e aggiornato
- Riassunti e immagini

**Workflow**:
1. Ricerca pagine: `/page/search/{query}`
2. Recupero riassunto: `/page/summary/{title}`

**Limitazioni**:
- Solo contenuti enciclopedici
- Dipende dalla qualità degli articoli

### 3. Wikidata SPARQL
**Endpoint**: `https://query.wikidata.org/sparql`
**Vantaggi**:
- Dati strutturati
- Entità e relazioni
- Multilingua
- Open data

**Query SPARQL**:
```sparql
SELECT DISTINCT ?item ?itemLabel ?itemDescription WHERE {
    ?item rdfs:label ?label .
    FILTER(CONTAINS(LCASE(?label), LCASE("query")))
    SERVICE wikibase:label { bd:serviceParam wikibase:language "it,en". }
}
LIMIT 3
```

**Limitazioni**:
- Query SPARQL complesse
- Dati tecnici, meno user-friendly

### 4. GitHub API
**Endpoint**: `https://api.github.com/`
**Vantaggi**:
- Ricerca codice e repository
- Informazioni su linguaggi e progetti
- Statistiche (stelle, fork)
- Aggiornamenti recenti

**Specializzazioni**:
- Attivazione automatica per query di programmazione
- Filtri per linguaggio
- Ordinamento per popolarità

**Limitazioni**:
- 60 richieste/ora senza autenticazione
- Solo repository pubblici

## 🚀 Funzionalità Avanzate

### Ricerca Parallela
```javascript
// Esecuzione simultanea di tutti i provider
const searchPromises = providers.map(provider => 
    searchWithProvider(query, provider)
);
const results = await Promise.all(searchPromises);
```

**Vantaggi**:
- Velocità superiore (timeout 15s totali invece di 15s x provider)
- Fallback automatico se un provider fallisce
- Risultati più completi

### Deduplicazione Intelligente
```javascript
deduplicateResults(results) {
    const seen = new Set();
    return results.filter(result => {
        const key = `${result.title?.toLowerCase()}_${result.url}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
```

**Logica**:
- Combinazione titolo + URL come chiave unica
- Case-insensitive per i titoli
- Non elimina variazioni legittime

### Sistema di Priorità
```javascript
// Ordinamento per rilevanza
results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
```

**Scoring**:
- `instant_answer`: 10 punti
- `definition`: 9 punti
- `encyclopedia`: 8 punti
- `related`: 7-5 punti (decrescente)
- `code`: 7 punti
- `data`: 6 punti

### Trigger Automatici
```javascript
triggers: [
    'cerca', 'ricerca', 'trova', 'dimmi di', 'cos\'è', 'chi è',
    'cosa sono', 'spiegami', 'informazioni su', 'link su'
]
```

**Logica di Attivazione**:
1. **Trigger Espliciti**: Parole chiave nella query
2. **Modalità Ricercatore**: Sempre attiva
3. **Trigger di Link**: Richiesta esplicita di collegamenti

## 🔄 Integrazione con AI

### Arricchimento Prompt
```javascript
userMessage += `\n\n🌐 INFORMAZIONI AGGIORNATE DAL WEB:\n${searchResults}\n\nUsa queste informazioni per fornire una risposta accurata e completa.`;
```

### Modalità Offline
Anche senza AI esterna, il sistema:
- Mostra risultati di ricerca formattati
- Fornisce link diretti alle fonti
- Suggerisce metodologie di ricerca

## 🎯 Formattazione Risultati

### Template di Output
```markdown
🌐 **Risultati Ricerca:** "query"
📊 **N risultati** da provider1, provider2

⚡ **Titolo Risultato**
Snippet descrittivo del contenuto
🔗 [Link] 🦆 badge_provider ⭐ stars

⏰ *Ricerca completata: timestamp*
```

### Badge Provider
- 🦆 DuckDuckGo
- 📚 Wikipedia  
- 🗃️ Wikidata
- 💻 GitHub

### Emoji per Tipo
- ⚡ Risposta Istantanea
- 📖 Definizione
- 📚 Enciclopedia
- 🔗 Correlato
- 🗃️ Dato Strutturato
- 💻 Codice/Repository

## 🛡️ Gestione Errori

### Timeout Management
```javascript
Promise.race([
    searchFunction(query, config),
    new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout)
    )
])
```

### Fallback Hierarchy
1. **Provider Multipli**: Se uno fallisce, altri compensano
2. **Modalità Offline**: Suggerimenti e link manuali
3. **Cache Locale**: Risultati precedenti (pianificato)

### Error Logging
```javascript
console.error('❌ Errore Provider:', error);
return { provider: name, success: false, error: error.message };
```

## 📊 Performance e Monitoring

### Metriche Tracciate
- Tempo di risposta per provider
- Tasso di successo per provider
- Numero di risultati per query
- Efficacia deduplicazione

### Ottimizzazioni
- **Timeout Bilanciati**: 15s totali per evitare UX lenta
- **Risultati Limitati**: Max 5 per evitare overhead
- **Caching**: Prevenzione chiamate duplicate (pianificato)

## 🔧 Configurazione Avanzata

### Personalizzazione Provider
```javascript
providers: {
    custom_provider: {
        enabled: true,
        url: 'https://api.custom.com/',
        name: 'Custom Provider',
        priority: 5,
        timeout: 10000,
        apiKey: 'optional_key'
    }
}
```

### Trigger Personalizzati
```javascript
triggers: [
    // Trigger esistenti +
    'custom_trigger',
    'altro_trigger'
],

// Trigger specifici per modalità
musicTriggers: ['suona', 'playlist', 'artista'],
codeTriggers: ['codice', 'programma', 'debug']
```

## 🚀 Estensioni Future

### Provider Pianificati
- **News APIs**: Notizie in tempo reale
- **Academic**: Google Scholar, PubMed
- **Social**: Reddit, Stack Overflow
- **Maps**: OpenStreetMap, Google Places

### Funzionalità Avanzate
- **Caching Persistente**: LocalStorage/IndexedDB
- **Machine Learning**: Ranking intelligente risultati
- **Personalizzazione**: Preferenze utente
- **Analytics**: Tracking usage pattern

### Integrazione AI
- **Query Expansion**: Riformulazione query per migliorare risultati
- **Sentiment Analysis**: Comprensione intenzione utente
- **Entity Recognition**: Estrazione entità dalle query
- **Summarization**: Riassunto automatico risultati lunghi

## 🧪 Testing e Debug

### Test Suite
- `test-ricerca-web.html`: Test interattivo completo
- Unit test per singoli provider
- Performance benchmarks
- Test di timeout e errori

### Debug Tools
```javascript
// Console logging dettagliato
console.log('🔍 Avvio ricerca:', query);
console.log('✅ Provider completato:', results.length);
console.log('🔄 Deduplicazione:', before, '→', after);
```

### Monitoring
```javascript
// Metriche di performance
const startTime = Date.now();
// ... ricerca ...
const endTime = Date.now();
console.log(`⏱️ Tempo totale: ${endTime - startTime}ms`);
```

---

Questa documentazione fornisce una visione completa del sistema di ricerca web implementato, dalle basi architetturali alle funzionalità avanzate e ai piani futuri.

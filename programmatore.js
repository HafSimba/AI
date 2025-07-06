// 💻 PROGRAMMATORE.JS - Gestione modalità Programmatore
// Assistenza tecnica, programmazione, debug, template di codice

console.log('💻 Caricamento modulo Programmatore...');

class ProgrammatoreHandler {
    constructor(mainInstance) {
        this.main = mainInstance;
        this.currentCategory = 'programmatore';
        
        // Template di codice predefiniti
        this.codeTemplates = {
            javascript: {
                basic: `// JavaScript Base
console.log('Hello World!');

// Variabili
let nome = 'Il tuo nome';
const eta = 25;

// Funzione
function saluta(nome) {
    return \`Ciao \${nome}!\`;
}

console.log(saluta(nome));`,
                async: `// JavaScript Async/Await
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore:', error);
        throw error;
    }
}

// Utilizzo
fetchData('https://api.example.com/data')
    .then(data => console.log(data))
    .catch(error => console.log('Errore:', error));`,
                react: `// React Component
import React, { useState, useEffect } from 'react';

function MyComponent() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = \`Count: \${count}\`;
    }, [count]);
    
    return (
        <div>
            <h1>Counter: {count}</h1>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}

export default MyComponent;`
            },
            python: {
                basic: `# Python Base
print("Hello World!")

# Variabili
nome = "Il tuo nome"
eta = 25

# Funzione
def saluta(nome):
    return f"Ciao {nome}!"

print(saluta(nome))`,
                class: `# Python Class
class Persona:
    def __init__(self, nome, eta):
        self.nome = nome
        self.eta = eta
    
    def saluta(self):
        return f"Ciao, sono {self.nome} e ho {self.eta} anni"
    
    def compleanno(self):
        self.eta += 1
        return f"Buon compleanno! Ora ho {self.eta} anni"

# Utilizzo
persona = Persona("Mario", 30)
print(persona.saluta())
print(persona.compleanno())`,
                async: `# Python Async/Await
import asyncio
import aiohttp

async def fetch_data(url):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as response:
                return await response.json()
        except Exception as error:
            print(f"Errore: {error}")
            raise

# Utilizzo
async def main():
    data = await fetch_data('https://api.example.com/data')
    print(data)

# Esegui
asyncio.run(main())`
            },
            html: {
                basic: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Il mio sito</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Benvenuto!</h1>
        <p>Questa è la mia pagina web.</p>
        <button onclick="alert('Ciao!')">Clicca qui</button>
    </div>
</body>
</html>`,
                form: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form di contatto</title>
    <style>
        form {
            max-width: 500px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea, select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <form>
        <div class="form-group">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="messaggio">Messaggio:</label>
            <textarea id="messaggio" name="messaggio" rows="4" required></textarea>
        </div>
        <button type="submit">Invia</button>
    </form>
</body>
</html>`
            }
        };
        
        // Inizializza script per container di codice
        this.initializeCodeContainerScripts();
        
        console.log('💻 ProgrammatoreHandler inizializzato');
    }
    
    // 💻 Gestisce tutti i messaggi per la modalità programmatore
    async handleMessage(message) {
        console.log('💻 Elaborazione messaggio programmatore:', message);
        
        // Controlla comandi slash specifici per programmatore
        if (message.startsWith('/')) {
            return this.handleSlashCommand(message);
        }
        
        // Controlla richieste di codice specifiche
        if (this.isCodeRequest(message)) {
            return await this.handleCodeRequest(message);
        }
        
        // Controlla richieste di debug/errori
        if (this.isDebugRequest(message)) {
            return await this.handleDebugRequest(message);
        }
        
        // Controlla richieste di spiegazioni tecniche
        if (this.isTechnicalExplanation(message)) {
            return await this.handleTechnicalExplanation(message);
        }
        
        // Risposta AI normale per modalità programmatore
        const aiResponse = await this.main.getAIResponse(message, null, 'programmatore');
        
        // Processa la risposta per estrarre e formattare i blocchi di codice
        return this.processCodeInResponse(aiResponse);
    }
    
    // 🔍 Controlla se è una richiesta di codice
    isCodeRequest(message) {
        const codeKeywords = [
            'codice', 'programma', 'script', 'funzione', 'classe', 'metodo',
            'javascript', 'python', 'java', 'html', 'css', 'sql', 'php',
            'template', 'esempio', 'come si fa', 'come creare', 'come scrivere',
            'algoritmo', 'implementazione', 'scrivimi', 'mostrami', 'fammi vedere',
            'sviluppa', 'crea', 'genera', 'build', 'costruisci', 'realizza'
        ];
        
        const codePatterns = [
            /scriv[iae] (?:un|una|del|il|lo|la) (?:codice|programma|funzione|script|classe)/i,
            /crea (?:un|una|del|il|lo|la) (?:programma|applicazione|script|funzione)/i,
            /come (?:fare|creare|scrivere|implementare) (?:un|una|del|il|lo|la)/i,
            /(?:voglio|vorrei|potresti|puoi) (?:un|una|del|il|lo|la) (?:codice|programma|script)/i,
            /(?:genera|sviluppa|costruisci|realizza) (?:un|una|del|il|lo|la)/i,
            /(?:funzione|classe|metodo) (?:per|che|di)/i,
            /(?:programma|script|codice) (?:per|che|di)/i
        ];
        
        const lowerMessage = message.toLowerCase();
        
        // Controlla pattern specifici
        const hasPattern = codePatterns.some(pattern => pattern.test(message));
        if (hasPattern) return true;
        
        // Controlla keywords
        const hasKeyword = codeKeywords.some(keyword => lowerMessage.includes(keyword));
        if (hasKeyword) return true;
        
        // Controlla linguaggi di programmazione menzionati
        const languages = ['javascript', 'python', 'java', 'html', 'css', 'php', 'sql', 'typescript', 'c++', 'c#'];
        const hasLanguage = languages.some(lang => lowerMessage.includes(lang.toLowerCase()));
        if (hasLanguage) return true;
        
        return false;
    }
    
    // 🐛 Controlla se è una richiesta di debug
    isDebugRequest(message) {
        const debugKeywords = [
            'errore', 'bug', 'debug', 'problema', 'non funziona', 'sbagliato',
            'exception', 'error', 'warning', 'syntax error', 'runtime error',
            'aiuta', 'help', 'correggere', 'risolvere', 'sistemare'
        ];
        
        const lowerMessage = message.toLowerCase();
        return debugKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    // 📚 Controlla se è una richiesta di spiegazione tecnica
    isTechnicalExplanation(message) {
        const explanationKeywords = [
            'spiegami', 'cos\'è', 'che cosa', 'come funziona', 'perché',
            'differenza', 'confronto', 'meglio', 'quando usare', 'vantaggi',
            'svantaggi', 'best practice', 'pattern', 'architettura'
        ];
        
        const lowerMessage = message.toLowerCase();
        return explanationKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    // 💻 Gestisce richieste di codice
    async handleCodeRequest(message) {
        console.log('💻 Elaborazione richiesta di codice:', message);
        
        try {
            // Analizza la richiesta per estrarre linguaggio e tipo
            const requestAnalysis = this.analyzeCodeRequest(message);
            console.log('🔍 Analisi richiesta:', requestAnalysis);
            
            // Genera prompt specifico per l'AI
            const aiPrompt = this.buildCodePrompt(message, requestAnalysis);
            console.log('🎯 Prompt generato per AI:', aiPrompt);
            
            // Controlla se l'AI è disponibile
            if (!this.main.isAIConfigured()) {
                console.log('⚠️ AI non configurata, uso fallback');
                return this.getFallbackCodeResponse(message, requestAnalysis);
            }
            
            // Ottieni risposta dall'AI con prompt specifico
            const aiResponse = await this.main.getAIResponse(aiPrompt, null, 'programmatore');
            console.log('🤖 Risposta AI ricevuta:', aiResponse?.substring(0, 200) + '...');
            
            // Verifica che la risposta contenga codice
            if (!this.containsCode(aiResponse)) {
                console.log('⚠️ Risposta AI senza codice, aggiungo codice generato');
                return this.enhanceResponseWithCode(aiResponse, requestAnalysis, message);
            }
            
            // Processa la risposta per estrarre e formattare il codice
            return this.processCodeInResponse(aiResponse);
            
        } catch (error) {
            console.error('❌ Errore nella generazione del codice:', error);
            
            // Fallback: usa template se AI non disponibile
            return this.getFallbackCodeResponse(message, requestAnalysis);
        }
    }
    
    // 🔍 Analizza la richiesta di codice per estrarre dettagli
    analyzeCodeRequest(message) {
        const lowerMessage = message.toLowerCase();
        
        // Rileva il linguaggio richiesto
        let language = null;
        const languagePatterns = {
            javascript: ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
            python: ['python', 'py', 'django', 'flask', 'pandas', 'numpy'],
            java: ['java', 'spring', 'android'],
            html: ['html', 'pagina web', 'sito web'],
            css: ['css', 'stile', 'styling', 'design'],
            php: ['php', 'laravel', 'wordpress'],
            sql: ['sql', 'database', 'query', 'mysql', 'postgresql'],
            cpp: ['c++', 'cpp'],
            csharp: ['c#', 'csharp', '.net'],
            typescript: ['typescript', 'ts']
        };
        
        for (const [lang, patterns] of Object.entries(languagePatterns)) {
            if (patterns.some(pattern => lowerMessage.includes(pattern))) {
                language = lang;
                break;
            }
        }
        
        // Se non specificato, prova a dedurre dal contesto
        if (!language) {
            if (lowerMessage.includes('web') || lowerMessage.includes('sito')) {
                language = 'html';
            } else if (lowerMessage.includes('server') || lowerMessage.includes('backend')) {
                language = 'python';
            } else if (lowerMessage.includes('frontend') || lowerMessage.includes('interfaccia')) {
                language = 'javascript';
            } else {
                language = 'javascript'; // Default
            }
        }
        
        // Rileva il tipo di codice richiesto
        let codeType = 'function';
        if (lowerMessage.includes('classe') || lowerMessage.includes('class')) {
            codeType = 'class';
        } else if (lowerMessage.includes('programma completo') || lowerMessage.includes('applicazione')) {
            codeType = 'program';
        } else if (lowerMessage.includes('funzione') || lowerMessage.includes('function')) {
            codeType = 'function';
        } else if (lowerMessage.includes('script')) {
            codeType = 'script';
        }
        
        // Estrai parole chiave importanti per il contesto
        const contextKeywords = [];
        const keywords = [
            'form', 'formulario', 'input', 'button', 'click', 'event',
            'api', 'fetch', 'ajax', 'request', 'http',
            'database', 'sql', 'insert', 'select', 'update', 'delete',
            'algoritmo', 'sort', 'search', 'filter', 'map', 'reduce',
            'validazione', 'validation', 'check', 'verify',
            'file', 'upload', 'download', 'read', 'write',
            'autenticazione', 'login', 'user', 'password',
            'calcolo', 'matematica', 'operazione', 'formula'
        ];
        
        keywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) {
                contextKeywords.push(keyword);
            }
        });
        
        return {
            language,
            codeType,
            contextKeywords,
            originalMessage: message
        };
    }
    
    // 🏗️ Costruisce prompt specifico per l'AI
    buildCodePrompt(originalMessage, analysis) {
        const { language, codeType, contextKeywords } = analysis;
        
        let prompt = `Sei un esperto programmatore ${language}. Un utente ti ha fatto questa richiesta:

"${originalMessage}"

ANALISI RICHIESTA:
- Linguaggio richiesto: ${language}
- Tipo di codice: ${codeType}
- Contesto chiave: ${contextKeywords.join(', ') || 'generico'}

ISTRUZIONI SPECIFICHE:
1. Scrivi SOLO codice ${language} funzionante e completo
2. Il codice deve rispondere ESATTAMENTE alla richiesta dell'utente
3. Includi commenti brevi per spiegare le parti importanti
4. Usa best practices e sintassi corretta per ${language}
5. Il codice deve essere pronto all'uso senza modifiche

FORMATO RISPOSTA RICHIESTO:
- Una breve spiegazione (1-2 righe) di cosa fa il codice
- Il codice completo racchiuso in blocco \`\`\`${language}
- Eventuali note sull'utilizzo (se necessarie)

IMPORTANTE: 
- NON fornire alternative o altri esempi
- NON spiegare teoria, concentrati sul codice pratico
- Il codice deve corrispondere al linguaggio ${language} richiesto
- Rispondi in italiano

Genera ora il codice richiesto:`;

        return prompt;
    }
    
    // 🔄 Risposta di fallback se AI non disponibile
    getFallbackCodeResponse(message, analysis = null) {
        console.log('🔄 Generazione fallback per:', message);
        
        // Se non abbiamo analisi, facciamola ora
        if (!analysis) {
            analysis = this.analyzeCodeRequest(message);
        }
        
        const { language, codeType, contextKeywords } = analysis;
        
        // Genera codice personalizzato basato sulla richiesta
        const customCode = this.generateCustomCode(message, analysis);
        const filename = this.generateFilename(language, codeType);
        const codeContainer = this.createCodeContainer(customCode, language, filename);
        
        return `💻 **Codice ${language.charAt(0).toUpperCase() + language.slice(1)} Generato**

Ecco il codice per la tua richiesta: "${message}"

${codeContainer}

**💡 Caratteristiche:**
• Linguaggio: ${language}
• Tipo: ${codeType}
• Contesto: ${contextKeywords.join(', ') || 'generico'}

**� Personalizzazioni:**
• Clicca "Modifica" per adattare il codice
• Usa "Copia" per copiarlo negli appunti  
• Clicca "Salva" per scaricare il file

${this.main.isAIConfigured() ? '' : '⚠️ **Nota**: Per codice più personalizzato, configura l\'AI nel sistema.'}`;
    }
    
    // 💻 Gestisce richieste di debug
    async handleDebugRequest(message) {
        return `🐛 **Assistenza Debug**
        
Vedo che hai un problema tecnico! Ecco come posso aiutarti:

**🔍 Strategie di Debug:**
1. **Leggi attentamente il messaggio di errore**
2. **Controlla la sintassi**
3. **Verifica i tipi di dati**
4. **Usa console.log() per debug**
5. **Controlla le importazioni/riferimenti**

**💡 Suggerimenti:**
• Incolla il codice e l'errore per un aiuto specifico
• Usa \`/debug\` per guide specifiche
• Controlla indentazione e parentesi
• Verifica le variabili non definite

**🛠️ Comandi utili:**
• \`/debug javascript\` - Guide debug JS
• \`/debug python\` - Guide debug Python
• \`/template debug\` - Template di debug

Condividi il tuo codice e l'errore per un aiuto più specifico!`;
    }
    
    // 📚 Gestisce spiegazioni tecniche
    async handleTechnicalExplanation(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('api')) {
            return this.explainAPI();
        } else if (lowerMessage.includes('async') || lowerMessage.includes('promise')) {
            return this.explainAsync();
        } else if (lowerMessage.includes('oop') || lowerMessage.includes('programmazione orientata')) {
            return this.explainOOP();
        } else if (lowerMessage.includes('mvc') || lowerMessage.includes('pattern')) {
            return this.explainMVC();
        }
        
        return `📚 **Spiegazioni Tecniche**
        
Sono qui per spiegare concetti di programmazione! Puoi chiedermi di:

**🎯 Concetti Popolari:**
• **API** - Application Programming Interface
• **Async/Await** - Programmazione asincrona
• **OOP** - Programmazione ad oggetti
• **MVC** - Model-View-Controller
• **REST** - Representational State Transfer
• **JSON** - JavaScript Object Notation

**💡 Esempi di domande:**
• "Spiegami cos'è un'API"
• "Come funziona async/await?"
• "Differenza tra GET e POST"
• "Che cos'è un pattern MVC?"

Cosa vorresti approfondire?`;
    }
    
    // 📋 Gestisce comandi slash specifici per programmatore
    handleSlashCommand(message) {
        const command = message.slice(1).toLowerCase().trim();
        const [mainCommand, subCommand] = command.split(' ');
        
        switch (mainCommand) {
            case 'template':
                return this.getTemplateHelp(subCommand);
            case 'debug':
                return this.getDebugHelp(subCommand);
            case 'best':
                return this.getBestPractices(subCommand);
            case 'explain':
                return this.getExplanation(subCommand);
            default:
                return `💻 **Comandi Programmatore Disponibili:**
                
• \`/template [linguaggio]\` - Template di codice
• \`/debug [linguaggio]\` - Guide di debug
• \`/best [argomento]\` - Best practices
• \`/explain [concetto]\` - Spiegazioni tecniche

**Esempi:**
• \`/template javascript\`
• \`/debug python\`
• \`/best security\`
• \`/explain api\``;
        }
    }
    
    // 📋 Restituisce template di codice
    getCodeTemplate(language, type, originalMessage) {
        const templates = this.codeTemplates[language];
        if (!templates) {
            return `❌ Linguaggio non supportato: ${language}
            
**Linguaggi disponibili:** javascript, python, html
            
Usa \`/template\` per vedere tutti i template disponibili.`;
        }
        
        const template = templates[type] || templates.basic;
        const filename = this.generateFilename(language, type);
        
        const codeContainer = this.createCodeContainer(template, language, filename);
        
        return `💻 **Template ${language.charAt(0).toUpperCase() + language.slice(1)} - ${type}**

${codeContainer}

**💡 Suggerimenti:**
• Clicca "Modifica" per personalizzare il codice
• Usa "Copia" per copiare negli appunti  
• Clicca "Salva" per scaricare il file
• Testa il codice in un ambiente di sviluppo

**🔧 Altri template disponibili:**
${Object.keys(templates).map(t => `• \`/template ${language} ${t}\``).join('\n')}`;
    }
    
    // 📁 Genera nome file appropriato
    generateFilename(language, type) {
        const extensions = {
            javascript: 'js',
            python: 'py',
            html: 'html',
            css: 'css',
            java: 'java',
            php: 'php',
            sql: 'sql',
            typescript: 'ts',
            cpp: 'cpp',
            csharp: 'cs'
        };
        
        const extension = extensions[language] || 'txt';
        const typePrefix = type !== 'basic' ? `${type}_` : '';
        
        return `${typePrefix}example.${extension}`;
    }
    
    // 🔢 Esempi specifici per programma di somma
    getSumProgramExamples() {
        const pythonCode = `# Input
num1 = float(input("Inserisci il primo numero: "))
num2 = float(input("Inserisci il secondo numero: "))

# Somma
somma = num1 + num2

# Output
print(f"La somma è: {somma}")`;

        const javascriptCode = `// Input
const num1 = parseFloat(prompt("Inserisci il primo numero:"));
const num2 = parseFloat(prompt("Inserisci il secondo numero:"));

// Somma
const somma = num1 + num2;

// Output
console.log(\`La somma è: \${somma}\`);
alert(\`La somma è: \${somma}\`);`;

        const nodejsCode = `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Inserisci il primo numero: ', (num1) => {
    rl.question('Inserisci il secondo numero: ', (num2) => {
        const somma = parseFloat(num1) + parseFloat(num2);
        console.log(\`La somma è: \${somma}\`);
        rl.close();
    });
});`;

        const pythonContainer = this.createCodeContainer(pythonCode, 'python', 'somma.py');
        const jsContainer = this.createCodeContainer(javascriptCode, 'javascript', 'somma.js');
        const nodeContainer = this.createCodeContainer(nodejsCode, 'javascript', 'somma_nodejs.js');
        
        return `💻 **Programma per sommare due numeri**

Ecco implementazioni complete in diversi linguaggi:

**🐍 Python (Console):**
${pythonContainer}

**⚡ JavaScript (Browser):**
${jsContainer}

**🟢 JavaScript (Node.js):**
${nodeContainer}

**💡 Come usare:**
• **Python**: Salva come \`.py\` ed esegui con \`python somma.py\`
• **Browser**: Salva come \`.html\` e apri nel browser
• **Node.js**: Salva come \`.js\` ed esegui con \`node somma.js\``;
    }
    
    // 🔍 Controlla se è una richiesta di debug
    // 📚 Spiegazioni tecniche specifiche
    explainAPI() {
        return `🌐 **Cos'è un'API?**

**API = Application Programming Interface**

Un'API è un "contratto" che definisce come due applicazioni possono comunicare tra loro.

**🔗 Analogia:** Pensa a un cameriere in un ristorante:
• Tu (client) ordini dal menu
• Il cameriere (API) porta l'ordine in cucina
• La cucina (server) prepara il piatto
• Il cameriere riporta il piatto

**📋 Tipi principali:**
• **REST API** - Usa HTTP (GET, POST, PUT, DELETE)
• **GraphQL** - Query flessibili
• **WebSocket** - Comunicazione in tempo reale

**💻 Esempio pratico:**
\`\`\`javascript
// Chiamata API REST
fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => console.log(data));
\`\`\`

**🎯 Vantaggi:**
• Separazione delle responsabilità
• Riutilizzo del codice
• Scalabilità
• Sicurezza`;
    }
    
    explainAsync() {
        return `⏱️ **Programmazione Asincrona - Async/Await**

**🤔 Il problema:** Il codice JavaScript è single-threaded, ma alcune operazioni (API calls, file I/O) richiedono tempo.

**💡 La soluzione:** Async/Await per gestire operazioni che richiedono tempo senza bloccare il thread principale.

**📈 Evoluzione:**
1. **Callback** (vecchio, callback hell)
2. **Promises** (meglio, ma verboso)
3. **Async/Await** (moderno, leggibile)

**💻 Esempio confronto:**
\`\`\`javascript
// ❌ Callback Hell
getData(function(a) {
    getMoreData(a, function(b) {
        getEvenMoreData(b, function(c) {
            // Difficile da leggere!
        });
    });
});

// ✅ Async/Await
async function loadData() {
    try {
        const a = await getData();
        const b = await getMoreData(a);
        const c = await getEvenMoreData(b);
        return c;
    } catch (error) {
        console.error('Errore:', error);
    }
}
\`\`\`

**🎯 Regole importanti:**
• Usa \`async\` per definire funzioni asincrone
• Usa \`await\` solo dentro funzioni \`async\`
• Gestisci sempre gli errori con try/catch`;
    }
    
    explainOOP() {
        return `🏗️ **Programmazione Orientata agli Oggetti (OOP)**

**🎯 Concetto base:** Organizzare il codice in "oggetti" che rappresentano entità del mondo reale.

**🏛️ I 4 Pilastri:**

**1. Incapsulamento** 📦
• Raggruppa dati e metodi
• Nascondi dettagli implementativi

**2. Ereditarietà** 👨‍👦
• Classi figlie ereditano da classi padre
• Riutilizzo del codice

**3. Polimorfismo** 🎭
• Stesso metodo, comportamenti diversi
• Flessibilità nell'implementazione

**4. Astrazione** 🎨
• Nascondi complessità
• Interfacce semplici

**💻 Esempio JavaScript:**
\`\`\`javascript
class Animale {
    constructor(nome) {
        this.nome = nome;
    }
    
    suono() {
        return "L'animale fa un suono";
    }
}

class Cane extends Animale {
    constructor(nome, razza) {
        super(nome);
        this.razza = razza;
    }
    
    suono() {
        return "Bau bau!";
    }
}

const myCane = new Cane("Fido", "Labrador");
console.log(myCane.suono()); // "Bau bau!"
\`\`\`

**✅ Vantaggi:**
• Codice riutilizzabile
• Facile manutenzione
• Organizzazione logica
• Collaborazione in team`;
    }
    
    explainMVC() {
        return `🏗️ **Pattern MVC (Model-View-Controller)**

**🎯 Obiettivo:** Separare logica, presentazione e controllo.

**🧩 I 3 Componenti:**

**📊 Model (Modello)**
• Gestisce i dati
• Logica di business
• Database interaction

**🎨 View (Vista)**
• Interfaccia utente
• Presentazione dati
• HTML, CSS, template

**🎮 Controller (Controllore)**
• Gestisce input utente
• Coordina Model e View
• Logica di controllo

**🔄 Flusso:**
1. User interagisce con View
2. Controller riceve input
3. Controller aggiorna Model
4. Model notifica cambiamenti
5. View si aggiorna

**💻 Esempio Express.js:**
\`\`\`javascript
// Model
class UserModel {
    static async getAllUsers() {
        return await db.query('SELECT * FROM users');
    }
}

// Controller
class UserController {
    static async index(req, res) {
        const users = await UserModel.getAllUsers();
        res.render('users/index', { users });
    }
}

// Routes (collegano View e Controller)
app.get('/users', UserController.index);
\`\`\`

**✅ Vantaggi:**
• Codice organizzato
• Manutenibilità
• Testabilità
• Lavoro in team`;
    }
    
    // 📋 Helper per comandi template
    getTemplateHelp(subCommand) {
        if (!subCommand) {
            return `📋 **Template Disponibili:**
            
**JavaScript:**
• \`/template javascript basic\` - Base
• \`/template javascript async\` - Async/Await
• \`/template javascript react\` - React Component

**Python:**
• \`/template python basic\` - Base
• \`/template python class\` - Classi
• \`/template python async\` - Asyncio

**HTML:**
• \`/template html basic\` - Pagina base
• \`/template html form\` - Form di contatto

Usa: \`/template [linguaggio] [tipo]\``;
        }
        
        const [language, type] = subCommand.split(' ');
        return this.getCodeTemplate(language || 'javascript', type || 'basic', '');
    }
    
    // 🐛 Helper per debug
    getDebugHelp(subCommand) {
        const language = subCommand || 'general';
        
        const debugGuides = {
            javascript: `🐛 **Debug JavaScript**

**🔍 Strumenti principali:**
• \`console.log()\` - Debug base
• \`console.error()\` - Errori
• \`console.table()\` - Dati tabulari
• \`debugger;\` - Breakpoint
• Browser DevTools

**⚠️ Errori comuni:**
• ReferenceError: Variable not defined
• TypeError: Cannot read property
• SyntaxError: Unexpected token
• Scope issues (var vs let/const)

**💡 Best practices:**
\`\`\`javascript
try {
    // Codice rischioso
    const result = riskyOperation();
    console.log('Successo:', result);
} catch (error) {
    console.error('Errore:', error.message);
}
\`\`\``,
            python: `🐛 **Debug Python**

**🔍 Strumenti principali:**
• \`print()\` - Debug base
• \`pdb.set_trace()\` - Debugger
• \`logging\` - Log avanzati
• IDE debugger

**⚠️ Errori comuni:**
• NameError: Variable not defined
• TypeError: Wrong type
• IndentationError: Bad indentation
• IndexError: List index out of range

**💡 Best practices:**
\`\`\`python
import logging
logging.basicConfig(level=logging.DEBUG)

try:
    result = risky_operation()
    logging.info(f'Successo: {result}')
except Exception as e:
    logging.error(f'Errore: {e}')
\`\`\``,
            general: `🐛 **Debug Generale**

**🔍 Strategia di debug:**
1. **Riproduci l'errore** consistentemente
2. **Isola il problema** (binary search)
3. **Leggi i messaggi di errore** attentamente
4. **Usa logging/print** per tracciare
5. **Controlla assunzioni** sui dati

**🛠️ Strumenti universali:**
• Debugger dell'IDE
• Print statements / console.log
• Unit tests
• Code review
• Documentation

**📋 Checklist errori comuni:**
• Typos nei nomi variabili
• Parentesi/virgole mancanti
• Indentazione sbagliata
• Tipi di dati incompatibili
• Variabili non inizializzate`
        };
        
        return debugGuides[language] || debugGuides.general;
    }
    
    // 🏆 Best practices
    getBestPractices(topic) {
        const practices = {
            security: `🔒 **Security Best Practices**

**🛡️ Principi base:**
• **Never trust user input** - Valida sempre
• **Principle of least privilege** - Minime autorizzazioni
• **Defense in depth** - Livelli di sicurezza

**💻 Codice sicuro:**
• Sanifica input (SQL injection, XSS)
• Usa HTTPS ovunque
• Hash password (bcrypt, Argon2)
• Valida sul server, non solo client

**🔑 Gestione autenticazione:**
\`\`\`javascript
// ❌ MAI così
const password = "plaintext";

// ✅ Sempre così
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 12);
\`\`\`

**🌐 Headers sicurezza:**
• Content-Security-Policy
• X-Frame-Options
• X-XSS-Protection
• Strict-Transport-Security`,
            
            performance: `⚡ **Performance Best Practices**

**🚀 Ottimizzazione generale:**
• Misura prima di ottimizzare
• Ottimizza i colli di bottiglia
• Usa caching intelligente
• Minimizza DOM manipulations

**💾 Database:**
• Usa indici appropriati
• Evita query N+1
• Pagina risultati grandi
• Connection pooling

**🌐 Frontend:**
• Minifica CSS/JS
• Comprimi immagini
• Lazy loading
• Code splitting

**📱 Mobile:**
• Responsive design
• Touch-friendly UI
• Ottimizza per reti lente`,
            
            clean: `✨ **Clean Code Practices**

**📖 Leggibilità:**
• Nomi descrittivi per variabili/funzioni
• Funzioni piccole e focalizzate
• Commenti utili, non ovvi
• Consistenza nello stile

**🏗️ Struttura:**
• Single Responsibility Principle
• DRY (Don't Repeat Yourself)
• KISS (Keep It Simple, Stupid)
• YAGNI (You Aren't Gonna Need It)

**💻 Esempio:**
\`\`\`javascript
// ❌ Cattivo
function calc(x, y, z) {
    if (z == 1) return x + y;
    else if (z == 2) return x - y;
    else return x * y;
}

// ✅ Buono
function addNumbers(a, b) {
    return a + b;
}

function subtractNumbers(a, b) {
    return a - b;
}

function multiplyNumbers(a, b) {
    return a * b;
}
\`\`\``
        };
        
        return practices[topic] || `🏆 **Best Practices disponibili:**
        
• \`/best security\` - Sicurezza del codice
• \`/best performance\` - Ottimizzazione performance
• \`/best clean\` - Clean code principles

Quale argomento ti interessa?`;
    }
    
    // 📚 Spiegazioni su richiesta
    getExplanation(concept) {
        switch (concept) {
            case 'api':
                return this.explainAPI();
            case 'async':
                return this.explainAsync();
            case 'oop':
                return this.explainOOP();
            case 'mvc':
                return this.explainMVC();
            default:
                return `📚 **Spiegazioni disponibili:**
                
• \`/explain api\` - Cos'è un'API
• \`/explain async\` - Programmazione asincrona
• \`/explain oop\` - Programmazione ad oggetti
• \`/explain mvc\` - Pattern MVC

Cosa vorresti approfondire?`;
        }
    }
    
    // 🤖 Risposta offline per modalità programmatore
    getOfflineResponse(message) {
        // Analizza il messaggio per parole chiave di programmazione
        const codeKeywords = ['codice', 'programma', 'javascript', 'python', 'html', 'css', 'errore', 'bug', 'debug'];
        const hasCodeKeyword = codeKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        // Controlla se richiede programma di somma
        const sumKeywords = ['somma', 'addizione', 'due numeri', 'input', 'output'];
        const isSumRequest = sumKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (isSumRequest) {
            return this.getSumProgramExamples();
        }
        
        if (message.includes('```') || hasCodeKeyword) {
            return `💻 **Modalità Programmatore Offline**

Vedo che hai una domanda tecnica! Anche in modalità offline posso aiutarti con:

**✅ Disponibile offline:**
• Template di codice (\`/template javascript\`)
• Guide di debug (\`/debug python\`)
• Best practices (\`/best security\`)
• Spiegazioni tecniche (\`/explain api\`)

**🔗 Per analisi avanzate:** Configura l'AI esterna

💡 **Suggerimento:** Prova \`/template javascript\` o \`/help\` per vedere tutte le opzioni!`;
        }
        
        return `💻 Salve, sviluppatore! Modalità offline attiva. 

Posso aiutarti con:
• **Template di codice** - \`/template [linguaggio]\`
• **Guide di debug** - \`/debug [linguaggio]\`
• **Best practices** - \`/best [argomento]\`
• **Spiegazioni** - \`/explain [concetto]\`

Digita \`/help\` per vedere tutti i comandi disponibili!`;
    }
    
    // 🎨 Crea container di codice futuristico
    createCodeContainer(code, language = 'javascript', filename = null) {
        // Detect language if not specified
        if (language === 'auto') {
            language = this.detectLanguage(code);
        }
        
        const containerId = 'code-container-' + Math.random().toString(36).substr(2, 9);
        const lineCount = code.split('\n').length;
        const charCount = code.length;
        const languageInfo = this.getLanguageInfo(language);
        
        // Generate line numbers
        const lineNumbers = Array.from({length: lineCount}, (_, i) => i + 1).join('\n');
        
        const containerHtml = `
        <div class="neural-code-container lang-${language}" id="${containerId}">
            <!-- Header futuristico -->
            <div class="code-header">
                <div class="language-badge">
                    <div class="language-icon">${languageInfo.icon}</div>
                    <span>${languageInfo.name}</span>
                </div>
                
                <div class="code-actions">
                    <button class="code-btn copy-btn" onclick="copyCodeToClipboard('${containerId}')" data-container="${containerId}">
                        <span class="btn-icon">📋</span>
                        <span class="btn-text">Copia</span>
                    </button>
                    
                    <button class="code-btn edit-btn" onclick="enableCodeEdit('${containerId}')" data-container="${containerId}">
                        <span class="btn-icon">✏️</span>
                        <span class="btn-text">Modifica</span>
                    </button>
                    
                    <button class="code-btn download-btn" onclick="downloadCode('${containerId}', '${filename || 'code.' + languageInfo.extension}')" data-container="${containerId}">
                        <span class="btn-icon">💾</span>
                        <span class="btn-text">Salva</span>
                    </button>
                </div>
            </div>
            
            <!-- Area contenuto codice -->
            <div class="code-content" id="${containerId}-content">
                <div class="line-numbers" id="${containerId}-lines">${lineNumbers}</div>
                <textarea class="code-block" id="${containerId}-code" readonly spellcheck="false">${code}</textarea>
            </div>
            
            <!-- Footer informazioni -->
            <div class="code-footer">
                <div class="code-stats">
                    <span>Righe: ${lineCount}</span>
                    <span>Caratteri: ${charCount}</span>
                    <span>Linguaggio: ${languageInfo.name}</span>
                    ${filename ? `<span>File: ${filename}</span>` : ''}
                </div>
                
                <button class="code-expand-btn" onclick="toggleCodeExpansion('${containerId}')" data-container="${containerId}">
                    <span id="${containerId}-expand-text">Espandi</span>
                </button>
            </div>
        </div>
        
        <script>
            // Auto-adjust textarea height
            setTimeout(() => {
                const textarea = document.getElementById('${containerId}-code');
                if (textarea) {
                    textarea.style.height = 'auto';
                    textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
                }
            }, 100);
        </script>
        `;
        
        return containerHtml;
    }
    
    // 🔍 Rileva il linguaggio dal codice
    detectLanguage(code) {
        const lowerCode = code.toLowerCase();
        
        // JavaScript
        if (lowerCode.includes('function') || lowerCode.includes('const ') || 
            lowerCode.includes('let ') || lowerCode.includes('var ') ||
            lowerCode.includes('console.log') || lowerCode.includes('=>')) {
            return 'javascript';
        }
        
        // Python
        if (lowerCode.includes('def ') || lowerCode.includes('import ') ||
            lowerCode.includes('print(') || lowerCode.includes('if __name__') ||
            lowerCode.includes('class ') && lowerCode.includes(':')) {
            return 'python';
        }
        
        // HTML
        if (lowerCode.includes('<!doctype') || lowerCode.includes('<html') ||
            lowerCode.includes('<body') || lowerCode.includes('<div')) {
            return 'html';
        }
        
        // CSS
        if (lowerCode.includes('{') && lowerCode.includes('}') && 
            (lowerCode.includes('color:') || lowerCode.includes('background:') ||
             lowerCode.includes('margin:') || lowerCode.includes('padding:'))) {
            return 'css';
        }
        
        // Java
        if (lowerCode.includes('public class') || lowerCode.includes('public static void main') ||
            lowerCode.includes('system.out.println')) {
            return 'java';
        }
        
        // PHP
        if (lowerCode.includes('<?php') || lowerCode.includes('$_') ||
            lowerCode.includes('echo ') || lowerCode.includes('function ')) {
            return 'php';
        }
        
        // SQL
        if (lowerCode.includes('select ') || lowerCode.includes('from ') ||
            lowerCode.includes('where ') || lowerCode.includes('insert into')) {
            return 'sql';
        }
        
        // TypeScript
        if (lowerCode.includes('interface ') || lowerCode.includes('type ') ||
            lowerCode.includes(': string') || lowerCode.includes(': number')) {
            return 'typescript';
        }
        
        // C++
        if (lowerCode.includes('#include') || lowerCode.includes('using namespace') ||
            lowerCode.includes('int main') || lowerCode.includes('cout <<')) {
            return 'cpp';
        }
        
        // C#
        if (lowerCode.includes('using system') || lowerCode.includes('namespace ') ||
            lowerCode.includes('console.writeline')) {
            return 'csharp';
        }
        
        // Default
        return 'javascript';
    }
    
    // 📋 Ottieni informazioni del linguaggio
    getLanguageInfo(language) {
        const languages = {
            javascript: {
                name: 'JavaScript',
                icon: '⚡',
                extension: 'js',
                color: '#f7df1e'
            },
            python: {
                name: 'Python',
                icon: '🐍',
                extension: 'py',
                color: '#3776ab'
            },
            html: {
                name: 'HTML',
                icon: '🌐',
                extension: 'html',
                color: '#e34f26'
            },
            css: {
                name: 'CSS',
                icon: '🎨',
                extension: 'css',
                color: '#1572b6'
            },
            java: {
                name: 'Java',
                icon: '☕',
                extension: 'java',
                color: '#ed8b00'
            },
            php: {
                name: 'PHP',
                icon: '🐘',
                extension: 'php',
                color: '#777bb4'
            },
            sql: {
                name: 'SQL',
                icon: '🗄️',
                extension: 'sql',
                color: '#336791'
            },
            typescript: {
                name: 'TypeScript',
                icon: '📘',
                extension: 'ts',
                color: '#3178c6'
            },
            cpp: {
                name: 'C++',
                icon: '⚙️',
                extension: 'cpp',
                color: '#00599c'
            },
            csharp: {
                name: 'C#',
                icon: '🔷',
                extension: 'cs',
                color: '#239120'
            },
            json: {
                name: 'JSON',
                icon: '📄',
                extension: 'json',
                color: '#000000'
            },
            xml: {
                name: 'XML',
                icon: '📝',
                extension: 'xml',
                color: '#0060ac'
            }
        };
        
        return languages[language] || languages.javascript;
    }
    
    // 🔍 Controlla se la risposta contiene codice
    containsCode(response) {
        if (!response) return false;
        
        // Controlla presenza di blocchi di codice
        const hasCodeBlocks = /```[\w]*\n.*```/s.test(response);
        
        // Controlla presenza di parole chiave di codice
        const codeIndicators = [
            'function', 'class', 'def ', 'import', 'from', 'const', 'let', 'var',
            'public', 'private', 'protected', 'return', 'if', 'for', 'while',
            '()', '{', '}', '=>', 'console.log', 'print(', 'System.out'
        ];
        
        const hasCodeIndicators = codeIndicators.some(indicator => 
            response.toLowerCase().includes(indicator.toLowerCase())
        );
        
        return hasCodeBlocks || hasCodeIndicators;
    }
    
    // 🎯 Migliora risposta AI aggiungendo codice se mancante
    enhanceResponseWithCode(aiResponse, analysis, originalMessage) {
        console.log('🎯 Miglioramento risposta AI con codice generato');
        
        const customCode = this.generateCustomCode(originalMessage, analysis);
        const filename = this.generateFilename(analysis.language, analysis.codeType);
        const codeContainer = this.createCodeContainer(customCode, analysis.language, filename);
        
        return `${aiResponse}

**💻 Codice Generato:**

${codeContainer}`;
    }
    
    // 🛠️ Genera codice personalizzato basato sulla richiesta
    generateCustomCode(message, analysis) {
        const { language, codeType, contextKeywords, originalMessage } = analysis;
        
        // Template intelligenti basati su keywords e linguaggio
        if (this.isCalculatorRequest(message)) {
            return this.generateCalculatorCode(language, message);
        } else if (this.isFormRequest(message)) {
            return this.generateFormCode(language, message);
        } else if (this.isFunctionRequest(message)) {
            return this.generateFunctionCode(language, message);
        } else if (this.isApiRequest(message)) {
            return this.generateApiCode(language, message);
        } else if (this.isLoopRequest(message)) {
            return this.generateLoopCode(language, message);
        } else {
            return this.generateBasicCode(language, codeType, contextKeywords);
        }
    }
    
    // 🧮 Rileva richieste di calcolatrice/operazioni matematiche
    isCalculatorRequest(message) {
        const calcKeywords = ['calcola', 'somma', 'sottrazione', 'moltiplicazione', 'divisione', 'matematica', 'operazione', 'numero'];
        return calcKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    // 📝 Rileva richieste di form/input
    isFormRequest(message) {
        const formKeywords = ['form', 'formulario', 'input', 'campo', 'inserimento', 'dati'];
        return formKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    // ⚙️ Rileva richieste di funzioni
    isFunctionRequest(message) {
        const funcKeywords = ['funzione', 'function', 'metodo', 'procedura'];
        return funcKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    // 🌐 Rileva richieste API
    isApiRequest(message) {
        const apiKeywords = ['api', 'fetch', 'request', 'http', 'ajax', 'chiamata'];
        return apiKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    // 🔄 Rileva richieste di loop/cicli
    isLoopRequest(message) {
        const loopKeywords = ['loop', 'ciclo', 'ripeti', 'itera', 'for', 'while'];
        return loopKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    // ⚙️ Genera codice per funzioni
    generateFunctionCode(language, message) {
        if (language === 'python') {
            return `def mia_funzione(parametro1, parametro2):
    """
    Descrizione della funzione
    
    Args:
        parametro1: Primo parametro
        parametro2: Secondo parametro
    
    Returns:
        Risultato dell'operazione
    """
    risultato = parametro1 + parametro2
    return risultato

# Esempio di utilizzo
if __name__ == "__main__":
    risultato = mia_funzione(5, 10)
    print(f"Il risultato è: {risultato}")`;
        } else if (language === 'javascript') {
            return `// Funzione tradizionale
function miaFunzione(parametro1, parametro2) {
    // Logica della funzione
    const risultato = parametro1 + parametro2;
    return risultato;
}

// Arrow function (ES6+)
const miaFunzioneArrow = (parametro1, parametro2) => {
    return parametro1 + parametro2;
};

// Arrow function compatta
const somma = (a, b) => a + b;

// Esempio di utilizzo
console.log("Risultato funzione:", miaFunzione(5, 10));
console.log("Risultato arrow:", miaFunzioneArrow(3, 7));
console.log("Risultato somma:", somma(2, 8));`;
        }
        
        return this.generateBasicCode(language, 'function', ['function']);
    }
    
    // 🌐 Genera codice per API
    generateApiCode(language, message) {
        if (language === 'javascript') {
            return `// Chiamata API con fetch
async function fetchData(url) {
    try {
        console.log('Richiesta API a:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer your-token'
            }
        });
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        console.log('Dati ricevuti:', data);
        return data;
        
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

// Esempio di utilizzo
fetchData('https://jsonplaceholder.typicode.com/users/1')
    .then(user => {
        console.log('Utente:', user.name);
        // Usa i dati ricevuti
    })
    .catch(error => {
        console.log('Errore:', error.message);
    });

// POST request
async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return await response.json();
    } catch (error) {
        console.error('Errore POST:', error);
        throw error;
    }
}`;
        } else if (language === 'python') {
            return `import requests
import json

def fetch_data(url):
    """
    Effettua una richiesta GET all'API
    """
    try:
        print(f"Richiesta API a: {url}")
        
        headers = {
            'Content-Type': 'application/json',
            # 'Authorization': 'Bearer your-token'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Solleva eccezione per status HTTP >= 400
        
        data = response.json()
        print("Dati ricevuti:", data)
        return data
        
    except requests.exceptions.RequestException as error:
        print(f"Errore nella richiesta: {error}")
        raise

def post_data(url, data):
    """
    Effettua una richiesta POST all'API
    """
    try:
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as error:
        print(f"Errore POST: {error}")
        raise

# Esempio di utilizzo
if __name__ == "__main__":
    try:
        user = fetch_data('https://jsonplaceholder.typicode.com/users/1')
        print(f"Utente: {user['name']}")
    except Exception as e:
        print(f"Errore: {e}")`;
        }
        
        return this.generateBasicCode(language, 'function', ['api']);
    }
    
    // 🔄 Genera codice per loop/cicli
    generateLoopCode(language, message) {
        if (language === 'python') {
            return `# Esempi di cicli in Python

# For loop con range
print("=== For loop con numeri ===")
for i in range(5):
    print(f"Numero: {i}")

# For loop con lista
print("\\n=== For loop con lista ===")
fruits = ["mela", "banana", "arancia"]
for fruit in fruits:
    print(f"Frutto: {fruit}")

# While loop
print("\\n=== While loop ===")
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1

# List comprehension (ciclo avanzato)
print("\\n=== List comprehension ===")
squares = [x**2 for x in range(5)]
print(f"Quadrati: {squares}")

# Ciclo con enumerate (indice + valore)
print("\\n=== Enumerate ===")
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")`;
        } else if (language === 'javascript') {
            return `// Esempi di cicli in JavaScript

// For loop tradizionale
console.log("=== For loop tradizionale ===");
for (let i = 0; i < 5; i++) {
    console.log(\`Numero: \${i}\`);
}

// For...of loop (per array)
console.log("\\n=== For...of loop ===");
const fruits = ["mela", "banana", "arancia"];
for (const fruit of fruits) {
    console.log(\`Frutto: \${fruit}\`);
}

// For...in loop (per oggetti)
console.log("\\n=== For...in loop ===");
const person = { nome: "Mario", età: 30, città: "Roma" };
for (const key in person) {
    console.log(\`\${key}: \${person[key]}\`);
}

// While loop
console.log("\\n=== While loop ===");
let count = 0;
while (count < 3) {
    console.log(\`Count: \${count}\`);
    count++;
}

// forEach (metodo array)
console.log("\\n=== Array forEach ===");
fruits.forEach((fruit, index) => {
    console.log(\`\${index}: \${fruit}\`);
});

// Map (trasforma array)
console.log("\\n=== Array map ===");
const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(x => x * x);
console.log(\`Originali: \${numbers}\`);
console.log(\`Quadrati: \${squares}\`);`;
        }
        
        return this.generateBasicCode(language, 'function', ['loop']);
    }
    
    // 🏗️ Genera codice di base
    generateBasicCode(language, codeType, contextKeywords) {
        // Usa i template esistenti come fallback
        const templates = this.codeTemplates[language];
        if (templates) {
            return templates.basic || templates[Object.keys(templates)[0]];
        }
        
        // Genera template minimo se il linguaggio non è supportato
        switch (language) {
            case 'java':
                return `public class Example {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        
        // Il tuo codice qui
        String message = "Benvenuto in Java!";
        System.out.println(message);
    }
}`;
            
            case 'php':
                return `<?php
// PHP Script
echo "Hello World!\\n";

// Variabili
$nome = "Il tuo nome";
$eta = 25;

// Funzione
function saluta($nome) {
    return "Ciao " . $nome . "!");
}

echo saluta($nome);
?>`;
            
            case 'sql':
                return `-- SQL Query Example
SELECT * FROM users WHERE active = 1;

-- Inserimento dati
INSERT INTO users (nome, email, data_registrazione)
VALUES ('Mario Rossi', 'mario@email.com', NOW());

-- Aggiornamento
UPDATE users 
SET ultimo_accesso = NOW() 
WHERE id = 1;

-- Query con JOIN
SELECT u.nome, u.email, p.titolo as post_title
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE u.active = 1;`;
            
            default:
                return `// Codice di esempio per ${language}
console.log("Hello World!");

// Il tuo codice qui
const message = "Benvenuto!";
console.log(message);`;
        }
    }
}

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
        return await this.main.getAIResponse(message, null, 'programmatore');
    }
    
    // 🔍 Controlla se è una richiesta di codice
    isCodeRequest(message) {
        const codeKeywords = [
            'codice', 'programma', 'script', 'funzione', 'classe', 'metodo',
            'javascript', 'python', 'java', 'html', 'css', 'sql', 'php',
            'template', 'esempio', 'come si fa', 'come creare', 'come scrivere',
            'algoritmo', 'implementazione', 'scrivimi', 'mostrami', 'fammi vedere'
        ];
        
        const lowerMessage = message.toLowerCase();
        return codeKeywords.some(keyword => lowerMessage.includes(keyword));
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
        const lowerMessage = message.toLowerCase();
        
        // Rileva il linguaggio richiesto
        let language = 'javascript'; // default
        if (lowerMessage.includes('python')) language = 'python';
        else if (lowerMessage.includes('java')) language = 'java';
        else if (lowerMessage.includes('html')) language = 'html';
        else if (lowerMessage.includes('css')) language = 'css';
        
        // Rileva il tipo di template
        let templateType = 'basic';
        if (lowerMessage.includes('async') || lowerMessage.includes('promise')) templateType = 'async';
        else if (lowerMessage.includes('class') || lowerMessage.includes('oggetto')) templateType = 'class';
        else if (lowerMessage.includes('react') || lowerMessage.includes('component')) templateType = 'react';
        else if (lowerMessage.includes('form') || lowerMessage.includes('modulo')) templateType = 'form';
        
        // Controlla richieste specifiche
        if (lowerMessage.includes('somma') && lowerMessage.includes('numeri')) {
            return this.getSumProgramExamples();
        }
        
        // Restituisce il template appropriato
        return this.getCodeTemplate(language, templateType, message);
    }
    
    // 🐛 Gestisce richieste di debug
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
        
        return `💻 **Template ${language.charAt(0).toUpperCase() + language.slice(1)} - ${type}**

\`\`\`${language}
${template}
\`\`\`

**💡 Suggerimenti:**
• Modifica il codice secondo le tue esigenze
• Testa il codice in un ambiente di sviluppo
• Usa \`/debug ${language}\` per guide di debug

**🔧 Altri template disponibili:**
${Object.keys(templates).map(t => `• \`/template ${language} ${t}\``).join('\n')}`;
    }
    
    // 🔢 Esempi specifici per programma di somma
    getSumProgramExamples() {
        return `💻 **Programma per sommare due numeri**

Ecco implementazioni complete in diversi linguaggi:

**🐍 Python:**
\`\`\`python
# Input
num1 = float(input("Inserisci il primo numero: "))
num2 = float(input("Inserisci il secondo numero: "))

# Somma
somma = num1 + num2

# Output
print(f"La somma è: {somma}")
\`\`\`

**🟨 JavaScript (Browser):**
\`\`\`javascript
// Input
const num1 = parseFloat(prompt("Inserisci il primo numero:"));
const num2 = parseFloat(prompt("Inserisci il secondo numero:"));

// Somma
const somma = num1 + num2;

// Output
console.log(\`La somma è: \${somma}\`);
alert(\`La somma è: \${somma}\`);
\`\`\`

**🟨 JavaScript (Node.js):**
\`\`\`javascript
const readline = require('readline');

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
});
\`\`\`

**☕ Java:**
\`\`\`java
import java.util.Scanner;

public class SommaDueNumeri {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Inserisci il primo numero: ");
        double num1 = scanner.nextDouble();
        
        System.out.print("Inserisci il secondo numero: ");
        double num2 = scanner.nextDouble();
        
        double somma = num1 + num2;
        System.out.println("La somma è: " + somma);
        
        scanner.close();
    }
}
\`\`\`

💡 **Quale preferisci?** Ogni linguaggio ha i suoi vantaggi!`;
    }
    
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
}

// Export del modulo per uso globale
window.ProgrammatoreHandler = ProgrammatoreHandler;

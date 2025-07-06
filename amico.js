// 💬 AMICO.JS - Gestione modalità Amico
// Conversazione amichevole, giochi (scacchi), chat informale

console.log('💬 Caricamento modulo Amico...');

class AmicoHandler {
    constructor(mainInstance) {
        this.main = mainInstance;
        this.currentCategory = 'amico';
        
        // ♟️ Sistema scacchi
        this.chessGame = {
            active: false,
            board: null,
            turn: 'white',
            selectedSquare: null,
            moveHistory: [],
            gameId: null
        };
        
        console.log('💬 AmicoHandler inizializzato');
    }
    
    // 💬 Gestisce tutti i messaggi per la modalità amico
    async handleMessage(message) {
        console.log('💬 Elaborazione messaggio amico:', message);
        
        // Controlla richieste di gioco
        if (this.isChessRequest(message)) {
            return await this.handleChessRequest(message);
        }
        
        // Controlla richieste amichevoli
        if (this.isFriendlyChat(message)) {
            return await this.handleFriendlyChat(message);
        }
        
        // Risposta AI normale per modalità amico
        return await this.main.getAIResponse(message, null, 'amico');
    }
    
    // ♟️ Controlla se è una richiesta di scacchi
    isChessRequest(message) {
        const chessKeywords = [
            'scacchi', 'scacco', 'partita', 'giochiamo', 'chess', 
            'gioco', 'giocare', 'scacchiera', 'mossa', 'pedone', 
            'torre', 'cavallo', 'alfiere', 'regina', 're'
        ];
        
        const lowerMessage = message.toLowerCase();
        return chessKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    // 💬 Controlla se è chat amichevole
    isFriendlyChat(message) {
        const friendlyKeywords = [
            'ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'hello',
            'come stai', 'come va', 'che fai', 'novità', 'come ti chiami',
            'età', 'anni', 'famiglia', 'amici', 'hobby', 'passioni'
        ];
        
        const lowerMessage = message.toLowerCase();
        return friendlyKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    // ♟️ Gestisce richieste di scacchi
    async handleChessRequest(message) {
        console.log('♟️ Richiesta scacchi rilevata:', message);
        
        const response = `♟️ **Fantastico! Giochiamo a scacchi!**\n\nSto preparando la scacchiera... Sarai i pezzi bianchi e inizierai tu!\n\nClicca su un pezzo per selezionarlo, poi clicca dove vuoi muoverlo.\n\n*Preparati per una bella partita!* 🎯`;
        
        // Avvia la partita dopo un breve delay
        setTimeout(() => {
            this.startChessGame();
        }, 1000);
        
        return response;
    }
    
    // ♟️ Avvia una partita di scacchi
    startChessGame() {
        try {
            console.log('♟️ Avvio partita di scacchi...');
            
            this.chessGame.active = true;
            this.chessGame.turn = 'white';
            this.chessGame.selectedSquare = null;
            this.chessGame.moveHistory = [];
            this.chessGame.gameId = 'chess-' + Date.now();
            
            // Crea la scacchiera
            const chessBoard = this.createChessBoard();
            
            // Aggiungi la scacchiera alla chat
            this.main.addChatMessage('', 'ai', chessBoard);
            
            console.log('♟️ Partita di scacchi avviata');
        } catch (error) {
            console.error('❌ Errore nell\'avvio scacchi:', error);
        }
    }
    
    // ♟️ Crea la scacchiera HTML
    createChessBoard() {
        const boardContainer = document.createElement('div');
        boardContainer.className = 'chess-game-container';
        boardContainer.style.cssText = `
            margin: 20px 0;
            text-align: center;
            background: linear-gradient(135deg, #2c3e50, #34495e);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        // Header del gioco
        const gameHeader = document.createElement('div');
        gameHeader.style.cssText = `
            color: #ecf0f1;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        `;
        gameHeader.innerHTML = '♟️ <span style="color: #f1c40f;">Partita di Scacchi</span>';
        
        // Scacchiera
        const chessBoard = document.createElement('div');
        chessBoard.className = 'chess-board';
        chessBoard.id = this.chessGame.gameId;
        chessBoard.style.cssText = `
            display: grid;
            grid-template-columns: repeat(8, 50px);
            grid-template-rows: repeat(8, 50px);
            gap: 1px;
            margin: 0 auto;
            border: 3px solid #34495e;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        `;
        
        // Inizializza posizioni pezzi
        this.initializeChessPieces();
        
        // Crea le caselle
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'chess-square';
                square.dataset.row = row;
                square.dataset.col = col;
                square.dataset.position = String.fromCharCode(97 + col) + (8 - row);
                
                // Colore alternato
                const isLight = (row + col) % 2 === 0;
                square.style.cssText = `
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: ${isLight ? '#f0d9b5' : '#b58863'};
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 28px;
                    user-select: none;
                `;
                
                // Pezzo sulla casella
                const piece = this.getPieceAt(row, col);
                if (piece) {
                    square.textContent = piece.symbol;
                    square.dataset.piece = piece.type;
                    square.dataset.color = piece.color;
                }
                
                // Event listener per click
                square.addEventListener('click', (e) => this.handleSquareClick(e));
                
                // Hover effects
                square.addEventListener('mouseenter', () => {
                    if (!square.classList.contains('selected')) {
                        square.style.background = isLight ? '#ffe066' : '#d4a574';
                    }
                });
                
                square.addEventListener('mouseleave', () => {
                    if (!square.classList.contains('selected')) {
                        square.style.background = isLight ? '#f0d9b5' : '#b58863';
                    }
                });
                
                chessBoard.appendChild(square);
            }
        }
        
        // Info partita
        const gameInfo = document.createElement('div');
        gameInfo.style.cssText = `
            margin-top: 15px;
            color: #bdc3c7;
            font-size: 14px;
        `;
        gameInfo.innerHTML = `
            <div style="margin-bottom: 8px;">
                <span style="color: #f1c40f;">Turno:</span> 
                <span id="current-turn" style="color: #ecf0f1; font-weight: bold;">Bianchi (Tu)</span>
            </div>
            <div style="font-size: 12px; color: #95a5a6;">
                💡 Clicca su un pezzo per selezionarlo, poi clicca dove vuoi muoverlo
            </div>
        `;
        
        // Assembla tutto
        boardContainer.appendChild(gameHeader);
        boardContainer.appendChild(chessBoard);
        boardContainer.appendChild(gameInfo);
        
        return boardContainer;
    }
    
    // ♟️ Inizializza posizioni iniziali dei pezzi
    initializeChessPieces() {
        this.chessGame.board = [
            // Row 0 (8th rank) - Black pieces
            ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
            // Row 1 (7th rank) - Black pawns  
            ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
            // Rows 2-5 - Empty
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            // Row 6 (2nd rank) - White pawns
            ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
            // Row 7 (1st rank) - White pieces
            ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
        ];
    }
    
    // ♟️ Ottiene il pezzo in una posizione
    getPieceAt(row, col) {
        const symbol = this.chessGame.board[row][col];
        if (!symbol) return null;
        
        const isWhite = ['♔', '♕', '♖', '♗', '♘', '♙'].includes(symbol);
        const pieceTypes = {
            '♔': 'king', '♚': 'king',
            '♕': 'queen', '♛': 'queen', 
            '♖': 'rook', '♜': 'rook',
            '♗': 'bishop', '♝': 'bishop',
            '♘': 'knight', '♞': 'knight',
            '♙': 'pawn', '♟': 'pawn'
        };
        
        return {
            symbol: symbol,
            type: pieceTypes[symbol],
            color: isWhite ? 'white' : 'black'
        };
    }
    
    // ♟️ Gestisce click sulle caselle
    handleSquareClick(event) {
        if (!this.chessGame.active) return;
        
        const square = event.target;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = this.getPieceAt(row, col);
        
        // Se nessuna casella selezionata
        if (!this.chessGame.selectedSquare) {
            if (piece && piece.color === this.chessGame.turn) {
                this.selectSquare(square, row, col);
            }
            return;
        }
        
        // Se stessa casella, deseleziona
        if (this.chessGame.selectedSquare.row === row && this.chessGame.selectedSquare.col === col) {
            this.deselectSquare();
            return;
        }
        
        // Tentativo di mossa
        this.attemptMove(this.chessGame.selectedSquare.row, this.chessGame.selectedSquare.col, row, col);
    }
    
    // ♟️ Seleziona una casella
    selectSquare(square, row, col) {
        // Rimuovi selezione precedente
        this.clearSelection();
        
        // Seleziona nuova casella
        square.classList.add('selected');
        square.style.background = '#f1c40f';
        square.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)';
        
        this.chessGame.selectedSquare = { row, col, element: square };
        
        // Mostra mosse possibili (semplificato)
        this.highlightPossibleMoves(row, col);
    }
    
    // ♟️ Deseleziona casella
    deselectSquare() {
        this.clearSelection();
        this.chessGame.selectedSquare = null;
    }
    
    // ♟️ Pulisce selezione
    clearSelection() {
        const board = document.getElementById(this.chessGame.gameId);
        if (!board) return;
        
        const squares = board.querySelectorAll('.chess-square');
        squares.forEach(square => {
            square.classList.remove('selected', 'possible-move');
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const isLight = (row + col) % 2 === 0;
            square.style.background = isLight ? '#f0d9b5' : '#b58863';
            square.style.boxShadow = 'none';
        });
    }
    
    // ♟️ Evidenzia mosse possibili (semplificato)
    highlightPossibleMoves(row, col) {
        const piece = this.getPieceAt(row, col);
        if (!piece) return;
        
        const board = document.getElementById(this.chessGame.gameId);
        if (!board) return;
        
        // Logica semplificata - mosse basilari per ogni pezzo
        const possibleMoves = this.calculatePossibleMoves(row, col, piece);
        
        possibleMoves.forEach(([r, c]) => {
            const targetSquare = board.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (targetSquare) {
                targetSquare.classList.add('possible-move');
                targetSquare.style.background = '#27ae60';
                targetSquare.style.opacity = '0.8';
            }
        });
    }
    
    // ♟️ Calcola mosse possibili (semplificato)
    calculatePossibleMoves(row, col, piece) {
        const moves = [];
        
        switch (piece.type) {
            case 'pawn':
                const direction = piece.color === 'white' ? -1 : 1;
                const newRow = row + direction;
                if (newRow >= 0 && newRow < 8 && !this.getPieceAt(newRow, col)) {
                    moves.push([newRow, col]);
                }
                break;
                
            case 'rook':
                // Mosse orizzontali e verticali (semplificato)
                for (let i = 0; i < 8; i++) {
                    if (i !== row) moves.push([i, col]);
                    if (i !== col) moves.push([row, i]);
                }
                break;
                
            case 'knight':
                const knightMoves = [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                    [1, -2], [1, 2], [2, -1], [2, 1]
                ];
                knightMoves.forEach(([dr, dc]) => {
                    const newR = row + dr;
                    const newC = col + dc;
                    if (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {
                        moves.push([newR, newC]);
                    }
                });
                break;
                
            // Altri pezzi... (semplificato per ora)
            default:
                // Mosse adiacenti per semplicità
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const newR = row + dr;
                        const newC = col + dc;
                        if (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {
                            moves.push([newR, newC]);
                        }
                    }
                }
        }
        
        return moves.filter(([r, c]) => {
            const targetPiece = this.getPieceAt(r, c);
            return !targetPiece || targetPiece.color !== piece.color;
        });
    }
    
    // ♟️ Tenta una mossa
    attemptMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.getPieceAt(fromRow, fromCol);
        const targetPiece = this.getPieceAt(toRow, toCol);
        
        // Validazione base
        if (!piece || piece.color !== this.chessGame.turn) {
            this.deselectSquare();
            return;
        }
        
        // Esegui la mossa
        this.executeMove(fromRow, fromCol, toRow, toCol);
        
        // Cambia turno
        this.switchTurn();
        
        // Deseleziona
        this.deselectSquare();
        
        // Se è il turno del computer, fai una mossa automatica
        if (this.chessGame.turn === 'black') {
            setTimeout(() => this.makeComputerMove(), 1500);
        }
    }
    
    // ♟️ Esegue la mossa
    executeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.chessGame.board[fromRow][fromCol];
        const targetPiece = this.chessGame.board[toRow][toCol];
        
        // Aggiorna board interno
        this.chessGame.board[toRow][toCol] = piece;
        this.chessGame.board[fromRow][fromCol] = null;
        
        // Aggiorna visualizzazione
        const board = document.getElementById(this.chessGame.gameId);
        if (board) {
            const fromSquare = board.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
            const toSquare = board.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
            
            if (fromSquare && toSquare) {
                // Muovi il pezzo visualmente
                toSquare.textContent = piece;
                toSquare.dataset.piece = fromSquare.dataset.piece;
                toSquare.dataset.color = fromSquare.dataset.color;
                
                fromSquare.textContent = '';
                delete fromSquare.dataset.piece;
                delete fromSquare.dataset.color;
            }
        }
        
        // Registra la mossa
        const moveNotation = this.getMoveNotation(fromRow, fromCol, toRow, toCol, piece, targetPiece);
        this.chessGame.moveHistory.push(moveNotation);
        
        console.log('♟️ Mossa eseguita:', moveNotation);
    }
    
    // ♟️ Cambia turno
    switchTurn() {
        this.chessGame.turn = this.chessGame.turn === 'white' ? 'black' : 'white';
        
        const turnElement = document.getElementById('current-turn');
        if (turnElement) {
            turnElement.textContent = this.chessGame.turn === 'white' ? 'Bianchi (Tu)' : 'Neri (Computer)';
            turnElement.style.color = this.chessGame.turn === 'white' ? '#ecf0f1' : '#e74c3c';
        }
    }
    
    // ♟️ Mossa del computer (semplificata)
    makeComputerMove() {
        if (this.chessGame.turn !== 'black') return;
        
        // Trova tutti i pezzi neri e le loro mosse possibili
        const blackMoves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPieceAt(row, col);
                if (piece && piece.color === 'black') {
                    const moves = this.calculatePossibleMoves(row, col, piece);
                    moves.forEach(([toRow, toCol]) => {
                        blackMoves.push({ from: [row, col], to: [toRow, toCol] });
                    });
                }
            }
        }
        
        if (blackMoves.length === 0) {
            console.log('♟️ Nessuna mossa disponibile per il computer');
            return;
        }
        
        // Scegli una mossa casuale
        const randomMove = blackMoves[Math.floor(Math.random() * blackMoves.length)];
        const [fromRow, fromCol] = randomMove.from;
        const [toRow, toCol] = randomMove.to;
        
        // Esegui la mossa
        this.executeMove(fromRow, fromCol, toRow, toCol);
        this.switchTurn();
        
        console.log('♟️ Computer ha mosso da', `${fromRow},${fromCol}`, 'a', `${toRow},${toCol}`);
    }
    
    // ♟️ Notazione mossa (semplificata)
    getMoveNotation(fromRow, fromCol, toRow, toCol, piece, captured) {
        const fromSquare = String.fromCharCode(97 + fromCol) + (8 - fromRow);
        const toSquare = String.fromCharCode(97 + toCol) + (8 - toRow);
        return `${piece}${fromSquare}-${toSquare}${captured ? 'x' + captured : ''}`;
    }
    
    // 💬 Gestisce chat amichevole
    async handleFriendlyChat(message) {
        console.log('💬 Chat amichevole:', message);
        
        const lowerMessage = message.toLowerCase();
        
        // Saluti
        const greetings = ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'hello'];
        const questions = ['come stai', 'come va', 'che fai', 'novità'];
        const help = ['aiuto', 'help', 'non so', 'problema'];
        
        const isGreeting = greetings.some(g => lowerMessage.includes(g));
        const isQuestion = questions.some(q => lowerMessage.includes(q));
        const needsHelp = help.some(h => lowerMessage.includes(h));
        
        if (isGreeting) {
            const responses = [
                '😊 Ehi, ciao! Come va oggi?',
                '😊 Ciao! Che bello sentirti! Come stai?',
                '😊 Salve! Sempre un piacere parlare con te!',
                '😊 Hey! Tutto bene? Dimmi, cosa fai di bello?'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        if (isQuestion) {
            const responses = [
                '😊 Tutto bene da queste parti! E tu invece? Cosa combini di bello?',
                '😊 Sto benissimo, grazie! Mi piace sempre chiacchierare con te. Tu come va?',
                '😊 Alla grande! Oggi sono particolarmente in forma per una bella conversazione!',
                '😊 Tutto perfetto! E tu? Raccontami cosa hai fatto di interessante!'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        if (needsHelp) {
            return '😊 Hey, dimmi pure! Di cosa hai bisogno? Posso aiutarti a chiacchierare o se ti va possiamo fare una partita a scacchi! Sono qui per te.';
        }
        
        // Risposte generiche amichevoli
        const friendlyResponses = [
            '😊 Interessante! Raccontami di più.',
            '😊 Ah sì? E tu che ne pensi?',
            '😊 Mi piace parlare con te! Continua pure.',
            '😊 Mmh, capisco. Dimmi altro!',
            '😊 Davvero? Che figata! Come è andata?',
            '😊 Ah interessante! E poi?',
            '😊 Bello! Mi hai incuriosito.',
            '😊 Wow, non ci avevo mai pensato! Cosa te lo ha fatto venire in mente?',
            '😊 Che bello! Mi piace quando condividi queste cose con me.',
            '😊 Eheh, sei sempre così interessante da sentire!'
        ];
        
        return friendlyResponses[Math.floor(Math.random() * friendlyResponses.length)];
    }
    
    // 🔧 Metodi di utilità
    getOfflineResponse(message) {
        return '😊 Ciao! Sono la modalità amico. Mi piace chiacchierare e giocare! Vuoi fare una partita a scacchi o preferisci parlare di qualcosa?';
    }
}

// Rendi disponibile globalmente
window.AmicoHandler = AmicoHandler;

console.log('✅ Modulo Amico caricato con successo');

// 🎵 MUSICA.JS - Gestione modalità Musica
// Ricerca YouTube, riproduzione, raccomandazioni musicali

console.log('🎵 Caricamento modulo Musica...');

class MusicaHandler {
    constructor(mainInstance) {
        this.main = mainInstance;
        this.currentCategory = 'musica';
        
        // Inizializza stili YouTube Player
        this.initializeYouTubePlayerStyles();
        
        console.log('🎵 MusicaHandler inizializzato');
    }
    
    // 🎵 Gestisce tutti i messaggi per la modalità musica
    async handleMessage(message) {
        console.log('🎵 Elaborazione messaggio musica:', message);
        
        if (this.isMusicRequest(message)) {
            return await this.handleMusicRequest(message);
        }
        
        // Risposta AI normale per modalità musica
        return await this.main.getAIResponse(message, null, 'musica');
    }
    
    // 🎵 Controlla se è una richiesta musicale
    isMusicRequest(message) {
        const lowerMessage = message.toLowerCase();
        
        // Keywords principali per riconoscimento musicale
        const musicKeywords = [
            'musica', 'canzone', 'brano', 'artista', 'cantante', 'album', 'band', 'gruppo',
            'suona', 'ascolta', 'riproduci', 'metti', 'play', 'fammi sentire', 'voglio sentire',
            'music', 'song', 'artist', 'listen', 'track', 'singer', 'consigliami', 'suggerisci',
            'simile a', 'come', 'genere', 'rock', 'pop', 'jazz', 'classica', 'rap', 'hip hop',
            'youtube', 'spotify', 'playlist', 'radio', 'concerto', 'festival', 'discografia'
        ];
        
        // Patterns specifici per richieste musicali
        const musicPatterns = [
            /(?:riproduci|suona|ascolta|play|metti)\s+/i,
            /(?:fammi\s+(?:sentire|ascoltare))\s+/i,
            /(?:voglio\s+(?:sentire|ascoltare))\s+/i,
            /(?:consigliami|suggerisci)\s+(?:una\s+canzone|un\s+brano|della\s+musica)/i,
            /(?:musica|canzoni|brani)\s+simili?\s+a\s+/i,
            /(?:chi\s+è|dimmi\s+di|parlami\s+di)\s+.+\s*(?:cantante|artista|musicista|band|gruppo)/i,
            /(?:il\s+genere|lo\s+stile)\s+musicale/i,
            /(?:album|discografia|singolo)\s+di\s+/i
        ];
        
        // Controlla patterns specifici
        const hasPattern = musicPatterns.some(pattern => pattern.test(lowerMessage));
        if (hasPattern) return true;
        
        // Controlla keywords
        const hasKeyword = musicKeywords.some(keyword => lowerMessage.includes(keyword));
        if (hasKeyword) return true;
        
        // Controlla nomi di artisti famosi
        const famousArtists = [
            'beatles', 'queen', 'elvis', 'michael jackson', 'madonna', 'bob dylan',
            'led zeppelin', 'pink floyd', 'rolling stones', 'david bowie', 'adele',
            'ed sheeran', 'taylor swift', 'beyonce', 'eminem', 'drake', 'radiohead'
        ];
        
        return famousArtists.some(artist => lowerMessage.includes(artist));
    }
    
    // 🎵 Gestisce le richieste musicali
    async handleMusicRequest(message) {
        try {
            console.log('🎵 Elaborazione richiesta musicale avanzata:', message);
            
            // Analizza il tipo di richiesta musicale
            const requestType = this.analyzeMusicRequestType(message);
            console.log('🎵 Tipo richiesta rilevato:', requestType);
            
            let response = '';
            
            switch (requestType.type) {
                case 'play':
                    response = await this.handlePlayRequest(message, requestType);
                    break;
                case 'recommend':
                    response = await this.handleRecommendationRequest(message, requestType);
                    break;
                case 'similar':
                    response = await this.handleSimilarMusicRequest(message, requestType);
                    break;
                case 'artist_info':
                    response = await this.handleArtistInfoRequest(message, requestType);
                    break;
                default:
                    response = await this.handleGeneralMusicRequest(message);
            }
            
            return response;
            
        } catch (error) {
            console.error('❌ Errore nella gestione richiesta musicale:', error);
            return '🎵 Si è verificato un errore nella ricerca musicale. Riprova con una richiesta diversa.';
        }
    }
    
    // 🎯 Analizza il tipo di richiesta musicale
    analyzeMusicRequestType(message) {
        const lowerMessage = message.toLowerCase();
        
        // Pattern per "riproduci/suona/ascolta"
        const playPatterns = [
            /(?:riproduci|suona|ascolta|metti|play)\s+(.+)/i,
            /(?:fammi\s+(?:sentire|ascoltare))\s+(.+)/i,
            /(?:voglio\s+(?:sentire|ascoltare))\s+(.+)/i
        ];
        
        // Pattern per "consigliami"
        const recommendPatterns = [
            /(?:consigliami|suggerisci|proponi)\s+(?:una\s+canzone|un\s+brano|della\s+musica)(?:\s+di\s+(.+))?/i,
            /(?:che\s+(?:canzone|brano|musica))\s+mi\s+consigli(?:\s+di\s+(.+))?/i,
            /(?:cosa\s+(?:dovrei|posso)\s+ascoltare)(?:\s+di\s+(.+))?/i
        ];
        
        // Pattern per "simile a"
        const similarPatterns = [
            /(?:musica|canzoni|brani)\s+simili?\s+a\s+(.+)/i,
            /(?:come|tipo)\s+(.+)/i,
            /(?:nello\s+stesso\s+stile\s+di)\s+(.+)/i
        ];
        
        // Pattern per info artista
        const artistInfoPatterns = [
            /(?:chi\s+è|dimmi\s+di|parlami\s+di|informazioni\s+su)\s+(.+)/i,
            /(?:cosa\s+sai\s+su)\s+(.+)/i
        ];
        
        // Controlla ogni tipo
        for (const pattern of playPatterns) {
            const match = lowerMessage.match(pattern);
            if (match) {
                return { type: 'play', query: match[1].trim(), originalMessage: message };
            }
        }
        
        for (const pattern of recommendPatterns) {
            const match = lowerMessage.match(pattern);
            if (match) {
                return { 
                    type: 'recommend', 
                    artist: match[1] ? match[1].trim() : null,
                    originalMessage: message 
                };
            }
        }
        
        for (const pattern of similarPatterns) {
            const match = lowerMessage.match(pattern);
            if (match) {
                return { type: 'similar', reference: match[1].trim(), originalMessage: message };
            }
        }
        
        for (const pattern of artistInfoPatterns) {
            const match = lowerMessage.match(pattern);
            if (match) {
                return { type: 'artist_info', artist: match[1].trim(), originalMessage: message };
            }
        }
        
        return { type: 'general', originalMessage: message };
    }
    
    // 🎵 Gestisce richieste di riproduzione
    async handlePlayRequest(message, requestData) {
        const query = requestData.query;
        console.log('🎵 Richiesta riproduzione:', query);
        
        try {
            // Cerca su YouTube
            const youtubeResults = await this.searchYouTube(query);
            
            if (youtubeResults.length === 0) {
                return await this.generateMusicFallbackResponse(query, 'play');
            }
            
            const topResult = youtubeResults[0];
            
            // Genera il componente embed del video
            const embedComponent = this.createYouTubeEmbed(topResult);
            
            // Ottieni informazioni aggiuntive dall'AI
            const musicInfo = await this.getMusicInfoFromAI(topResult.title, 'play');
            
            return `🎵 **Riproduzione: ${topResult.title}**\n\n${embedComponent}\n\n${musicInfo}`;
            
        } catch (error) {
            console.error('❌ Errore riproduzione:', error);
            return await this.generateMusicFallbackResponse(query, 'play');
        }
    }
    
    // 🎵 Gestisce richieste di raccomandazioni
    async handleRecommendationRequest(message, requestData) {
        const artist = requestData.artist;
        console.log('🎵 Richiesta raccomandazione per:', artist);
        
        try {
            let searchQuery = '';
            let aiPrompt = '';
            
            if (artist) {
                searchQuery = `${artist} best songs`;
                aiPrompt = `Consigliami 3-4 delle migliori canzoni di ${artist}. Per ogni canzone, dimmi perché è speciale e interessante.`;
            } else {
                // Raccomandazione generica
                aiPrompt = 'Consigliami 3-4 canzoni bellissime di diversi generi musicali. Per ogni canzone, dimmi artista, titolo e perché dovrei ascoltarla.';
                searchQuery = 'popular music songs';
            }
            
            // Ottieni raccomandazioni dall'AI
            const aiRecommendations = await this.main.getAIResponse(aiPrompt, null, 'musica');
            
            // Se specificato un artista, cerca anche su YouTube
            if (artist) {
                const youtubeResults = await this.searchYouTube(searchQuery);
                
                if (youtubeResults.length > 0) {
                    const topSongs = youtubeResults.slice(0, 2);
                    let youtubeSection = '\n\n🎬 **Top Brani su YouTube:**\n\n';
                    
                    topSongs.forEach(song => {
                        youtubeSection += this.createYouTubeEmbed(song) + '\n';
                    });
                    
                    return `${aiRecommendations}${youtubeSection}`;
                }
            }
            
            return aiRecommendations;
            
        } catch (error) {
            console.error('❌ Errore raccomandazione:', error);
            return await this.generateMusicFallbackResponse(artist || 'musica', 'recommend');
        }
    }
    
    // 🎵 Gestisce richieste di musica simile
    async handleSimilarMusicRequest(message, requestData) {
        const reference = requestData.reference;
        console.log('🎵 Richiesta musica simile a:', reference);
        
        try {
            const aiPrompt = `Suggerisci 3-4 artisti o canzoni simili a "${reference}". Spiega perché sono simili e cosa hanno in comune (genere, stile, epoca, etc.).`;
            
            const aiResponse = await this.main.getAIResponse(aiPrompt, null, 'musica');
            
            // Cerca anche esempi su YouTube
            const searchQuery = `music like ${reference}`;
            const youtubeResults = await this.searchYouTube(searchQuery);
            
            if (youtubeResults.length > 0) {
                const similarSongs = youtubeResults.slice(0, 2);
                let youtubeSection = '\n\n🎬 **Esempi che potresti gradire:**\n\n';
                
                similarSongs.forEach(song => {
                    youtubeSection += this.createYouTubeEmbed(song) + '\n';
                });
                
                return `${aiResponse}${youtubeSection}`;
            }
            
            return aiResponse;
            
        } catch (error) {
            console.error('❌ Errore ricerca simile:', error);
            return await this.generateMusicFallbackResponse(reference, 'similar');
        }
    }
    
    // 🎵 Gestisce richieste di informazioni su artisti
    async handleArtistInfoRequest(message, requestData) {
        const artist = requestData.artist;
        console.log('🎵 Richiesta info artista:', artist);
        
        try {
            const aiPrompt = `Dimmi tutto quello che sai su ${artist}: biografia, genere musicale, album famosi, curiosità interessanti. Includi anche qualche canzone che consigli di ascoltare.`;
            
            const aiResponse = await this.main.getAIResponse(aiPrompt, null, 'musica');
            
            // Cerca canzoni popolari dell'artista
            const searchQuery = `${artist} popular songs`;
            const youtubeResults = await this.searchYouTube(searchQuery);
            
            if (youtubeResults.length > 0) {
                const popularSongs = youtubeResults.slice(0, 2);
                let songsSection = '\n\n🎵 **Le sue canzoni più popolari:**\n\n';
                
                popularSongs.forEach(song => {
                    songsSection += this.createYouTubeEmbed(song) + '\n';
                });
                
                return `${aiResponse}${songsSection}`;
            }
            
            return aiResponse;
            
        } catch (error) {
            console.error('❌ Errore info artista:', error);
            return await this.generateMusicFallbackResponse(artist, 'artist_info');
        }
    }
    
    // 🎵 Gestisce richieste musicali generiche
    async handleGeneralMusicRequest(message) {
        try {
            const aiPrompt = `L'utente ha fatto questa richiesta musicale: "${message}". Rispondi in modo utile e coinvolgente, offrendo consigli, informazioni o suggerimenti musicali pertinenti.`;
            
            return await this.main.getAIResponse(aiPrompt, null, 'musica');
            
        } catch (error) {
            console.error('❌ Errore richiesta generale:', error);
            return '🎵 Sono qui per aiutarti con tutto quello che riguarda la musica! Puoi chiedermi di riprodurre una canzone, consigliarti artisti, parlare di generi musicali o qualsiasi altra cosa ti venga in mente. Cosa vorresti sapere?';
        }
    }
    
    // 🎬 Crea componente embed YouTube FUTURISTICO
    createYouTubeEmbed(videoData) {
        const videoId = this.extractYouTubeVideoId(videoData.url);
        if (!videoId) {
            return this.createFallbackVideoPlayer(videoData);
        }
        
        const playerId = 'youtube-player-' + Math.random().toString(36).substr(2, 9);
        
        // Creiamo il componente che si integra perfettamente con l'estetica della chat
        const embedHtml = `
        <div class="neural-media-player" style="
            margin: 20px 0;
            background: linear-gradient(145deg, #0f1419, #1a1f24);
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 12px;
            padding: 0;
            box-shadow: 
                0 0 20px rgba(0, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            max-width: 100%;
        ">
            <!-- Header futuristico -->
            <div class="media-header" style="
                background: linear-gradient(90deg, #1a1f24, #0f1419);
                padding: 12px 16px;
                border-bottom: 1px solid rgba(0, 255, 255, 0.2);
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                <div class="yt-logo" style="
                    background: linear-gradient(45deg, #ff0000, #cc0000);
                    color: white;
                    padding: 6px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
                ">▶ YOUTUBE</div>
                
                <div class="track-info" style="flex: 1;">
                    <div class="track-title" style="
                        color: #00ffff;
                        font-size: 13px;
                        font-weight: 600;
                        margin-bottom: 2px;
                        text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
                    ">${this.truncateTitle(videoData.title, 50)}</div>
                    <div class="track-channel" style="
                        color: #8892b0;
                        font-size: 11px;
                        opacity: 0.8;
                    ">${videoData.channelTitle || 'YouTube Music'}</div>
                </div>
                
                <div class="status-indicator" style="
                    width: 8px;
                    height: 8px;
                    background: #00ff00;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #00ff00;
                    animation: pulse 2s infinite;
                "></div>
            </div>
            
            <!-- Player area -->
            <div class="player-zone" style="
                position: relative;
                background: #000;
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background-image: url('https://img.youtube.com/vi/${videoId}/mqdefault.jpg');
                background-size: cover;
                background-position: center;
            " onclick="this.parentElement.querySelector('.play-overlay').style.display='none'; this.innerHTML='<iframe width=\\'100%\\' height=\\'200\\' src=\\'https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0\\' frameborder=\\'0\\' allow=\\'autoplay; encrypted-media\\' allowfullscreen></iframe>';">
                <div class="play-overlay" style="
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                ">
                    <div class="neural-play-btn" style="
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(45deg, #00ffff, #0080ff);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 
                            0 0 20px rgba(0, 255, 255, 0.5),
                            inset 0 2px 4px rgba(255, 255, 255, 0.2);
                        position: relative;
                    " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 0 30px rgba(0, 255, 255, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.2)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 0 20px rgba(0, 255, 255, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)';">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(0, 0, 0, 0.8)">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <div style="
                            position: absolute;
                            top: -2px; left: -2px; right: -2px; bottom: -2px;
                            border: 2px solid transparent;
                            border-radius: 50%;
                            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                            animation: rotate 3s linear infinite;
                        "></div>
                    </div>
                </div>
            </div>
            
            <!-- Control panel -->
            <div class="control-panel" style="
                background: linear-gradient(90deg, #1a1f24, #0f1419);
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid rgba(0, 255, 255, 0.1);
            ">
                <div class="action-buttons" style="display: flex; gap: 8px;">
                    <button class="neural-btn" onclick="window.open('${videoData.url}', '_blank')" style="
                        background: linear-gradient(45deg, #ff0000, #cc0000);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(255, 0, 0, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(255, 0, 0, 0.3)';">
                        � YouTube
                    </button>
                    
                    <button class="neural-btn" onclick="navigator.share ? navigator.share({title: '${videoData.title.replace(/'/g, "\\'")}', url: '${videoData.url}'}) : navigator.clipboard.writeText('${videoData.url}').then(() => this.textContent='✅ Copiato!')" style="
                        background: linear-gradient(45deg, #00ffff, #0080ff);
                        color: #000;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        box-shadow: 0 2px 8px rgba(0, 255, 255, 0.3);
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 255, 255, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0, 255, 255, 0.3)';">
                        📤 Share
                    </button>
                </div>
                
                <div class="track-meta" style="
                    color: #64748b;
                    font-size: 10px;
                    text-align: right;
                    opacity: 0.7;
                ">
                    <div>NEURAL STREAM</div>
                    <div style="margin-top: 2px;">ID: ${videoId.substring(0, 8)}</div>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(0.8); }
            }
            
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .neural-media-player:hover {
                box-shadow: 
                    0 0 25px rgba(0, 255, 255, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
        </style>
        `;
        
        return embedHtml;
    }
    
    // 🔄 Crea player di fallback per video non YouTube
    createFallbackVideoPlayer(videoData) {
        return `
        <div class="neural-media-player fallback" style="
            margin: 20px 0;
            background: linear-gradient(145deg, #1a0f0f, #241a1a);
            border: 1px solid rgba(255, 100, 100, 0.3);
            border-radius: 12px;
            padding: 0;
            box-shadow: 
                0 0 20px rgba(255, 100, 100, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            max-width: 100%;
        ">
            <!-- Header futuristico -->
            <div class="media-header" style="
                background: linear-gradient(90deg, #241a1a, #1a0f0f);
                padding: 12px 16px;
                border-bottom: 1px solid rgba(255, 100, 100, 0.2);
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                <div class="external-logo" style="
                    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                    color: white;
                    padding: 6px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
                ">🎵 ESTERNO</div>
                
                <div class="track-info" style="flex: 1;">
                    <div class="track-title" style="
                        color: #ff6b6b;
                        font-size: 13px;
                        font-weight: 600;
                        margin-bottom: 2px;
                        text-shadow: 0 0 5px rgba(255, 107, 107, 0.3);
                    ">${this.truncateTitle(videoData.title, 50)}</div>
                    <div class="track-channel" style="
                        color: #b08892;
                        font-size: 11px;
                        opacity: 0.8;
                    ">Link esterno</div>
                </div>
                
                <div class="status-indicator" style="
                    width: 8px;
                    height: 8px;
                    background: #ff6b6b;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #ff6b6b;
                    animation: pulse 2s infinite;
                "></div>
            </div>
            
            <!-- Content area -->
            <div class="content-zone" style="
                padding: 40px 20px;
                text-align: center;
                background: linear-gradient(45deg, #1a0f0f, #241a1a);
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
                ">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
                    </svg>
                </div>
                
                <p style="
                    color: #ff6b6b;
                    font-size: 14px;
                    margin-bottom: 20px;
                    font-weight: 500;
                ">🔗 Link multimediale esterno rilevato</p>
                
                <button onclick="window.open('${videoData.url}', '_blank')" style="
                    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
                " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 6px 20px rgba(255, 107, 107, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(255, 107, 107, 0.3)';">
                    🚀 Apri Link
                </button>
            </div>
        </div>
        `;
    }
    
    // ✂️ Accorcia i titoli lunghi
    truncateTitle(title, maxLength = 60) {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength - 3) + '...';
    }
    
    // 🎬 Carica player YouTube dinamicamente
    loadYouTubePlayer(videoId, playerId) {
        const playerElement = document.getElementById(playerId);
        if (!playerElement) return;
        
        // Sostituisce il placeholder con iframe YouTube
        playerElement.innerHTML = `
            <iframe 
                width="100%" 
                height="100%"
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="border-radius: 8px;">
            </iframe>
        `;
        
        // Aggiunge animazione di caricamento
        playerElement.style.transition = 'all 0.3s ease';
        
        console.log('🎬 Player YouTube caricato per video:', videoId);
    }
    
    // 🔗 Apre video su YouTube
    openInYouTube(url) {
        window.open(url, '_blank');
        console.log('🔗 Apertura YouTube:', url);
    }
    
    // 📤 Condivide video
    shareVideo(url, title) {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).catch(err => console.log('Errore condivisione:', err));
        } else {
            // Fallback: copia negli appunti
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('🔗 Link copiato negli appunti!');
            }).catch(() => {
                // Fallback finale: mostra popup
                prompt('Copia questo link:', url);
            });
        }
    }
    
    // 🔍 Estrae l'ID del video YouTube dall'URL
    extractYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // 🤖 Ottiene informazioni musicali dall'AI
    async getMusicInfoFromAI(songTitle, context = 'general') {
        try {
            let prompt = '';
            
            switch (context) {
                case 'play':
                    prompt = `Dimmi qualcosa di interessante su questa canzone: "${songTitle}". Include informazioni sull'artista, il genere, l'anno di uscita se lo conosci, e una tua opinione personale sul brano. Sii breve ma coinvolgente.`;
                    break;
                case 'recommend':
                    prompt = `Perché dovrei ascoltare "${songTitle}"? Cosa la rende speciale o interessante?`;
                    break;
                default:
                    prompt = `Dimmi qualcosa su questa canzone: "${songTitle}".`;
            }
            
            const response = await this.main.getAIResponse(prompt, null, 'musica');
            return `🎼 **Il mio parere:**\n${response}`;
            
        } catch (error) {
            console.warn('⚠️ Errore nel ottenere info AI:', error);
            return '🎼 **Buon ascolto!** Spero che ti piaccia questa canzone! 🎵';
        }
    }
    
    // 💬 Genera risposte di fallback per modalità offline
    async generateMusicFallbackResponse(query, type) {
        const fallbackResponses = {
            play: `🎵 **Non riesco a trovare "${query}" su YouTube**, ma ti consiglio di cercarlo manualmente!\n\n🎼 Nel frattempo, sappi che la musica è un linguaggio universale che attraversa culture e generazioni. Ogni brano ha la sua storia e la sua magia!`,
            recommend: `🎵 **Ecco alcuni consigli musicali per "${query}":**\n\n• Esplora le playlist "Best of" su Spotify o YouTube\n• Controlla le classifiche musicali del genere\n• Ascolta radio online specializzate\n• Chiedi consigli agli amici con gusti simili\n\n🎼 La scoperta musicale è un viaggio meraviglioso!`,
            similar: `🎵 **Per trovare musica simile a "${query}":**\n\n• Usa Spotify Radio o YouTube Music\n• Cerca "artisti simili a..." su Google\n• Esplora playlist collaborative\n• Controlla i "fan also like" sui profili degli artisti\n\n🎼 Ogni scoperta musicale è un'avventura!`,
            artist_info: `🎵 **Per saperne di più su "${query}":**\n\n• Controlla Wikipedia per la biografia\n• Visita il sito ufficiale dell'artista\n• Leggi interviste e recensioni\n• Ascolta le loro canzoni più popolari\n\n🎼 Ogni artista ha una storia unica da raccontare!`
        };
        
        return fallbackResponses[type] || fallbackResponses.recommend;
    }
    
    // 🔍 Cerca su YouTube - VERSIONE AVANZATA
    async searchYouTube(query) {
        try {
            console.log('🔍 Ricerca YouTube per:', query);
            
            // Controlla se API key è configurata
            if (!AI_CONFIG?.youtube?.apiKey || AI_CONFIG.youtube.apiKey === 'YOUR_YOUTUBE_API_KEY') {
                console.warn('⚠️ API Key YouTube non configurata, uso fallback');
                return this.generateYouTubeFallbackResults(query);
            }
            
            const apiKey = AI_CONFIG.youtube.apiKey;
            const maxResults = AI_CONFIG?.youtube?.maxResults || 5;
            
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
                `part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&` +
                `type=video&videoCategoryId=10&key=${apiKey}`;
            
            const response = await fetch(searchUrl);
            
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.items || data.items.length === 0) {
                console.warn('⚠️ Nessun risultato da YouTube API');
                return this.generateYouTubeFallbackResults(query);
            }
            
            return data.items.map(item => ({
                title: this.cleanVideoTitle(item.snippet.title),
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                videoId: item.id.videoId,
                thumbnail: item.snippet.thumbnails.medium.url,
                description: item.snippet.description,
                publishedAt: item.snippet.publishedAt,
                channelTitle: item.snippet.channelTitle
            }));
            
        } catch (error) {
            console.error('❌ Errore ricerca YouTube:', error);
            
            // Fallback se API non disponibile
            if (AI_CONFIG?.youtube?.fallbackEnabled) {
                return this.generateYouTubeFallbackResults(query);
            }
            
            return [];
        }
    }
    
    // 🎯 Pulisce i titoli dei video YouTube
    cleanVideoTitle(title) {
        return title
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }
    
    // 🔄 Genera risultati di fallback quando YouTube API non è disponibile
    generateYouTubeFallbackResults(query) {
        console.log('🔄 Generazione risultati fallback per:', query);
        
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const youtubeMusicUrl = `https://music.youtube.com/search?q=${encodeURIComponent(query)}`;
        
        return [
            {
                title: `🔍 Cerca "${query}" su YouTube`,
                url: youtubeSearchUrl,
                videoId: null,
                thumbnail: null,
                description: 'Clicca per cercare direttamente su YouTube',
                isFallback: true
            },
            {
                title: `🎵 Cerca "${query}" su YouTube Music`,
                url: youtubeMusicUrl,
                videoId: null,
                thumbnail: null,
                description: 'Clicca per cercare su YouTube Music',
                isFallback: true
            }
        ];
    }
    
    // 📢 Mostra notifiche temporanee
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideInNotification 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutNotification 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
    
    // 🎨 Inizializza stili per il player YouTube
    initializeYouTubePlayerStyles() {
        // Controlla se gli stili sono già stati aggiunti
        if (document.getElementById('youtube-player-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'youtube-player-styles';
        styles.textContent = `
            /* Animazioni per notifiche */
            @keyframes slideInNotification {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutNotification {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            /* Animazioni per player YouTube */
            .youtube-player-container:hover .play-overlay {
                background: rgba(0,0,0,0.6) !important;
            }
            
            .youtube-player-container:hover .play-button {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(255,0,0,0.6) !important;
            }
        `;
        
        document.head.appendChild(styles);
        console.log('🎨 Stili YouTube Player inizializzati');
    }
    
    // 🔧 Inizializza event listeners per i player YouTube
    initializeYouTubeEventListeners() {
        // Event delegation per i pulsanti YouTube
        document.addEventListener('click', (e) => {
            // Player click
            if (e.target.closest('.youtube-player')) {
                const player = e.target.closest('.youtube-player');
                const videoId = player.dataset.videoId;
                const playerId = player.dataset.playerId;
                if (videoId && playerId) {
                    this.loadYouTubePlayer(videoId, playerId);
                }
            }
            
            // Pulsanti controlli
            if (e.target.classList.contains('youtube-btn')) {
                const action = e.target.dataset.action;
                const url = e.target.dataset.url;
                const title = e.target.dataset.title;
                
                if (action === 'open') {
                    this.openInYouTube(url);
                } else if (action === 'share') {
                    this.shareVideo(url, title);
                }
            }
        });
    }
}

// Rendi disponibile globalmente
window.MusicaHandler = MusicaHandler;

// Inizializza event listeners globali per YouTube
document.addEventListener('DOMContentLoaded', () => {
    if (window.MusicaHandler) {
        const musicaHandler = new MusicaHandler({ getAIResponse: () => 'Test' });
        musicaHandler.initializeYouTubeEventListeners();
    }
});

console.log('✅ Modulo Musica caricato con successo');

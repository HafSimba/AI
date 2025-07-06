// 💾 LEARNING STORAGE - Sistema di archiviazione per apprendimento
// Gestisce salvataggio locale e sincronizzazione cloud dei dati di apprendimento

console.log('💾 Caricamento Learning Storage...');

class LearningStorage {
    constructor() {
        this.dbName = 'AILearningDB';
        this.version = 1;
        this.maxEntries = 10000;
        this.compressionEnabled = true;
        this.db = null;
    }
    
    async init() {
        try {
            console.log('🔧 Inizializzazione database apprendimento...');
            this.db = await this.openDB();
            await this.setupStores();
            console.log('✅ Database apprendimento inizializzato');
        } catch (error) {
            console.error('❌ Errore inizializzazione storage:', error);
            throw error;
        }
    }
    
    // 🗃️ Apri database IndexedDB
    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store per profilo utente
                if (!db.objectStoreNames.contains('userProfile')) {
                    db.createObjectStore('userProfile', { keyPath: 'id' });
                }
                
                // Store per interazioni
                if (!db.objectStoreNames.contains('interactions')) {
                    const interactionsStore = db.createObjectStore('interactions', { keyPath: 'id' });
                    interactionsStore.createIndex('timestamp', 'timestamp');
                    interactionsStore.createIndex('mode', 'context.mode');
                }
                
                // Store per feedback
                if (!db.objectStoreNames.contains('feedback')) {
                    const feedbackStore = db.createObjectStore('feedback', { keyPath: 'id' });
                    feedbackStore.createIndex('rating', 'rating');
                    feedbackStore.createIndex('timestamp', 'timestamp');
                }
                
                // Store per pattern di successo
                if (!db.objectStoreNames.contains('patterns')) {
                    const patternsStore = db.createObjectStore('patterns', { keyPath: 'key' });
                    patternsStore.createIndex('averageRating', 'averageRating');
                    patternsStore.createIndex('count', 'count');
                }
            };
        });
    }
    
    // 🏗️ Setup stores
    async setupStores() {
        // Verifica che tutti gli store esistano
        const requiredStores = ['userProfile', 'interactions', 'feedback', 'patterns'];
        const existingStores = Array.from(this.db.objectStoreNames);
        
        for (const store of requiredStores) {
            if (!existingStores.includes(store)) {
                console.warn(`⚠️ Store ${store} non trovato`);
            }
        }
        
        // Cleanup dati vecchi se necessario
        await this.cleanupOldData();
    }
    
    // 💾 Salva profilo utente
    async saveUserProfile(profile) {
        try {
            const data = {
                id: 'current_user',
                profile: this.compressionEnabled ? this.compressData(profile) : profile,
                timestamp: Date.now(),
                version: this.version
            };
            
            const transaction = this.db.transaction(['userProfile'], 'readwrite');
            const store = transaction.objectStore('userProfile');
            await this.promisifyRequest(store.put(data));
            
            console.log('💾 Profilo utente salvato');
        } catch (error) {
            console.error('❌ Errore salvataggio profilo:', error);
            throw error;
        }
    }
    
    // 📖 Carica profilo utente
    async loadUserProfile() {
        try {
            const transaction = this.db.transaction(['userProfile'], 'readonly');
            const store = transaction.objectStore('userProfile');
            const result = await this.promisifyRequest(store.get('current_user'));
            
            if (result) {
                const profile = this.compressionEnabled ? 
                    this.decompressData(result.profile) : result.profile;
                console.log('📖 Profilo utente caricato');
                return profile;
            }
            
            return null;
        } catch (error) {
            console.error('❌ Errore caricamento profilo:', error);
            return null;
        }
    }
    
    // 📝 Salva interazione
    async saveInteraction(interaction) {
        try {
            const data = this.compressionEnabled ? 
                { ...interaction, data: this.compressData(interaction) } : interaction;
            
            const transaction = this.db.transaction(['interactions'], 'readwrite');
            const store = transaction.objectStore('interactions');
            await this.promisifyRequest(store.put(data));
            
        } catch (error) {
            console.error('❌ Errore salvataggio interazione:', error);
        }
    }
    
    // 📊 Salva feedback
    async saveFeedback(feedback) {
        try {
            const transaction = this.db.transaction(['feedback'], 'readwrite');
            const store = transaction.objectStore('feedback');
            await this.promisifyRequest(store.put(feedback));
            
        } catch (error) {
            console.error('❌ Errore salvataggio feedback:', error);
        }
    }
    
    // 🎯 Salva pattern di successo
    async savePattern(key, pattern) {
        try {
            const data = { key, ...pattern, lastSaved: Date.now() };
            
            const transaction = this.db.transaction(['patterns'], 'readwrite');
            const store = transaction.objectStore('patterns');
            await this.promisifyRequest(store.put(data));
            
        } catch (error) {
            console.error('❌ Errore salvataggio pattern:', error);
        }
    }
    
    // 📊 Carica statistiche
    async loadStats() {
        try {
            const stats = {
                totalInteractions: await this.countRecords('interactions'),
                totalFeedback: await this.countRecords('feedback'),
                totalPatterns: await this.countRecords('patterns'),
                avgRating: await this.calculateAverageRating()
            };
            
            return stats;
        } catch (error) {
            console.error('❌ Errore caricamento statistiche:', error);
            return null;
        }
    }
    
    // 🔢 Conta record in store
    async countRecords(storeName) {
        try {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            return await this.promisifyRequest(store.count());
        } catch (error) {
            return 0;
        }
    }
    
    // 📊 Calcola rating medio
    async calculateAverageRating() {
        try {
            const transaction = this.db.transaction(['feedback'], 'readonly');
            const store = transaction.objectStore('feedback');
            const cursor = store.openCursor();
            
            let total = 0;
            let count = 0;
            
            return new Promise((resolve) => {
                cursor.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        total += cursor.value.rating;
                        count++;
                        cursor.continue();
                    } else {
                        resolve(count > 0 ? total / count : 0);
                    }
                };
                cursor.onerror = () => resolve(0);
            });
        } catch (error) {
            return 0;
        }
    }
    
    // 🧹 Cleanup dati vecchi
    async cleanupOldData() {
        try {
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            
            // Cleanup interazioni vecchie
            await this.deleteOldRecords('interactions', thirtyDaysAgo);
            
            // Cleanup feedback vecchi
            await this.deleteOldRecords('feedback', thirtyDaysAgo);
            
            console.log('🧹 Cleanup dati completato');
        } catch (error) {
            console.error('❌ Errore cleanup:', error);
        }
    }
    
    // 🗑️ Elimina record vecchi
    async deleteOldRecords(storeName, cutoffTime) {
        try {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore('store');
            const index = store.index('timestamp');
            const range = IDBKeyRange.upperBound(cutoffTime);
            
            return new Promise((resolve, reject) => {
                const deleteRequest = index.openCursor(range);
                deleteRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    } else {
                        resolve();
                    }
                };
                deleteRequest.onerror = () => reject(deleteRequest.error);
            });
        } catch (error) {
            console.error(`❌ Errore eliminazione record da ${storeName}:`, error);
        }
    }
    
    // 🗜️ Comprimi dati
    compressData(data) {
        try {
            const jsonString = JSON.stringify(data);
            // Simulazione compressione semplice (in produzione usare libreria come LZ4)
            return btoa(jsonString);
        } catch (error) {
            console.error('❌ Errore compressione:', error);
            return data;
        }
    }
    
    // 📤 Decomprimi dati
    decompressData(compressedData) {
        try {
            if (typeof compressedData === 'string') {
                const jsonString = atob(compressedData);
                return JSON.parse(jsonString);
            }
            return compressedData;
        } catch (error) {
            console.error('❌ Errore decompressione:', error);
            return compressedData;
        }
    }
    
    // 🔄 Promisify request IndexedDB
    promisifyRequest(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    // 📤 Esporta dati
    async exportData() {
        try {
            const data = {
                userProfile: await this.loadUserProfile(),
                stats: await this.loadStats(),
                exportDate: new Date().toISOString(),
                version: this.version
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ai-learning-export-${Date.now()}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            console.log('📤 Dati esportati con successo');
        } catch (error) {
            console.error('❌ Errore esportazione:', error);
        }
    }
    
    // 📥 Importa dati
    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.userProfile) {
                await this.saveUserProfile(data.userProfile);
                console.log('📥 Dati importati con successo');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('❌ Errore importazione:', error);
            return false;
        }
    }
    
    // 🗑️ Cancella tutti i dati
    async clearAllData() {
        try {
            const stores = ['userProfile', 'interactions', 'feedback', 'patterns'];
            
            for (const storeName of stores) {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                await this.promisifyRequest(store.clear());
            }
            
            console.log('🗑️ Tutti i dati cancellati');
        } catch (error) {
            console.error('❌ Errore cancellazione dati:', error);
        }
    }
    
    // 📊 Ottieni dimensione database
    async getDatabaseSize() {
        try {
            if ('estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                return {
                    used: estimate.usage,
                    available: estimate.quota,
                    percentage: (estimate.usage / estimate.quota * 100).toFixed(2)
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}

// Privacy Manager per crittografia
class PrivacyManager {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
        this.saltLength = 16;
        this.userKey = null;
    }
    
    // 🔐 Genera chiave utente
    async generateUserKey() {
        const keyMaterial = await crypto.subtle.generateKey(
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );
        
        return keyMaterial;
    }
    
    // 🔒 Cripta dati sensibili
    async encryptSensitiveData(data) {
        try {
            const salt = crypto.getRandomValues(new Uint8Array(this.saltLength));
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            if (!this.userKey) {
                this.userKey = await this.generateUserKey();
            }
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                this.userKey,
                { name: this.algorithm, length: this.keyLength },
                false,
                ['encrypt']
            );
            
            const encodedData = new TextEncoder().encode(JSON.stringify(data));
            const encrypted = await crypto.subtle.encrypt(
                { name: this.algorithm, iv: iv },
                key,
                encodedData
            );
            
            return {
                encrypted: Array.from(new Uint8Array(encrypted)),
                salt: Array.from(salt),
                iv: Array.from(iv)
            };
        } catch (error) {
            console.error('❌ Errore crittografia:', error);
            return data; // Fallback non criptato
        }
    }
    
    // 🔓 Decripta dati
    async decryptSensitiveData(encryptedData) {
        try {
            if (!encryptedData.encrypted) {
                return encryptedData; // Dati non criptati
            }
            
            const salt = new Uint8Array(encryptedData.salt);
            const iv = new Uint8Array(encryptedData.iv);
            const encrypted = new Uint8Array(encryptedData.encrypted);
            
            if (!this.userKey) {
                this.userKey = await this.generateUserKey();
            }
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                this.userKey,
                { name: this.algorithm, length: this.keyLength },
                false,
                ['decrypt']
            );
            
            const decrypted = await crypto.subtle.decrypt(
                { name: this.algorithm, iv: iv },
                key,
                encrypted
            );
            
            const decodedData = new TextDecoder().decode(decrypted);
            return JSON.parse(decodedData);
        } catch (error) {
            console.error('❌ Errore decrittografia:', error);
            return encryptedData; // Fallback
        }
    }
    
    // 🔒 Hash dati per anonimizzazione
    async hashData(data) {
        const encoded = new TextEncoder().encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // 🕵️ Anonimizza dati per cloud
    async anonymizeForCloud(data) {
        return {
            preferences: {
                style: data.preferences?.responseStyle,
                formality: data.preferences?.formality,
                personality: data.preferences?.personality
            },
            quality: {
                averageRating: data.responseQuality?.averageRating,
                totalFeedbacks: data.responseQuality?.totalFeedbacks
            },
            progress: {
                interactionsCount: data.learningProgress?.interactionsCount,
                level: this.calculateLevel(data.learningProgress?.interactionsCount)
            },
            timestamp: Date.now()
        };
    }
    
    calculateLevel(interactions) {
        if (interactions < 10) return 'beginner';
        if (interactions < 50) return 'intermediate';
        return 'advanced';
    }
}

// Esporta classi
window.LearningStorage = LearningStorage;
window.PrivacyManager = PrivacyManager;

console.log('✅ Learning Storage caricato con successo');

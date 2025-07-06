// 📊 LEARNING METRICS - Sistema di metriche per apprendimento continuo
// Gestisce tracking, analisi e visualizzazione delle performance AI

console.log('📊 Caricamento Learning Metrics...');

class LearningMetrics {
    constructor() {
        this.metrics = {
            responseQuality: 0,
            userSatisfaction: 0,
            learningProgress: 0,
            personalizationLevel: 0,
            improvementRate: 0
        };
        
        this.history = {
            ratings: [],
            improvements: [],
            interactions: []
        };
        
        this.thresholds = {
            excellent: 4.5,
            good: 3.5,
            acceptable: 2.5,
            poor: 1.5
        };
        
        this.trends = {
            daily: [],
            weekly: [],
            monthly: []
        };
    }
    
    // 📊 Aggiorna metriche da feedback
    updateFromFeedback(feedback) {
        this.recordRating(feedback.rating, feedback.context);
        this.calculateMetrics();
        this.updateTrends();
        this.checkMilestones();
        
        console.log('📊 Metriche aggiornate:', this.metrics);
    }
    
    // 📝 Registra rating
    recordRating(rating, context) {
        const record = {
            rating: rating,
            context: context,
            timestamp: Date.now(),
            date: new Date().toISOString().split('T')[0]
        };
        
        this.history.ratings.push(record);
        
        // Mantieni solo ultimi 1000 rating
        if (this.history.ratings.length > 1000) {
            this.history.ratings = this.history.ratings.slice(-1000);
        }
    }
    
    // 🧮 Calcola metriche principali
    calculateMetrics() {
        this.metrics.responseQuality = this.calculateAverageRating();
        this.metrics.userSatisfaction = this.calculateSatisfactionScore();
        this.metrics.learningProgress = this.calculateLearningProgress();
        this.metrics.personalizationLevel = this.calculatePersonalizationLevel();
        this.metrics.improvementRate = this.calculateImprovementRate();
    }
    
    // 📊 Calcola rating medio
    calculateAverageRating() {
        if (this.history.ratings.length === 0) return 0;
        
        const total = this.history.ratings.reduce((sum, record) => sum + record.rating, 0);
        return total / this.history.ratings.length;
    }
    
    // 😊 Calcola punteggio soddisfazione
    calculateSatisfactionScore() {
        if (this.history.ratings.length === 0) return 0;
        
        const recentRatings = this.history.ratings.slice(-50); // Ultimi 50 rating
        const positiveRatings = recentRatings.filter(r => r.rating >= 4).length;
        
        return (positiveRatings / recentRatings.length) * 100;
    }
    
    // 📈 Calcola progresso apprendimento
    calculateLearningProgress() {
        if (this.history.ratings.length < 10) return 0;
        
        const recentWindow = 20;
        const recent = this.history.ratings.slice(-recentWindow);
        const older = this.history.ratings.slice(-recentWindow * 2, -recentWindow);
        
        if (older.length === 0) return 25; // Progress iniziale
        
        const recentAvg = recent.reduce((sum, r) => sum + r.rating, 0) / recent.length;
        const olderAvg = older.reduce((sum, r) => sum + r.rating, 0) / older.length;
        
        const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;
        return Math.max(0, Math.min(100, 50 + improvement * 10));
    }
    
    // 🎯 Calcola livello personalizzazione
    calculatePersonalizationLevel() {
        const interactions = this.history.interactions.length;
        const feedbacks = this.history.ratings.length;
        
        if (interactions === 0) return 0;
        
        const feedbackRatio = feedbacks / interactions;
        const baseLevel = Math.min(interactions / 100, 1) * 60; // Max 60% da interazioni
        const feedbackBonus = feedbackRatio * 40; // Max 40% da feedback
        
        return baseLevel + feedbackBonus;
    }
    
    // 📊 Calcola tasso di miglioramento
    calculateImprovementRate() {
        if (this.history.ratings.length < 20) return 0;
        
        const windows = 3;
        const windowSize = Math.floor(this.history.ratings.length / windows);
        
        let improvements = 0;
        for (let i = 0; i < windows - 1; i++) {
            const current = this.history.ratings.slice(i * windowSize, (i + 1) * windowSize);
            const next = this.history.ratings.slice((i + 1) * windowSize, (i + 2) * windowSize);
            
            const currentAvg = current.reduce((sum, r) => sum + r.rating, 0) / current.length;
            const nextAvg = next.reduce((sum, r) => sum + r.rating, 0) / next.length;
            
            if (nextAvg > currentAvg) improvements++;
        }
        
        return (improvements / (windows - 1)) * 100;
    }
    
    // 📈 Aggiorna trends
    updateTrends() {
        const today = new Date().toISOString().split('T')[0];
        
        // Trend giornaliero
        this.updateDailyTrend(today);
        
        // Trend settimanale
        this.updateWeeklyTrend();
        
        // Trend mensile
        this.updateMonthlyTrend();
    }
    
    // 📅 Aggiorna trend giornaliero
    updateDailyTrend(date) {
        const todayRatings = this.history.ratings.filter(r => r.date === date);
        
        if (todayRatings.length > 0) {
            const avgRating = todayRatings.reduce((sum, r) => sum + r.rating, 0) / todayRatings.length;
            
            const existingDay = this.trends.daily.find(d => d.date === date);
            if (existingDay) {
                existingDay.avgRating = avgRating;
                existingDay.count = todayRatings.length;
            } else {
                this.trends.daily.push({
                    date: date,
                    avgRating: avgRating,
                    count: todayRatings.length
                });
            }
            
            // Mantieni solo ultimi 30 giorni
            this.trends.daily = this.trends.daily.slice(-30);
        }
    }
    
    // 📊 Aggiorna trend settimanale
    updateWeeklyTrend() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weekRatings = this.history.ratings.filter(r => 
            new Date(r.timestamp) >= weekAgo
        );
        
        if (weekRatings.length > 0) {
            const avgRating = weekRatings.reduce((sum, r) => sum + r.rating, 0) / weekRatings.length;
            
            this.trends.weekly.push({
                week: this.getWeekNumber(new Date()),
                avgRating: avgRating,
                count: weekRatings.length,
                date: new Date().toISOString()
            });
            
            // Mantieni solo ultime 12 settimane
            this.trends.weekly = this.trends.weekly.slice(-12);
        }
    }
    
    // 📊 Aggiorna trend mensile
    updateMonthlyTrend() {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        const monthRatings = this.history.ratings.filter(r => 
            new Date(r.timestamp) >= monthAgo
        );
        
        if (monthRatings.length > 0) {
            const avgRating = monthRatings.reduce((sum, r) => sum + r.rating, 0) / monthRatings.length;
            
            this.trends.monthly.push({
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                avgRating: avgRating,
                count: monthRatings.length,
                date: new Date().toISOString()
            });
            
            // Mantieni solo ultimi 12 mesi
            this.trends.monthly = this.trends.monthly.slice(-12);
        }
    }
    
    // 🏆 Controlla milestone raggiunte
    checkMilestones() {
        const milestones = [
            { interactions: 10, message: 'Prime 10 interazioni completate!' },
            { interactions: 50, message: 'Mezzo secolo di conversazioni!' },
            { interactions: 100, message: 'Un centinaio di dialoghi!' },
            { rating: 4.0, message: 'Rating eccellente raggiunto!' },
            { satisfaction: 80, message: '80% di soddisfazione utente!' }
        ];
        
        milestones.forEach(milestone => {
            if (this.checkMilestone(milestone)) {
                this.showMilestone(milestone.message);
            }
        });
    }
    
    // ✅ Controlla singolo milestone
    checkMilestone(milestone) {
        if (milestone.interactions) {
            return this.history.interactions.length >= milestone.interactions &&
                   this.history.interactions.length - 1 < milestone.interactions;
        }
        
        if (milestone.rating) {
            return this.metrics.responseQuality >= milestone.rating;
        }
        
        if (milestone.satisfaction) {
            return this.metrics.userSatisfaction >= milestone.satisfaction;
        }
        
        return false;
    }
    
    // 🎉 Mostra milestone raggiunta
    showMilestone(message) {
        console.log('🏆 Milestone raggiunta:', message);
        
        // Crea notifica visiva
        const notification = document.createElement('div');
        notification.className = 'milestone-notification';
        notification.innerHTML = `
            <div class="milestone-content">
                <div class="milestone-icon">🏆</div>
                <div class="milestone-text">${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Rimuovi dopo 5 secondi
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // 📊 Genera report completo
    generateReport() {
        const report = {
            summary: {
                totalInteractions: this.history.interactions.length,
                totalFeedbacks: this.history.ratings.length,
                averageRating: this.metrics.responseQuality.toFixed(2),
                satisfactionLevel: this.getQualityLabel(this.metrics.userSatisfaction),
                learningStatus: this.getLearningStatus()
            },
            metrics: { ...this.metrics },
            trends: {
                improvement: this.calculateTrendDirection(),
                bestPeriod: this.findBestPeriod(),
                consistency: this.calculateConsistency()
            },
            recommendations: this.generateRecommendations(),
            generatedAt: new Date().toISOString()
        };
        
        return report;
    }
    
    // 🏷️ Ottieni label qualità
    getQualityLabel(score) {
        if (score >= this.thresholds.excellent) return 'Eccellente';
        if (score >= this.thresholds.good) return 'Buono';
        if (score >= this.thresholds.acceptable) return 'Accettabile';
        if (score >= this.thresholds.poor) return 'Scarso';
        return 'Molto Scarso';
    }
    
    // 📈 Ottieni stato apprendimento
    getLearningStatus() {
        const progress = this.metrics.learningProgress;
        
        if (progress >= 80) return 'Avanzato';
        if (progress >= 60) return 'Intermedio';
        if (progress >= 40) return 'In Progresso';
        if (progress >= 20) return 'Iniziale';
        return 'Principiante';
    }
    
    // 📊 Calcola direzione trend
    calculateTrendDirection() {
        if (this.trends.daily.length < 2) return 'Stabile';
        
        const recent = this.trends.daily.slice(-7);
        const older = this.trends.daily.slice(-14, -7);
        
        if (recent.length === 0 || older.length === 0) return 'Stabile';
        
        const recentAvg = recent.reduce((sum, d) => sum + d.avgRating, 0) / recent.length;
        const olderAvg = older.reduce((sum, d) => sum + d.avgRating, 0) / older.length;
        
        const diff = recentAvg - olderAvg;
        
        if (diff > 0.2) return 'In Miglioramento';
        if (diff < -0.2) return 'In Peggioramento';
        return 'Stabile';
    }
    
    // 🏆 Trova miglior periodo
    findBestPeriod() {
        if (this.trends.daily.length === 0) return 'N/A';
        
        const best = this.trends.daily.reduce((max, day) => 
            day.avgRating > max.avgRating ? day : max
        );
        
        return {
            date: best.date,
            rating: best.avgRating.toFixed(2),
            interactions: best.count
        };
    }
    
    // 📊 Calcola consistenza
    calculateConsistency() {
        if (this.history.ratings.length < 10) return 0;
        
        const ratings = this.history.ratings.slice(-50).map(r => r.rating);
        const mean = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        const variance = ratings.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / ratings.length;
        const stdDev = Math.sqrt(variance);
        
        // Normalizza tra 0-100 (consistenza alta = bassa deviazione standard)
        return Math.max(0, 100 - (stdDev * 25));
    }
    
    // 💡 Genera raccomandazioni
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.responseQuality < 3.0) {
            recommendations.push('Considera di raccogliere più feedback per migliorare la qualità delle risposte');
        }
        
        if (this.metrics.userSatisfaction < 70) {
            recommendations.push('Focus sulla personalizzazione per aumentare la soddisfazione utente');
        }
        
        if (this.metrics.learningProgress < 40) {
            recommendations.push('Aumenta la frequenza delle interazioni per accelerare l\'apprendimento');
        }
        
        if (this.calculateConsistency() < 60) {
            recommendations.push('Lavora sulla consistenza delle risposte per stabilizzare le performance');
        }
        
        return recommendations;
    }
    
    // 📊 Visualizza metriche
    displayMetrics() {
        const metricsHTML = `
            <div class="learning-metrics">
                <h4>📊 Metriche di Apprendimento</h4>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-label">Qualità Risposte</div>
                        <div class="metric-value">${this.metrics.responseQuality.toFixed(2)}/5</div>
                        <div class="metric-bar">
                            <div class="metric-progress" style="width: ${(this.metrics.responseQuality / 5) * 100}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-label">Soddisfazione Utente</div>
                        <div class="metric-value">${this.metrics.userSatisfaction.toFixed(1)}%</div>
                        <div class="metric-bar">
                            <div class="metric-progress" style="width: ${this.metrics.userSatisfaction}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-label">Progresso Apprendimento</div>
                        <div class="metric-value">${this.metrics.learningProgress.toFixed(1)}%</div>
                        <div class="metric-bar">
                            <div class="metric-progress" style="width: ${this.metrics.learningProgress}%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-label">Personalizzazione</div>
                        <div class="metric-value">${this.metrics.personalizationLevel.toFixed(1)}%</div>
                        <div class="metric-bar">
                            <div class="metric-progress" style="width: ${this.metrics.personalizationLevel}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return metricsHTML;
    }
    
    // 📊 Aggiungi stili metriche
    addMetricsStyles() {
        const styles = `
            .learning-metrics {
                background: rgba(74, 144, 226, 0.05);
                border: 1px solid rgba(74, 144, 226, 0.2);
                border-radius: 12px;
                padding: 20px;
                margin: 15px 0;
            }
            
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .metric-card {
                background: rgba(26, 26, 46, 0.7);
                border: 1px solid rgba(74, 144, 226, 0.3);
                border-radius: 8px;
                padding: 15px;
                text-align: center;
            }
            
            .metric-label {
                font-size: 12px;
                color: #a0aec0;
                margin-bottom: 8px;
            }
            
            .metric-value {
                font-size: 24px;
                font-weight: bold;
                color: #4a90e2;
                margin-bottom: 10px;
            }
            
            .metric-bar {
                width: 100%;
                height: 6px;
                background: rgba(74, 144, 226, 0.2);
                border-radius: 3px;
                overflow: hidden;
            }
            
            .metric-progress {
                height: 100%;
                background: linear-gradient(90deg, #4a90e2, #667eea);
                border-radius: 3px;
                transition: width 0.5s ease;
            }
            
            .milestone-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(16, 21, 62, 0.95);
                border: 2px solid #4a90e2;
                border-radius: 12px;
                padding: 15px 20px;
                color: white;
                z-index: 1000;
                animation: slideInRight 0.5s ease;
                backdrop-filter: blur(10px);
            }
            
            .milestone-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .milestone-icon {
                font-size: 24px;
            }
            
            .milestone-text {
                font-weight: 500;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    // 📊 Ottieni numero settimana
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    // 🔄 Reset metriche
    reset() {
        this.metrics = {
            responseQuality: 0,
            userSatisfaction: 0,
            learningProgress: 0,
            personalizationLevel: 0,
            improvementRate: 0
        };
        
        this.history = {
            ratings: [],
            improvements: [],
            interactions: []
        };
        
        this.trends = {
            daily: [],
            weekly: [],
            monthly: []
        };
        
        console.log('🔄 Metriche resettate');
    }
}

// Esporta classe
window.LearningMetrics = LearningMetrics;

console.log('✅ Learning Metrics caricato con successo');

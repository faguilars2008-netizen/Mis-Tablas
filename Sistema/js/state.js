/**
 * State Management Module - Mis Tablas
 * Mantiene y persiste la información de progreso del estudiante.
 */

class StudentState {
    constructor() {
        this.profile = null;
        this.BADGES_DEFINITIONS = [
            { id: 'iniciante', name: 'Primer Paso', icon: '🌱', desc: 'Ingresar a la plataforma e iniciar el viaje.' },
            { id: 'maestro_2', name: 'Dominador del 2', icon: '✌️', desc: 'Completar la tabla del 2 con 3 estrellas.' },
            { id: 'maestro_5', name: 'Experto del 5', icon: '🖐️', desc: 'Completar la tabla del 5 con 3 estrellas.' },
            { id: 'maestro_10', name: 'Campeón del 10', icon: '🔟', desc: 'Completar la tabla del 10 con 3 estrellas.' },
            { id: 'memoria_pro', name: 'Mente Brillante', icon: '🧠', desc: 'Ganar un juego de Memoria Matemática.' },
            { id: 'cazador_burbujas', name: 'Atrapa Todo', icon: '🫧', desc: 'Atrapar 10 resultados sin fallar en Atrapa el Resultado.' },
            { id: 'detective_math', name: 'Sherlock Math', icon: '🔍', desc: 'Resolver 3 enigmas del Detective Matemático.' },
            { id: 'simce_master', name: 'Gran Genio SIMCE', icon: '🏅', desc: 'Obtener nivel Avanzado u 80%+ en el Ensayo SIMCE.' },
            { id: 'galaxia_master', name: 'Piloto Galáctico', icon: '🚀', desc: 'Destruir todas las naves alienígenas en Galaxia de Tablas.' },
            { id: 'carrera_pro', name: 'Rayo Nitro', icon: '🏎️', desc: 'Completar la Carrera Retro Nitro a máxima velocidad.' },
            { id: 'topos_champ', name: 'Rey del Martillo', icon: '🔨', desc: 'Golpear a todos los topos matemáticos en Martillo de Topos.' }
        ];
        this.loadState();
    }

    loadState() {
        try {
            const data = localStorage.getItem('misTablas_studentProfile');
            if (data) {
                this.profile = JSON.parse(data);
                // Asegurar estructura
                if (!this.profile.xp) this.profile.xp = 0;
                if (!this.profile.level) this.profile.level = 1;
                if (!this.profile.stars) this.profile.stars = 0;
                if (!this.profile.unlockedTables) this.profile.unlockedTables = [2];
                if (!this.profile.tableProgress) this.profile.tableProgress = {};
                if (!this.profile.badges) this.profile.badges = ['iniciante'];
                if (!this.profile.simceHistory) this.profile.simceHistory = [];
            }
        } catch (e) {
            console.error('Error al cargar estado:', e);
            this.profile = null;
        }
    }

    saveState() {
        if (this.profile) {
            localStorage.setItem('misTablas_studentProfile', JSON.stringify(this.profile));
        }
    }

    addXP(amount) {
        if (!this.profile) return;
        this.profile.xp += amount;
        
        // Calcular Nivel (cada 200 XP sube 1 nivel)
        const newLevel = Math.floor(this.profile.xp / 200) + 1;
        const leveledUp = newLevel > this.profile.level;
        this.profile.level = newLevel;

        this.saveState();

        if (leveledUp) {
            window.soundFX.playFanfare();
            this.showToast(`🎉 ¡SUBISTE AL NIVEL ${newLevel}!`, `¡Felicidades, ganaste más poderes matemáticos!`);
        }

        return { xp: this.profile.xp, level: this.profile.level, leveledUp };
    }

    addStars(count) {
        if (!this.profile) return;
        this.profile.stars = (this.profile.stars || 0) + count;
        this.saveState();
    }

    updateTableProgress(tableNum, percent, stars) {
        if (!this.profile) return;
        if (!this.profile.tableProgress) this.profile.tableProgress = {};
        
        const current = this.profile.tableProgress[tableNum] || { percent: 0, stars: 0 };
        const newPercent = Math.max(current.percent, percent);
        const newStars = Math.max(current.stars, stars);

        this.profile.tableProgress[tableNum] = {
            percent: newPercent,
            stars: newStars
        };

        // Comprobar si se puede desbloquear la siguiente tabla
        if (newPercent >= 70 && tableNum < 10) {
            const nextTable = tableNum + 1;
            if (!this.profile.unlockedTables.includes(nextTable)) {
                this.profile.unlockedTables.push(nextTable);
                this.showToast(`🔓 ¡Tabla del ${nextTable} Desbloqueada!`, `Demuestra lo que sabes en la tabla del ${nextTable}.`);
                window.soundFX.playFanfare();
            }
        }

        // Comprobar insignias por tabla
        if (newStars >= 3) {
            if (tableNum === 2) this.awardBadge('maestro_2');
            if (tableNum === 5) this.awardBadge('maestro_5');
            if (tableNum === 10) this.awardBadge('maestro_10');
        }

        this.saveState();
    }

    awardBadge(badgeId) {
        if (!this.profile) return;
        if (!this.profile.badges.includes(badgeId)) {
            this.profile.badges.push(badgeId);
            const badge = this.BADGES_DEFINITIONS.find(b => b.id === badgeId);
            if (badge) {
                window.soundFX.playFanfare();
                this.showToast(`🏆 ¡Logro Desbloqueado: ${badge.name}!`, badge.desc);
            }
            this.saveState();
        }
    }

    recordSimceResult(score, total, percentage, levelName) {
        if (!this.profile) return;
        const entry = {
            date: new Date().toLocaleDateString('es-CL'),
            score: score,
            total: total,
            percentage: percentage,
            level: levelName
        };
        this.profile.simceHistory.push(entry);
        
        if (percentage >= 80) {
            this.awardBadge('simce_master');
        }
        
        this.addXP(score * 30);
        this.saveState();
    }

    showToast(title, message) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-icon">🌟</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-desc">${message}</div>
            </div>
        `;

        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.4s forwards ease-in';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
}

window.studentState = new StudentState();

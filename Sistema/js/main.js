/**
 * Main Controller Module - Mis Tablas (Ultra-Interactive 16-Bit Arcade Edition)
 * Gestor del tablero principal, mapa de mundos interactivo, guía rápida cheat-sheet,
 * retos relámpago flash y sala de práctica interactiva con audio.
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.studentState || !window.studentState.profile) {
        window.location.href = '../index.html';
        return;
    }

    const state = window.studentState;
    let currentRoadmapFilter = 'all';

    const MASCOT_POSES = {
        happy: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#bfdbfe"/>
            <rect x="25" y="30" width="50" height="42" rx="10" fill="#3b82f6"/>
            <rect x="30" y="36" width="40" height="22" rx="6" fill="#1e293b"/>
            <circle cx="40" cy="47" r="5" fill="#60a5fa"/>
            <circle cx="60" cy="47" r="5" fill="#60a5fa"/>
            <circle cx="41" cy="45" r="1.8" fill="#ffffff"/>
            <circle cx="61" cy="45" r="1.8" fill="#ffffff"/>
            <rect x="38" y="62" width="24" height="4" rx="2" fill="#93c5fd"/>
            <circle cx="50" cy="18" r="6" fill="#ef4444"/>
            <line x1="50" y1="24" x2="50" y2="30" stroke="#3b82f6" stroke-width="4"/>
        </svg>`,

        celebrating: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#fed7aa"/>
            <path d="M20 30L35 60H15L20 30Z" fill="#ea580c"/>
            <path d="M80 30L85 60H65L80 30Z" fill="#ea580c"/>
            <path d="M25 40L50 85L75 40C75 40 60 55 50 55C40 55 25 40 25 40Z" fill="#f97316"/>
            <path d="M30 46Q38 38 44 46" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
            <path d="M56 46Q62 38 70 46" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
            <ellipse cx="50" cy="58" rx="7" ry="5" fill="#0f172a"/>
            <path d="M12 20L15 26L21 27L16 31L18 37L12 33L6 37L8 31L3 27L9 26Z" fill="#fbbf24"/>
            <path d="M88 20L91 26L97 27L92 31L94 37L88 33L82 37L84 31L79 27L85 26Z" fill="#fbbf24"/>
        </svg>`,

        sad: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#bfdbfe"/>
            <rect x="25" y="30" width="50" height="42" rx="10" fill="#3b82f6"/>
            <rect x="30" y="36" width="40" height="22" rx="6" fill="#1e293b"/>
            <circle cx="40" cy="47" r="5" fill="#60a5fa"/>
            <circle cx="60" cy="47" r="5" fill="#60a5fa"/>
            <path d="M32 54C32 54 28 60 32 64C36 64 34 54 32 54Z" fill="#38bdf8"/>
            <path d="M68 54C68 54 64 60 68 64C72 64 70 54 68 54Z" fill="#38bdf8"/>
            <path d="M38 64Q50 58 62 64" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        </svg>`
    };

    updateProfileBar();
    renderWorldRouteTrack();
    renderRoadmapGrid();
    setupRoadmapFilterButtons();
    setupDailyMission();
    renderBadgesGrid();
    setupTabNavigation();
    setupSwitchUserButton();

    if (window.learningExplorer) window.learningExplorer.init();
    if (window.simceTestEngine) window.simceTestEngine.init();

    function updateProfileBar() {
        const p = state.profile;
        if (!p) return;

        const avatarBox = document.getElementById('profileAvatarBox');
        const nameElem = document.getElementById('profileNameText');
        const levelElem = document.getElementById('profileLevelText');
        const xpBarFill = document.getElementById('profileXpBarFill');
        const starsElem = document.getElementById('profileStarsText');

        if (avatarBox) {
            avatarBox.innerHTML = (p.avatar && p.avatar.svg) ? p.avatar.svg : MASCOT_POSES.happy;
        }
        if (nameElem) nameElem.textContent = p.name;
        if (levelElem) levelElem.textContent = `NIVEL ${p.level || 1}`;
        if (starsElem) starsElem.textContent = p.stars || 0;

        if (xpBarFill) {
            const currentLevelXP = (p.xp || 0) % 200;
            const percentage = Math.min(100, Math.round((currentLevelXP / 200) * 100));
            xpBarFill.style.width = `${percentage}%`;
        }
    }

    /* ==========================================================
       RUTA MUNDIAL INTERACTIVA (WORLD MAP 16-BIT TRACK)
       ========================================================== */
    function renderWorldRouteTrack() {
        const track = document.getElementById('worldRouteTrack');
        const statusText = document.getElementById('worldRouteStatusText');
        if (!track) return;

        track.innerHTML = '';
        const p = state.profile;
        const unlocked = p.unlockedTables || [2];
        const highestUnlocked = Math.max(...unlocked);

        if (statusText) {
            statusText.textContent = `ESTÁS EN ETAPA ${highestUnlocked} DE 10 🚀`;
        }

        for (let t = 2; t <= 10; t++) {
            const isPassed = t < highestUnlocked;
            const isCurrent = t === highestUnlocked;
            const isLocked = t > highestUnlocked;
            const isBoss = (t === 7 || t === 9 || t === 10);

            const node = document.createElement('div');
            node.className = `world-stage-node ${isCurrent ? 'stage-current' : ''} ${isPassed ? 'stage-passed' : ''} ${isLocked ? 'stage-locked' : ''} ${isBoss ? 'stage-boss' : ''}`;
            node.title = `Etapa ${t}: Tabla del ${t}`;

            node.innerHTML = `
                ${isCurrent ? '<div class="player-avatar-marker">📍 [1P]</div>' : ''}
                <div class="stage-bubble">
                    ${isLocked ? '🔒' : (isBoss ? '👑' : t)}
                </div>
                <div class="stage-label">T-${t}</div>
            `;

            // Al hacer clic en un mundo, navega y hace scroll a esa tarjeta
            node.addEventListener('click', () => {
                if (!isLocked) {
                    if (window.soundFX) window.soundFX.playClick();
                    const card = document.getElementById(`tableCard_${t}`);
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.classList.add('card-highlight-pulse');
                        setTimeout(() => card.classList.remove('card-highlight-pulse'), 1200);
                    }
                } else {
                    if (window.soundFX) window.soundFX.playWrong();
                }
            });

            track.appendChild(node);

            // Conector entre etapas
            if (t < 10) {
                const connector = document.createElement('div');
                connector.className = `world-stage-connector ${t < highestUnlocked ? 'connector-active' : ''}`;
                track.appendChild(connector);
            }
        }
    }

    /* ==========================================================
       FILTROS INTERACTIVOS DEL ROADMAP
       ========================================================== */
    function setupRoadmapFilterButtons() {
        const filterBtns = document.querySelectorAll('.btn-filter-tag');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentRoadmapFilter = btn.dataset.filter;
                renderRoadmapGrid();
            });
        });
    }

    /* ==========================================================
       MISIÓN DIARIA INTERACTIVA
       ========================================================== */
    function setupDailyMission() {
        const btn = document.getElementById('btnAcceptDailyMission');
        if (!btn) return;

        btn.addEventListener('click', () => {
            if (window.soundFX) window.soundFX.playFanfare();
            // Iniciar desafío de la Tabla del 7
            openTablePracticeRoom(7);
        });
    }

    /* ==========================================================
       GRILLA DE NODOS DE TABLAS (ROADMAP DASHBOARD)
       ========================================================== */
    function renderRoadmapGrid() {
        const container = document.getElementById('roadmapGridContainer');
        if (!container) return;

        container.innerHTML = '';
        const p = state.profile;

        for (let t = 2; t <= 10; t++) {
            const isUnlocked = p.unlockedTables.includes(t);
            const progress = p.tableProgress[t] || { percent: 0, stars: 0 };
            const isMastered = progress.stars >= 3;
            const isBoss = (t === 7 || t === 9 || t === 10);

            // Aplicar filtro
            if (currentRoadmapFilter === 'unlocked' && !isUnlocked) continue;
            if (currentRoadmapFilter === 'mastered' && !isMastered) continue;
            if (currentRoadmapFilter === 'locked' && isUnlocked) continue;

            const nodeCard = document.createElement('div');
            nodeCard.id = `tableCard_${t}`;
            nodeCard.className = `table-node-card ${isUnlocked ? 'unlocked' : 'locked'} ${isBoss ? 'card-boss-theme' : ''}`;

            let starsHtml = '';
            for (let s = 1; s <= 3; s++) {
                starsHtml += `<span class="${s <= progress.stars ? 'star-filled' : 'star-empty'}">★</span>`;
            }

            nodeCard.innerHTML = `
                ${isBoss ? '<div class="card-boss-badge">👑 ETAPA JEFE • 2X XP</div>' : ''}
                <div class="node-header">
                    <div class="node-badge">${t}</div>
                    <div class="node-stars">${starsHtml}</div>
                </div>
                <div class="node-title">Tabla del ${t}</div>
                <div class="node-desc">${isUnlocked ? `Avance: ${progress.percent}% | ${progress.stars} / 3 Estrellas` : `Desbloquea con 70% en tabla anterior`}</div>
                <div class="node-progress-bar">
                    <div class="node-progress-fill" style="width: ${progress.percent}%;"></div>
                </div>

                <!-- Botones de Acción Interactiva -->
                <div class="node-actions-vertical">
                    <button class="btn-node-action btn-main-practice" ${!isUnlocked ? 'disabled' : ''}>
                        ${isUnlocked ? '✨ ¡ENTRAR Y PRACTICAR!' : '🔒 BLOQUEADO'}
                    </button>
                    
                    ${isUnlocked ? `
                        <div class="node-sub-actions">
                            <button class="btn-sub-action btn-view-cheat" data-table="${t}">
                                <span>📜</span> Guía Rápida
                            </button>
                            <button class="btn-sub-action btn-flash-challenge" data-table="${t}">
                                <span>⚡</span> Reto Flash
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;

            if (isUnlocked) {
                // 1. Práctica completa
                nodeCard.querySelector('.btn-main-practice').addEventListener('click', () => {
                    if (window.soundFX) window.soundFX.playClick();
                    openTablePracticeRoom(t);
                });

                // 2. Cheat Sheet interactiva
                const btnCheat = nodeCard.querySelector('.btn-view-cheat');
                if (btnCheat) {
                    btnCheat.addEventListener('click', () => {
                        openQuickCheatSheet(t);
                    });
                }

                // 3. Reto Flash
                const btnFlash = nodeCard.querySelector('.btn-flash-challenge');
                if (btnFlash) {
                    btnFlash.addEventListener('click', () => {
                        openQuickFlashChallenge(t);
                    });
                }
            }

            container.appendChild(nodeCard);
        }
    }

    /* ==========================================================
       MODAL 1: GUÍA RÁPIDA DE MULTIPLICAR (CHEAT SHEET)
       ========================================================== */
    function openQuickCheatSheet(tableNum) {
        const modal = document.getElementById('quickCheatSheetModal');
        const title = document.getElementById('cheatSheetTitle');
        const grid = document.getElementById('cheatSheetGrid');
        const btnClose = document.getElementById('btnCloseCheatSheetModal');

        if (!modal || !grid) return;

        if (window.soundFX) window.soundFX.playPop();

        if (title) title.textContent = `GUÍA RÁPIDA: TABLA DEL ${tableNum}`;

        grid.innerHTML = '';
        for (let m = 1; m <= 10; m++) {
            const prod = tableNum * m;
            const item = document.createElement('div');
            item.className = 'cheat-sheet-item';
            item.innerHTML = `
                <span class="cheat-equation">${tableNum} × ${m}</span>
                <span class="cheat-equals">=</span>
                <strong class="cheat-product">${prod}</strong>
            `;

            item.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playSuccess();
                document.querySelectorAll('.cheat-sheet-item').forEach(i => i.classList.remove('active-cheat'));
                item.classList.add('active-cheat');
            });

            grid.appendChild(item);
        }

        modal.classList.add('active');

        if (btnClose) {
            btnClose.onclick = () => {
                if (window.soundFX) window.soundFX.playClick();
                modal.classList.remove('active');
            };
        }
    }

    /* ==========================================================
       MODAL 2: RETO RELÁMPAGO FLASH (3 PREGUNTAS EXPRESS)
       ========================================================== */
    function openQuickFlashChallenge(tableNum) {
        const modal = document.getElementById('quickFlashModal');
        const title = document.getElementById('flashChallengeTitle');
        const prompt = document.getElementById('flashQuestionPrompt');
        const optionsGrid = document.getElementById('flashOptionsGrid');
        const stepSpan = document.getElementById('flashCurrentStep');
        const scoreSpan = document.getElementById('flashCorrectScore');
        const btnClose = document.getElementById('btnCloseFlashModal');

        if (!modal) return;

        if (window.soundFX) window.soundFX.playFanfare();

        let step = 0;
        let score = 0;
        const multipliers = [2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 3);

        const renderFlash = () => {
            if (step >= 3) {
                if (window.soundFX) window.soundFX.playSuccess();
                state.addXP(score * 12);
                updateProfileBar();

                prompt.textContent = `¡RETO FLASH COMPLETADO!`;
                optionsGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center;">
                        <p style="font-family: var(--font-pixel); font-size: 0.85rem; color: #047857; margin-bottom: 16px;">
                            Acertaste ${score} de 3. ¡Ganaste +${score * 12} XP! ⭐
                        </p>
                        <button class="btn-node-action" id="btnFinishFlash" style="background: #10b981; color: #fff;">CONTINUAR 🚀</button>
                    </div>
                `;
                document.getElementById('btnFinishFlash').onclick = () => {
                    modal.classList.remove('active');
                };
                return;
            }

            const m = multipliers[step];
            const correct = tableNum * m;

            if (stepSpan) stepSpan.textContent = step + 1;
            if (scoreSpan) scoreSpan.textContent = score;
            if (title) title.textContent = `RETO FLASH: TABLA DEL ${tableNum}`;
            if (prompt) prompt.textContent = `${tableNum} × ${m} = ?`;

            const choices = [correct];
            while (choices.length < 4) {
                const fake = correct + (Math.floor(Math.random() * 8) - 4);
                if (fake > 0 && !choices.includes(fake)) choices.push(fake);
            }
            choices.sort(() => Math.random() - 0.5);

            optionsGrid.innerHTML = choices.map(c => `
                <button class="btn-practice-option" data-val="${c}">${c}</button>
            `).join('');

            optionsGrid.querySelectorAll('.btn-practice-option').forEach(btn => {
                btn.onclick = () => {
                    const picked = parseInt(btn.dataset.val);
                    if (picked === correct) {
                        if (window.soundFX) window.soundFX.playPop();
                        score++;
                        btn.style.setProperty('background', '#d1fae5', 'important');
                        btn.style.setProperty('color', '#047857', 'important');
                    } else {
                        if (window.soundFX) window.soundFX.playWrong();
                        btn.style.setProperty('background', '#fee2e2', 'important');
                        btn.style.setProperty('color', '#dc2626', 'important');
                    }
                    setTimeout(() => {
                        step++;
                        renderFlash();
                    }, 500);
                };
            });
        };

        renderFlash();
        modal.classList.add('active');

        if (btnClose) {
            btnClose.onclick = () => {
                modal.classList.remove('active');
            };
        }
    }

    /* ==========================================================
       MODAL 3: SALA DE PRÁCTICA PRINCIPAL POR TABLA
       ========================================================== */
    function openTablePracticeRoom(tableNum) {
        const modal = document.getElementById('tablePracticeModal');
        if (!modal) return;

        let currentStep = 0;
        let correctCount = 0;

        const multipliers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5).slice(0, 5);
        const questions = multipliers.map(m => ({
            table: tableNum,
            mult: m,
            product: tableNum * m
        }));

        const mascotBox = document.getElementById('practiceMascotBox');
        const speechBubble = document.getElementById('practiceSpeechBubble');
        const questionTitle = document.getElementById('practiceQuestionTitle');
        const visualGroups = document.getElementById('practiceVisualGroups');
        const optionsGrid = document.getElementById('practiceOptionsGrid');
        const btnClose = document.getElementById('btnClosePracticeModal');

        const renderQuestion = () => {
            if (currentStep >= questions.length) {
                const percentEarned = Math.round((correctCount / questions.length) * 100);
                const starsEarned = percentEarned >= 100 ? 3 : (percentEarned >= 70 ? 2 : 1);

                state.updateTableProgress(tableNum, percentEarned, starsEarned);
                state.addXP(correctCount * 15);
                state.addStars(starsEarned);

                if (window.soundFX) window.soundFX.playFanfare();
                updateProfileBar();
                renderWorldRouteTrack();
                renderRoadmapGrid();

                mascotBox.innerHTML = MASCOT_POSES.celebrating;
                speechBubble.textContent = `🎉 ¡Práctica completada! Acertaste ${correctCount} de 5. Obtenías ${percentEarned}% de avance.`;

                questionTitle.textContent = `¡Tabla del ${tableNum} Superada!`;
                visualGroups.innerHTML = `<div style="font-size: 1.3rem; font-weight: 800; color: #059669;">⭐ ¡Ganaste +${correctCount * 15} XP y ${starsEarned} estrellas!</div>`;
                optionsGrid.innerHTML = `<button class="btn-node-action" id="btnFinishPractice" style="grid-column: 1 / -1; background: #10b981; color:#ffffff !important; font-size: 1.2rem; border: 3px solid #000;">Volver al Mapa de Tablas 🚀</button>`;

                document.getElementById('btnFinishPractice').onclick = () => {
                    modal.classList.remove('active');
                };
                return;
            }

            const q = questions[currentStep];

            mascotBox.innerHTML = MASCOT_POSES.happy;
            speechBubble.textContent = `¡Vamos! Ejercicio ${currentStep + 1} de 5 de la Tabla del ${tableNum} ✨`;

            questionTitle.textContent = `${q.table} × ${q.mult} = ?`;

            visualGroups.innerHTML = '';
            for (let g = 0; g < q.table; g++) {
                const box = document.createElement('div');
                box.className = 'group-box';
                box.innerHTML = `<div class="group-tag-badge">GRUPO ${g + 1} (${q.mult})</div>`;
                const itemsWrap = document.createElement('div');
                itemsWrap.className = 'group-items-wrap';
                for (let i = 0; i < q.mult; i++) {
                    itemsWrap.innerHTML += `<span class="item-icon">⭐</span>`;
                }
                box.appendChild(itemsWrap);
                visualGroups.appendChild(box);
            }

            const choices = [q.product];
            while (choices.length < 4) {
                const wrong = q.product + (Math.floor(Math.random() * 10) - 5);
                if (wrong > 0 && !choices.includes(wrong)) choices.push(wrong);
            }
            choices.sort(() => Math.random() - 0.5);

            optionsGrid.innerHTML = choices.map(c => `
                <button class="btn-practice-option" data-val="${c}">${c}</button>
            `).join('');

            optionsGrid.querySelectorAll('.btn-practice-option').forEach(btn => {
                btn.onclick = () => {
                    const chosen = parseInt(btn.dataset.val);

                    if (chosen === q.product) {
                        if (window.soundFX) window.soundFX.playSuccess();
                        correctCount++;
                        mascotBox.innerHTML = MASCOT_POSES.celebrating;
                        speechBubble.textContent = `✨ ¡Excelente! ${q.table} × ${q.mult} es efectivamente ${q.product}! 🎉`;
                        btn.style.setProperty('background', '#d1fae5', 'important');
                        btn.style.setProperty('border-color', '#10b981', 'important');
                        btn.style.setProperty('color', '#047857', 'important');

                        setTimeout(() => {
                            currentStep++;
                            renderQuestion();
                        }, 1200);
                    } else {
                        if (window.soundFX) window.soundFX.playWrong();
                        mascotBox.innerHTML = MASCOT_POSES.sad;
                        speechBubble.textContent = `⚡ ¡Uy! ${q.table} × ${q.mult} no es ${chosen}. ¡Inténtalo de nuevo!`;
                        btn.style.setProperty('background', '#fee2e2', 'important');
                        btn.style.setProperty('border-color', '#ef4444', 'important');
                        btn.style.setProperty('color', '#dc2626', 'important');
                    }
                };
            });
        };

        renderQuestion();
        modal.classList.add('active');

        if (btnClose) {
            btnClose.onclick = () => {
                modal.classList.remove('active');
            };
        }
    }

    function renderBadgesGrid() {
        const container = document.getElementById('badgesGridContainer');
        if (!container) return;

        container.innerHTML = '';
        const p = state.profile;

        state.BADGES_DEFINITIONS.forEach(b => {
            const isUnlocked = p.badges.includes(b.id);
            const card = document.createElement('div');
            card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="badge-icon">${b.icon}</div>
                <div class="badge-title">${b.name}</div>
                <div class="badge-desc">${b.desc}</div>
            `;
            container.appendChild(card);
        });
    }

    function setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.nav-tab-btn');
        const viewPanes = document.querySelectorAll('.view-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                const targetTab = btn.dataset.tab;

                tabBtns.forEach(b => b.classList.remove('active'));
                viewPanes.forEach(v => v.classList.remove('active'));

                btn.classList.add('active');
                const activePane = document.getElementById(`view-${targetTab}`);
                if (activePane) activePane.classList.add('active');

                if (targetTab === 'games' && window.miniGamesEngine) {
                    window.miniGamesEngine.closeGame();
                }
                if (targetTab === 'badges') {
                    renderBadgesGrid();
                }
                if (targetTab === 'roadmap') {
                    renderWorldRouteTrack();
                    renderRoadmapGrid();
                }
            });
        });

        document.querySelectorAll('.game-select-card').forEach(card => {
            card.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                const gameId = card.dataset.game;
                if (window.miniGamesEngine) {
                    window.miniGamesEngine.launchGame(gameId);
                }
            });
        });

        const btnBackHub = document.getElementById('btnBackGamesHub');
        if (btnBackHub) {
            btnBackHub.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                if (window.miniGamesEngine) {
                    window.miniGamesEngine.closeGame();
                }
            });
        }

        const btnStartSimceHero = document.getElementById('btnStartSimceHero');
        if (btnStartSimceHero) {
            btnStartSimceHero.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                const simceTabBtn = document.querySelector('[data-tab="simce"]');
                if (simceTabBtn) simceTabBtn.click();
            });
        }
    }

    function setupSwitchUserButton() {
        const btnSwitch = document.getElementById('btnSwitchUser');
        if (btnSwitch) {
            btnSwitch.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                if (confirm('¿Deseas volver a la pantalla de inicio? Tu avance se mantendrá guardado.')) {
                    window.location.href = '../index.html';
                }
            });
        }

        const btnToggleSound = document.getElementById('btnToggleSoundSystem');
        if (btnToggleSound) {
            btnToggleSound.addEventListener('click', () => {
                if (window.soundFX) {
                    window.soundFX.enabled = !window.soundFX.enabled;
                    if (window.soundFX.enabled) {
                        btnToggleSound.textContent = '🔊 SFX: ON';
                        btnToggleSound.classList.remove('muted');
                        window.soundFX.playClick();
                    } else {
                        btnToggleSound.textContent = '🔇 SFX: OFF';
                        btnToggleSound.classList.add('muted');
                    }
                }
            });
        }
    }
});

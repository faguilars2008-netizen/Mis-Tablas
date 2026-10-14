/**
 * Games Engine Module - Mis Tablas (10-Game Arcade Suite • 100% Guaranteed High Contrast)
 * Todos los enunciados, preguntas, puntos, relojes y opciones usan insignias de alto contraste.
 */

class MiniGamesEngine {
    constructor() {
        this.currentGameId = null;
        this.timerInterval = null;
        this.activeIntervals = [];
    }

    launchGame(gameId) {
        this.currentGameId = gameId;
        this.stopAllTimers();

        const hubGrid = document.getElementById('gamesHubGrid');
        const activeArena = document.getElementById('activeGameArena');
        const gameTitle = document.getElementById('activeGameTitle');

        if (hubGrid) hubGrid.style.display = 'none';
        if (activeArena) activeArena.style.display = 'block';

        switch (gameId) {
            case 'memoria':
                if (gameTitle) gameTitle.textContent = '🃏 Memoria Matemática';
                this.initMemoria();
                break;
            case 'atrapa':
                if (gameTitle) gameTitle.textContent = '🫧 Atrapa el Resultado';
                this.initAtrapa();
                break;
            case 'galaxia':
                if (gameTitle) gameTitle.textContent = '🚀 Galaxia de Tablas (Space Blaster)';
                this.initGalaxia();
                break;
            case 'carrera':
                if (gameTitle) gameTitle.textContent = '🏎️ Carrera Retro Nitro (Pixel Racer)';
                this.initCarrera();
                break;
            case 'topos':
                if (gameTitle) gameTitle.textContent = '🔨 Martillo de Topos (Whack-a-Number)';
                this.initTopos();
                break;
            case 'construye':
                if (gameTitle) gameTitle.textContent = '🧩 Construye la Multiplicación';
                this.initConstruye();
                break;
            case 'quien':
                if (gameTitle) gameTitle.textContent = '🤖 ¿Quién tiene la Respuesta?';
                this.initQuien();
                break;
            case 'tiempo':
                if (gameTitle) gameTitle.textContent = '⏱️ Desafío Contra el Tiempo';
                this.initTiempo();
                break;
            case 'arrastra':
                if (gameTitle) gameTitle.textContent = '🎯 Arrastra y Completa';
                this.initArrastra();
                break;
            case 'detective':
                if (gameTitle) gameTitle.textContent = '🔍 Detective Matemático';
                this.initDetective();
                break;
            default:
                this.closeGame();
        }
    }

    closeGame() {
        this.stopAllTimers();
        const hubGrid = document.getElementById('gamesHubGrid');
        const activeArena = document.getElementById('activeGameArena');
        if (hubGrid) hubGrid.style.display = 'block';
        if (activeArena) activeArena.style.display = 'none';
    }

    stopAllTimers() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.activeIntervals.forEach(id => clearInterval(id));
        this.activeIntervals = [];
    }

    getRandomProblem() {
        const t = Math.floor(Math.random() * 9) + 2; // 2..10
        const m = Math.floor(Math.random() * 9) + 2; // 2..10
        return { table: t, mult: m, product: t * m, str: `${t} × ${m}` };
    }

    /* ----------------------------------------------------
       JUEGO 1: MEMORIA MATEMÁTICA
    ---------------------------------------------------- */
    initMemoria() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        const pairs = [];
        for (let i = 0; i < 4; i++) {
            const prob = this.getRandomProblem();
            pairs.push({ id: i, text: prob.str, matchId: i, type: 'eq' });
            pairs.push({ id: i, text: prob.product.toString(), matchId: i, type: 'ans' });
        }

        pairs.sort(() => Math.random() - 0.5);

        let flippedCards = [];
        let matchedCount = 0;

        body.innerHTML = `
            <div class="game-instruction-bar">
                <span class="pixel-arrow">►</span> Encuentra las parejas que corresponden a la misma multiplicación y resultado.
            </div>
            <div class="memory-grid" id="memGrid"></div>
        `;

        const grid = document.getElementById('memGrid');
        pairs.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-front">❓</div>
                    <div class="memory-card-back">${item.text}</div>
                </div>
            `;

            card.addEventListener('click', () => {
                if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) return;

                if (window.soundFX) window.soundFX.playFlip();
                card.classList.add('flipped');
                flippedCards.push({ card, item });

                if (flippedCards.length === 2) {
                    const [c1, c2] = flippedCards;
                    if (c1.item.matchId === c2.item.matchId && c1.item.type !== c2.item.type) {
                        setTimeout(() => {
                            if (window.soundFX) window.soundFX.playSuccess();
                            c1.card.classList.add('matched');
                            c2.card.classList.add('matched');
                            flippedCards = [];
                            matchedCount++;
                            if (matchedCount === 4) {
                                window.studentState.addXP(60);
                                window.studentState.awardBadge('memoria_pro');
                                this.showVictoryModal('¡MEMORIA COMPLETADA!', '¡Excelente agilidad mental de 16-bit! Ganaste +60 XP.');
                            }
                        }, 400);
                    } else {
                        setTimeout(() => {
                            if (window.soundFX) window.soundFX.playWrong();
                            c1.card.classList.remove('flipped');
                            c2.card.classList.remove('flipped');
                            flippedCards = [];
                        }, 900);
                    }
                }
            });

            grid.appendChild(card);
        });
    }

    /* ----------------------------------------------------
       JUEGO 2: ATRAPA EL RESULTADO (BURBUJAS ARCADE)
    ---------------------------------------------------- */
    initAtrapa() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        let score = 0;
        let targetProblem = this.getRandomProblem();

        body.innerHTML = `
            <div class="game-top-hud">
                <div class="game-hud-question">
                    <span>¿Cuál es el resultado de:</span>
                    <span id="catchQuestionStr" class="hud-target-badge">${targetProblem.str}</span> ?
                </div>
                <div class="game-hud-score">
                    🪙 PUNTOS: <strong id="catchScore" class="hud-points-badge">0</strong> / 5
                </div>
            </div>
            <div class="catch-bubbles-arena" id="catchArena"></div>
        `;

        const arena = document.getElementById('catchArena');
        const scoreElem = document.getElementById('catchScore');

        const spawnBubble = () => {
            if (score >= 5) return;

            const isCorrect = Math.random() < 0.45;
            const value = isCorrect ? targetProblem.product : targetProblem.product + (Math.floor(Math.random() * 8) - 4 || 3);
            
            const bubble = document.createElement('div');
            bubble.className = 'bubble-target';
            bubble.textContent = value;
            bubble.style.left = `${Math.random() * 75 + 10}%`;
            bubble.style.bottom = '-85px';

            arena.appendChild(bubble);

            let posY = -85;
            const speed = Math.random() * 1.5 + 1.2;

            const floatInterval = setInterval(() => {
                posY += speed;
                bubble.style.bottom = `${posY}px`;
                if (posY > 400) {
                    clearInterval(floatInterval);
                    bubble.remove();
                }
            }, 20);
            this.activeIntervals.push(floatInterval);

            bubble.addEventListener('click', () => {
                clearInterval(floatInterval);
                bubble.remove();

                if (parseInt(bubble.textContent) === targetProblem.product) {
                    if (window.soundFX) window.soundFX.playPop();
                    score++;
                    scoreElem.textContent = score;
                    if (score >= 5) {
                        window.studentState.addXP(70);
                        window.studentState.awardBadge('cazador_burbujas');
                        this.showVictoryModal('¡REFLEJOS DE ACERO!', '¡Atrapaste todas las respuestas correctas! Ganaste +70 XP.');
                    } else {
                        targetProblem = this.getRandomProblem();
                        const qStr = document.getElementById('catchQuestionStr');
                        if (qStr) qStr.textContent = targetProblem.str;
                    }
                } else {
                    if (window.soundFX) window.soundFX.playWrong();
                }
            });
        };

        this.timerInterval = setInterval(spawnBubble, 1600);
        spawnBubble();
    }

    /* ----------------------------------------------------
       JUEGO 3: GALAXIA DE TABLAS (SPACE INVADERS BLASTER) - NUEVO
    ---------------------------------------------------- */
    initGalaxia() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        let score = 0;
        let prob = this.getRandomProblem();

        const renderGalaxyRound = () => {
            body.innerHTML = `
                <div class="game-top-hud">
                    <div class="game-hud-question">
                        <span>🚀 DISPARA A LA NAVE CON EL RESULTADO DE:</span>
                        <span class="hud-target-badge">${prob.str}</span>
                    </div>
                    <div class="game-hud-score">
                        👾 OLEADA: <strong class="hud-points-badge">${score + 1}</strong> / 5
                    </div>
                </div>

                <div class="galaxy-space-arena" id="galaxyArena">
                    <div class="galaxy-starfield"></div>
                    
                    <!-- Escuadrón Alienígena -->
                    <div class="alien-squad" id="alienSquad"></div>

                    <!-- Cañón Espacial del Jugador -->
                    <div class="player-cannon">
                        <div class="cannon-turret">🚀</div>
                        <div class="cannon-laser-sight"></div>
                    </div>
                </div>
            `;

            const squad = document.getElementById('alienSquad');
            const arena = document.getElementById('galaxyArena');

            // 3 naves alienígenas (1 correcta, 2 distractores)
            const answers = [prob.product];
            while (answers.length < 3) {
                const fake = prob.product + (Math.floor(Math.random() * 12) - 6);
                if (fake > 0 && !answers.includes(fake)) answers.push(fake);
            }
            answers.sort(() => Math.random() - 0.5);

            const alienIcons = ['👾', '🛸', '👽'];

            answers.forEach((val, i) => {
                const alien = document.createElement('div');
                alien.className = 'alien-ship';
                alien.dataset.val = val;
                alien.innerHTML = `
                    <div class="alien-sprite">${alienIcons[i % alienIcons.length]}</div>
                    <div class="alien-shield-number">${val}</div>
                `;

                alien.addEventListener('click', () => {
                    const picked = parseInt(alien.dataset.val);
                    if (picked === prob.product) {
                        if (window.soundFX) window.soundFX.playSuccess();
                        alien.classList.add('alien-destroyed');
                        alien.innerHTML = `<div class="alien-explosion">💥 +100</div>`;

                        score++;
                        if (score >= 5) {
                            window.studentState.addXP(80);
                            window.studentState.awardBadge('galaxia_master');
                            setTimeout(() => {
                                this.showVictoryModal('¡GALAXIA SALVADA, COMANDANTE!', '¡Derrotaste a todos los invasores numéricos! Ganaste +80 XP.');
                            }, 600);
                        } else {
                            setTimeout(() => {
                                prob = this.getRandomProblem();
                                renderGalaxyRound();
                            }, 700);
                        }
                    } else {
                        if (window.soundFX) window.soundFX.playWrong();
                        alien.classList.add('alien-shield-hit');
                        setTimeout(() => alien.classList.remove('alien-shield-hit'), 500);
                    }
                });

                squad.appendChild(alien);
            });
        };

        renderGalaxyRound();
    }

    /* ----------------------------------------------------
       JUEGO 4: CARRERA RETRO NITRO (PIXEL RACER) - NUEVO
    ---------------------------------------------------- */
    initCarrera() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        let lap = 0;
        let prob = this.getRandomProblem();

        const renderTrack = () => {
            const answers = [prob.product];
            while (answers.length < 3) {
                const fake = prob.product + (Math.floor(Math.random() * 10) - 5);
                if (fake > 0 && !answers.includes(fake)) answers.push(fake);
            }
            answers.sort(() => Math.random() - 0.5);

            body.innerHTML = `
                <div class="game-top-hud">
                    <div class="game-hud-question">
                        <span>🏁 CRUZA POR EL CARRIL CORRECTO:</span>
                        <span class="hud-target-badge">${prob.str}</span>
                    </div>
                    <div class="game-hud-score">
                        🏎️ VUELTA: <strong class="hud-points-badge">${lap + 1}</strong> / 5
                    </div>
                </div>

                <div class="highway-arena" id="racerArena">
                    <div class="highway-lanes-container">
                        ${answers.map((ans, idx) => `
                            <div class="highway-lane" data-val="${ans}" data-lane="${idx}">
                                <div class="lane-speed-gate">
                                    <div class="gate-sign">PORTAL ${idx + 1}</div>
                                    <div class="gate-number">${ans}</div>
                                </div>
                                <div class="lane-track-strip"></div>
                                <div class="lane-click-hint">CLICK PARA ACELERAR AQUÍ 👆</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="racer-car" id="playerCar">
                        <span>🏎️</span>
                        <div class="nitro-exhaust" id="nitroFlames"></div>
                    </div>
                </div>
            `;

            const car = document.getElementById('playerCar');
            const lanes = document.querySelectorAll('.highway-lane');

            lanes.forEach(lane => {
                lane.addEventListener('click', () => {
                    const chosen = parseInt(lane.dataset.val);
                    const laneIndex = parseInt(lane.dataset.lane);

                    // Animar auto hacia ese carril
                    car.style.left = `${(laneIndex * 33.33) + 16.66}%`;

                    if (chosen === prob.product) {
                        if (window.soundFX) window.soundFX.playSuccess();
                        const flames = document.getElementById('nitroFlames');
                        if (flames) flames.classList.add('nitro-active');

                        lap++;
                        if (lap >= 5) {
                            window.studentState.addXP(85);
                            window.studentState.awardBadge('carrera_pro');
                            setTimeout(() => {
                                this.showVictoryModal('¡PRIMER LUGAR EN EL PODIO! 🏆', '¡Cruzaste la meta con velocidad turbo! Ganaste +85 XP.');
                            }, 700);
                        } else {
                            setTimeout(() => {
                                prob = this.getRandomProblem();
                                renderTrack();
                            }, 800);
                        }
                    } else {
                        if (window.soundFX) window.soundFX.playWrong();
                        car.classList.add('car-crash-shake');
                        setTimeout(() => car.classList.remove('car-crash-shake'), 450);
                    }
                });
            });
        };

        renderTrack();
    }

    /* ----------------------------------------------------
       JUEGO 5: MARTILLO DE TOPOS (WHACK-A-NUMBER) - NUEVO
    ---------------------------------------------------- */
    initTopos() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        let whacked = 0;
        let prob = this.getRandomProblem();

        const renderMolesRound = () => {
            const answers = [prob.product];
            while (answers.length < 4) {
                const fake = prob.product + (Math.floor(Math.random() * 12) - 6);
                if (fake > 0 && !answers.includes(fake)) answers.push(fake);
            }
            answers.sort(() => Math.random() - 0.5);

            body.innerHTML = `
                <div class="game-top-hud">
                    <div class="game-hud-question">
                        <span>🔨 GOLPEA AL TOPO QUE SOSTIENE:</span>
                        <span class="hud-target-badge">${prob.str}</span>
                    </div>
                    <div class="game-hud-score">
                        🐹 ATRAPADOS: <strong class="hud-points-badge">${whacked}</strong> / 5
                    </div>
                </div>

                <div class="whack-moles-arena">
                    <div class="moles-burrows-grid">
                        ${answers.map((val) => `
                            <div class="mole-burrow-slot">
                                <div class="mole-hole">🕳️</div>
                                <div class="mole-character" data-val="${val}">
                                    <div class="mole-sprite">🐹</div>
                                    <div class="mole-sign-board">${val}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            document.querySelectorAll('.mole-character').forEach(mole => {
                mole.addEventListener('click', () => {
                    const chosen = parseInt(mole.dataset.val);
                    if (chosen === prob.product) {
                        if (window.soundFX) window.soundFX.playPop();
                        mole.classList.add('mole-bonked');
                        mole.innerHTML = `<div class="bonk-star">🔨 BAM! ⭐</div><div class="mole-sign-board mole-success-sign">${chosen}</div>`;

                        whacked++;
                        if (whacked >= 5) {
                            if (window.soundFX) window.soundFX.playSuccess();
                            window.studentState.addXP(75);
                            window.studentState.awardBadge('topos_champ');
                            setTimeout(() => {
                                this.showVictoryModal('¡REY DEL MARTILLO ARCADE!', '¡Golpeaste a todos los topos traviesos! Ganaste +75 XP.');
                            }, 600);
                        } else {
                            setTimeout(() => {
                                prob = this.getRandomProblem();
                                renderMolesRound();
                            }, 700);
                        }
                    } else {
                        if (window.soundFX) window.soundFX.playWrong();
                        mole.classList.add('mole-dodge');
                        setTimeout(() => mole.classList.remove('mole-dodge'), 400);
                    }
                });
            });
        };

        renderMolesRound();
    }

    /* ----------------------------------------------------
       JUEGO 6: CONSTRUYE LA MULTIPLICACIÓN
    ---------------------------------------------------- */
    initConstruye() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        const prob = this.getRandomProblem();

        body.innerHTML = `
            <div class="game-top-hud">
                <div class="game-hud-question">
                    <span>REPRESENTA LA MULTIPLICACIÓN:</span>
                    <span class="hud-target-badge">${prob.str}</span>
                </div>
                <div class="game-hud-score">
                    📦 Necesitas: <strong>${prob.table} grupos</strong> de <strong>${prob.mult} elementos</strong>
                </div>
            </div>

            <div style="display: flex; gap: 14px; justify-content: center; margin: 18px 0;">
                <button id="btnAddGroup" class="btn-retro-arcade-action btn-add-group">➕ Agregar Grupo (+${prob.mult})</button>
                <button id="btnRemoveGroup" class="btn-retro-arcade-action btn-remove-group">➖ Quitar Grupo</button>
            </div>

            <div class="groups-flex-container" id="builderArena"></div>

            <div style="text-align: center; margin-top: 24px;">
                <button id="btnCheckBuild" class="btn-simce-finish">VERIFICAR CONSTRUCCIÓN 🚀</button>
            </div>
        `;

        let currentGroups = 0;
        const arena = document.getElementById('builderArena');

        const updateArena = () => {
            arena.innerHTML = '';
            for (let g = 0; g < currentGroups; g++) {
                const box = document.createElement('div');
                box.className = 'group-box';
                box.innerHTML = `<div class="group-tag-badge">GRUPO ${g + 1} (${prob.mult})</div>`;
                const itemsWrap = document.createElement('div');
                itemsWrap.className = 'group-items-wrap';
                for (let i = 0; i < prob.mult; i++) {
                    itemsWrap.innerHTML += `<span class="item-icon">⭐</span>`;
                }
                box.appendChild(itemsWrap);
                arena.appendChild(box);
            }
        };

        document.getElementById('btnAddGroup').addEventListener('click', () => {
            if (currentGroups < 12) {
                if (window.soundFX) window.soundFX.playPop();
                currentGroups++;
                updateArena();
            }
        });

        document.getElementById('btnRemoveGroup').addEventListener('click', () => {
            if (currentGroups > 0) {
                if (window.soundFX) window.soundFX.playClick();
                currentGroups--;
                updateArena();
            }
        });

        document.getElementById('btnCheckBuild').addEventListener('click', () => {
            if (currentGroups === prob.table) {
                if (window.soundFX) window.soundFX.playSuccess();
                window.studentState.addXP(50);
                this.showVictoryModal('¡CONSTRUCCIÓN PERFECTA!', `Representaste correctamente ${prob.table} grupos de ${prob.mult}. Ganaste +50 XP.`);
            } else {
                if (window.soundFX) window.soundFX.playWrong();
                alert(`Revisa tu construcción. Necesitas ${prob.table} grupos, y actualmente tienes ${currentGroups}.`);
            }
        });
    }

    /* ----------------------------------------------------
       JUEGO 7: ¿QUIÉN TIENE LA RESPUESTA?
    ---------------------------------------------------- */
    initQuien() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        const prob = this.getRandomProblem();
        const correctAns = prob.product;

        const options = [correctAns];
        while (options.length < 4) {
            const wrong = correctAns + (Math.floor(Math.random() * 12) - 6);
            if (wrong > 0 && !options.includes(wrong)) {
                options.push(wrong);
            }
        }
        options.sort(() => Math.random() - 0.5);

        const mascots = ['🤖', '🦊', '🦉', '🦖'];
        const names = ['Robot Clic', 'Súper Zorro', 'Astro Búho', 'Dino Multi'];

        body.innerHTML = `
            <div class="game-top-hud">
                <div class="game-hud-question">
                    <span>¿QUÉ PERSONAJE SOSTIENE LA RESPUESTA DE:</span>
                    <span class="hud-target-badge">${prob.str}</span> ?
                </div>
            </div>
            <div class="characters-grid">
                ${options.map((opt, idx) => `
                    <div class="character-option-card" data-val="${opt}">
                        <div class="char-mascot-icon">${mascots[idx]}</div>
                        <div class="char-mascot-name">${names[idx]}</div>
                        <div class="char-answer-bubble">${opt}</div>
                    </div>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.character-option-card').forEach(card => {
            card.addEventListener('click', () => {
                const val = parseInt(card.dataset.val);
                if (val === correctAns) {
                    if (window.soundFX) window.soundFX.playSuccess();
                    window.studentState.addXP(40);
                    this.showVictoryModal('¡PERSONAJE CORRECTO!', `¡Genial! ${prob.str} es efectivamente ${correctAns}. Ganaste +40 XP.`);
                } else {
                    if (window.soundFX) window.soundFX.playWrong();
                    card.style.opacity = '0.35';
                }
            });
        });
    }

    /* ----------------------------------------------------
       JUEGO 8: DESAFÍO CONTRA EL TIEMPO
    ---------------------------------------------------- */
    initTiempo() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        let timeLeft = 30;
        let score = 0;
        let combo = 1;
        let currentProb = this.getRandomProblem();

        body.innerHTML = `
            <div class="time-challenge-hud">
                <div class="time-stat-pill">⏳ TIEMPO: <strong id="timeClock">30s</strong></div>
                <div class="time-stat-pill time-score-pill">🔥 PUNTOS: <strong id="timeScore">0</strong></div>
            </div>
            <div style="text-align: center; margin: 24px 0;">
                <div id="timeQuestionStr" class="hud-target-badge hud-large-badge">
                    ${currentProb.str} = ?
                </div>
            </div>
            <div class="time-options-flex" id="timeOptions"></div>
        `;

        const clockElem = document.getElementById('timeClock');
        const scoreElem = document.getElementById('timeScore');

        const renderOptions = () => {
            const opts = [currentProb.product];
            while (opts.length < 3) {
                const w = currentProb.product + (Math.floor(Math.random() * 10) - 5);
                if (w > 0 && !opts.includes(w)) opts.push(w);
            }
            opts.sort(() => Math.random() - 0.5);

            const container = document.getElementById('timeOptions');
            container.innerHTML = opts.map(o => `
                <button class="btn-time-option" data-opt="${o}">${o}</button>
            `).join('');

            container.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    const chosen = parseInt(btn.dataset.opt);
                    if (chosen === currentProb.product) {
                        if (window.soundFX) window.soundFX.playPop();
                        score += 10 * combo;
                        scoreElem.textContent = score;
                        currentProb = this.getRandomProblem();
                        const qStr = document.getElementById('timeQuestionStr');
                        if (qStr) qStr.textContent = `${currentProb.str} = ?`;
                        renderOptions();
                    } else {
                        if (window.soundFX) window.soundFX.playWrong();
                    }
                });
            });
        };

        renderOptions();

        this.timerInterval = setInterval(() => {
            timeLeft--;
            if (clockElem) clockElem.textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                this.stopAllTimers();
                if (window.soundFX) window.soundFX.playFanfare();
                window.studentState.addXP(score);
                this.showVictoryModal('¡TIEMPO AGOTADO!', `¡Hiciste un puntaje espectacular de ${score} puntos! Ganaste +${score} XP.`);
            }
        }, 1000);
    }

    /* ----------------------------------------------------
       JUEGO 9: ARRASTRA Y COMPLETA
    ---------------------------------------------------- */
    initArrastra() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        const prob = this.getRandomProblem();

        body.innerHTML = `
            <div class="game-instruction-bar">
                <span class="pixel-arrow">►</span> SELECCIONA EL NÚMERO QUE FALTA PARA COMPLETAR LA ECUACIÓN:
            </div>

            <div class="drag-slots-container">
                <span class="drag-fixed-box">${prob.table} ×</span>
                <div class="drag-drop-slot" id="targetSlot">?</div>
                <span class="drag-fixed-box">= ${prob.product}</span>
            </div>

            <div class="draggable-tags-pool">
                ${[prob.mult, prob.mult + 2, Math.max(1, prob.mult - 1), prob.mult + 4]
                    .sort(() => Math.random() - 0.5)
                    .map(val => `<div class="drag-tag" data-val="${val}">${val}</div>`)
                    .join('')}
            </div>
        `;

        document.querySelectorAll('.drag-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const val = parseInt(tag.dataset.val);
                const slot = document.getElementById('targetSlot');
                slot.textContent = val;
                
                if (val === prob.mult) {
                    if (window.soundFX) window.soundFX.playSuccess();
                    slot.className = 'drag-drop-slot slot-correct';
                    window.studentState.addXP(45);
                    setTimeout(() => {
                        this.showVictoryModal('¡ECUACIÓN COMPLETA!', `${prob.table} × ${prob.mult} = ${prob.product}. ¡Excelente! +45 XP.`);
                    }, 400);
                } else {
                    if (window.soundFX) window.soundFX.playWrong();
                    slot.className = 'drag-drop-slot slot-wrong';
                }
            });
        });
    }

    /* ----------------------------------------------------
       JUEGO 10: DETECTIVE MATEMÁTICO (ALTO CONTRASTE GARANTIZADO)
    ---------------------------------------------------- */
    initDetective() {
        const body = document.getElementById('gameBodyContainer');
        if (!body) return;

        const prob = this.getRandomProblem();
        const secret = prob.product;

        body.innerHTML = `
            <div class="detective-card">
                <div class="detective-header-title">
                    🕵️ CASO POLICIAL #402: EL NÚMERO OCULTO
                </div>
                <p class="detective-subtitle">Lee las pistas confidenciales del expediente para resolver el caso:</p>

                <div class="clue-list">
                    <div class="clue-item">🔍 <strong>PISTA 1:</strong> Pertenezco a la tabla del <span class="clue-highlight">${prob.table}</span>.</div>
                    <div class="clue-item">🔍 <strong>PISTA 2:</strong> Al multiplicar ${prob.table} por <span class="clue-highlight">${prob.mult}</span> obtienes mi valor.</div>
                    <div class="clue-item">🔍 <strong>PISTA 3:</strong> Soy un número mayor que <span class="clue-highlight">${Math.max(0, secret - 5)}</span> y menor que <span class="clue-highlight">${secret + 6}</span>.</div>
                </div>

                <div class="detective-input-group">
                    <input type="number" id="detectiveInput" class="detective-num-input" placeholder="??" autofocus>
                    <button id="btnSolveDetective" class="btn-retro-arcade-action btn-solve-case">RESOLVER CASO 📂</button>
                </div>
            </div>
        `;

        document.getElementById('btnSolveDetective').addEventListener('click', () => {
            const val = parseInt(document.getElementById('detectiveInput').value);
            if (val === secret) {
                if (window.soundFX) window.soundFX.playSuccess();
                window.studentState.addXP(65);
                window.studentState.awardBadge('detective_math');
                this.showVictoryModal('¡CASO RESUELTO, DETECTIVE!', `El número secreto era efectivamente ${secret}. Ganaste +65 XP.`);
            } else {
                if (window.soundFX) window.soundFX.playWrong();
                alert('El número ingresado no coincide con las pistas del caso. ¡Revisa con atención!');
            }
        });
    }

    showVictoryModal(title, message) {
        const modal = document.createElement('div');
        modal.className = 'simce-results-modal active';
        modal.innerHTML = `
            <div class="results-card arcade-victory-card">
                <div class="victory-pixel-trophy">🌟 🏆 🌟</div>
                <h2 class="results-title">${title}</h2>
                <p class="victory-message">${message}</p>
                <button class="btn-submit btn-continue-game" id="btnCloseGameModal">
                    <span>¡CONTINUAR JUGANDO!</span>
                    <span>🚀</span>
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btnCloseGameModal').addEventListener('click', () => {
            modal.remove();
            this.closeGame();
        });
    }
}

window.miniGamesEngine = new MiniGamesEngine();

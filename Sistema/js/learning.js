/**
 * Visual Learning Explorer Module (Ultra-Interactive 16-Bit Arcade Edition)
 * Controles de paso a paso, animación de conteo, giro de matrices conmutativas,
 * recta numérica con saltos y modo desafío interactivo.
 */

class LearningExplorer {
    constructor() {
        this.selectedTable = 6;
        this.selectedMultiplier = 4;
        this.selectedItemType = '🌟';
        this.isMatrixFlipped = false;
        this.isQuizModeHidden = false;
        this.isCountingAnimationRunning = false;
        this.currentJumpIndex = 0;
        this.itemsClickedCount = 0;

        this.AVAILABLE_ITEMS = [
            { icon: '🌟', name: 'Estrellas' },
            { icon: '🍎', name: 'Manzanas' },
            { icon: '🚀', name: 'Cohetes' },
            { icon: '🤖', name: 'Robots' },
            { icon: '🪙', name: 'Monedas' },
            { icon: '🍕', name: 'Pizzas' },
            { icon: '💎', name: 'Gemas' },
            { icon: '⚽', name: 'Pelotas' }
        ];
    }

    init() {
        this.setupQuickTableChips();
        this.setupSteppers();
        this.setupItemChips();
        this.setupToolButtons();
        this.render();
    }

    setupQuickTableChips() {
        const container = document.getElementById('tableArcadeChips');
        if (!container) return;

        container.innerHTML = '';
        for (let t = 2; t <= 10; t++) {
            const btn = document.createElement('button');
            btn.className = `btn-table-chip ${t === this.selectedTable ? 'active' : ''}`;
            btn.dataset.table = t;
            btn.innerHTML = `<span class="chip-num">T-${t}</span>`;

            btn.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                this.selectedTable = t;
                this.isMatrixFlipped = false;
                this.isCountingAnimationRunning = false;
                this.currentJumpIndex = 0;
                this.itemsClickedCount = 0;
                this.updateActiveTableChip();
                this.render();
            });

            container.appendChild(btn);
        }
    }

    updateActiveTableChip() {
        document.querySelectorAll('.btn-table-chip').forEach(btn => {
            const t = parseInt(btn.dataset.table);
            if (t === this.selectedTable) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    setupSteppers() {
        const btnDec = document.getElementById('btnDecMult');
        const btnInc = document.getElementById('btnIncMult');

        if (btnDec) {
            btnDec.addEventListener('click', () => {
                if (this.selectedMultiplier > 1) {
                    if (window.soundFX) window.soundFX.playClick();
                    this.selectedMultiplier--;
                    this.currentJumpIndex = 0;
                    this.render();
                }
            });
        }

        if (btnInc) {
            btnInc.addEventListener('click', () => {
                if (this.selectedMultiplier < 10) {
                    if (window.soundFX) window.soundFX.playClick();
                    this.selectedMultiplier++;
                    this.currentJumpIndex = 0;
                    this.render();
                }
            });
        }
    }

    setupItemChips() {
        const container = document.getElementById('itemsChipsFlex');
        if (!container) return;

        container.innerHTML = '';
        this.AVAILABLE_ITEMS.forEach(it => {
            const chip = document.createElement('button');
            chip.className = `btn-item-chip ${it.icon === this.selectedItemType ? 'active' : ''}`;
            chip.dataset.icon = it.icon;
            chip.innerHTML = `<span>${it.icon}</span>`;
            chip.title = it.name;

            chip.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playPop();
                this.selectedItemType = it.icon;
                document.querySelectorAll('.btn-item-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.renderGroupsView();
                this.renderArrayGrid();
            });

            container.appendChild(chip);
        });
    }

    setupToolButtons() {
        // 1. Animar Conteo en Vivo
        const btnAnimate = document.getElementById('btnAnimateCount');
        if (btnAnimate) {
            btnAnimate.addEventListener('click', () => {
                this.runCountingAnimation();
            });
        }

        // 2. Girar Matriz (Propiedad Conmutativa)
        const btnRotate = document.getElementById('btnRotateMatrix');
        if (btnRotate) {
            btnRotate.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playFlip();
                this.isMatrixFlipped = !this.isMatrixFlipped;
                this.renderArrayGrid();
                this.renderEquationSummary();
            });
        }

        // 3. Recta Numérica Interactiva
        const btnNumberLine = document.getElementById('btnToggleNumberLine');
        const lineArea = document.getElementById('interactiveNumberLineArea');
        if (btnNumberLine && lineArea) {
            btnNumberLine.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                const isHidden = lineArea.style.display === 'none';
                lineArea.style.display = isHidden ? 'block' : 'none';
                btnNumberLine.classList.toggle('active', isHidden);
                if (isHidden) {
                    this.renderNumberLine();
                }
            });
        }

        const btnJump = document.getElementById('btnDoJump');
        if (btnJump) {
            btnJump.addEventListener('click', () => {
                this.doNumberLineJump();
            });
        }

        // 4. Modo Desafío (Ocultar/Revelar)
        const btnQuiz = document.getElementById('btnToggleQuizMode');
        const quizText = document.getElementById('quizModeBtnText');
        if (btnQuiz) {
            btnQuiz.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                this.isQuizModeHidden = !this.isQuizModeHidden;
                if (quizText) {
                    quizText.textContent = this.isQuizModeHidden ? '¡REVELAR RESPUESTA! 👁️' : 'MODO DESAFÍO: ¿CUÁL ES?';
                }
                btnQuiz.classList.toggle('active', this.isQuizModeHidden);
                this.renderEquationSummary();
            });
        }
    }

    render() {
        const multDisplay = document.getElementById('multDisplayBox');
        if (multDisplay) {
            multDisplay.textContent = `× ${this.selectedMultiplier}`;
        }
        this.updateActiveTableChip();
        this.renderEquationSummary();
        this.renderGroupsView();
        this.renderArrayGrid();
        this.renderSkipPattern();
        this.renderNumberLine();
    }

    renderEquationSummary() {
        const summaryElem = document.getElementById('explorerEquationSummary');
        if (!summaryElem) return;

        const total = this.selectedTable * this.selectedMultiplier;
        const rows = this.isMatrixFlipped ? this.selectedMultiplier : this.selectedTable;
        const cols = this.isMatrixFlipped ? this.selectedTable : this.selectedMultiplier;

        const resultHtml = this.isQuizModeHidden 
            ? `<span class="quiz-hidden-badge" title="Haz clic para revelar el resultado" id="quizHiddenClick">¿ ?</span>`
            : `<strong class="equation-result-num">${total}</strong>`;

        summaryElem.innerHTML = `
            <div class="explorer-equation-badge">
                <span class="pixel-star">★</span> 
                <span class="equation-core-text">${rows} × ${cols} = ${resultHtml}</span>
                <span class="pixel-star">★</span>
            </div>
            <div class="explorer-meaning-text">
                Significa: <strong class="meaning-highlight">${rows} grupos</strong> de 
                <strong class="meaning-highlight">${cols} elementos</strong> cada uno. 
                ${this.isMatrixFlipped ? '<span class="commutative-notice">🔄 ¡Propiedad Conmutativa: Da el mismo resultado!</span>' : ''}
            </div>
        `;

        const quizClick = document.getElementById('quizHiddenClick');
        if (quizClick) {
            quizClick.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playFanfare();
                this.isQuizModeHidden = false;
                const btnQuiz = document.getElementById('btnToggleQuizMode');
                const quizText = document.getElementById('quizModeBtnText');
                if (btnQuiz) btnQuiz.classList.remove('active');
                if (quizText) quizText.textContent = 'MODO DESAFÍO: ¿CUÁL ES?';
                this.renderEquationSummary();
            });
        }
    }

    renderGroupsView() {
        const container = document.getElementById('explorerGroupsContainer');
        if (!container) return;

        container.innerHTML = '';
        const groupsCount = this.selectedTable;
        const itemsPerGroup = this.selectedMultiplier;

        for (let g = 0; g < groupsCount; g++) {
            const groupCard = document.createElement('div');
            groupCard.className = 'group-box interactive-group-box';
            groupCard.dataset.group = g + 1;

            const groupTag = document.createElement('div');
            groupTag.className = 'group-tag-badge';
            groupTag.textContent = `GRUPO ${g + 1} (${itemsPerGroup})`;
            groupCard.appendChild(groupTag);

            const itemsWrap = document.createElement('div');
            itemsWrap.className = 'group-items-wrap';

            for (let i = 0; i < itemsPerGroup; i++) {
                const item = document.createElement('span');
                item.className = 'item-icon clickable-item-icon';
                item.textContent = this.selectedItemType;
                const globalIndex = (g * itemsPerGroup) + (i + 1);
                item.dataset.index = globalIndex;
                item.title = `Elemento #${globalIndex} (Haz clic para contar)`;

                // Interactividad: al hacer clic en un objeto, se anima y cuenta
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (window.soundFX) window.soundFX.playPop();
                    this.showItemFloatingBubble(item, globalIndex);
                });

                itemsWrap.appendChild(item);
            }

            groupCard.appendChild(itemsWrap);
            container.appendChild(groupCard);
        }
    }

    showItemFloatingBubble(itemElem, countNum) {
        itemElem.classList.add('item-bounce-pop');
        setTimeout(() => itemElem.classList.remove('item-bounce-pop'), 400);

        const bubble = document.createElement('div');
        bubble.className = 'item-floating-counter-badge';
        bubble.textContent = `#${countNum}`;
        itemElem.style.position = 'relative';
        itemElem.appendChild(bubble);

        setTimeout(() => bubble.remove(), 1000);
    }

    renderArrayGrid() {
        const gridElem = document.getElementById('explorerArrayGrid');
        if (!gridElem) return;

        gridElem.innerHTML = '';
        
        const rows = this.isMatrixFlipped ? this.selectedMultiplier : this.selectedTable;
        const cols = this.isMatrixFlipped ? this.selectedTable : this.selectedMultiplier;
        const total = rows * cols;

        const infoBar = document.createElement('div');
        infoBar.className = 'array-dimensions-info';
        infoBar.innerHTML = `
            <span>📐 Matriz Rectangular: <strong>${rows} Filas</strong> × <strong>${cols} Columnas</strong> = <strong>${total} Total</strong></span>
            <span class="matrix-tip">💡 Pasa el cursor por cualquier casilla para inspeccionar su coordenada</span>
        `;
        gridElem.appendChild(infoBar);

        const matrix = document.createElement('div');
        matrix.className = 'array-matrix-layout';
        matrix.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        for (let i = 0; i < total; i++) {
            const cell = document.createElement('div');
            cell.className = 'array-cell interactive-array-cell';
            const r = Math.floor(i / cols) + 1;
            const c = (i % cols) + 1;
            cell.innerHTML = `
                <span class="cell-emoji">${this.selectedItemType}</span>
                <span class="cell-coord">${r},${c}</span>
            `;

            cell.addEventListener('mouseenter', () => {
                if (window.soundFX) window.soundFX.playClick();
                cell.classList.add('cell-highlight');
            });
            cell.addEventListener('mouseleave', () => {
                cell.classList.remove('cell-highlight');
            });

            cell.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playPop();
                const pos = i + 1;
                infoBar.innerHTML = `<span>🎯 Casilla seleccionada: <strong>Fila ${r}</strong>, <strong>Columna ${c}</strong> (Elemento <strong>#${pos} de ${total}</strong>)</span>`;
            });

            matrix.appendChild(cell);
        }

        gridElem.appendChild(matrix);
    }

    renderSkipPattern() {
        const patternElem = document.getElementById('explorerSkipPattern');
        if (!patternElem) return;

        let stepsHtml = '';
        let current = 0;
        for (let i = 1; i <= 10; i++) {
            current += this.selectedTable;
            const isHighlight = i === this.selectedMultiplier;
            stepsHtml += `
                <div class="skip-step-card ${isHighlight ? 'step-highlight' : ''}" data-step="${i}" data-val="${current}">
                    <div class="step-badge">${i}° salto</div>
                    <div class="step-val">+${this.selectedTable} ➜ <strong>${current}</strong></div>
                    ${isHighlight ? '<div class="step-target-pill">¡AQUÍ! ★</div>' : ''}
                </div>
            `;
        }

        patternElem.innerHTML = `
            <div class="skip-pattern-header">
                <span class="pixel-arrow">►</span> SECUENCIA NUMÉRICA / CONTEO DE ${this.selectedTable} EN ${this.selectedTable}:
            </div>
            <div class="skip-steps-flex">
                ${stepsHtml}
            </div>
        `;

        patternElem.querySelectorAll('.skip-step-card').forEach(card => {
            card.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                const s = parseInt(card.dataset.step);
                this.selectedMultiplier = s;
                this.render();
            });
        });
    }

    /* ----------------------------------------------------
       RECTA NUMÉRICA CON SALTOS INTERACTIVOS (NUEVO)
    ---------------------------------------------------- */
    renderNumberLine() {
        const track = document.getElementById('numberLineTrack');
        if (!track) return;

        track.innerHTML = '';
        const step = this.selectedTable;
        const total = step * this.selectedMultiplier;
        const maxVal = Math.max(total + step, step * 10);

        const lineWrap = document.createElement('div');
        lineWrap.className = 'number-line-ruler';

        // Puntos de la recta
        for (let n = 0; n <= maxVal; n += step) {
            const tick = document.createElement('div');
            const isReached = n <= (step * this.currentJumpIndex);
            const isTarget = n === total;

            tick.className = `ruler-tick ${isReached ? 'tick-reached' : ''} ${isTarget ? 'tick-target' : ''}`;
            tick.innerHTML = `
                <div class="tick-mark"></div>
                <div class="tick-number">${n}</div>
            `;
            lineWrap.appendChild(tick);
        }

        // Mascota que salta
        const jumper = document.createElement('div');
        jumper.className = 'mascot-jumper';
        jumper.id = 'mascotJumper';
        const percent = Math.min(100, ( (this.selectedTable * this.currentJumpIndex) / maxVal ) * 100);
        jumper.style.left = `${percent}%`;
        jumper.innerHTML = `<span>🦘</span>`;
        lineWrap.appendChild(jumper);

        track.appendChild(lineWrap);
    }

    doNumberLineJump() {
        if (this.currentJumpIndex < this.selectedMultiplier) {
            this.currentJumpIndex++;
            if (window.soundFX) window.soundFX.playPop();
            this.renderNumberLine();

            if (this.currentJumpIndex === this.selectedMultiplier) {
                setTimeout(() => {
                    if (window.soundFX) window.soundFX.playSuccess();
                }, 300);
            }
        } else {
            // Reiniciar salto
            this.currentJumpIndex = 0;
            if (window.soundFX) window.soundFX.playClick();
            this.renderNumberLine();
        }
    }

    /* ----------------------------------------------------
       ANIMACIÓN DE CONTEO EN VIVO PASO A PASO (NUEVO)
    ---------------------------------------------------- */
    runCountingAnimation() {
        if (this.isCountingAnimationRunning) return;
        this.isCountingAnimationRunning = true;

        const btnAnimate = document.getElementById('btnAnimateCount');
        if (btnAnimate) {
            btnAnimate.classList.add('active');
            btnAnimate.innerHTML = `<span class="tool-icon">⏳</span><span>CONTANDO...</span>`;
        }

        const groups = document.querySelectorAll('.group-box');
        let currentGroup = 0;
        let cumulativeSum = 0;
        const step = this.selectedMultiplier;

        const stepInterval = setInterval(() => {
            if (currentGroup < groups.length) {
                groups.forEach(g => g.classList.remove('group-counting-active'));
                const gElem = groups[currentGroup];
                gElem.classList.add('group-counting-active');

                cumulativeSum += step;
                if (window.soundFX) window.soundFX.playPop();

                // Mostrar tag acumulativo
                const tag = gElem.querySelector('.group-tag-badge');
                if (tag) {
                    tag.textContent = `GRUPO ${currentGroup + 1} ➜ ¡LLEVAS ${cumulativeSum}!`;
                }

                currentGroup++;
            } else {
                clearInterval(stepInterval);
                this.isCountingAnimationRunning = false;
                if (window.soundFX) window.soundFX.playFanfare();

                if (btnAnimate) {
                    btnAnimate.classList.remove('active');
                    btnAnimate.innerHTML = `<span class="tool-icon">▶</span><span>¡ANIMAR OTRA VEZ!</span>`;
                }
            }
        }, 650);
    }
}

window.learningExplorer = new LearningExplorer();

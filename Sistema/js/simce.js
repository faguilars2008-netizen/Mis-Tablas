/**
 * SIMCE Mock Test Engine Module - Mis Tablas
 * Módulo de evaluación de 10 preguntas contextualizadas para 4° Básico.
 */

class SimceTestEngine {
    constructor() {
        this.questions = [
            {
                id: 1,
                context: '🛒 Compras en el Almacén',
                question: 'Sofía fue al almacén y compró 6 paquetes de galletas. Si cada paquete cuesta $400 pesos y contiene 4 galletas, ¿cuántas galletas compró en total?',
                illustration: '🍪 🍪 🍪 🍪 (6 paquetes)',
                options: [
                    { letter: 'A', text: '10 galletas', correct: false },
                    { letter: 'B', text: '24 galletas', correct: true },
                    { letter: 'C', text: '16 galletas', correct: false },
                    { letter: 'D', text: '20 galletas', correct: false }
                ],
                explanation: 'Para saber el total de galletas, debemos multiplicar los 6 paquetes por las 4 galletas que tiene cada uno: 6 × 4 = 24 galletas.'
            },
            {
                id: 2,
                context: '⚽ Educación Física y Deportes',
                question: 'En la clase de educación física de 4° básico, el profesor organizó a los alumnos en 5 equipos de 7 estudiantes cada uno. ¿Cuántos estudiantes hay en total en la clase?',
                illustration: '👕 👕 👕 👕 👕 👕 👕 (5 equipos)',
                options: [
                    { letter: 'A', text: '12 estudiantes', correct: false },
                    { letter: 'B', text: '30 estudiantes', correct: false },
                    { letter: 'C', text: '35 estudiantes', correct: true },
                    { letter: 'D', text: '40 estudiantes', correct: false }
                ],
                explanation: 'Hay 5 equipos y cada uno tiene 7 integrantes. La multiplicación correspondiente es 5 × 7 = 35 estudiantes.'
            },
            {
                id: 3,
                context: '✏️ Materiales Escolares',
                question: 'La profesora distribuyó 8 cajas de lápices de colores entre sus alumnos. Si cada caja contiene 6 lápices, ¿cuántos lápices repartió la profesora?',
                illustration: '✏️✏️✏️✏️✏️✏️ (8 cajas)',
                options: [
                    { letter: 'A', text: '48 lápices', correct: true },
                    { letter: 'B', text: '42 lápices', correct: false },
                    { letter: 'C', text: '14 lápices', correct: false },
                    { letter: 'D', text: '56 lápices', correct: false }
                ],
                explanation: 'Multiplicamos la cantidad de cajas por el número de lápices por caja: 8 × 6 = 48 lápices.'
            },
            {
                id: 4,
                context: '🎭 Teatro del Colegio',
                question: 'En la sala de actos del colegio hay 9 filas con 8 sillas en cada fila. ¿Cuántas personas se pueden sentar en total en el teatro?',
                illustration: '🪑 🪑 🪑 🪑 🪑 🪑 🪑 🪑 (9 filas)',
                options: [
                    { letter: 'A', text: '64 sillas', correct: false },
                    { letter: 'B', text: '72 sillas', correct: true },
                    { letter: 'C', text: '81 sillas', correct: false },
                    { letter: 'D', text: '17 sillas', correct: false }
                ],
                explanation: 'Para calcular el total de asientos ordenados en filas y columnas, multiplicamos las 9 filas por 8 sillas por fila: 9 × 8 = 72 sillas.'
            },
            {
                id: 5,
                context: '🍎 Feria y Frutas',
                question: 'Don Tomás armó 7 bolsas de manzanas para vender en la feria. Si puso 9 manzanas en cada bolsa, ¿cuántas manzanas usó en total?',
                illustration: '🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 (7 bolsas)',
                options: [
                    { letter: 'A', text: '54 manzanas', correct: false },
                    { letter: 'B', text: '63 manzanas', correct: true },
                    { letter: 'C', text: '72 manzanas', correct: false },
                    { letter: 'D', text: '16 manzanas', correct: false }
                ],
                explanation: 'Multiplicamos las 7 bolsas por las 9 manzanas de cada una: 7 × 9 = 63 manzanas.'
            },
            {
                id: 6,
                context: '🧁 Regalos y Celebraciones',
                question: 'Para el cumpleaños de Lucas, su mamá preparó 4 cajas de cupcakes. Cada caja tiene 8 cupcakes. ¿Cuántos cupcakes hay en total?',
                illustration: '🧁 🧁 🧁 🧁 🧁 🧁 🧁 🧁 (4 cajas)',
                options: [
                    { letter: 'A', text: '32 cupcakes', correct: true },
                    { letter: 'B', text: '24 cupcakes', correct: false },
                    { letter: 'C', text: '36 cupcakes', correct: false },
                    { letter: 'D', text: '12 cupcakes', correct: false }
                ],
                explanation: 'Multiplicamos 4 cajas por 8 cupcakes en cada caja: 4 × 8 = 32 cupcakes.'
            },
            {
                id: 7,
                context: '🎲 Juegos y Colecciones',
                question: 'Matías colecciona cartas de superhéroes. Guardó sus cartas en 3 sobres. Si cada sobre tiene 9 cartas, ¿cuántas cartas tiene en su colección?',
                illustration: '🃏 🃏 🃏 🃏 🃏 🃏 🃏 🃏 🃏 (3 sobres)',
                options: [
                    { letter: 'A', text: '27 cartas', correct: true },
                    { letter: 'B', text: '18 cartas', correct: false },
                    { letter: 'C', text: '24 cartas', correct: false },
                    { letter: 'D', text: '12 cartas', correct: false }
                ],
                explanation: 'El total de cartas se obtiene al calcular 3 sobres × 9 cartas = 27 cartas.'
            },
            {
                id: 8,
                context: '🪴 Huerto Escolar',
                question: 'Los estudiantes plantaron un huerto escolar con 6 maceteros. En cada macetero sembraron 7 semillas de girasol. ¿Cuántas semillas sembraron en total?',
                illustration: '🌻 🌻 🌻 🌻 🌻 🌻 🌻 (6 maceteros)',
                options: [
                    { letter: 'A', text: '35 semillas', correct: false },
                    { letter: 'B', text: '42 semillas', correct: true },
                    { letter: 'C', text: '49 semillas', correct: false },
                    { letter: 'D', text: '13 semillas', correct: false }
                ],
                explanation: 'Multiplicamos 6 maceteros por 7 semillas por macetero: 6 × 7 = 42 semillas.'
            },
            {
                id: 9,
                context: '🎨 Taller de Arte',
                question: 'En el taller de pintura hay 10 mesas de trabajo. Si en cada mesa se colocaron 5 pinceles, ¿cuántos pinceles hay en total en el taller?',
                illustration: '🖌️ 🖌️ 🖌️ 🖌️ 🖌️ (10 mesas)',
                options: [
                    { letter: 'A', text: '15 pinceles', correct: false },
                    { letter: 'B', text: '40 pinceles', correct: false },
                    { letter: 'C', text: '50 pinceles', correct: true },
                    { letter: 'D', text: '60 pinceles', correct: false }
                ],
                explanation: 'Para calcular los pinceles en 10 mesas con 5 pinceles cada una, multiplicamos 10 × 5 = 50 pinceles.'
            },
            {
                id: 10,
                context: '🚗 Estacionamiento del Mall',
                question: 'En una sección del estacionamiento hay 8 filas con 10 autos estacionados en cada una. ¿Cuántos autos hay estacionados en esa sección?',
                illustration: '🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗 (8 filas)',
                options: [
                    { letter: 'A', text: '80 autos', correct: true },
                    { letter: 'B', text: '18 autos', correct: false },
                    { letter: 'C', text: '70 autos', correct: false },
                    { letter: 'D', text: '90 autos', correct: false }
                ],
                explanation: 'Multiplicamos 8 filas por 10 autos por fila: 8 × 10 = 80 autos.'
            }
        ];

        this.currentQuestionIndex = 0;
        this.userAnswers = {}; // { questionId: selectedIndex }
    }

    init() {
        this.renderSidebarNav();
        this.renderCurrentQuestion();

        const btnPrev = document.getElementById('btnSimcePrev');
        const btnNext = document.getElementById('btnSimceNext');
        const btnFinish = document.getElementById('btnSimceFinish');

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                window.soundFX.playClick();
                if (this.currentQuestionIndex > 0) {
                    this.currentQuestionIndex--;
                    this.updateView();
                }
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                window.soundFX.playClick();
                if (this.currentQuestionIndex < this.questions.length - 1) {
                    this.currentQuestionIndex++;
                    this.updateView();
                }
            });
        }

        if (btnFinish) {
            btnFinish.addEventListener('click', () => {
                window.soundFX.playFanfare();
                this.calculateAndShowResults();
            });
        }
    }

    renderSidebarNav() {
        const grid = document.getElementById('simceNavGrid');
        if (!grid) return;

        grid.innerHTML = '';
        this.questions.forEach((q, idx) => {
            const btn = document.createElement('button');
            const isAnswered = this.userAnswers[q.id] !== undefined;
            const isActive = idx === this.currentQuestionIndex;

            btn.className = `simce-q-btn ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}`;
            btn.textContent = idx + 1;

            btn.addEventListener('click', () => {
                window.soundFX.playClick();
                this.currentQuestionIndex = idx;
                this.updateView();
            });

            grid.appendChild(btn);
        });

        // Actualizar contador de respondidas
        const answeredCount = Object.keys(this.userAnswers).length;
        const statusBadge = document.getElementById('simceAnsweredBadge');
        if (statusBadge) {
            statusBadge.textContent = `${answeredCount} / 10 Respondidas`;
        }
    }

    renderCurrentQuestion() {
        const q = this.questions[this.currentQuestionIndex];
        if (!q) return;

        const tagElem = document.getElementById('simceContextTag');
        const textElem = document.getElementById('simceQuestionText');
        const illustElem = document.getElementById('simceIllustrationBox');
        const optionsElem = document.getElementById('simceOptionsGrid');

        if (tagElem) tagElem.textContent = q.context;
        if (textElem) textElem.textContent = `Pregunta ${q.id}: ${q.question}`;
        if (illustElem) illustElem.textContent = q.illustration;

        if (optionsElem) {
            optionsElem.innerHTML = '';
            const selectedOptIdx = this.userAnswers[q.id];

            q.options.forEach((opt, optIdx) => {
                const card = document.createElement('div');
                card.className = `option-card ${selectedOptIdx === optIdx ? 'selected' : ''}`;
                card.innerHTML = `
                    <div class="option-letter">${opt.letter}</div>
                    <div class="option-label">${opt.text}</div>
                `;

                card.addEventListener('click', () => {
                    window.soundFX.playClick();
                    this.userAnswers[q.id] = optIdx;
                    this.updateView();
                });

                optionsElem.appendChild(card);
            });
        }

        // Actualizar estados de botones de navegación
        const btnPrev = document.getElementById('btnSimcePrev');
        const btnNext = document.getElementById('btnSimceNext');
        if (btnPrev) btnPrev.disabled = (this.currentQuestionIndex === 0);
        if (btnNext) btnNext.disabled = (this.currentQuestionIndex === this.questions.length - 1);
    }

    updateView() {
        this.renderSidebarNav();
        this.renderCurrentQuestion();
    }

    calculateAndShowResults() {
        let correctCount = 0;
        const feedbackItems = [];

        this.questions.forEach(q => {
            const userChoice = this.userAnswers[q.id];
            const isCorrect = userChoice !== undefined && q.options[userChoice].correct;
            if (isCorrect) correctCount++;

            feedbackItems.push({
                qId: q.id,
                context: q.context,
                isCorrect: isCorrect,
                userAnswer: userChoice !== undefined ? q.options[userChoice].text : 'No respondida',
                correctAnswer: q.options.find(o => o.correct).text,
                explanation: q.explanation
            });
        });

        const percentage = Math.round((correctCount / this.questions.length) * 100);

        let levelName = 'Inicial';
        let levelClass = 'level-inicial';
        if (percentage >= 80) {
            levelName = 'Avanzado';
            levelClass = 'level-avanzado';
        } else if (percentage >= 50) {
            levelName = 'Adecuado';
            levelClass = 'level-adecuado';
        }

        // Guardar resultado en el perfil
        window.studentState.recordSimceResult(correctCount, this.questions.length, percentage, levelName);

        // Renderizar Modal de Resultados
        const modal = document.getElementById('simceResultsModal');
        if (!modal) return;

        const scoreNumElem = document.getElementById('simceResultScoreNum');
        const levelBadgeElem = document.getElementById('simceResultLevelBadge');
        const feedbackContainer = document.getElementById('simceFeedbackContainer');

        if (scoreNumElem) scoreNumElem.textContent = `${correctCount} / 10`;
        if (levelBadgeElem) {
            levelBadgeElem.textContent = `Nivel SIMCE: ${levelName} (${percentage}%)`;
            levelBadgeElem.className = `results-level-badge ${levelClass}`;
        }

        if (feedbackContainer) {
            feedbackContainer.innerHTML = feedbackItems.map(item => `
                <div class="feedback-item ${item.isCorrect ? 'correct' : 'incorrect'}">
                    <div class="feedback-item-title">
                        ${item.isCorrect ? '✅' : '❌'} Pregunta ${item.qId} (${item.context}): ${item.isCorrect ? '¡Correcto!' : 'Respuesta Incorrecta'}
                    </div>
                    <div class="feedback-explanation">
                        <strong>Tu respuesta:</strong> ${item.userAnswer} <br>
                        ${!item.isCorrect ? `<strong>Respuesta correcta:</strong> ${item.correctAnswer}<br>` : ''}
                        💡 <em>${item.explanation}</em>
                    </div>
                </div>
            `).join('');
        }

        modal.classList.add('active');

        const btnClose = document.getElementById('btnCloseSimceResults');
        if (btnClose) {
            btnClose.onclick = () => {
                modal.classList.remove('active');
            };
        }
    }
}

window.simceTestEngine = new SimceTestEngine();

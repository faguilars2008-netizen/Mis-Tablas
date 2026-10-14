/**
 * Login Module - Mis Tablas
 * Maneja la selección de avatares superhéroes y la validación del ingreso.
 */

document.addEventListener('DOMContentLoaded', () => {
    const AVATARS = [
        {
            id: 'zorro',
            name: 'Súper Zorro',
            color: '#f97316',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#fed7aa"/>
                <path d="M20 30L35 60H15L20 30Z" fill="#ea580c"/>
                <path d="M80 30L85 60H65L80 30Z" fill="#ea580c"/>
                <path d="M25 40L50 85L75 40C75 40 60 55 50 55C40 55 25 40 25 40Z" fill="#f97316"/>
                <circle cx="38" cy="48" r="5" fill="#1e293b"/>
                <circle cx="62" cy="48" r="5" fill="#1e293b"/>
                <circle cx="40" cy="46" r="1.8" fill="#ffffff"/>
                <circle cx="64" cy="46" r="1.8" fill="#ffffff"/>
                <ellipse cx="50" cy="58" rx="6" ry="4" fill="#0f172a"/>
                <path d="M44 64Q50 68 56 64" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
            </svg>`
        },
        {
            id: 'robot',
            name: 'Robot Clic',
            color: '#3b82f6',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </svg>`
        },
        {
            id: 'buho',
            name: 'Astro Búho',
            color: '#8b5cf6',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#ddd6fe"/>
                <path d="M25 30C25 30 35 75 50 75C65 75 75 30 75 30C75 30 65 25 50 25C35 25 25 30 25 30Z" fill="#7c3aed"/>
                <circle cx="38" cy="46" r="12" fill="#ffffff"/>
                <circle cx="62" cy="46" r="12" fill="#ffffff"/>
                <circle cx="38" cy="46" r="6" fill="#4c1d95"/>
                <circle cx="62" cy="46" r="6" fill="#4c1d95"/>
                <circle cx="40" cy="44" r="2" fill="#ffffff"/>
                <circle cx="64" cy="44" r="2" fill="#ffffff"/>
                <polygon points="50,52 44,60 56,60" fill="#f59e0b"/>
            </svg>`
        },
        {
            id: 'dino',
            name: 'Dino Multi',
            color: '#10b981',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#a7f3d0"/>
                <path d="M30 70C30 45 40 25 65 25C75 25 80 32 80 40C80 50 70 55 60 55C50 55 45 75 45 75Z" fill="#10b981"/>
                <circle cx="68" cy="35" r="4" fill="#064e3b"/>
                <circle cx="69" cy="34" r="1.5" fill="#ffffff"/>
                <path d="M60 46Q65 48 70 45" stroke="#064e3b" stroke-width="2" stroke-linecap="round"/>
                <polygon points="35,28 32,36 40,34" fill="#047857"/>
                <polygon points="45,23 42,31 50,29" fill="#047857"/>
                <polygon points="55,21 52,29 60,27" fill="#047857"/>
            </svg>`
        },
        {
            id: 'cohete',
            name: 'Cohete X',
            color: '#ec4899',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#fbcfe8"/>
                <path d="M50 20C65 35 65 65 65 75H35C35 65 35 35 50 20Z" fill="#db2777"/>
                <circle cx="50" cy="45" r="9" fill="#38bdf8"/>
                <circle cx="50" cy="45" r="7" fill="#1e293b"/>
                <circle cx="52" cy="43" r="2" fill="#ffffff"/>
                <path d="M35 55L20 70V78H35V55Z" fill="#9d174d"/>
                <path d="M65 55L80 70V78H65V55Z" fill="#9d174d"/>
                <polygon points="44,75 56,75 50,90" fill="#f59e0b"/>
            </svg>`
        },
        {
            id: 'hada',
            name: 'Hada Cero',
            color: '#06b6d4',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#cffafe"/>
                <path d="M25 40C15 25 35 20 45 40C35 45 20 50 25 40Z" fill="#67e8f9"/>
                <path d="M75 40C85 25 65 20 55 40C65 45 80 50 75 40Z" fill="#67e8f9"/>
                <circle cx="50" cy="45" r="18" fill="#0891b2"/>
                <circle cx="44" cy="42" r="3" fill="#ffffff"/>
                <circle cx="56" cy="42" r="3" fill="#ffffff"/>
                <path d="M45 52Q50 56 55 52" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                <polygon points="50,18 53,26 61,26 55,31 57,39 50,34 43,39 45,31 39,26 47,26" fill="#f59e0b"/>
            </svg>`
        }
    ];

    let selectedAvatarId = 'zorro';

    const avatarGrid = document.getElementById('avatarGrid');
    const studentInput = document.getElementById('studentName');
    const loginForm = document.getElementById('loginForm');
    const inputErrorMsg = document.getElementById('inputErrorMsg');
    const btnToggleSound = document.getElementById('btnToggleSound');

    // Pre-cargar perfil anterior si existe (efecto "CONTINUE GAME")
    try {
        const savedProfile = JSON.parse(localStorage.getItem('misTablas_studentProfile'));
        if (savedProfile) {
            if (savedProfile.name) {
                studentInput.value = savedProfile.name;
            }
            if (savedProfile.avatar && savedProfile.avatar.id) {
                const found = AVATARS.find(a => a.id === savedProfile.avatar.id);
                if (found) {
                    selectedAvatarId = found.id;
                }
            }
        }
    } catch (err) {
        // Ignorar error de parsing
    }

    // Toggle de sonido Arcade SFX en la marquesina
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

    function renderAvatars() {
        avatarGrid.innerHTML = '';
        AVATARS.forEach(avatar => {
            const card = document.createElement('div');
            card.className = `avatar-card ${avatar.id === selectedAvatarId ? 'selected' : ''}`;
            card.dataset.id = avatar.id;

            card.innerHTML = `
                <div class="selected-badge">1P</div>
                <div class="avatar-svg-box">${avatar.svg}</div>
                <div class="avatar-name">${avatar.name}</div>
            `;

            // Efecto de sonido al pasar el cursor (retro hover)
            card.addEventListener('mouseenter', () => {
                if (window.soundFX && window.soundFX.enabled) {
                    window.soundFX.playPop();
                }
            });

            card.addEventListener('click', () => {
                if (window.soundFX) window.soundFX.playClick();
                selectedAvatarId = avatar.id;
                document.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });

            avatarGrid.appendChild(card);
        });
    }

    renderAvatars();

    // Sonido retro sutil al escribir (throttled)
    let lastKeySoundTime = 0;
    studentInput.addEventListener('keydown', (e) => {
        if (e.key.length === 1 || e.key === 'Backspace') {
            const now = Date.now();
            if (now - lastKeySoundTime > 90 && window.soundFX && window.soundFX.enabled) {
                window.soundFX.playClick();
                lastKeySoundTime = now;
            }
        }
    });

    studentInput.addEventListener('input', () => {
        inputErrorMsg.style.display = 'none';
        studentInput.classList.remove('shake');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = studentInput.value.trim();

        if (!name || name.length < 2) {
            if (window.soundFX) window.soundFX.playWrong();
            inputErrorMsg.style.display = 'block';
            studentInput.classList.add('shake');
            studentInput.focus();
            return;
        }

        // Tocar fanfare victorioso de 16-bit al iniciar
        if (window.soundFX) {
            window.soundFX.playFanfare();
        }

        const avatarObj = AVATARS.find(a => a.id === selectedAvatarId) || AVATARS[0];

        let existingProfile = null;
        try {
            existingProfile = JSON.parse(localStorage.getItem('misTablas_studentProfile'));
        } catch (err) {
            existingProfile = null;
        }

        const profileData = {
            name: name,
            avatar: avatarObj,
            xp: existingProfile ? (existingProfile.xp || 0) : 0,
            level: existingProfile ? (existingProfile.level || 1) : 1,
            stars: existingProfile ? (existingProfile.stars || 0) : 0,
            unlockedTables: existingProfile ? (existingProfile.unlockedTables || [2]) : [2],
            tableProgress: existingProfile ? (existingProfile.tableProgress || {}) : {},
            badges: existingProfile ? (existingProfile.badges || ['iniciante']) : ['iniciante'],
            simceHistory: existingProfile ? (existingProfile.simceHistory || []) : []
        };

        localStorage.setItem('misTablas_studentProfile', JSON.stringify(profileData));

        const card = document.querySelector('.login-card');
        if (card) {
            card.style.animation = 'cardDisappear 0.5s forwards ease-in';
        }
        setTimeout(() => {
            window.location.href = 'Sistema/index.html';
        }, 500);
    });
});

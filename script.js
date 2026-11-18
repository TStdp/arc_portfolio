document.addEventListener('DOMContentLoaded', () => {
    /* ================= 1. MOBILE NAV ================= */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    /* ================= 2. 3D EXPLODED HOUSE MODEL MOUSE INTERACTION ================= */
    const viewport3d = document.getElementById('viewport-3d');
    const houseAssembly = document.getElementById('house-assembly');
    const gyroCoords = document.getElementById('gyro-coords');
    const btnExplode = document.getElementById('btn-explode');
    const btnAssemble = document.getElementById('btn-assemble');

    if (viewport3d && houseAssembly) {
        const parts = houseAssembly.querySelectorAll('.house-part');
        let isAssembled = false;

        viewport3d.addEventListener('mousemove', (e) => {
            const rect = viewport3d.getBoundingClientRect();
            // Normalized cursor position from -0.5 to +0.5
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;

            const rotY = Math.round(28 + nx * 64);
            const rotX = Math.round(-20 - ny * 38);

            houseAssembly.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

            if (gyroCoords) {
                gyroCoords.textContent = `ROT: ${rotX}° / ${rotY}°`;
            }

            // Parallax depth shift across the 5 separated house parts when exploded
            if (!isAssembled) {
                parts.forEach((part) => {
                    const layer = Number(part.getAttribute('data-layer') || 3);
                    const offsetFactor = (3 - layer); // +2 for roof, 0 for frame, -2 for plinth
                    const shiftX = nx * offsetFactor * 22;
                    const shiftY = offsetFactor * 16 + ny * offsetFactor * 14;
                    const shiftZ = offsetFactor * 16;
                    part.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, ${shiftZ.toFixed(1)}px)`;
                });
            }
        });

        viewport3d.addEventListener('mouseleave', () => {
            houseAssembly.style.transform = 'rotateX(-20deg) rotateY(28deg)';
            if (gyroCoords) {
                gyroCoords.textContent = 'ROT: -20° / 28°';
            }
            if (!isAssembled) {
                parts.forEach((part) => {
                    part.style.transform = '';
                });
            }
        });

        if (btnExplode && btnAssemble) {
            btnExplode.addEventListener('click', () => {
                isAssembled = false;
                houseAssembly.classList.remove('assembled');
                parts.forEach((part) => (part.style.transform = ''));
                btnExplode.classList.add('active');
                btnAssemble.classList.remove('active');
            });

            btnAssemble.addEventListener('click', () => {
                isAssembled = true;
                parts.forEach((part) => (part.style.transform = ''));
                houseAssembly.classList.add('assembled');
                btnAssemble.classList.add('active');
                btnExplode.classList.remove('active');
            });
        }
    }

    /* ================= 3. WORKS FILTER & ARCHITECTURAL SHEET MODAL ================= */
    const workData = {
        courtyard: {
            type: 'Residential Architecture • Scale 1:50',
            title: 'The Terraced Courtyard House',
            desc: 'Designed for a warm-temperate suburban site to house three generations while maintaining acoustic privacy and shared outdoor life.',
            notes: [
                'Program: 210 m² living area, central courtyard garden, shaded veranda, and passive solar clerestory.',
                'Materials: Local kiln-fired dark red brick base, Douglas fir timber roof framing, and lime plaster.',
                'Physical Model: Constructed a 1:50 removable-roof basswood model to test winter solstice sunlight penetration.'
            ]
        },
        cabin: {
            type: 'Tectonic Model Study • Scale 1:25',
            title: 'Cantilevered Hillside Timber Cabin',
            desc: 'A compact 65 m² retreat perched on a 24-degree wooded slope using minimal concrete pier footings instead of heavy retaining walls.',
            notes: [
                'Structural Logic: Paired glulam timber beams anchored back into bedrock with steel tension rods.',
                'Craft Process: Hand-cut 140+ individual basswood joists and mortise-and-tenon joints.',
                'Outcome: Demonstrated how elevated foundations preserve natural hillside rainwater runoff.'
            ]
        },
        rowhouse: {
            type: 'Adaptive Reuse & Housing • Scale 1:100',
            title: 'Narrow-Lot Infill Brick Rowhouse',
            desc: 'Addresses urban housing affordability by transforming a neglected 4.5m-wide vacant lot into a bright three-story family home.',
            notes: [
                'Daylighting Strategy: Central open-riser timber staircase beneath a operable skylight acts as a thermal chimney.',
                'Facade: Perforated brick screen filters harsh afternoon western glare while preserving street privacy.',
                'Drawings: Full set of 1:100 floor plans, longitudinal section, and solar shadow studies.'
            ]
        },
        pavilion: {
            type: 'Daylighting & Spatial Study • Scale 1:20',
            title: 'Solstice Reading Pavilion',
            desc: 'An experimental study of how angled ceiling baffles and deep window reveals turn harsh sunlight into soft, atmospheric interior glow.',
            notes: [
                'Model Medium: Cast plaster interior walls paired with birch plywood roof baffles.',
                'Testing: Photographed outdoors at 9 AM, 12 PM, and 4 PM to document shadow transitions.',
                'Takeaway: Informed window reveal proportions across my subsequent residential house designs.'
            ]
        },
        modular: {
            type: 'Sustainable Housing • Scale 1:50',
            title: 'Grow-Over-Time Modular Starter Home',
            desc: 'Designed around a standardized 3.6m structural timber grid so homeowners can add rooms without demolishing existing walls.',
            notes: [
                'Phase 1: 58 m² core containing kitchen, wet-wall bath, living area, and primary bedroom.',
                'Phase 2 & 3: Pre-engineered bolt-on panel bays add two children’s bedrooms and a garden workshop.',
                'Sustainability: Reduces construction waste by 35% compared to conventional remodeling.'
            ]
        },
        atlas: {
            type: 'Observational Drawing • Field Sketchbook',
            title: 'Vernacular Porch & Threshold Atlas',
            desc: 'Measured ink-and-watercolor studies of historic neighborhood homes examining how porches foster community interaction.',
            notes: [
                'Scope: 24 measured plans, elevation details, and perspective vignettes across 6 residential neighborhoods.',
                'Focus: Roof overhang ratios, step transitions, and natural cross-ventilation transoms.',
                'Medium: Fountain pen, architectural scale ruler, and warm mineral watercolor washes.'
            ]
        }
    };

    const filterPills = document.querySelectorAll('.filter-pill');
    const workCards = document.querySelectorAll('.work-card');

    filterPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            filterPills.forEach((p) => p.classList.remove('active'));
            pill.classList.add('active');
            const filter = pill.getAttribute('data-filter');

            workCards.forEach((card) => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    const workModal = document.getElementById('work-modal');
    const closeWorkModal = document.getElementById('close-work-modal');
    const wModalType = document.getElementById('w-modal-type');
    const wModalTitle = document.getElementById('w-modal-title');
    const wModalDesc = document.getElementById('w-modal-desc');
    const wModalNotes = document.getElementById('w-modal-notes');

    document.querySelectorAll('.open-work-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-work');
            const item = workData[key];
            if (!item || !workModal) return;

            wModalType.textContent = item.type;
            wModalTitle.textContent = item.title;
            wModalDesc.textContent = item.desc;
            wModalNotes.innerHTML = item.notes.map((n) => `<li>${n}</li>`).join('');
            workModal.classList.remove('hidden');
        });
    });

    if (closeWorkModal && workModal) {
        closeWorkModal.addEventListener('click', () => workModal.classList.add('hidden'));
        workModal.addEventListener('click', (e) => {
            if (e.target === workModal) workModal.classList.add('hidden');
        });
    }

    /* ================= 4. CONTACT PAGE INTERACTIONS ================= */
    const copyEmailBtn = document.getElementById('copy-arch-email');
    const archEmail = document.getElementById('arch-email');
    if (copyEmailBtn && archEmail) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(archEmail.textContent.trim()).then(() => {
                copyEmailBtn.textContent = 'Copied!';
                setTimeout(() => (copyEmailBtn.textContent = 'Copy'), 1500);
            });
        });
    }

    const archForm = document.getElementById('arch-contact-form');
    const archFeedback = document.getElementById('arch-feedback');
    if (archForm && archFeedback) {
        archForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('c-name').value.trim();
            const email = document.getElementById('c-email').value.trim();
            const msg = document.getElementById('c-msg').value.trim();

            if (!name || !email || !email.includes('@') || !msg) {
                archFeedback.textContent = 'Please enter your name, a valid email address, and your message.';
                archFeedback.className = 'notice-banner error';
                return;
            }

            archFeedback.textContent = `Thank you, ${name}. Your correspondence has been recorded for Maya Lin.`;
            archFeedback.className = 'notice-banner';
            archForm.reset();
        });
    }
});

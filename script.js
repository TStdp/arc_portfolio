document.addEventListener('DOMContentLoaded', () => {
    /* ================= 1. MOBILE SHEET DRAWER ================= */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    /* ================= 2. 3D AXONOMETRIC HOUSE MOUSE INTERACTION ================= */
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
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;

            const rotY = Math.round(28 + nx * 64);
            const rotX = Math.round(-20 - ny * 38);

            houseAssembly.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

            if (gyroCoords) {
                gyroCoords.textContent = `AZIMUTH ${rotY}° / ELEV ${rotX}°`;
            }

            if (!isAssembled) {
                parts.forEach((part) => {
                    const layer = Number(part.getAttribute('data-layer') || 3);
                    const offsetFactor = (3 - layer);
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
                gyroCoords.textContent = 'AZIMUTH 28° / ELEV -20°';
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

    /* ================= 3. SHEET A-101 FILTER & DRAWING MODAL ================= */
    const workData = {
        courtyard: {
            type: 'SHEET A-101.1 • RESIDENTIAL COURTYARD TYPOLOGY (1:50)',
            title: 'The Terraced Courtyard House',
            desc: 'Designed for a warm-temperate suburban site to house three generations while maintaining acoustic privacy and shared garden life.',
            notes: [
                'Program: 210 m² living area, central south courtyard, shaded timber veranda, and clerestory studio.',
                'Materials: Kiln-fired dark crimson brick plinth, Douglas fir roof framing, and breathable lime plaster.',
                'Physical Model: Constructed a 1:50 removable-roof basswood sectional model to verify winter sun angles.'
            ]
        },
        cabin: {
            type: 'SHEET A-101.2 • STRUCTURAL TECTONIC MODEL (1:25)',
            title: 'Cantilevered Hillside Timber Cabin',
            desc: 'A compact 65 m² retreat perched on a 24-degree wooded slope using minimal concrete pier footings instead of heavy retaining walls.',
            notes: [
                'Structural Logic: Paired glulam timber beams anchored into bedrock with concealed steel tension rods.',
                'Craft Process: Hand-cut 140+ individual basswood joists and mortise-and-tenon joinery details.',
                'Ecological Outcome: Preserves natural hillside stormwater sheet flow beneath the elevated floor.'
            ]
        },
        rowhouse: {
            type: 'SHEET A-101.3 • NARROW-LOT URBAN INFILL (1:100)',
            title: '4.5m Infill Brick Rowhouse',
            desc: 'Transforms a neglected 4.5m-wide urban gap lot into a sunlit three-story starter home for a young family.',
            notes: [
                'Daylighting Section: Central open-riser timber stair under an operable skylight acts as a passive thermal chimney.',
                'Street Facade: Perforated brick screen filters western afternoon glare while protecting interior privacy.',
                'Drawing Set: 1:100 floor plans, longitudinal section, and equinox shadow diagrams.'
            ]
        },
        pavilion: {
            type: 'SHEET A-101.4 • ATMOSPHERIC DAYLIGHTING (1:20)',
            title: 'Solstice Reading Pavilion',
            desc: 'An experimental study of how angled ceiling baffles and deep window reveals soften harsh direct sunlight into calm interior glow.',
            notes: [
                'Model Medium: Cast plaster interior walls paired with birch plywood roof baffles.',
                'Heliodon Testing: Photographed outdoors at 9 AM, 12 PM, and 4 PM to document shadow progression.',
                'Takeaway: Established window reveal proportions applied across subsequent residential designs.'
            ]
        },
        modular: {
            type: 'SHEET A-101.5 • INCREMENTAL HOUSING SYSTEM (1:50)',
            title: 'Grow-Over-Time Modular Starter Home',
            desc: 'Engineered around a standardized 3.6m structural timber grid so homeowners can add rooms without demolishing existing walls.',
            notes: [
                'Phase 1 Core: 58 m² starter house containing kitchen, wet-wall bath, living hearth, and primary bedroom.',
                'Phase 2 & 3 Bays: Pre-engineered bolt-on timber bays add two bedrooms and a garden workshop.',
                'Sustainability: Cuts future remodeling demolition waste by 35%.'
            ]
        },
        atlas: {
            type: 'SHEET A-101.6 • MEASURED FIELD SKETCHBOOK',
            title: 'Vernacular Porch & Threshold Atlas',
            desc: 'Measured ink-and-watercolor drawings of historic neighborhood homes examining how porches connect private rooms to the street.',
            notes: [
                'Scope: 24 measured plans, elevation details, and perspective vignettes across 6 residential districts.',
                'Focus: Roof overhang ratios, step transitions, and natural cross-ventilation transoms.',
                'Medium: Fountain pen, architectural scale ruler, and mineral watercolor washes.'
            ]
        }
    };

    const filterPills = document.querySelectorAll('.filter-pill');
    const workCards = document.querySelectorAll('.plate-card');

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

    /* ================= 4. SHEET A-401 TRANSMITTAL FORM ================= */
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

            archFeedback.textContent = `Transmittal Logged: Thank you, ${name}. Your note has been queued for Maya Lin.`;
            archFeedback.className = 'notice-banner';
            archForm.reset();
        });
    }
});

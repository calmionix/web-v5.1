/**
 * ========================================
 * CALMIONIX CREATOR HUB - PREMIUM JAVASCRIPT
 * Elegant Galaxy Theme with Premium Interactions
 * ========================================
 */

// ========================================
// AUDIO CONTEXT FOR SOUND EFFECTS
// ========================================
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.15;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            this.createSounds();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    createSounds() {
        // Create synthesized sound effects
        this.sounds = {
            hover: this.createTone(800, 0.05, 'sine'),
            click: this.createTone(1200, 0.08, 'sine'),
            toggle: this.createTone(600, 0.1, 'triangle'),
            success: this.createTone(1000, 0.15, 'sine'),
            switch: this.createTone(400, 0.08, 'sine')
        };
    }

    createTone(frequency, duration, type = 'sine') {
        return { frequency, duration, type };
    }

    play(soundName) {
        if (!this.enabled || !this.initialized || !this.audioContext) return;
        
        // Resume audio context if suspended (browser policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const sound = this.sounds[soundName];
        if (!sound) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = sound.frequency;
        oscillator.type = sound.type;

        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + sound.duration);

        oscillator.start(now);
        oscillator.stop(now + sound.duration);
    }

    enable() {
        this.enabled = true;
        if (!this.initialized) this.init();
    }

    disable() {
        this.enabled = false;
    }
}

// Global sound manager instance
const soundManager = new SoundManager();

// ========================================
// DOM CONTENT LOADED - INITIALIZE ALL
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize in order
    initLoadingScreen();
    initStars();
    initNavbar();
    initThemeToggle();
    initMusicButton();
    initClock();
    initCountUp();
    initJadwal();
    initFAQ();
    initScrollAnimations();
    initSmoothScroll();
    initSoundEffects();
    initParallax();
});

// ========================================
// PREMIUM LOADING SCREEN
// ========================================
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressNumber = document.getElementById('progress-number');
    const loadingBar = document.getElementById('loading-bar');
    const transitionCircle = document.getElementById('transition-circle');
    const mainContent = document.getElementById('main-content');

    let progress = 0;
    const duration = 3500; // 3.5 seconds
    const interval = 30; // Update every 30ms
    const increment = 100 / (duration / interval);

    // Easing function for smooth progress
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    const progressInterval = setInterval(() => {
        progress += increment;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Update final progress
            progressNumber.textContent = Math.floor(progress);
            loadingBar.style.width = progress + '%';
            
            // Start cinematic transition
            setTimeout(() => {
                // Hide loading screen
                loadingScreen.classList.add('hidden');
                
                // Activate circle transition
                transitionCircle.classList.add('active');
                
                // Show main content after circle animation
                setTimeout(() => {
                    mainContent.classList.add('visible');
                    
                    // Animate hero elements
                    animateHeroElements();
                }, 600);
                
                // Remove loading screen from DOM
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    transitionCircle.style.display = 'none';
                }, 1200);
                
            }, 300);
            
        } else {
            // Apply easing
            const easedProgress = easeOutCubic(progress / 100) * 100;
            progressNumber.textContent = Math.floor(easedProgress);
            loadingBar.style.width = easedProgress + '%';
        }
    }, interval);
}

// Animate hero elements after loading
function animateHeroElements() {
    const heroElements = document.querySelectorAll('.hero [data-animate]');
    heroElements.forEach((el, index) => {
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => {
            el.classList.add('animated');
        }, delay);
    });
}

// ========================================
// GALAXY STARS BACKGROUND
// ========================================
function initStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;

    const starCount = window.innerWidth < 768 ? 30 : 60; // Fewer stars on mobile
    
    // Create regular stars
    for (let i = 0; i < starCount; i++) {
        createStar(container);
    }
    
    // Create occasional shooting stars
    setInterval(() => {
        if (Math.random() > 0.7) {
            createShootingStar(container);
        }
    }, 5000);
}

function createStar(container) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size (smaller for subtle effect)
    const size = Math.random() * 2 + 1;
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.2;
    
    // Random animation duration
    const duration = Math.random() * 4 + 2;
    
    star.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        --opacity: ${opacity};
        --duration: ${duration}s;
    `;
    
    container.appendChild(star);
}

function createShootingStar(container) {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // Random starting position
    const startY = Math.random() * 50;
    shootingStar.style.top = `${startY}%`;
    shootingStar.style.left = '-100px';
    
    container.appendChild(shootingStar);
    
    // Remove after animation
    setTimeout(() => {
        shootingStar.remove();
    }, 3000);
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        soundManager.play('toggle');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// ========================================
// DARK/LIGHT MODE TOGGLE
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        soundManager.play('switch');
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    });
}

// ========================================
// PREMIUM MUSIC BUTTON
// ========================================
function initMusicButton() {
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    
    if (!musicBtn || !bgMusic) return;
    
    // Set volume
    bgMusic.volume = 0.2;
    
    let isPlaying = false;
    
    // Try autoplay (may be blocked by browser)
    const tryAutoplay = () => {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add('playing');
        }).catch(() => {
            // Autoplay blocked, wait for user interaction
            isPlaying = false;
            musicBtn.classList.remove('playing');
        });
    };
    
    // Try autoplay after a short delay
    setTimeout(tryAutoplay, 1000);
    
    // Toggle on click
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicBtn.classList.add('playing');
                isPlaying = true;
            });
        }
        
        soundManager.play('toggle');
    });
    
    // Enable music on first user interaction (for autoplay policy)
    const enableAudio = () => {
        if (!isPlaying) {
            tryAutoplay();
        }
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
    };
    
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
}

// ========================================
// REAL-TIME CLOCK (WIB)
// ========================================
function initClock() {
    const clockDate = document.getElementById('clock-date');
    const clockTime = document.getElementById('clock-time');
    
    if (!clockDate || !clockTime) return;

    function updateClock() {
        const now = new Date();
        const wibTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        const dayName = days[wibTime.getDay()];
        const date = wibTime.getDate();
        const month = months[wibTime.getMonth()];
        const year = wibTime.getFullYear();

        const hours = String(wibTime.getHours()).padStart(2, '0');
        const minutes = String(wibTime.getMinutes()).padStart(2, '0');
        const seconds = String(wibTime.getSeconds()).padStart(2, '0');

        clockDate.textContent = `${dayName}, ${date} ${month} ${year}`;
        clockTime.textContent = `${hours}:${minutes}:${seconds} WIB`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// ========================================
// COUNT UP ANIMATION FOR STATS
// ========================================
function initCountUp() {
    const statCards = document.querySelectorAll('.stat-card');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const target = parseInt(card.dataset.target);
                const element = card.querySelector('.stat-number');
                
                animateCountUp(element, target);
                observer.unobserve(card);
            }
        });
    }, observerOptions);

    statCards.forEach(card => observer.observe(card));
}

function animateCountUp(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        // Format number
        if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'K';
        } else {
            element.textContent = current;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Final value
            if (target >= 1000) {
                element.textContent = (target / 1000).toFixed(target >= 10000 ? 0 : 1) + 'K';
            } else {
                element.textContent = target;
            }
        }
    }

    requestAnimationFrame(update);
}

// ========================================
// JADWAL/SCHEDULE SECTION
// ========================================
async function initJadwal() {
    const jadwalContainer = document.getElementById('jadwal-container');
    const slotContainer = document.getElementById('slot-container');
    const totalAntrianEl = document.getElementById('total-antrian');
    const slotTersediaEl = document.getElementById('slot-tersedia');
    const uploadBerikutnyaEl = document.getElementById('upload-berikutnya');

    if (!jadwalContainer) return;

    // Fallback data
    const fallbackData = [
        { date: '2026-03-12', day: 'Kamis', server: 'Stecu SMP', platform: 'TikTok', time: '18:00' },
        { date: '2026-03-13', day: 'Jumat', server: 'Natural SMP', platform: 'TikTok', time: '14:00' },
        { date: '2026-03-14', day: 'Sabtu', server: 'Potato SMP', platform: 'TikTok', time: '18:00' },
        { date: '2026-03-15', day: 'Minggu', server: 'Hypix SMP', platform: 'TikTok', time: '14:00' },
        { date: '2026-03-16', day: 'Senin', server: 'Trinity Indonesia', platform: 'TikTok', time: '14:00' },
        { date: '2026-03-17', day: 'Selasa', server: 'Nexoverse', platform: 'TikTok + YouTube', time: '14:00' },
        { date: '2026-03-18', day: 'Rabu', server: 'Nexoverse', platform: 'TikTok', time: '14:00' },
        { date: '2026-03-23', day: 'Senin', server: 'Survborn', platform: 'TikTok', time: '18:00' },
        { date: '2026-03-27', day: 'Jumat', server: 'Iciki Network', platform: 'TikTok', time: '18:00' }
    ];

    try {
        const response = await fetch('assets/schedule.json?v=' + Date.now(), {
            cache: 'no-store'
        });
        
        let scheduleData = fallbackData;
        if (response.ok) {
            scheduleData = await response.json();
        }
        
        processScheduleData(scheduleData, jadwalContainer, slotContainer, totalAntrianEl, slotTersediaEl, uploadBerikutnyaEl);
    } catch (error) {
        console.log('Using fallback schedule data');
        processScheduleData(fallbackData, jadwalContainer, slotContainer, totalAntrianEl, slotTersediaEl, uploadBerikutnyaEl);
    }
}

function processScheduleData(scheduleData, jadwalContainer, slotContainer, totalAntrianEl, slotTersediaEl, uploadBerikutnyaEl) {
    // Get current date in WIB
    const now = new Date();
    const wibTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const today = formatDate(wibTime);

    // Process schedule data
    const processedData = scheduleData.map(item => {
        const itemDate = new Date(item.date);
        const itemDateStr = formatDate(itemDate);
        const diffTime = itemDate - wibTime;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status;
        if (itemDateStr === today) {
            status = 'HARI INI';
        } else if (diffDays < 0) {
            status = 'SELESAI';
        } else {
            status = 'UPCOMING';
        }

        return { ...item, status, diffDays };
    });

    // Filter active schedules
    const activeSchedules = processedData.filter(item => item.status !== 'SELESAI');

    // Calculate statistics
    const totalAntrian = activeSchedules.length;
    const maxSlotsPerWeek = 20;
    const slotTersedia = Math.max(0, maxSlotsPerWeek - totalAntrian);
    const nextUpload = activeSchedules.length > 0 ? activeSchedules[0] : null;

    // Update statistics
    if (totalAntrianEl) totalAntrianEl.textContent = `${totalAntrian} Server`;
    if (slotTersediaEl) slotTersediaEl.textContent = `${slotTersedia} Slot`;
    if (uploadBerikutnyaEl && nextUpload) {
        uploadBerikutnyaEl.innerHTML = `${nextUpload.server}<br><small>${formatDisplayDateShort(new Date(nextUpload.date))}</small>`;
    }

    // Render schedule cards
    jadwalContainer.innerHTML = '';
    if (activeSchedules.length === 0) {
        jadwalContainer.innerHTML = `
            <div class="jadwal-empty">
                <div class="jadwal-empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
                <h3>Tidak Ada Jadwal</h3>
                <p>Saat ini tidak ada jadwal endorse yang akan datang.</p>
                <a href="https://wa.me/6282130570915" target="_blank" class="btn-primary">Order Endorse Sekarang</a>
            </div>
        `;
    } else {
        activeSchedules.forEach((item, index) => {
            const card = createScheduleCard(item, index);
            jadwalContainer.appendChild(card);
        });
    }

    // Generate and render available slots
    const availableSlots = generateAvailableSlots(wibTime, scheduleData, slotTersedia);
    if (slotContainer) {
        slotContainer.innerHTML = '';
        if (availableSlots.length === 0) {
            slotContainer.innerHTML = `
                <div class="jadwal-empty" style="grid-column: 1 / -1;">
                    <div class="jadwal-empty-icon" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h3>Slot Penuh</h3>
                    <p>Semua slot untuk minggu ini sudah terisi.</p>
                    <p style="color: #22c55e; margin-top: 10px;">Hubungi kami untuk info slot minggu depan.</p>
                </div>
            `;
        } else {
            availableSlots.forEach(slot => {
                const slotCard = createSlotCard(slot);
                slotContainer.appendChild(slotCard);
            });
        }
    }
}

function createScheduleCard(item, index) {
    const card = document.createElement('div');
    card.className = `jadwal-card status-${item.status.toLowerCase().replace(' ', '-')}`;
    card.style.animationDelay = `${index * 0.1}s`;

    const statusBadge = item.status === 'HARI INI' 
        ? '<span class="jadwal-status-badge today">HARI INI</span>'
        : '<span class="jadwal-status-badge upcoming">UPCOMING</span>';

    card.innerHTML = `
        ${statusBadge}
        <div class="jadwal-card-header">
            <div class="jadwal-day">${item.day}</div>
            <div class="jadwal-date">${formatDisplayDate(new Date(item.date))}</div>
        </div>
        <div class="jadwal-card-body">
            <div class="jadwal-server">${item.server}</div>
            <div class="jadwal-info">
                <div class="jadwal-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Upload: ${item.time} WIB</span>
                </div>
            </div>
        </div>
        <div class="jadwal-card-footer">
            <div class="jadwal-platform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span>${item.platform || 'TikTok'}</span>
            </div>
        </div>
    `;

    return card;
}

function createSlotCard(slot) {
    const card = document.createElement('div');
    card.className = 'slot-card';

    card.innerHTML = `
        <div class="slot-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        </div>
        <div class="slot-date">${slot.date}</div>
        <div class="slot-day">${slot.day}</div>
        <a href="https://wa.me/6282130570915?text=Halo%20Calmionix%2C%20saya%20mau%20ambil%20slot%20endorse%20tanggal%20${encodeURIComponent(slot.fullDate)}" 
           target="_blank" class="slot-btn" data-sound="hover">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Ambil Slot
        </a>
    `;

    return card;
}

function generateAvailableSlots(currentDate, bookedSchedules, maxSlots) {
    const slots = [];
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const bookedDates = bookedSchedules.map(s => s.date);
    
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() + 1);
    
    let generatedCount = 0;
    for (let i = 0; i < 30 && generatedCount < maxSlots; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() + i);
        
        const dateStr = formatDate(checkDate);
        const dayName = days[checkDate.getDay()];
        
        if (!bookedDates.includes(dateStr)) {
            slots.push({
                date: formatDisplayDateShort(checkDate),
                day: dayName,
                fullDate: dateStr
            });
            generatedCount++;
        }
    }
    
    return slots;
}

// ========================================
// FAQ ACCORDION
// ========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                soundManager.play('click');
            } else {
                soundManager.play('toggle');
            }
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                soundManager.play('click');
            }
        });
    });
}

// ========================================
// SOUND EFFECTS FOR INTERACTIONS
// ========================================
function initSoundEffects() {
    // Initialize sound manager on first user interaction
    const initOnInteraction = () => {
        soundManager.init();
        document.removeEventListener('click', initOnInteraction);
        document.removeEventListener('touchstart', initOnInteraction);
    };
    
    document.addEventListener('click', initOnInteraction);
    document.addEventListener('touchstart', initOnInteraction);
    
    // Add hover sounds to elements with data-sound="hover"
    document.querySelectorAll('[data-sound="hover"]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            soundManager.play('hover');
        });
        
        el.addEventListener('click', () => {
            soundManager.play('click');
        });
    });
    
    // Add click sounds to all buttons without data-sound
    document.querySelectorAll('button:not([data-sound])').forEach(btn => {
        btn.addEventListener('click', () => {
            soundManager.play('click');
        });
    });
    
    // Add click sounds to toggle elements
    document.querySelectorAll('[data-sound="toggle"]').forEach(el => {
        el.addEventListener('click', () => {
            soundManager.play('toggle');
        });
    });
    
    // Add click sounds to all interactive cards
    document.querySelectorAll('.stat-card, .jadwal-card, .slot-card, .price-card, .portfolio-card, .komunitas-card').forEach(card => {
        card.addEventListener('click', () => {
            soundManager.play('click');
        });
        
        card.addEventListener('mouseenter', () => {
            soundManager.play('hover');
        });
    });
    
    // Add click sounds to stat boxes
    document.querySelectorAll('.stat-box').forEach(box => {
        box.addEventListener('click', () => {
            soundManager.play('click');
        });
        
        box.addEventListener('mouseenter', () => {
            soundManager.play('hover');
        });
    });
    
    // Add click sounds to footer links
    document.querySelectorAll('.footer-section a').forEach(link => {
        link.addEventListener('click', () => {
            soundManager.play('click');
        });
        
        link.addEventListener('mouseenter', () => {
            soundManager.play('hover');
        });
    });
    
    // Add click sounds to external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        if (!link.hasAttribute('data-sound')) {
            link.addEventListener('click', () => {
                soundManager.play('click');
            });
        }
    });
}

// ========================================
// PARALLAX EFFECT
// ========================================
function initParallax() {
    // Skip on mobile for performance
    if (window.innerWidth < 768) return;
    
    const glows = document.querySelectorAll('.hero-glow');
    
    let ticking = false;
    
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                glows.forEach((glow, index) => {
                    const speed = (index + 1) * 15;
                    const xOffset = (x - 0.5) * speed;
                    const yOffset = (y - 0.5) * speed;
                    glow.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDisplayDateShort(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
                   'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ========================================
// PRELOAD IMAGES
// ========================================
window.addEventListener('load', () => {
    const images = [
        'assets/images/logo-calmionix.png',
        'https://img.youtube.com/vi/UI2Ahpt_wzw/maxresdefault.jpg',
        'https://img.youtube.com/vi/XqcqkOP6jXI/maxresdefault.jpg',
        'https://img.youtube.com/vi/IphMg209DCE/maxresdefault.jpg'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// ========================================
// VISIBILITY API - PAUSE WHEN TAB HIDDEN
// ========================================
document.addEventListener('visibilitychange', () => {
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    
    if (document.hidden) {
        // Tab is hidden - music will continue but we could pause it
    }
});

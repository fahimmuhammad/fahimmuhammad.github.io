// ── Tech Background: Neural Network + Floating Code Particles ──
(function () {
    const canvas = document.getElementById('bgCanvas');
    const ctx    = canvas.getContext('2d');

    function resize() {
        canvas.width  = canvas.offsetWidth  || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // rgba prefix strings — append alpha + ')' to build a full color
    const C_PRIMARY   = 'rgba(99,102,241,';
    const C_SECONDARY = 'rgba(6,182,212,';
    const C_VIOLET    = 'rgba(124,58,237,';
    const PALETTE     = [C_PRIMARY, C_SECONDARY, C_VIOLET];

    // Keywords drawn from Fahim's actual skill stack
    const CODE_WORDS = [
        'Python', 'JavaScript', '<div>', 'function()', 'import',
        'SELECT *', 'git push', 'console.log()', 'PHP', 'MySQL',
        'HTML', 'CSS', 'Tailwind', 'C++', 'int main()', 'echo',
        '#include', 'git commit', 'WHERE id=', 'async/await',
        '#!/bin/bash', 'chmod 755', 'nmap -sV', 'ssh', 'curl',
        'df.head()', 'import pandas', 'model.fit()', 'ReLU',
        'Java', 'Linux', 'git clone', 'npm i', 'fetch()',
        'JOIN', '$var', 'class {}', 'return', '0xFF', 'epoch:',
        'Java', 'Bootstrap', 'WordPress', 'LaTeX', 'C',
    ];

    // ── Code Particle ─────────────────────────────────────
    function CodeParticle(initial) {
        this.reset = function (init) {
            this.x    = Math.random() * canvas.width;
            this.y    = init ? Math.random() * canvas.height : canvas.height + 10;
            this.text = CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)];
            this.vy   = 0.22 + Math.random() * 0.42;
            this.opacity       = init ? Math.random() * 0.09 : 0;
            this.targetOpacity = 0.05 + Math.random() * 0.09;
            this.size  = 9 + Math.random() * 5;
            this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        };
        this.reset(initial);

        this.update = function () {
            this.y -= this.vy;
            if (this.opacity < this.targetOpacity) this.opacity += 0.0008;
            if (this.y < -20) this.reset(false);
        };
        this.draw = function () {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle   = this.color + '1)';
            ctx.font        = this.size + "px 'Space Grotesk', monospace";
            ctx.fillText(this.text, this.x, this.y);
            ctx.restore();
        };
    }

    // ── Network Node ──────────────────────────────────────
    function NetworkNode() {
        this.x     = Math.random() * canvas.width;
        this.y     = Math.random() * canvas.height;
        this.vx    = (Math.random() - 0.5) * 0.32;
        this.vy    = (Math.random() - 0.5) * 0.32;
        this.r     = 1.5 + Math.random() * 1.5;
        this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        this.phase = Math.random() * Math.PI * 2;

        this.update = function () {
            this.x += this.vx;
            this.y += this.vy;
            this.phase += 0.022;
            if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        };
        this.draw = function () {
            var a = 0.35 + 0.2 * Math.sin(this.phase);
            ctx.save();
            ctx.globalAlpha = a;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color + '1)';
            ctx.fill();
            ctx.restore();
        };
    }

    var MAX_DIST = 145;
    var MAX_DIST2 = MAX_DIST * MAX_DIST;

    function drawConnections(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            for (var j = i + 1; j < nodes.length; j++) {
                var dx = nodes[i].x - nodes[j].x;
                var dy = nodes[i].y - nodes[j].y;
                if (dx * dx + dy * dy < MAX_DIST2) {
                    var dist  = Math.sqrt(dx * dx + dy * dy);
                    var alpha = (1 - dist / MAX_DIST) * 0.18;
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = nodes[i].color + '1)';
                    ctx.lineWidth   = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    var mobile       = window.innerWidth < 768;
    var nodeCount    = mobile ? 28 : 55;
    var particleCount = mobile ? 16 : 30;

    var nodes     = [];
    var particles = [];
    for (var n = 0; n < nodeCount;    n++) nodes.push(new NetworkNode());
    for (var p = 0; p < particleCount; p++) particles.push(new CodeParticle(true));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConnections(nodes);
        for (var i = 0; i < nodes.length;     i++) { nodes[i].update();     nodes[i].draw(); }
        for (var j = 0; j < particles.length; j++) { particles[j].update(); particles[j].draw(); }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}());

// ── AOS (Animate on Scroll) ──────────────────────────────
AOS.init({
    duration: 750,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
});

// ── Typed.js (Hero Typewriter) ───────────────────────────
new Typed('#typed', {
    strings: [
        'Web Developer',
        'Software Engineer',
        'ML Enthusiast',
        'Ethical Hacking Learner',
        'Full Stack Dev',
    ],
    typeSpeed: 60,
    backSpeed: 35,
    backDelay: 2200,
    loop: true,
    cursorChar: '|',
});

// ── Navbar: scroll opacity + active link highlight ───────
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link:not(.mobile-nav-link)');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
    // Darken navbar on scroll
    if (window.scrollY > 40) {
        navbar.style.background = 'rgba(5, 9, 20, 0.96)';
    } else {
        navbar.style.background = 'rgba(5, 9, 20, 0.75)';
    }

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
            current = sec.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── Mobile Menu Toggle ───────────────────────────────────
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuBtn.querySelector('i').className = isOpen ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
});

// Close mobile menu when a link is tapped
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.querySelector('i').className = 'fas fa-bars text-xl';
    });
});

// ── Smooth-scroll for anchor links (fallback for old browsers) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Subtle tilt on glass cards (desktop only) ────────────
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card, .stat-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
            const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
            card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

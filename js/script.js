(() => {
	const $ = (s, r = document) => r.querySelector(s);
	const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Loader
	const loader = $('#loader');
	window.addEventListener('load', () => {
		setTimeout(() => loader?.classList.add('hide'), 500);
		setTimeout(() => loader?.remove(), 1400);
	});

	// Page transitions (for in-page anchors)
	const overlay = $('.page-overlay');
	const smoothScroll = (id) => {
		const el = $(id);
		if (!el) return;
		el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
	};
	$$("a[data-nav]").forEach(a => {
		a.addEventListener('click', (e) => {
			const href = a.getAttribute('href');
			if (!href || !href.startsWith('#')) return;
			e.preventDefault();
			overlay?.classList.add('active');
			setTimeout(() => {
				smoothScroll(href);
				overlay?.classList.remove('active');
			}, prefersReduced ? 0 : 400);
			// close mobile menu if open
			closeMobileMenu();
		});
	});

	// Parallax
	const layers = $$('.layer');
	const parallax = (x, y) => {
		layers.forEach(l => {
			const d = parseFloat(l.dataset.depth || '0.05');
			l.style.transform = `translate3d(${x * d}px, ${y * d}px, 0)`;
		});
	};
	let px = 0, py = 0;
	window.addEventListener('mousemove', (e) => {
		const cx = window.innerWidth / 2;
		const cy = window.innerHeight / 2;
		px = (e.clientX - cx) / 30;
		py = (e.clientY - cy) / 30;
	});
	const raf = () => {
		parallax(px, py);
		requestAnimationFrame(raf);
	};
	requestAnimationFrame(raf);

	// Reveal on scroll
	const revealEls = $$('.reveal');
	const io = new IntersectionObserver((entries) => {
		entries.forEach((e) => {
			if (e.isIntersecting) {
				e.target.classList.add('in');
				io.unobserve(e.target);
			}
		});
	}, { threshold: 0.15 });
	revealEls.forEach(el => io.observe(el));

	// Counters
	const counterEls = $$('[data-count]');
	const animateCounter = (el) => {
		const target = parseInt(el.dataset.count || '0', 10);
		const start = 0;
		const dur = 1200;
		const t0 = performance.now();
		const step = (t) => {
			const p = Math.min(1, (t - t0) / dur);
			const val = Math.floor(start + (target - start) * (1 - Math.pow(1 - p, 3)));
			el.textContent = String(val);
			if (p < 1) requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	};
	counterEls.forEach(el => animateCounter(el));

	// Simulate live players (random for demo)
	const live = $('[data-live]');
	const updateLive = () => {
		if (!live) return;
		const val = Math.floor(40 + Math.random() * 30);
		live.textContent = String(val);
	};
	updateLive();
	setInterval(updateLive, 4000);

	// Copy IP
	$$("[data-copy-ip]").forEach(btn => {
		btn.addEventListener('click', async () => {
			const ip = btn.getAttribute('data-ip') || 'play.minefc.vn';
			try {
				await navigator.clipboard.writeText(ip);
				toast(`Đã sao chép: ${ip}`);
			} catch {
				toast('Không thể sao chép, hãy copy thủ công.');
			}
		});
	});

	// Ripple microinteraction
	const addRipple = (e) => {
		const target = e.currentTarget;
		const rect = target.getBoundingClientRect();
		const ripple = document.createElement('span');
		ripple.className = 'ripple';
		const size = Math.max(rect.width, rect.height);
		ripple.style.width = ripple.style.height = `${size}px`;
		ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
		ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
		target.appendChild(ripple);
		ripple.addEventListener('animationend', () => ripple.remove());
	};
	$$('[data-ripple]').forEach(el => el.addEventListener('click', addRipple));

	// Mobile menu
	const toggle = $('.menu-toggle');
	const mobile = $('#mobile-menu');
	const openMobileMenu = () => {
		if (!toggle || !mobile) return;
		toggle.classList.add('active');
		toggle.setAttribute('aria-expanded', 'true');
		mobile.hidden = false;
	};
	const closeMobileMenu = () => {
		if (!toggle || !mobile) return;
		toggle.classList.remove('active');
		toggle.setAttribute('aria-expanded', 'false');
		mobile.hidden = true;
	};
	toggle?.addEventListener('click', () => {
		const expanded = toggle.getAttribute('aria-expanded') === 'true';
		expanded ? closeMobileMenu() : openMobileMenu();
	});

	// Close menu when resizing to desktop
	window.addEventListener('resize', () => {
		if (window.innerWidth > 640) {
			closeMobileMenu();
		}
	});

	// Footer year
	const y = new Date().getFullYear();
	const year = $('#year');
	if (year) year.textContent = String(y);

	// Toast helper
	function toast(msg) {
		let el = $('#toast');
		if (!el) {
			el = document.createElement('div');
			el.id = 'toast';
			Object.assign(el.style, {
				position:'fixed', left:'50%', bottom:'26px', transform:'translateX(-50%)',
				background:'rgba(0,0,0,.7)', color:'#e6f2ff', padding:'10px 14px',
				borderRadius:'10px', border:'1px solid rgba(255,255,255,.1)',
				zIndex: 200, opacity:'0', transition:'opacity .2s ease'
			});
			document.body.appendChild(el);
		}
		el.textContent = msg;
		el.style.opacity = '1';
		setTimeout(() => { el && (el.style.opacity = '0'); }, 1600);
	}
})();


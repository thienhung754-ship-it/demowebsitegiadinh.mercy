document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. DYNAMICALLY INJECT VISUAL ELEMENTS (CURSOR, GRAIN, CAD LINES)
    // ----------------------------------------------------
    
    // Check if device supports hover (desktop/mouse) to enable custom cursor
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    
    if (supportsHover) {
        // Inject Custom Cursor elements
        const cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor';
        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'custom-cursor-follower';
        
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorFollower);
        
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly position the dot
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        
        // Lerp loop for the smooth trailing follower ring
        function animateFollower() {
            // Lerp formula: current + (target - current) * ease
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
        
        // Bind hover events to enlarge cursor follower
        const interactives = document.querySelectorAll('a, button, select, input, textarea, .project-item, .service-card, .magazine-card, .slider-handle, .client-avatar');
        
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('active');
                cursorDot.classList.add('active');
                
                // Add specific text badges inside cursor on project cards
                if (el.classList.contains('project-item') || el.classList.contains('service-card')) {
                    cursorFollower.setAttribute('data-label', 'CHI TIẾT');
                } else if (el.classList.contains('slider-handle') || el.classList.contains('comparison-slider-input')) {
                    cursorFollower.setAttribute('data-label', 'KÉO');
                }
            });
            
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('active');
                cursorDot.classList.remove('active');
                cursorFollower.removeAttribute('data-label');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    }

    // Inject Subtle Grain Noise Overlay
    const grainOverlay = document.createElement('div');
    grainOverlay.className = 'bg-grain';
    document.body.appendChild(grainOverlay);

    // Inject Architectural CAD Blueprint Gridlines
    const cadGrid = document.createElement('div');
    cadGrid.className = 'cad-grid-container';
    cadGrid.innerHTML = `
        <div class="cad-line-v v1"></div>
        <div class="cad-line-v v2"></div>
        <div class="cad-line-v v3"></div>
    `;
    document.body.appendChild(cadGrid);

    // ----------------------------------------------------
    // 2. MAGNETIC CTA BUTTONS
    // ----------------------------------------------------
    if (supportsHover) {
        const magneticButtons = document.querySelectorAll('.btn-gold, .btn-outline, .nav-btn, .btn-submit, .mobile-btn');
        
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const btnX = rect.left + rect.width / 2;
                const btnY = rect.top + rect.height / 2;
                
                const distanceX = e.clientX - btnX;
                const distanceY = e.clientY - btnY;
                
                // Pull element slightly towards the mouse coordinate (max 12px)
                btn.style.transform = `translate(${distanceX * 0.25}px, ${distanceY * 0.25}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                // Reset button transform smoothly
                btn.style.transform = '';
            });
        });
    }

    // ----------------------------------------------------
    // 3. COMMON INTERACTIVE UTILITIES
    // ----------------------------------------------------
    
    // Dismiss Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 1000);
    }

    // Header scroll background toggle
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Navigation Drawer Overlay
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    function openMobileMenu() {
        if (mobileOverlay) {
            mobileOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileMenu() {
        if (mobileOverlay) {
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

    // Scroll Reveal IntersectionObserver
    const revealItems = document.querySelectorAll('.reveal-item');
    if (revealItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(item => {
            observer.observe(item);
        });
    }

    // ----------------------------------------------------
    // 4. DETECT & EXECUTE PAGE-SPECIFIC MODULES
    // ----------------------------------------------------

    // A. Ken Burns Hero Slider (Homepage Banner)
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // B. Before/After Comparison Image Slider (Homepage)
    const rangeInput = document.getElementById('sliderRangeInput');
    const afterImage = document.getElementById('afterImage');
    const afterImgAsset = document.getElementById('afterImgAsset');
    const divider = document.getElementById('sliderDivider');
    const handle = document.getElementById('sliderHandle');
    const sliderContainer = document.getElementById('sliderContainer');

    if (sliderContainer && rangeInput && afterImage && afterImgAsset) {
        function syncWidth() {
            const width = sliderContainer.offsetWidth;
            afterImgAsset.style.width = width + 'px';
        }
        syncWidth();
        window.addEventListener('resize', syncWidth);

        function updateSlider(percent) {
            afterImage.style.width = percent + '%';
            divider.style.left = percent + '%';
            handle.style.left = percent + '%';
        }

        rangeInput.addEventListener('input', (e) => {
            if (sweepInterval) {
                clearInterval(sweepInterval);
                sweepInterval = null;
            }
            updateSlider(e.target.value);
        });

        let sweepInterval;
        let direction = 1;
        let sweepValue = 50;

        // Auto sweep visual hint
        setTimeout(() => {
            sweepInterval = setInterval(() => {
                sweepValue += direction * 0.5;
                if (sweepValue >= 75) direction = -1;
                else if (sweepValue <= 25) direction = 1;
                rangeInput.value = sweepValue;
                updateSlider(sweepValue);
            }, 16);
        }, 2000);

        sliderContainer.addEventListener('mouseenter', () => {
            if (sweepInterval) {
                clearInterval(sweepInterval);
                sweepInterval = null;
                // Smoothly reset back to 50%
                let resetTimer = setInterval(() => {
                    let current = parseFloat(rangeInput.value);
                    if (Math.abs(current - 50) < 1) {
                        updateSlider(50);
                        rangeInput.value = 50;
                        clearInterval(resetTimer);
                    } else {
                        let step = current + (50 - current) * 0.15;
                        updateSlider(step);
                        rangeInput.value = step;
                    }
                }, 16);
            }
        });
    }

    // C. Client Testimonials Testimonial Slider (Homepage)
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    if (testimonialSlides.length > 0 && dots.length > 0) {
        let currentTestimonial = 0;

        function showTestimonial(index) {
            testimonialSlides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            testimonialSlides[index].classList.add('active');
            dots[index].classList.add('active');
            currentTestimonial = index;
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => showTestimonial(i));
        });

        setInterval(() => {
            let nextIndex = (currentTestimonial + 1) % testimonialSlides.length;
            showTestimonial(nextIndex);
        }, 6000);
    }

    // D. Project Filtering Console (Projects sub-page)
    const filterType = document.getElementById('filterType');
    const filterLocation = document.getElementById('filterLocation');
    const filterStyle = document.getElementById('filterStyle');
    const btnSearchConsole = document.getElementById('btnSearchConsole');
    const projectItems = document.querySelectorAll('.project-item');

    if (btnSearchConsole && projectItems.length > 0) {
        btnSearchConsole.addEventListener('click', () => {
            const typeVal = filterType.value;
            const locVal = filterLocation.value;
            const styleVal = filterStyle.value;

            projectItems.forEach(item => {
                const itemType = item.getAttribute('data-type');
                const itemLoc = item.getAttribute('data-location');
                const itemStyle = item.getAttribute('data-style');

                const matchType = typeVal === 'all' || itemType === typeVal;
                const matchLoc = locVal === 'all' || itemLoc === locVal;
                const matchStyle = styleVal === 'all' || itemStyle === styleVal;

                if (matchType && matchLoc && matchStyle) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1) translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95) translateY(15px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    }

    // E. Dynamic Project Detail Modal (Projects sub-page)
    const modal = document.getElementById('projectDetailModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    if (modal && projectItems.length > 0) {
        window.openModal = function(tag, title, desc, area, year, img) {
            document.getElementById('modalProjectImg').src = img;
            document.getElementById('modalProjectTag').innerText = tag;
            document.getElementById('modalProjectTitle').innerText = title;
            document.getElementById('modalProjectDesc').innerText = desc;
            document.getElementById('modalProjectArea').innerText = area;
            document.getElementById('modalProjectYear').innerText = year;
            
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        window.closeModal = function() {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        projectItems.forEach(item => {
            item.addEventListener('click', () => {
                const tag = item.querySelector('.project-meta-overlay').innerText;
                const title = item.querySelector('h3').innerText;
                const desc = item.querySelector('p').innerText;
                const specs = item.querySelectorAll('.project-specs span');
                const area = specs[0].innerText.replace('Diện tích: ', '');
                const year = specs[1].innerText.replace('Bàn giao: ', '');
                const img = item.querySelector('.project-img-wrapper img').src;
                
                openModal(tag, title, desc, area, year, img);
            });
        });
    }

    // F. Contact Form submission & validation (Contact / Home)
    const consultationForm = document.getElementById('consultationForm');
    const formSuccessMessage = document.getElementById('formSuccessMessage');

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phoneInput = document.getElementById('clientPhone');
            const phoneVal = phoneInput.value.replace(/\s+/g, '');
            const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

            if (!phoneRegex.test(phoneVal)) {
                phoneInput.style.borderColor = '#ef4444';
                alert('Số điện thoại không hợp lệ! Vui lòng điền đúng 10 chữ số di động Việt Nam (Ví dụ: 0908123456).');
                return;
            }

            const btnSubmit = document.getElementById('btnSubmitForm');
            btnSubmit.disabled = true;
            btnSubmit.innerText = 'ĐANG GỬI THÔNG TIN...';

            setTimeout(() => {
                consultationForm.style.display = 'none';
                if (formSuccessMessage) formSuccessMessage.style.display = 'block';

                setTimeout(() => {
                    consultationForm.reset();
                    consultationForm.style.display = 'block';
                    if (formSuccessMessage) formSuccessMessage.style.display = 'none';
                    btnSubmit.disabled = false;
                    btnSubmit.innerText = 'GỬI THÔNG TIN ĐĂNG KÝ';
                    phoneInput.style.borderColor = '';
                }, 5000);
            }, 1500);
        });
    }
});

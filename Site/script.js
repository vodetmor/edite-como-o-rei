/**
 * EDITE COMO O REI - SCRIPT
 * Lógica do Vanilla JS (Modais, Lazy Load e Interações)
 * Isolado numa IIFE (Immediately Invoked Function Expression) para evitar colisões no WP/Elementor
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        
        // --- 1. CONFIGURAÇÃO DE MODAL DE VÍDEO ---
        // Aqui criamos o modal de vídeo de forma dinâmica no HTML apenas quando for necessário
        
        const createVideoModal = () => {
            const modalHTML = `
                <div id="edtr-video-modal" class="edtr-modal-overlay" style="display: none;">
                    <button id="edtr-modal-close" class="edtr-modal-close-btn">&times;</button>
                    <div class="edtr-modal-content">
                        <!-- O Iframe entrará aqui dinamicamente -->
                        <div id="edtr-iframe-container" class="edtr-iframe-ratio"></div>
                    </div>
                </div>
            `;
            
            // Adiciona o CSS do Modal via JS se necessário, mas idealmente vai pro style.css
            // Insere no final do body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        };

        createVideoModal();

        const modalOverlay = document.getElementById('edtr-video-modal');
        const modalCloseBtn = document.getElementById('edtr-modal-close');
        const iframeContainer = document.getElementById('edtr-iframe-container');

        const openModal = (videoUrl) => {
            // Em injetamos um mock do Wistia/Youtube da Monstercopy
            iframeContainer.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%; height:100%;"></iframe>`;
            modalOverlay.style.display = 'flex';
            setTimeout(() => {
                modalOverlay.classList.add('edtr-modal-open');
            }, 10);
        };

        const closeModal = () => {
            modalOverlay.classList.remove('edtr-modal-open');
            setTimeout(() => {
                modalOverlay.style.display = 'none';
                iframeContainer.innerHTML = ''; // Limpa o iframe para parar o áudio
            }, 300); // 300ms de transição
        };

        // Eventos do Modal
        modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.style.display === 'flex') closeModal();
        });

        // --- 2. ATIVADOR DA VSL PRINCIPAL ---
        const mainVslPlaceholders = document.querySelectorAll('.edtr-vsl-wrapper');
        mainVslPlaceholders.forEach(el => {
            el.addEventListener('click', () => {
                const videoId = el.getAttribute('data-video-id');
                if(videoId) openModal(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
            });
        });

        // --- 3. ATIVADOR DOS DEMOS (Portfólio) ---
        const demoPlayers = document.querySelectorAll('.edtr-mini-player');
        demoPlayers.forEach(el => {
            el.addEventListener('click', () => {
                const videoId = el.getAttribute('data-video-id');
                if(videoId) openModal(`https://www.youtube.com/embed/${videoId}?autoplay=1`); 
            });
        });

        // --- 4. EFEITO DE ENTRADA SUAVE (FADE UP) ---
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const revealOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Adiciona a classe de animação aos elementos que queremos revelar
        const cards = document.querySelectorAll('.edtr-glass-card, .edtr-author-bio');
        cards.forEach(card => {
            card.classList.add('edtr-animate-fade-up');
            revealOnScroll.observe(card);
        });
    });
})();

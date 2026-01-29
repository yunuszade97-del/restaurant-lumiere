/**
 * ==============================================================================
 * ГЛАВНЫЙ JAVASCRIPT ФАЙЛ
 * ==============================================================================
 * Описание: Инициализация fullPage.js, Swiper.js и управление интерфейсом
 * Версия: 2.0 - Исправлены баги инициализации
 * ==============================================================================
 */

// ==============================================================================
// ОЖИДАНИЕ ПОЛНОЙ ЗАГРУЗКИ СТРАНИЦЫ
// ==============================================================================
// Используем 'load' вместо 'DOMContentLoaded' для гарантии загрузки всех ресурсов
window.addEventListener('load', function () {
    'use strict';

    // Принудительная прокрутка вверх при перезагрузке
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ==========================================================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (определяем ПЕРВЫМИ)
    // ==========================================================================

    // DOM элементы
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav__link');

    /**
     * Закрытие мобильного меню
     * ВАЖНО: Должна быть определена ДО fullPage.js
     */
    function closeMobileMenu() {
        if (burger && nav) {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Переключение состояния мобильного меню
     */
    function toggleMobileMenu() {
        if (burger && nav) {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        }
    }

    /**
     * Обновляет класс 'active' у ссылок навигации
     * ВАЖНО: Должна быть определена ДО fullPage.js
     * @param {string} anchor - Якорь текущей секции
     */
    function updateActiveNavLink(anchor) {
        if (!navLinks.length) return;

        navLinks.forEach(function (link) {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector('.nav__link[data-menuanchor="' + anchor + '"]');
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Показывает уведомление пользователю
     * @param {string} message - Текст уведомления
     * @param {string} type - Тип уведомления ('success' или 'error')
     */
    function showNotification(message, type) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification notification--' + type;
        notification.innerHTML = '<p>' + message + '</p><button class="notification__close">&times;</button>';

        notification.style.cssText = '\
            position: fixed;\
            bottom: 2rem;\
            left: 50%;\
            transform: translateX(-50%);\
            padding: 1rem 2rem;\
            background: ' + (type === 'success' ? '#2ecc71' : '#e74c3c') + ';\
            color: white;\
            border-radius: 8px;\
            display: flex;\
            align-items: center;\
            gap: 1rem;\
            z-index: 9999;\
            animation: slideUp 0.3s ease;\
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\
        ';

        document.body.appendChild(notification);

        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.style.cssText = '\
            background: none;\
            border: none;\
            color: white;\
            font-size: 1.5rem;\
            cursor: pointer;\
            padding: 0;\
            line-height: 1;\
        ';
        closeBtn.addEventListener('click', function () {
            notification.remove();
        });

        setTimeout(function () {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(20px)';
                notification.style.transition = 'all 0.3s ease';
                setTimeout(function () {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // ==========================================================================
    // ОБРАБОТЧИКИ СОБЫТИЙ МОБИЛЬНОГО МЕНЮ
    // ==========================================================================

    if (burger) {
        burger.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // ==========================================================================
    // ИНИЦИАЛИЗАЦИЯ FULLPAGE.JS
    // ==========================================================================

    // Проверяем наличие fullpage
    if (typeof fullpage === 'undefined') {
        console.error('❌ fullPage.js не загружен!');
        return;
    }

    // Определяем тип устройства
    const isMobile = window.innerWidth < 768;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    try {
        // Инициализируем fullPage ТОЛЬКО на десктопе
        if (!isMobile) {
            new fullpage('#fullpage', {
                // Якоря для навигации
                anchors: ['home', 'about', 'menu', 'contacts'],

                // Привязка к меню
                menu: '#nav',

                // Скорость прокрутки
                scrollingSpeed: 800,

                // Эффект перехода
                easingcss3: 'ease-out',

                // Боковая навигация
                navigation: true,
                navigationPosition: 'right',
                navigationTooltips: ['Главная', 'О нас', 'Меню', 'Контакты'],

                // Скролл внутри секции
                scrollOverflow: true,
                scrollOverflowReset: false,

                // Нормальный скролл для этих элементов
                normalScrollElements: '.swiper-wrapper, .booking-form, .contacts__form-container',

                // CSS3 анимации
                css3: true,

                // Лицензия
                licenseKey: 'gplv3-license',

                // Callback после загрузки секции
                afterLoad: function (origin, destination, direction) {
                    if (destination && destination.anchor) {
                        updateActiveNavLink(destination.anchor);
                    }

                    if (header) {
                        if (destination && destination.index > 0) {
                            header.classList.add('header--scrolled');
                        } else {
                            header.classList.remove('header--scrolled');
                        }
                    }

                    if (destination && destination.item) {
                        destination.item.classList.add('section--visible');
                    }
                },

                onLeave: function (origin, destination, direction) {
                    closeMobileMenu();
                }
            });
            console.log('✅ fullPage.js инициализирован (Desktop)');
        } else {
            console.log('📱 Мобильная версия: fullPage.js отключен для стабильной прокрутки');
            // Включаем видимость секций сразу
            document.querySelectorAll('.section').forEach(sec => sec.classList.add('section--visible'));

            // Простой скролл-спай для мобильных
            window.addEventListener('scroll', function () {
                const scrollPos = window.scrollY + 100;

                // Хедер
                if (header) {
                    if (window.scrollY > 50) {
                        header.classList.add('header--scrolled');
                    } else {
                        header.classList.remove('header--scrolled');
                    }
                }

                // Активная ссылка
                document.querySelectorAll('section').forEach(section => {
                    if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
                        const id = section.getAttribute('data-anchor') || section.id;
                        if (id) updateActiveNavLink(id);
                    }
                });
            });
        }

    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
    }

    // ==========================================================================
    // СЛАЙДЕРЫ УДАЛЕНЫ (переход на Grid Layout)
    // ==========================================================================


    // ==========================================================================
    // ФОРМА БРОНИРОВАНИЯ
    // ==========================================================================

    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(bookingForm);
            const data = {};

            formData.forEach(function (value, key) {
                data[key] = value;
            });

            // Валидация
            if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }

            // Показываем успех (в реальном приложении здесь будет отправка на сервер)
            showNotification('Спасибо! Мы свяжемся с вами для подтверждения брони.', 'success');
            bookingForm.reset();
        });
    }

    // ==========================================================================
    // УСТАНОВКА МИНИМАЛЬНОЙ ДАТЫ В ФОРМЕ
    // ==========================================================================

    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // ==========================================================================
    // ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК
    // ==========================================================================

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId && targetId !== '#') {
                const sectionAnchor = targetId.replace('#', '');

                if (['home', 'about', 'menu', 'contacts'].includes(sectionAnchor)) {
                    e.preventDefault();

                    // Проверяем доступность fullpage_api
                    if (typeof fullpage_api !== 'undefined' && fullpage_api.moveTo) {
                        fullpage_api.moveTo(sectionAnchor);
                    } else {
                        // Fallback - обычный скролл
                        const targetSection = document.querySelector('[data-anchor="' + sectionAnchor + '"]');
                        if (targetSection) {
                            targetSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            }
        });
    });

    // ==========================================================================
    // ОТЛАДОЧНАЯ ИНФОРМАЦИЯ
    // ==========================================================================
    console.log('🍽️ Сайт ресторана LUMIÈRE загружен');
    console.log('📱 Мобильное устройство:', isMobile);
    console.log('👆 Touch устройство:', isTouch);
});

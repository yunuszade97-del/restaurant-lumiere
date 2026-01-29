/**
 * ==============================================================================
 * ГЛАВНЫЙ JAVASCRIPT ФАЙЛ
 * ==============================================================================
 * Описание: Инициализация fullPage.js, Swiper.js и управление интерфейсом
 * ==============================================================================
 */

// ==============================================================================
// ОЖИДАНИЕ ЗАГРУЗКИ DOM
// ==============================================================================
// DOMContentLoaded срабатывает когда HTML полностью загружен и обработан
document.addEventListener('DOMContentLoaded', function () {

    // ==========================================================================
    // ИНИЦИАЛИЗАЦИЯ FULLPAGE.JS
    // ==========================================================================
    // fullPage.js - библиотека для создания полноэкранных секций с плавной
    // поэкранной прокруткой (One Page Scroll эффект)
    // ==========================================================================

    // Определяем, является ли устройство мобильным (ширина < 768px)
    const isMobile = window.innerWidth < 768;

    const fullPageInstance = new fullpage('#fullpage', {
        // ------ Привязка якорей для навигации (соответствуют data-anchor в HTML) ------
        anchors: ['home', 'about', 'menu', 'contacts'],

        // ------ Привязка навигации к ссылкам меню ------
        menu: '#nav',

        // ------ Анимация прокрутки ------
        // На мобильных делаем быстрее для отзывчивости
        scrollingSpeed: isMobile ? 700 : 900,

        // ------ Эффект перехода ------
        easingcss3: 'cubic-bezier(0.86, 0, 0.07, 1)',

        // ------ Автоматическая прокрутка ------
        // Отключаем на мобильных для естественного скролла
        autoScrolling: !isMobile,

        // ------ Fit to Section ------
        // Подгоняет секцию под экран при остановке скролла
        fitToSection: !isMobile,
        fitToSectionDelay: 600,

        // ------ Адаптивность ------
        // Отключаем fullPage.js на маленьких экранах (< 768px)
        responsiveWidth: 768,
        responsiveHeight: 0,

        // ------ Навигация (боковые точки) ------
        navigation: !isMobile,
        navigationPosition: 'right',
        navigationTooltips: ['Главная', 'О нас', 'Меню', 'Контакты'],
        showActiveTooltip: false,

        // ------ Поведение при скролле ------
        scrollOverflow: true,
        scrollOverflowReset: true,

        // ------ Тачпад и мышь ------
        normalScrollElements: '.swiper-wrapper, .booking-form',

        // ------ Чувствительность скролла ------
        touchSensitivity: 10,

        // ------ Анимация секций ------
        css3: true,

        // ------ Лицензионный ключ ------
        licenseKey: 'gplv3-license',

        // ------ Callbacks ------

        afterLoad: function (origin, destination, direction) {
            const currentAnchor = destination.anchor;
            updateActiveNavLink(currentAnchor);

            // Добавляем класс к header при уходе с первой секции
            const header = document.getElementById('header');
            if (destination.index > 0) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }

            // Анимация элементов при появлении секции
            const section = destination.item;
            section.classList.add('section--visible');
        },

        onLeave: function (origin, destination, direction) {
            // Закрываем мобильное меню при переходе
            closeMobileMenu();
        },

        // Callback при изменении режима (responsive)
        afterResponsive: function (isResponsive) {
            console.log('📱 Responsive mode:', isResponsive ? 'ON' : 'OFF');
        }
    });

    // ==========================================================================
    // ИНИЦИАЛИЗАЦИЯ SWIPER.JS (СЛАЙДЕР МЕНЮ)
    // ==========================================================================
    // Swiper.js - мощная библиотека для создания слайдеров и каруселей
    // ==========================================================================

    const menuSwiper = new Swiper('.menu__swiper', {
        // ------ Количество слайдов ------
        slidesPerView: 1,              // По умолчанию 1 слайд

        // ------ Отступы между слайдами ------
        spaceBetween: 30,              // 30px между карточками

        // ------ Центрирование ------
        centeredSlides: false,

        // ------ Зацикливание ------
        loop: true,                    // Бесконечная прокрутка

        // ------ Скорость анимации ------
        speed: 600,

        // ------ Автоматическая прокрутка ------
        autoplay: {
            delay: 4000,               // Задержка между слайдами (4 секунды)
            disableOnInteraction: false, // Не останавливать при взаимодействии
            pauseOnMouseEnter: true    // Пауза при наведении мыши
        },

        // ------ Пагинация (точки) ------
        pagination: {
            el: '.swiper-pagination',
            clickable: true            // Точки кликабельны
        },

        // ------ Кнопки навигации ------
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },

        // ------ Брейкпоинты (адаптивность) ------
        // Определяем количество слайдов для разных размеров экрана
        breakpoints: {
            // При ширине экрана >= 480px
            480: {
                slidesPerView: 1.5,    // 1.5 слайда (виден кусок следующего)
                spaceBetween: 20
            },
            // При ширине экрана >= 768px
            768: {
                slidesPerView: 2,      // 2 слайда
                spaceBetween: 25
            },
            // При ширине экрана >= 1024px
            1024: {
                slidesPerView: 3,      // 3 слайда
                spaceBetween: 30
            },
            // При ширине экрана >= 1280px
            1280: {
                slidesPerView: 3,      // 3 слайда
                spaceBetween: 40
            }
        },

        // ------ Доступность ------
        a11y: {
            prevSlideMessage: 'Предыдущее блюдо',
            nextSlideMessage: 'Следующее блюдо'
        }
    });

    // ==========================================================================
    // УПРАВЛЕНИЕ МОБИЛЬНЫМ МЕНЮ (БУРГЕР)
    // ==========================================================================

    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');

    /**
     * Переключение состояния мобильного меню
     */
    function toggleMobileMenu() {
        burger.classList.toggle('active');
        nav.classList.toggle('active');

        // Блокируем/разблокируем скролл body при открытом меню
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    /**
     * Закрытие мобильного меню
     */
    function closeMobileMenu() {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Обработчик клика по бургеру
    if (burger) {
        burger.addEventListener('click', toggleMobileMenu);
    }

    // Закрываем меню при клике на ссылку
    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // ==========================================================================
    // ОБНОВЛЕНИЕ АКТИВНОЙ ССЫЛКИ В НАВИГАЦИИ
    // ==========================================================================

    /**
     * Обновляет класс 'active' у ссылок навигации
     * @param {string} anchor - Якорь текущей секции
     */
    function updateActiveNavLink(anchor) {
        // Удаляем класс active у всех ссылок
        navLinks.forEach(function (link) {
            link.classList.remove('active');
        });

        // Добавляем класс active к ссылке с соответствующим якорем
        const activeLink = document.querySelector('.nav__link[data-menuanchor="' + anchor + '"]');
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // ==========================================================================
    // ОБРАБОТКА ФОРМЫ БРОНИРОВАНИЯ
    // ==========================================================================

    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (event) {
            // Предотвращаем стандартную отправку формы
            event.preventDefault();

            // Собираем данные формы
            const formData = new FormData(bookingForm);
            const data = {};

            formData.forEach(function (value, key) {
                data[key] = value;
            });

            // Валидация (простая проверка)
            if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }

            // В реальном приложении здесь будет отправка на сервер
            // fetch('/api/booking', { method: 'POST', body: JSON.stringify(data) })

            // Показываем сообщение об успехе
            showNotification('Спасибо! Мы свяжемся с вами для подтверждения брони.', 'success');

            // Очищаем форму
            bookingForm.reset();
        });
    }

    // ==========================================================================
    // УВЕДОМЛЕНИЯ
    // ==========================================================================

    /**
     * Показывает уведомление пользователю
     * @param {string} message - Текст уведомления
     * @param {string} type - Тип уведомления ('success' или 'error')
     */
    function showNotification(message, type) {
        // Удаляем существующее уведомление если есть
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Создаём элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification notification--' + type;
        notification.innerHTML = '<p>' + message + '</p><button class="notification__close">&times;</button>';

        // Стили для уведомления (добавляем динамически)
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

        // Добавляем в DOM
        document.body.appendChild(notification);

        // Обработчик закрытия
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

        // Автоматическое удаление через 5 секунд
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
    // УСТАНОВКА МИНИМАЛЬНОЙ ДАТЫ В ФОРМЕ
    // ==========================================================================

    const dateInput = document.getElementById('date');
    if (dateInput) {
        // Устанавливаем минимальную дату - сегодня
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // ==========================================================================
    // ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК
    // ==========================================================================
    // Обрабатываем все ссылки, начинающиеся с #

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Если это ссылка на секцию fullPage, используем API fullPage
            if (targetId && targetId !== '#') {
                const sectionAnchor = targetId.replace('#', '');

                // Проверяем, существует ли секция с таким якорем
                if (['home', 'about', 'menu', 'contacts'].includes(sectionAnchor)) {
                    e.preventDefault();
                    fullpage_api.moveTo(sectionAnchor);
                }
            }
        });
    });

    // ==========================================================================
    // ЛОГИРОВАНИЕ ДЛЯ ОТЛАДКИ
    // ==========================================================================
    console.log('✅ Сайт ресторана LUMIÈRE успешно загружен');
    console.log('📦 fullPage.js инициализирован');
    console.log('🎠 Swiper.js инициализирован');
});

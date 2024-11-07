/* ===================================================================
 * Hesed 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";
    
    const cfg = {
                scrollDuration : 800, // smoothscroll duration
                mailChimpURL   : ''   // mailchimp url
                };
    const $WIN = $(window);

    // Add the User Agent to the <html>
    // will be used for IE10/IE11 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; rv:11.0))
    const doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);


   /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        $("html").addClass('ss-preload');

        $WIN.on('load', function() {

            // force page scroll position to top at page refresh
            // $('html, body').animate({ scrollTop: 0 }, 'normal');

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('ss-preload');
            $("html").addClass('ss-loaded');

        });
    };


   /* Mobile Menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = $('.header-menu-toggle');
        const nav = $('.header-nav-wrap');

        toggleButton.on('click', function(event){
            event.preventDefault();

            toggleButton.toggleClass('is-clicked');
            nav.slideToggle();
        });

        if (toggleButton.is(':visible')) nav.addClass('mobile');

        $WIN.on('resize', function() {
            if (toggleButton.is(':visible')) nav.addClass('mobile');
            else nav.removeClass('mobile');
        });

        nav.find('a').on("click", function() {

            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle(); 
            }
        });

    };


   /* Alert Boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        $('.alert-box').on('click', '.alert-box__close', function() {
            $(this).parent().fadeOut(500);
        }); 

    };

    
   /* Smooth Scrolling
    * ------------------------------------------------------ */
    const ssSmoothScroll = function() {
        
        $('.smoothscroll').on('click', function (e) {
            const target = this.hash;
            const $target = $(target);
            
            e.preventDefault();
            e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing').promise().done(function () {

                // check if menu is open
                if ($('body').hasClass('menu-is-open')) {
                    $('.header-menu-toggle').trigger('click');
                }

                window.location.hash = target;
            });
        });

    };


   /* Back to Top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {
        
        const pxShow      = 500;
        const $goTopButton = $(".ss-go-top")

        // Show or hide the button
        if ($(window).scrollTop() >= pxShow) $goTopButton.addClass('link-is-visible');

        $(window).on('scroll', function() {
            if ($(window).scrollTop() >= pxShow) {
                if(!$goTopButton.hasClass('link-is-visible')) $goTopButton.addClass('link-is-visible')
            } else {
                $goTopButton.removeClass('link-is-visible')
            }
        });
    };


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssAlertBoxes();
        ssSmoothScroll();
        ssBackToTop();

    })();

    /* Predicas
    * ------------------------------------------------------ */

    document.addEventListener('DOMContentLoaded', function() {
        var video = document.getElementById('hero-video');
        
        if (video) {
            // Asegurarse de que el video está en pausa antes de intentar reproducirlo
            video.pause();

            // Intenta reproducir el video cuando el documento esté listo
            video.play().catch(function(error) {
                console.log('Autoplay failed:', error);
                // Agregar un listener para la primera interacción del usuario
                document.addEventListener('click', function() {
                    video.play();
                }, { once: true });
            });
        } else {
            console.log('El elemento de video no se encontró.');
        }
    });


    function parseDate(dateString) {
        const months = {
            "Enero": 0, "Febrero": 1, "Marzo": 2, "Abril": 3,
            "Mayo": 4, "Junio": 5, "Julio": 6, "Agosto": 7,
            "Septiembre": 8, "Octubre": 9, "Noviembre": 10, "Diciembre": 11
        };

        const parts = dateString.replace(/^\S+/, '').split(',').map(part => part.trim());

        // console.log(parts)
        const day = parseInt(parts[0].replace(',', ''));
        // console.log(day)
        const month = months[parts[1]];
        // console.log(month)
        const year = parseInt(parts[2]);
        // console.log(year)

        return new Date(year, month, day);
    }

    const today = new Date();
    const events = document.querySelectorAll('.events-list__item');
    let upcomingEvents = 0;

    events.forEach(event => {
        const dateText = event.querySelector('.events-list__meta-date').textContent.trim();
        const eventDate = parseDate(dateText);

        if (eventDate < today) {
            event.style.display = 'none';
        } else {
            upcomingEvents++;
        }
    });

    if (upcomingEvents === 0) {
        document.getElementById('lead-text').textContent = 'Por el momento no tenemos eventos en camino pero no te preocupes, aquí encontrarás nuestros próximos eventos.';
    }

    const mujeresFechas = [
        new Date("2024-11-23T00:00:00"),
        new Date("2024-12-14T00:00:00"),
    ];

    const hombresFechas = [
        new Date("2024-12-07T00:00:00"),
        new Date("2025-02-01T00:00:00"),
    ];
    const oracionFechas = [
        new Date("2024-11-27T00:00:00"),
        new Date("2024-12-18T00:00:00"),
        new Date("2025-01-29T00:00:00"),
    ];
    
    
    function actualizarFecha(eventId, dateElementId, fechas) {
        const hoy = new Date();
        const proximaFecha = fechas.find(fecha => fecha > hoy);
        const dateElement = document.getElementById(dateElementId);
        if (proximaFecha) {
            const opcionesFormato = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
            const fechaFormateada = proximaFecha.toLocaleDateString('es-ES', opcionesFormato);
            dateElement.textContent = `${fechaFormateada}`;
        } else {
            // No hay próximas fechas, muestra el mensaje de atención
            dateElement.textContent = "Mantente atento a nuestras redes para enterarte de la siguiente fecha";
        }
    }

    // Actualizar fechas de ambos eventos al cargar la página
    document.addEventListener("DOMContentLoaded", () => {
        actualizarFecha("mujeres-event", "mujeres-date", mujeresFechas);
        actualizarFecha("hombres-event", "hombres-date", hombresFechas);
        actualizarFecha("oracion-event", "oracion-date", oracionFechas);
    });

})(jQuery);
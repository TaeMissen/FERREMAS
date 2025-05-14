document.addEventListener('DOMContentLoaded', function() {
    const footer = document.getElementById('main-footer');
    const header = document.getElementById('main-header');
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', function() {
        // Mostrar el footer cuando se llega al final de la página
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            footer.classList.add('show');
        } else {
            footer.classList.remove('show');
        }

        // Mostrar el header cuando se desplaza hacia abajo y ya no está visible
        if (window.scrollY > headerHeight) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });
});

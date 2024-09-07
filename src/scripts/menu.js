// Muestra u oculta (toggle) el menú hamburguesa
function toggleMenu() {
  const $menuItems = document.querySelector('#menu-items');
  if ($menuItems) {
    $menuItems.classList.toggle('hidden');
  }
}

function setupMenu() {
  const $menuBtn = document.querySelector('#menu-btn');
  
  if ($menuBtn) {
    // Remueve el listener anterior si existe
    $menuBtn.removeEventListener('click', toggleMenu);
    
    // Añade el nuevo listener
    $menuBtn.addEventListener('click', toggleMenu);
  }
}

// Ejecuta setupMenu después de cada transición de página y en la carga inicial
document.addEventListener('astro:page-load', setupMenu);
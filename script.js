// Les 5 emplacements possibles autour de la roue.
// Index 0 = centre, puis on tourne dans le sens horaire.
const POSITIONS = ["centre", "haut-droite", "bas-droite", "bas-gauche", "haut-gauche"];

// ordre[i] = le numéro de l'onglet actuellement placé à POSITIONS[i]
// Au départ : l'onglet 1 est au centre, 2/3/4/5 autour.
let ordre = [1, 2, 3, 4, 5];

// Met à jour les classes CSS de chaque <li> pour qu'il se retrouve
// visuellement à la bonne position (voir style.css, classes .position-*).
function appliquerPositions() {
  ordre.forEach(function (numeroOnglet, i) {
    const item = document.querySelector('.wheel-item[data-tab="' + numeroOnglet + '"]');

    // 1) on retire toutes les classes qui commencent par "position-"
    Array.from(item.classList).forEach(function (classe) {
      if (classe.startsWith("position-")) {
        item.classList.remove(classe);
      }
    });

    // 2) on ajoute la classe correspondant à la nouvelle position
    item.classList.add("position-" + POSITIONS[i]);

    // 3) on indique aux lecteurs d'écran quel onglet est l'actif
    if (i === 0) {
      item.setAttribute("aria-current", "true");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

// Fait tourner la roue de "nombreDeCrans" crans.
// direction = 1  -> sens "suivant" (›)
// direction = -1 -> sens "précédent" (‹)
function tourner(direction, nombreDeCrans) {
  // Si on ne précise pas le nombre de crans, on en fait un seul
  if (nombreDeCrans === undefined) {
    nombreDeCrans = 1;
  }

  for (let n = 0; n < nombreDeCrans; n++) {
    if (direction === 1) {
      // [1, 2, 3, 4, 5] -> [2, 3, 4, 5, 1]
      ordre.push(ordre.shift());
    } else {
      // [1, 2, 3, 4, 5] -> [5, 1, 2, 3, 4]
      ordre.unshift(ordre.pop());
    }
  }

  appliquerPositions();
}

// Amène directement un onglet au centre (utilisé quand on clique dessus).
function mettreAuCentre(numeroOnglet) {
  const i = ordre.indexOf(numeroOnglet); // sa position actuelle (0 = déjà au centre)

  if (i === 0) {
    return; // rien à faire
  }

  // Le chemin le plus court : vers l'avant si l'onglet est à 1 ou 2 crans,
  // vers l'arrière s'il est à 3 ou 4 crans.
  if (i <= 2) {
    tourner(1, i);
  } else {
    tourner(-1, ordre.length - i);
  }
}

// Boutons ‹ et ›
document.querySelectorAll(".wheel-btn").forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    const direction = Number(bouton.dataset.direction);
    tourner(direction);
  });
});

// Clic (ou touche Entrée) sur un onglet : il vient au centre
document.querySelectorAll(".wheel-item").forEach(function (item) {
  const numero = Number(item.dataset.tab);

  item.addEventListener("click", function () {
    mettreAuCentre(numero);
  });

  item.addEventListener("keydown", function (evenement) {
    if (evenement.key === "Enter") {
      mettreAuCentre(numero);
    }
  });
});

// Affichage initial au chargement de la page.
appliquerPositions();

// ===========================================================
// POP-UP : clic sur "Zoo de Maubeuge" ou "Supermarché Match"
// ===========================================================
const popup = document.getElementById("popup");
const popupImage = document.getElementById("popup-image");
const popupTitre = document.getElementById("popup-titre");
const popupFermer = document.getElementById("popup-fermer");

// Chaque bouton .orga porte son image et son titre dans data-image et data-titre
document.querySelectorAll(".orga").forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    popupImage.src = bouton.dataset.image;
    popupImage.alt = bouton.dataset.titre;
    popupTitre.textContent = bouton.dataset.titre;

    popup.showModal(); // ouvre la pop-up avec le fond sombre
  });
});

// Bouton ×
popupFermer.addEventListener("click", function () {
  popup.close();
});

// Clic à côté de l'image (sur le fond sombre) : on ferme aussi.
// Quand on clique sur le fond, la cible du clic est le <dialog> lui-même.
popup.addEventListener("click", function (evenement) {
  if (evenement.target === popup) {
    popup.close();
  }
});

// Page ouverte par chaque onglet (chemins depuis le dossier Index)
var PAGES = {
  1: 'onglet1.html',
  2: '../Onglet2/Onglet_2.html',
  3: '../Onglet3/onglet3.html',
  4: '../Onglet4/Onglet4.html',
  5: '../Onglet5/onglet5.html'
};

// Clic sur la carte du milieu → on ouvre la page
document.addEventListener('click', function (e) {
  var item = e.target.closest('.wheel-item');
  if (!item) return;

  // on cherche quelle carte est la plus proche du centre de la roue
  var roue = document.getElementById('wheel').getBoundingClientRect();
  var cx = roue.left + roue.width / 2;
  var cy = roue.top + roue.height / 2;

  function distance(el) {
    var r = el.getBoundingClientRect();
    return Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
  }

  var cartes = Array.from(document.querySelectorAll('.wheel-item'));
  var milieu = cartes.reduce(function (a, b) {
    return distance(a) < distance(b) ? a : b;
  });

  if (item === milieu) {
    window.location.href = PAGES[item.dataset.tab];
  }
}, true);

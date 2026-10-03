
const POSITIONS = ["centre", "haut-droite", "bas-droite", "bas-gauche", "haut-gauche"];


let ordre = [1, 2, 3, 4, 5];

function appliquerPositions() {
  ordre.forEach(function (numeroOnglet, i) {
    const item = document.querySelector('.wheel-item[data-tab="' + numeroOnglet + '"]');

    Array.from(item.classList).forEach(function (classe) {
      if (classe.startsWith("position-")) {
        item.classList.remove(classe);
      }
    });

    item.classList.add("position-" + POSITIONS[i]);

    if (i === 0) {
      item.setAttribute("aria-current", "true");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

function tourner(direction, nombreDeCrans) {
  if (nombreDeCrans === undefined) {
    nombreDeCrans = 1;
  }

  for (let n = 0; n < nombreDeCrans; n++) {
    if (direction === 1) {
      ordre.push(ordre.shift());
    } else {
      ordre.unshift(ordre.pop());
    }
  }

  appliquerPositions();
}

function mettreAuCentre(numeroOnglet) {
  const i = ordre.indexOf(numeroOnglet); 

  if (i === 0) {
    return; // rien à faire
  }


  if (i <= 2) {
    tourner(1, i);
  } else {
    tourner(-1, ordre.length - i);
  }
}

document.querySelectorAll(".wheel-btn").forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    const direction = Number(bouton.dataset.direction);
    tourner(direction);
  });
});

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

appliquerPositions();


const popup = document.getElementById("popup");
const popupImage = document.getElementById("popup-image");
const popupTitre = document.getElementById("popup-titre");
const popupFermer = document.getElementById("popup-fermer");

document.querySelectorAll(".orga").forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    popupImage.src = bouton.dataset.image;
    popupImage.alt = bouton.dataset.titre;
    popupTitre.textContent = bouton.dataset.titre;

    popup.showModal();
  });
});

popupFermer.addEventListener("click", function () {
  popup.close();
});

popup.addEventListener("click", function (evenement) {
  if (evenement.target === popup) {
    popup.close();
  }
});


//met le chemin de l'onglet 1 ici ou juste change les noms
var PAGES = {
  1: '../Onglet1/onglet1.html',
  2: '../Onglet2/Onglet_2.html',
  3: '../Onglet3/onglet3.html',
  4: '../Onglet4/Onglet4.html',
  5: '../Onglet5/onglet5.html'
};

document.addEventListener('click', function (e) {
  var item = e.target.closest('.wheel-item');
  if (!item) return;

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

const Partie = require('./modeles/partie');
const Joueur = require('./modeles/joueur');

const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '657947',
  key: '5309ab04bb80de5c4e76',
  secret: 'fb624ea8a12c4f3eb5ad',
  cluster: 'us2',
  encrypted: true
});

const modificateurVitesse = Math.max(process.argv[2], 1);

const listePartie = [];

listePartie.push(new Partie('0', new Joueur('Albert', 'Ramos', 28, 56, 'Espagne'), new Joueur('Milos', 'Raonic', 28, 16, 'Canada'), '1', 'Hale', '12h30', 200));
listePartie.push(new Partie('1', new Joueur('Andy', 'Murray', 28, 132, 'Angleterre'), new Joueur('Andy', 'Roddick', 36, 1000, 'États-Unis'), '2', 'Hale', '13h00', 500));
listePartie.push(new Partie('2', new Joueur('Novak', 'Djokovic', 31, 3, 'Serbie'), new Joueur('Jo-Wilfried', 'Tsonga', 33, 30, 'France'), '4', 'Hale', '14h15', 2000));
listePartie.push(new Partie('3', new Joueur('Roger', 'Federer', 37, 2, 'Suisse'), new Joueur('Rafael', 'Nadal', 32, 1, 'Espagne'), '3', 'Hale', '18h00', 5000));

const demarrer = function () {
  let tick = 0;
  setInterval(function () {
    for (const partie in listePartie) {
      if (listePartie[partie].tick_debut === tick) {
        demarrerPartie(listePartie[partie]);
      }
    }

    tick += 1;
  }, Math.floor(1000 / modificateurVitesse));
};

function demarrerPartie (partie) {
  const timer = setInterval(function () {
    partie.jouerTour();
    if (partie.estTerminee()) {
      if(partie.pointage.manches[0] > partie.pointage.manches[1]){
        partie.nomJoueurGagnant = partie.joueur1.nom;
      }else{
        partie.nomJoueurGagnant = partie.joueur2.nom;
      }
      console.log(partie.nomJoueurGagnant);
      if(partie.nbParis) {
        pusher.trigger('notifications', 'pari', {
          pari: "OK c'est fait",
          nomJoueur: partie.nomJoueurGagnant,
          montant: partie.montantPari
        });
      }
      partie.calculPari();
      clearInterval(timer);
    }
  }, Math.floor(1000 / modificateurVitesse));
}

module.exports = {};
module.exports.demarrer = demarrer;
module.exports.liste_partie = listePartie;

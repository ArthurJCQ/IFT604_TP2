const Pointage = require('./pointage.js');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '657947',
  key: '5309ab04bb80de5c4e76',
  secret: 'fb624ea8a12c4f3eb5ad',
  cluster: 'us2',
  encrypted: true
});

class Partie {
  constructor (id, joueur1, joueur2, terrain, tournoi, heureDebut, tickDebut) {
    this.id = id;
    this.joueur1 = joueur1;
    this.joueur2 = joueur2;
    this.terrain = terrain;
    this.tournoi = tournoi;
    this.heure_debut = heureDebut;
    this.pointage = new Pointage(this);
    this.temps_partie = 0;
    this.joueur_au_service = Math.floor(Math.random() * 2);
    this.vitesse_dernier_service = 0;
    this.nombre_coup_dernier_echange = 0;
    this.constestation = [3, 3];
    this.tick_debut = tickDebut;
    this.montantPari = 0;
    this.nbParis = 0;
    this.canPari = true;
    this.nomJoueurGagnant = "";
  }

  jouerTour () {
    let contestationReussi = false;
    if ((Math.random() * 100) < 3) { // 3% de contestation
      const contestant = Math.floor(Math.random() * 2);
      this.constestation[contestant] = Math.max(0, this.constestation[contestant] - 1);
      const nomJoueurContestant = (contestant === 1) ? this.joueur1.prenom : this.joueur2.prenom;
      console.log(nomJoueurContestant);
      if (!Partie.contester()) {
        console.log('contestation echouee');
      } else {
        contestationReussi = true;
        console.log('contestation reussie');
        pusher.trigger('contestations', 'contest', {
          contest: "Réussie",
          joueur: nomJoueurContestant
        });
      }
    }

    if (!contestationReussi) {
      this.pointage.ajouterPoint(Math.floor(Math.random() * 2));
      this.canPari = (this.pointage.manches[0] < 1 && this.pointage.manches[1] < 1);
    }
    this.temps_partie += Math.floor(Math.random() * 60); // entre 0 et 60 secondes entre chaque point
    this.vitesse_dernier_service = Math.floor(Math.random() * (250 - 60 + 1)) + 60; // entre 60 et 250 km/h
    this.nombre_coup_dernier_echange = Math.floor(Math.random() * (30 - 1 + 1)) + 1; // entre 1 et 30 coups par échange
  }

  static contester () {
    return (Math.random() * 100) > 25; // 75% de chance que la contestation passe
  }

  changerServeur () {
    this.joueur_au_service = (this.joueur_au_service + 1) % 2;
  }

  nouvelleManche () {
    this.constestation = [3, 3];
  }

  estTerminee () {
    return this.pointage.final;
  }

  creerPari (montantPari) {
      this.montantPari += montantPari;
      this.nbParis++;
  }

  calculPari (nomJoueurPari) {
      if (nomJoueurPari === this.joueur1.prenom) {
          if (this.pointage.manches[0] > this.pointage.manches[1]){
              return true;
          }
      }
      else if (nomJoueurPari === this.joueur2.prenom) {
          if (this.pointage.manches[1] > this.pointage.manches[0]){
              return true;
          }
      }
      else{
          console.log("Pari échoué");
          return false;
      }
  }

  toJSON () {
    return {
        'id': this.id,
        'joueur1': this.joueur1,
        'joueur2': this.joueur2,
        'terrain': this.terrain,
        'tournoi': this.tournoi,
        'heure_debut': this.heure_debut,
        'pointage': this.pointage,
        'temps_partie': this.temps_partie,
        'serveur': this.joueur_au_service,
        'vitesse_dernier_service': this.vitesse_dernier_service,
        'nombre_coup_dernier_echange': this.nombre_coup_dernier_echange,
        'constestation': this.constestation,
        'montantPari': this.montantPari,
        'nomJoueurGagnant': this.nomJoueurGagnant,
        'nbParis': this.nbParis,
        'canPari': this.canPari
    };
  }
}
module.exports = Partie;

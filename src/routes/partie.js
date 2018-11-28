const express = require('express');
const router = express.Router();

const gen = require('../generateur');

const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '657947',
  key: '5309ab04bb80de5c4e76',
  secret: 'fb624ea8a12c4f3eb5ad',
  cluster: 'us2',
  encrypted: true
});

/* GET parties listing. */
router.get('/', function (req, res, next) {
  res.send(gen.liste_partie);
});

router.get('/:id', function (req, res, next) {
  res.send(gen.liste_partie[req.params.id]);
});

/* POST pari for a Partie */
router.post('/:id/pari', function (req, res, next) {
    var montantPari = req.body.montantPari;
    gen.liste_partie[req.params.id].creerPari(montantPari);
    pusher.trigger('notifications', 'pari', {
      pari: "OK c'est fait",
    }, req.headers['x-socket-id']);
    res.status('200').send(req.body);
});

module.exports = router;

import React, { Component } from 'react';
import './App.css';
import '../match/Match.js';
import { Redirect } from 'react-router-dom';
import Pusher from 'pusher-js';
Pusher.logToConsole = true;

class MatchArray extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: [],
      networkDataReceived: false,
    }
    this.subscribePusher = this.subscribePusher.bind(this);

    this.pusher = new Pusher('5309ab04bb80de5c4e76', {
      cluster: 'us2',
      forceTLS: true
    });
  }

  componentDidMount() {
    this.subscribePusher();
    this.fetchMatchs()
      .then(res => {
        this.setState({
          response: res,
          networkDataReceived: true,
        });

      })
      .catch(err => console.log(err));
  }

  fetchMatchs = async () => {
    const response = await fetch('/parties');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  subscribePusher(pusher) {
    this.pusher.unsubscribe('constestations');
    var channel = this.pusher.subscribe('contestations');
    channel.bind('pusher:subscription_succeeded', function(data) {
      console.log("Subscription succeeded !");
    });
    channel.bind('contest', function(data) {
      var notification;
        console.log('CONTEST OK');
        notification = new Notification("Contestation", {
          body: "Contestation réussie pour " + data.joueur,
        });
        notification.onclick = function (event) {
            event.preventDefault();
            notification.close();
        }
      }
    });
  }

  render() {
    return (
      // Squelette du tableau
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Joueurs</th>
            <th scope="col">Heure</th>
            <th scope="col">Sets</th>
            <th scope="col">Jeux</th>
            <th scope="col">Tournoi</th>
          </tr>
        </thead>
        <Match matchs={this.state.response} click={this.props.toMatch}/>
      </table>
    );
  }
}


function Match(props) {
  const matchs = props.matchs;
  const listMatch = matchs.map((match) =>
    <tr key={match.id} onClick={(e) => props.click(match)}>
        <th scope="row">{match.pointage.end ? "Terminé" : match.temps_partie ? "En cours" : "A venir"}</th>
        <td>{match.joueur1.prenom } {match.joueur1.nom} - <b>VS</b> - {match.joueur2.prenom} {match.joueur2.nom}</td>
        <td>{match.heure_debut}</td>
        <td>{match.pointage.manches[0]} - {match.pointage.manches[1]}</td>
        <Jeu jeux={match.pointage.jeu}/>
        <td>{match.tournoi}</td>
    </tr>
  );

  return (
    <tbody>
      {listMatch}
    </tbody>
  );
}

function Jeu(props) {
  const jeux = props.jeux;
  const listJeux = jeux.map((jeu, i) =>
    <span key={i++}>{jeu[0]} - {jeu[1]}<br/></span>
  );
  return <td>{listJeux}</td>
}

function Header(props) {
  return (
    <h1>Matchs de Tennis</h1>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toMatch: false,
      match: [],
    }
    this.toMatch = this.toMatch.bind(this);
  }

  toMatch(match)  {
    this.setState({
      match: match,
      toMatch: true,
    });
  }

  render() {
    if (this.state.toMatch)
      return (
        <Redirect push to={{
            pathname: `/match`,
            state: {match: this.state.match}
          }} />
      );

    return (
      <div className="jumbotron">
        <div className="container-fluid text-center">
          <Header />
        </div>
        <hr className="my-4"/>
        <section className="container-fluid">
          <MatchArray toMatch={this.toMatch}/>
        </section>
      </div>
    );
  }
}

export default App;

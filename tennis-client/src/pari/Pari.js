import React, { Component } from 'react';
import './Pari.css';
import { Redirect } from 'react-router-dom';
import Pusher from 'pusher-js';
// Pusher.logToConsole = true;
var Loader = require('react-loader');

function FormPari(props) {
    return (
      <form onSubmit={props.handleSubmit}>
        <div className="row">
          <div className="form-group text-center container col-md-4 offset-md-4">
            <label htmlFor="selectPlayer">Sélectionner un joueur :</label>
            <select className="form-control"
                    id="selectPlayer"
                    onChange={props.handleChangeJoueur}
                    defaultValue={props.joueur1.prenom + " " + props.joueur1.nom}
                    required>
              <option>{props.joueur1.prenom} {props.joueur1.nom}</option>
              <option>{props.joueur2.prenom} {props.joueur2.nom}</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="form-group text-center container col-md-4 offset-md-4">
            <label htmlFor="montant">Montant :</label>
            <input type="number"
                   className="form-control"
                   id="montant"
                   required
                   onChange={props.handleChangeMontant}></input>
          </div>
        </div>
        <div className="row">
          <div className="form-group container-fluid text-center">
            <input type="submit"
                   disabled={props.pariDone}
                   className={"btn btn-lg " + (props.pariDone ? 'btn-warning' : 'btn-success')}
                   value={props.pariDone ? "Pari Effectué" : "Parier"} />
          </div>
        </div>
      </form>
    );
}

class Pari extends Component {
    constructor(props) {
      super(props);
      this.state = {
        match: [],
        data: false,
        montant: null,
        joueur: '',
        pariDone: false,
      }
      this.doPari = this.doPari.bind(this);
      this.changeJoueur = this.changeJoueur.bind(this);
      this.changeMontant = this.changeMontant.bind(this);
      this.subscribePusher = this.subscribePusher.bind(this);

      this.pusher = new Pusher('5309ab04bb80de5c4e76', {
        cluster: 'us2',
        forceTLS: true
      });
    }

    componentDidMount() {
      if (this.props.location.state) {
        const match = this.props.location.state.match;
        this.setState({
          match: match,
          data: true,
          joueur: match.joueur1.prenom + " " + match.joueur1.nom,
        });
      }
    }

    subscribePusher(pusher) {
      var channel = this.pusher.subscribe('notifications');
      channel.bind('pusher:subscription_succeeded', function(data) {
        console.log("Subscription succeeded !");
      });
      channel.bind('pari', function(data) {
        console.log(localStorage.getItem('joueurPari'));
        console.log(data.nomJoueur);
        var notification;
        if (localStorage.getItem('joueurPari') === data.nomJoueur) {
          console.log('PARI OK');
          //var gains = data.montant;
          var gains = this.state.montant*100/(data.montant*0.75);
          notification = new Notification("Gagné !!", {
            body: "Vous gagnez " + data.montant + "$ pour avoir parié sur " + data.nomJoueur,
          });
          notification.onclick = function (event) {
              event.preventDefault();
              notification.close();
          }
        }
        else{
          console.log('PARI KO');

          notification = new Notification("Perdu !!", {
            body: "Vous perdez votre mise pour avoir parié sur " + data.nomJoueur,
          });
          notification.onclick = function (event) {
              event.preventDefault();
              notification.close();
          }
        }
        localStorage.removeItem('joueurPari');
        localStorage.removeItem('montantPari');
      });
    }

    doPari(event) {
      event.preventDefault();
      this.callApi()
        .then(res => {
          this.setState({pariDone: true});
          localStorage.setItem("joueurPari", this.state.joueur.split(" ")[1]);
          localStorage.setItem("montantPari", this.state.montant);
          this.subscribePusher();
        })
        .catch(err => console.log("Erreur", err))
    }

    callApi = async () => {
      const response = await fetch(`parties/${this.state.match.id}/pari`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Socket-Id': this.pusher.connection.socket_id,
        },
        body: JSON.stringify({
          montantPari: this.state.montant
        }),
      });
      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
    };

    changeJoueur(event) {
      this.setState({
        joueur: event.target.value
      });
    }

    changeMontant(event) {
      this.setState({
        montant: event.target.value
      });
    }

    render(){
      if(!this.props.location.state)
      return (
        <Redirect push to={{
            pathname: `/`,
          }} />
      );

      return (
        <section className="jumbotron text-center">
          <h1>Fais ton pari !</h1>
          <hr className="my-4"/>
          <div>
            <Loader loaded={this.state.data}>
              <FormPari handleSubmit={this.doPari}
                        handleChangeJoueur={this.changeJoueur}
                        handleChangeMontant={this.changeMontant}
                        joueur1={this.state.match.joueur1}
                        joueur2={this.state.match.joueur2}
                        pariDone={this.state.pariDone} />
            </Loader>
          </div>
        </section>
      );
    }
}

export default Pari;

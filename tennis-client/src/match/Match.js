import React , { Component } from 'react';
import './Match.css';
import { Redirect } from 'react-router-dom';
var Loader = require('react-loader');

function Pointage(props) {
  return (
    <div className="container-fluid text-center">
      <Points points={props.match} />
      <Sets sets={props.match.pointage.manches} />
      <div className="row">
        <div className="col-md text-center">
          <p>Jeux</p>
        </div>
      </div>
      <Jeux jeux={props.match.pointage.jeu} />
      <Contestations contest={props.match.constestation} />
    </div>
  );
}

function Points(props) {
  var pointsJoueur1 = props.points.pointage.echange[0] * 15;
  var pointsJoueur2 = props.points.pointage.echange[1] * 15;

  if (pointsJoueur1 > 40)
    pointsJoueur1 = 40
  if (pointsJoueur2 > 40)
    pointsJoueur2 = 40

  if(props.points.pointage.end) {
    return (
      <div className="row">
        <div className="col-md-4 offset-md-4 text-center">
          <h2 className="text-danger">Match terminé</h2>
          <span><i>Durée : {Math.floor(props.points.temps_partie / 60)} minutes</i></span>
          <hr className="my-4"/>
        </div>
      </div>
    );
  }

  if(!props.points.temps_partie) {
    return (
      <div className="row">
        <div className="col-md-4 offset-md-4 text-center">
          <h2 className="text-warning">Match à venir</h2>
          <hr className="my-4"/>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-4 offset-md-4 text-center">
          <h2 className="text-success">Match en cours</h2>
          <span><i>Depuis {Math.floor(props.points.temps_partie / 60)} minutes</i></span>
          <hr className="my-4"/>
        </div>
      </div>
      <div className="row">
        <div className="col-md text-center">
          <p>Points</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 offset-md-2">
          <p>{pointsJoueur1}</p>
        </div>
        <div className="col-md-2">
          <p>-</p>
        </div>
        <div className="col-md-3">
          <p>{pointsJoueur2}</p>
        </div>
      </div>
    </div>
  );
}

function Jeux(props) {
  const jeux = props.jeux;
  const listJeux = jeux.map((jeu, i) =>
    <div key={i++}>
      <div className="row">
        <div className="col-md-3 offset-md-2">
          <p>{jeu[0]}</p>
        </div>
        <div className="col-md-2">
          <p>-</p>
        </div>
        <div className="col-md-3">
          <p>{jeu[1]}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {listJeux}
    </div>
  )
}

function Sets(props) {
  return (
    <div>
      <div className="row">
        <div className="col-md text-center">
          <p>Sets</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 offset-md-2">
          <p>{props.sets[0]}</p>
        </div>
        <div className="col-md-2">
          <p>-</p>
        </div>
        <div className="col-md-3">
          <p>{props.sets[1]}</p>
        </div>
      </div>
    </div>
  );
}

function Contestations(props) {
  return (
    <div>
      <div className="row">
        <div className="col-md text-center">
          <p>Contestations restantes</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 offset-md-2">
          <p>{props.contest[0]}</p>
        </div>
        <div className="col-md-2">
          <p>-</p>
        </div>
        <div className="col-md-3">
          <p>{props.contest[1]}</p>
        </div>
      </div>
    </div>
  );
}

function Actions(props) {
  return (
    <div className="container-fluid text-center">
        <button disabled={props.pointage.end}
                className="btn btn-success btn-lg"
                onClick={(e) => props.update()}>Update</button>
        <button disabled={props.pointage.manches[0] > 0 || props.pointage.manches[1] > 0}
                className="offset-md-4 btn btn-danger btn-lg"
                onClick={(e) => props.parier()}>Parier</button>
    </div>
    );
}

function MatchTemplate(props) {
  return (
    <div>
      <div className="container-fluid text-center">
        <h1 className="display-4">{props.match.joueur1.prenom} {props.match.joueur1.nom}<b> - VS - </b>{props.match.joueur2.prenom} {props.match.joueur2.nom}</h1>
      </div>
      <hr className="my-4"/>
      <Pointage match={props.match} />
      <hr className="my-4"/>
      <Actions pointage={props.match.pointage} update={props.update} parier={props.parier}/>
    </div>
  )
}

class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: [],
      matchUpdated: true,
      toPari: false,
    }
    this.setMatch = this.setMatch.bind(this);
    this.parier = this.parier.bind(this);
  }

  componentDidMount() {
    this.setMatch();
    this.timerID = setInterval(
      () => this.tick(),
      5000
    );
  }

  tick() {
    if (!this.state.match.pointage.end)
      this.setMatch();
    else
      clearInterval(this.timerID);
  }

  parier() {
    this.setState({
      toPari: true,
    });
  }

  setMatch() {
    this.fetchMatch()
      .then(res => {
        this.setState({
          match: res,
          matchUpdated: true,
        });
      })
      .catch(err => {
        console.log(err)
        // this.setState({
        //   matchUpdated: false,
        // });
      });
  }

  fetchMatch = async () => {
    const response = await fetch(`/parties/${this.props.location.state.match.id}`);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  render() {
    if(!this.props.location.state)
    return (
      <Redirect push to={{
          pathname: `/`,
        }} />
    );

    if (this.state.toPari)
      return (
        <Redirect push to={{
            pathname: `/pari`,
            state: {match: this.state.match}
          }} />
      );

    return (
      <section className="jumbotron">
        <Loader loaded={this.state.matchUpdated}>
          <MatchTemplate match={this.state.match} update={this.setMatch} parier={this.parier}/>
        </Loader>
      </section>
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
}

export default Match;

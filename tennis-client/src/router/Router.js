import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import App from '../home/App';
import Match from '../match/Match';
import Pari from '../pari/Pari';

class AppRouter extends Component {
  constructor(props) {
    super(props);
    Notification.requestPermission();
  }
  render() {
    return (
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/match" component={Match} />
          <Route path="/pari" component={Pari} />
          {/* when none of the above match, <NoMatch> will be rendered */}
          <Route component={App} />
        </Switch>
    );
  }
}

export default AppRouter;

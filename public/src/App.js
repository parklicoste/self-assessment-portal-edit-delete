import React from 'react';
//import axios from 'axios';
import Project from './Project';
import Nav from './Nav';
import Home from './Home'
import Faculty from './Faculty'
import Comments from './Comments'
import User from './User'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import UserAccessRole from './UserAccessRole';




class App extends React.Component {

render() {
  return(
    <div className="row mt-5">
      <Router>
        <div className="container">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/user"  component={User} />
            <Route path="/faculty"  component={Faculty} />
            <Route path="/comments"  component={Comments} />
            <Route path="/useraccessrole" component={UserAccessRole} />
            <Route path="/project" component={Project} />
          </Switch>
        </div>
      </Router>
    </div>
  )}
}

export default App;

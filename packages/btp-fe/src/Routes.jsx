import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from 'containers/HomePage';
import NetworkPage from 'containers/NetworkPage';
import NotFoundPage from 'containers/NotFoundPage';
import Governance from 'containers/Governance';
import Transfer from 'containers/Transfer';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/transfer" exact component={Transfer} />
        <Route path="/overview" exact component={Transfer} />
        <Route path="/network" exact component={Transfer} />
        <Route path="/governance" exact component={Governance} />
        <Route path="/network" exact component={NetworkPage} />
        <Route path="/governance" exact component={Transfer} />
        <Route path="/auction" exact component={Transfer} />
        <Route path="/profile" exact component={Transfer} />
        <Route path="/setting" exact component={Transfer} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;

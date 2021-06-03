import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from 'components/Layout';

import HomePage from 'containers/HomePage';
import NetworkPage from 'containers/NetworkPage';
import NotFoundPage from 'containers/NotFoundPage';
import Governance from 'containers/Governance';
import Transfer from 'containers/Transfer';
import Overview from 'containers/Overview';

function Routes() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/transfer" exact component={Transfer} />
          <Route path="/overview" exact component={Overview} />
          <Route path="/network" exact component={NetworkPage} />
          <Route path="/governance" exact component={Governance} />
          <Route path="/auction" exact component={Transfer} />
          <Route path="/profile" exact component={Transfer} />
          <Route path="/setting" exact component={Transfer} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default Routes;

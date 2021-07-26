import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from 'components/Layout';

import NetworkPage from 'containers/NetworkPage';
import NotFoundPage from 'containers/NotFoundPage';
import Governance from 'containers/Governance';
import Transfer from 'containers/Transfer';
import TransferHistory from 'containers/TransferHistory';
import Overview from 'containers/Overview';
import FeeAuctionPage from 'containers/FeeAuctionPage';
import FeeAuctionDetails from 'containers/FeeAuctionDetails';

import { ModalWrapper } from 'components/NotificationModal';

function Routes() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Redirect from="/" to="/transfer" exact />
          <Route path="/transfer" exact component={Transfer} />
          <Route path="/transfer/history" exact component={TransferHistory} />
          <Route path="/overview" exact component={Overview} />
          <Route path="/network" exact component={NetworkPage} />
          <Route path="/governance" exact component={Governance} />
          <Route path="/auction" exact component={FeeAuctionPage} />
          <Route path="/auction/:id" exact component={FeeAuctionDetails} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
        <ModalWrapper />
      </Layout>
    </BrowserRouter>
  );
}

export default Routes;

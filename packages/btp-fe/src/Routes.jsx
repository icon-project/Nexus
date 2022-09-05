import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from 'components/Layout';

import NetworkPage from 'containers/NetworkPage';
import NotFoundPage from 'containers/NotFoundPage';
import Transfer from 'containers/Transfer';
import TransferHistory from 'containers/TransferHistory';
import TermsOfUse from 'containers/TermsOfUse';
import E2ETestingSetup from 'containers/E2ETestingSetup';
import HanaControlPannel from 'containers/E2ETestingSetup/HanaControlPannel';
import OpportunitiesPage from 'containers/OpportunitiesPage';

// import Overview from 'containers/Overview';
// import FeeAuctionPage from 'containers/FeeAuctionPage';
// import FeeAuctionDetails from 'containers/FeeAuctionDetails';
// import Governance from 'containers/Governance';

import { ModalWrapper } from 'components/NotificationModal';
import ErrorBoundary from './ErrorBoundary';
import { E2ETestingRoute } from 'utils/constants';

function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <Switch>
            <Redirect from="/" to="/transfer" exact />
            <Route path="/transfer" exact component={Transfer} />
            <Route path="/history" exact component={TransferHistory} />
            <Route path="/network" exact component={NetworkPage} />
            <Route path="/opportunities" exact component={OpportunitiesPage} />
            <Route path="/terms-of-use" exact component={TermsOfUse} />
            <Route path={E2ETestingRoute} exact component={E2ETestingSetup} />

            {/* <Route path="/overview" exact component={Overview} /> */}
            {/* <Route path="/governance" exact component={Governance} /> */}
            {/* <Route path="/auction" exact component={FeeAuctionPage} /> */}
            {/* <Route path="/auction/:id" exact component={FeeAuctionDetails} /> */}
            <Route path="*" component={NotFoundPage} />
          </Switch>
          <ModalWrapper />
          <HanaControlPannel />
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;

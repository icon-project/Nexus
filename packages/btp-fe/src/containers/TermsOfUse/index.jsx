import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';

import { Text, Header } from 'components/Typography';
import { Helmet } from 'components/Helmet';
import { media } from 'components/Styles/Media';
import { Icon } from 'components/Icon';
import closeIcon from 'assets/images/close-icon.svg';

const PageWrapper = styled.div`
  text-align: center;
  padding: 80px 20%;

  .heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 50px;

    .header-text {
      text-align: center;
      margin-top: 30px;
    }

    > img {
      cursor: pointer;
    }
  }

  .plain-text {
    margin-bottom: 15px;
    text-align: justify;
    text-justify: inter-word;
  }

  ${media.md`
    padding: 80px 20px;
  `};
`;

const TermsOfUse = () => {
  const history = useHistory();

  const onClose = () => {
    const { prevPath } = history.location?.state || {};
    if (prevPath && prevPath !== '/terms-of-use') {
      history.goBack();
    } else {
      history.push('/');
    }
  };
  return (
    <PageWrapper>
      <Helmet title="Terms of use" />
      <div className="heading">
        <span></span>
        <Header className="sm">TERMS OF USE</Header>
        <Icon iconURL={closeIcon} size="s" onClick={onClose} />
      </div>

      <Text className="md">
        All goods or services provided through the Nexus application (the “Protocol”) are provided
        on an “as is,” “as available” basis. The Protocol is constantly under active development,
        and it is currently undergoing its “beta” testing phase, meaning that while the core
        features of the Protocol have been implemented, undetected bugs, errors, and vulnerabilities
        may remain undiscovered until this phase of testing is complete.
      </Text>

      <Text className="md">
        The Protocol may now or in the future contain undetected errors, bugs, or vulnerabilities.
        It is possible that the ICON Project (the “Project”) or the ICON Foundation (the
        “Foundation”) will not detect errors in the Protocol or the underlying technology until
        after code has been fully released for external or internal use. Any errors, bugs,
        vulnerabilities, or other design defects discovered in the Protocol’s code after release may
        result in a negative experience for the Protocol’s users.
      </Text>

      <Text className="md">
        Users are responsible for knowing their private key address and keeping such address a
        secret. Because a private key, or a combination of private keys, is necessary to control and
        dispose of the digital assets stored in the user’s digital asset wallet, the loss of one or
        more of a user’s private keys associated with her, his or its digital asset wallet storing
        the user’s digital assets will result in the loss of the user’s digital assets. Moreover,
        any third party that gains access to one or more of a user’s private keys, including by
        gaining access to login credentials of a hosted wallet service a user uses, may be able to
        misappropriate a user’s digital assets. The Project and its affiliates will never ask a user
        for her, his or its private key address and a user should never share them with someone the
        user does not know and trust.
      </Text>
      <Text className="md">
        Transactions in digital assets performed via the Protocol may be irreversible, and,
        accordingly, losses due to fraudulent or accidental transactions may not be recoverable.
        Once a transaction has been verified and recorded in a block that is added to the
        blockchain, an incorrect transfer or a theft of digital assets generally will not be
        reversible. If a party is able to hack a user’s account and initiate a transaction, the user
        may not be capable of receiving compensation for any such transfer or theft. If there is an
        error and a transaction occurs with the wrong account, to the extent that the Project is
        unable to seek a corrective transaction with such third party or is incapable of identifying
        the third party which has received the digital assets transferred through error or theft,
        neither the Project nor the Foundation will be able to revert or otherwise recover
        incorrectly transferred digital assets. The user is solely responsible for providing the
        Protocol with accurate information with respect to the destination digital asset wallet
        intended for the receipt of the user’s digital assets. If information provided by a user
        proves incorrect, and as a result, the digital assets are not delivered to the intended
        destination digital asset wallet, neither the Project nor the Foundation will have any
        liability to the user for the loss of such digital assets suffered by the user.
      </Text>
      <Text className="md">
        THE USER’S USE OF THE PROTOCOL AND ANY RELATED SERVICES IS AT THE USER’S SOLE RISK. THE
        PROTOCOL IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. TO THE FULLEST EXTENT LEGALLY
        PERMISSIBLE, THE PROJECT AND THE FOUNDATION DO NOT MAKE (AND EXPLICITLY DISCLAIM) ANY AND
        ALL REPRESENTATIONS OR WARRANTIES OF ANY KIND RELATED TO THE PROTOCOL, WHETHER EXPRESS,
        IMPLIED, OR STATUTORY, INCLUDING (WITHOUT LIMITATION) THE WARRANTIES OF MERCHANTABILITY,
        NON-INFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE. NEITHER THE PROJECT NOR THE
        FOUNDATION (NOR ANY PERSON ASSOCIATED WITH EITHER ENTITY) MAKES ANY WARRANTY OR
        REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY,
        OR AVAILABILITY OF THE PROTOCOL OR ANY RELATED SERVICES. TO THE FULLEST EXTENT PROVIDED BY
        LAW, IN NO EVENT WILL THE PROJECT, THE FOUNDATION, OR ANY AFFILIATES, OR THEIR LICENSORS,
        SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY
        KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH THE USER’S USE, OR
        INABILITY TO USE, THE PROTOCOL, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE PROJECT’S
        WEBSITE OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND
        SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR
        ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT
        (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE. THIS
        DISCLAIMER OF LIABILITY EXTENDS TO ANY AND ALL DAMAGES CAUSED BY ANY THIRD PARTY (INCLUDING,
        WITHOUT LIMITATION, THOSE CAUSED BY FRAUD, DECEIT, OR MANIPULATION), WHETHER OR NOT A
        PARTICIPANT, OR ANY FAILURE, EXPLOIT, OR VULNERABILITY OF THE PROTOCOL, THE USER’S WEB3
        UTILITIES, OR THE UNDERLYING BLOCKCHAINS OR RELATED BLOCKCHAIN FUNCTIONALITIES. TO THE
        FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL THE COLLECTIVE LIABILITY OF THE PROJECT,
        THE FOUNDATION AND ITS SUBSIDIARIES AND AFFILIATES, AND THEIR LICENSORS, SERVICE PROVIDERS,
        EMPLOYEES, AGENTS, OFFICERS, AND DIRECTORS, TO ANY PARTY (REGARDLESS OF THE FORM OF ACTION,
        WHETHER IN CONTRACT, TORT, OR OTHERWISE) EXCEED THE GREATER OF $100 OR THE AMOUNT THE USER
        HAS PAID DIRECTLY TO THE PROJECT FOR THE USE OF THE PROTOCOL IN THE LAST SIX MONTHS OUT OF
        WHICH LIABILITY AROSE. THE FOREGOING DOES NOT AFFECT ANY LIABILITY THAT CANNOT BE EXCLUDED
        OR LIMITED UNDER APPLICABLE LAW.
      </Text>
    </PageWrapper>
  );
};

export default TermsOfUse;

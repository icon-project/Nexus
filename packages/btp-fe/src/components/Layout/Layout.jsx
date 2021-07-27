import styled from 'styled-components';

import { Layout as AtndLayout } from 'antd';
import { Header } from '../Header';
import { colors } from '../Styles/Colors';
import { media } from 'components/Styles/Media';

const StyledLayout = styled(AtndLayout)`
  > main {
    background-color: ${colors.grayDark};
    min-height: calc(100vh - 80px); // minus header height
  }

  ${media.smallDesktop`
    > main {
      padding: 0 16px;
    }
  `};
`;

const Layout = ({ children }) => {
  return (
    <StyledLayout>
      <Header />
      <main>{children}</main>
    </StyledLayout>
  );
};

export default Layout;

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { media } from '../Styles/Media';

const StyledFooter = styled(Layout.Footer)`
  text-align: ${(props) => props.align};
  font-size: 1.4rem;

  ${media.xxs`
    a {
      float: right;
    }
  `}
`;

const Footer = ({ companyName, align, children, year, ...rest }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <StyledFooter {...rest} align={align}>
      ©{year || currentYear} {t('footer.created_by', 'Created by')} {companyName}
      {children}{' '}
      <a
        href="https://git.baikal.io/web/admin-boilerplate/-/blob/canary/packages/admin-boilerplate/CHANGELOG.md"
        target="_blank"
        rel="noreferrer nofollow"
      >
        v{process.env.VERSION}
      </a>
    </StyledFooter>
  );
};

Footer.propTypes = {
  align: PropTypes.string,
  companyName: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Footer.defaultProps = {
  align: 'center',
  companyName: 'Ant UED',
};

export default Footer;

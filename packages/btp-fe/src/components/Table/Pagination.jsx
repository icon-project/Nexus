import styled from 'styled-components';
import { Pagination as AntdPagination } from 'antd';
import { smallBoldSubtitle } from 'components/Typography/SubTitle';
import { colors } from 'components/Styles/Colors';

const { primaryBrandLight, primaryBrandBG, primaryBrandBase } = colors;

const StyledPagination = styled(AntdPagination)`
  margin-top: 24px;
  text-align: center;

  > .ant-pagination-item,
  > .ant-pagination-prev,
  > .ant-pagination-next {
    display: inline-flex;
    align-items: center;

    cursor: pointer !important;
    ${smallBoldSubtitle};
    color: ${primaryBrandLight};
    transition: none;
    background-color: transparent;
    border: 1px solid ${primaryBrandLight};
    border-radius: 4px;

    min-width: unset;
    height: 36px;
    width: 36px;

    > a {
      color: inherit;
      padding: 0;
      width: 100%;
    }

    .ant-pagination-item-link {
      display: none;
    }

    &.ant-pagination-item-active {
      color: ${primaryBrandBG};
      background-color: ${primaryBrandBase};
      border-color: ${primaryBrandBase};
    }
  }
`;

export const Pagination = (props) => {
  return <StyledPagination {...props} />;
};

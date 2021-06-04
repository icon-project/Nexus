import styled from 'styled-components';
import { Table as antdTable } from 'antd';
import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';
import { smallText, mediumText } from '../Typography/Text';
const TableStyled = styled(antdTable)`
  width: 100%;
  .ant-table-content {
    font-family: Poppins;
  }
  .ant-table-tbody {
    background-color: ${(props) => props.backgroundColor};
    ${(props) => (props.bodyText === 'sm' ? smallText : mediumText)}
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${colors.grayLine};
    cursor: pointer;
  }
  .ant-table-thead > tr > th {
    background: ${(props) => props.headerColor};
    border-bottom: 1px solid ${colors.grayLine};
    ${(props) => (props.headerText === 'sm' ? smallText : mediumText)}
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 13px 14px;
  }
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: ${(props) => props.hoverColor};
  }
  .ant-pagination-item-active,
  .ant-pagination-item,
  .ant-pagination-item-link {
    font-family: Poppins;
    font-weight: 600;
    ${smallText};
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
    width: 36px;
    height: 36px;
  }
  .ant-pagination-disabled {
    a,
    .anticon {
      color: ${colors.primaryBrandLight};
    }
  }
  .ant-pagination-prev,
  .ant-pagination-next {
    margin-right: 0;
  }
  .ant-pagination-item,
  .ant-pagination-item-link {
    border: 1px solid ${colors.primaryBrandLight};
    background: transparent;
    a,
    .anticon {
      color: ${colors.primaryBrandLight};
    }
    :hover {
      border: 1px solid ${colors.primaryBrandBase};
      a,
      .anticon {
        color: ${colors.primaryBrandBase};
      }
    }
  }
  .ant-pagination-item-active {
    border: none;
    background: ${colors.primaryBrandBase};
    a {
      color: ${colors.primaryBrandBG};
    }
    :hover {
      a {
        color: ${colors.primaryBrandBG};
      }
    }
  }
  ${media.md`
    .ant-table-content {
      overflow-x: auto;
    }
  `};
`;
export const Table = ({
  headerColor,
  headerText,
  backgroundColor,
  bodyText,
  children,
  hoverColor,
  ...rest
}) => {
  return (
    <TableStyled
      headerColor={headerColor}
      headerText={headerText}
      backgroundColor={backgroundColor}
      bodyText={bodyText}
      hoverColor={hoverColor}
      {...rest}
    >
      {children}
    </TableStyled>
  );
};

Table.defaultProps = {
  headerText: 'sm',
  bodyText: 'sm',
  hoverColor: colors.grayBG,
};

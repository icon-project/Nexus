import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table as antdTable } from 'antd';
import { colors } from '../Styles/Colors';

import { media } from '../Styles/Media';
import { smallText, mediumText } from '../Typography/Text';
import { Loader } from 'components/Loader';

import UnionSrc from 'assets/images/union.svg';
import PrevIconSrc from 'assets/images/prev-icon.svg';

const TableStyled = styled(antdTable)`
  width: 100%;
  /* hide empty row */
  .ant-table-placeholder,
  .ant-pagination-options {
    display: none;
  }

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

    span {
      color: ${colors.primaryBrandLight} !important;
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

  .ant-pagination {
    margin: 24px 0 0;
  }

  .pagination-inline {
    display: inline-flex;

    .next-btn {
      transform: rotateY(180deg);
    }
  }

  table {
    tr {
      ${({ columns }) =>
        columns[0].width
          ? columns.map((col, idx) => `td:nth-child(${idx + 1}){width:${col.width};}`).join()
          : ''}
    }
  }

  ${media.md`
    .ant-table-content {
      overflow-x: auto;
    }
  `};
`;

let myTimer;

export const Table = ({
  headerColor,
  headerText,
  backgroundColor,
  bodyText,
  children,
  hoverColor,
  pagination = {},
  columns,
  loading,
  itemPerPage = 5,
  getItemsHandler,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const { totalItem, limit } = pagination;

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (getItemsHandler) getItemsHandler(current);
  }, [current]);

  // we don't set loading immediately to avoid blinking UI
  useEffect(() => {
    if (loading) {
      myTimer = setTimeout(() => {
        if (loading) setIsLoading(true);
      }, 300);
    } else {
      clearTimeout(myTimer);
      setIsLoading(false);
    }
  }, [loading]);

  function itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return (
        <div className="pagination-inline">
          <a className="ant-pagination-item">
            <img src={UnionSrc} />
          </a>
          <a className="ant-pagination-item">
            <img src={PrevIconSrc} />
          </a>
        </div>
      );
    }
    if (type === 'next') {
      return (
        <div className="pagination-inline">
          <a className="ant-pagination-item">
            <img className="next-btn" src={PrevIconSrc} />
          </a>
          <a className="ant-pagination-item">
            <img className="next-btn" src={UnionSrc} />
          </a>
        </div>
      );
    }
    return originalElement;
  }
  return (
    <TableStyled
      headerColor={headerColor}
      headerText={headerText}
      backgroundColor={backgroundColor}
      bodyText={bodyText}
      hoverColor={hoverColor}
      columns={columns}
      loading={isLoading && { indicator: <Loader size="25px" borderSize="3px" /> }}
      pagination={
        totalItem && itemPerPage < totalItem
          ? {
              ...pagination,
              position: ['bottomCenter'],
              itemRender,
              pageSize: limit,
              onChange: (page) => {
                setCurrent(page);
              },
              total: totalItem,
            }
          : false
      }
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

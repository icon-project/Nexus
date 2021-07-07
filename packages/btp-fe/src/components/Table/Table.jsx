import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table as antdTable } from 'antd';

import { Pagination } from './Pagination';
import { smallText, mediumText } from '../Typography/Text';
import { Loader } from 'components/Loader';

import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';
import { stableSort, getComparator } from './natureSorting';

const TableStyled = styled(antdTable)`
  width: 100%;

  /* hide empty row */
  .ant-table-placeholder {
    display: none;
  }

  .ant-table-tbody {
    background-color: ${(props) => props.backgroundColor};
    ${(props) => (props.bodyText === 'sm' ? smallText : mediumText)}
  }

  .ant-table-thead > tr > th {
    background: ${(props) => props.headerColor};
    ${(props) => (props.headerText === 'sm' ? smallText : mediumText)}
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    font-family: Poppins;
    border-bottom: 1px solid ${colors.grayLine};
    padding: 13px 14px;
  }

  .ant-table-thead,
  .ant-table-tbody {
    & > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
    & > tr:hover:not(.ant-table-expanded-row) > td {
      background: ${(props) => props.hoverColor};
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
  getItemsHandler,
  sortOptions = {},
  dataSource,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const { totalItem, limit } = pagination;
  const { order, orderBy } = sortOptions;

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (getItemsHandler) getItemsHandler(current)();
  }, [current]);

  // we don't set loading immediately to avoid blinking UI
  useEffect(() => {
    if (loading) {
      myTimer = setTimeout(() => {
        if (loading) setIsLoading(true);
      }, 500);
    } else {
      clearTimeout(myTimer);
      setIsLoading(false);
    }
  }, [loading]);

  return (
    <>
      <TableStyled
        headerColor={headerColor}
        headerText={headerText}
        backgroundColor={backgroundColor}
        bodyText={bodyText}
        hoverColor={hoverColor}
        columns={columns}
        dataSource={order ? stableSort(dataSource, getComparator(order, orderBy)) : dataSource}
        loading={isLoading && { indicator: <Loader size="25px" borderSize="3px" /> }}
        pagination={false}
        {...rest}
      >
        {children}
      </TableStyled>

      {totalItem && limit < totalItem && (
        <Pagination
          pageSize={limit}
          onChange={(page) => {
            setCurrent(page);
          }}
          setCurrent={setCurrent}
          current={current}
          total={totalItem}
          showSizeChanger={false}
          showLessItems
        />
      )}
    </>
  );
};

Table.defaultProps = {
  headerText: 'sm',
  bodyText: 'sm',
  hoverColor: colors.grayBG,
};

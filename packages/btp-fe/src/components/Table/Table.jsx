import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Table as antdTable } from 'antd';

import { Pagination } from './Pagination';
import { TextMixin } from 'components/Typography/Text';
import { Loader } from 'components/Loader';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';
import { stableSort, getComparator } from './natureSorting';

const TableStyled = styled(antdTable)`
  width: 100%;

  > .ant-spin-nested-loading {
    position: relative;

    .ant-spin {
      position: absolute;
      display: grid;
      place-items: center;
      z-index: 4;
      width: 100%;
      height: 100%;
    }

    .ant-spin-blur {
      opacity: 0.5;
      user-select: none;
    }
  }

  /* hide empty row */
  .ant-table-placeholder {
    display: none;
  }

  .ant-table-tbody {
    background-color: ${(props) => props.backgroundColor};
    ${(props) => (props.bodyText === 'sm' ? TextMixin.sm : TextMixin.md)}
  }

  .ant-table-thead > tr > th {
    background: ${(props) => props.headerColor};
    ${(props) => (props.headerText === 'sm' ? TextMixin.sm : TextMixin.md)}
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    height: 48px;
    border: none;
    border-bottom: 1px solid ${colors.grayLine};
    padding: 11.5px 14px;
    word-break: break-all;
    text-align: left;
  }

  .ant-table-thead,
  .ant-table-tbody {
    & > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
    & > tr:hover:not(.ant-table-expanded-row) > td {
      background: ${(props) => props.hoverColor};
    }
  }

  table {
    border-spacing: 0;
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
    <div className="table-component">
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

      {totalItem && limit < totalItem ? (
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
      ) : (
        ''
      )}
    </div>
  );
};

Table.defaultProps = {
  headerText: 'sm',
  bodyText: 'sm',
  hoverColor: colors.grayBG,
};

import styled from 'styled-components';
import { Pagination as AntdPagination } from 'antd';
import { smallBoldSubtitle } from 'components/Typography/SubTitle';
import { colors } from 'components/Styles/Colors';

import prevIcon from 'assets/images/prev-icon.svg';
import fastForward from 'assets/images/union.svg';

const { primaryBrandLight, primaryBrandBG, primaryBrandBase } = colors;

const Wrapper = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  .fast-forward {
    height: 36px;
    width: 36px;
    background-color: transparent;
    border: 1px solid ${primaryBrandLight};
    border-radius: 4px;
    margin-right: 8px;
    background: transparent center / 37% no-repeat url('${fastForward}');
  }

  .fast-forward__next {
    margin-right: 0;
    margin-left: 8px;
    transform: rotate(180deg);
  }
`;

const StyledPagination = styled(AntdPagination)`
  display: inline-block;

  > .ant-pagination-item,
  > .ant-pagination-prev,
  > .ant-pagination-next {
    display: inline-flex;
    align-items: center;
    justify-content: center;

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

  > .ant-pagination-prev,
  > .ant-pagination-next {
    position: relative;

    :after {
      content: '';
      position: absolute;
      width: 6.67px;
      height: 11.67px;
      background: transparent center / cover no-repeat url('${prevIcon}');
    }

    &.ant-pagination-next {
      :after {
        transform: rotate(180deg);
      }
    }
  }
`;

export const Pagination = ({ current, total, pageSize, setCurrent, ...props }) => {
  const fastForwardStep = 2;
  const totalPage = Math.ceil(total / pageSize);

  const handleFastForward = (step) => {
    const page = current + step;
    if (page < 1) return;
    if (page > totalPage) {
      setCurrent(totalPage);
      return;
    }
    setCurrent(page);
  };
  return (
    <Wrapper>
      <button
        className="fast-forward fast-forward__prev"
        onClick={() => {
          handleFastForward(-fastForwardStep);
        }}
      ></button>
      <StyledPagination current={current} total={total} pageSize={pageSize} {...props} />
      <button
        className="fast-forward fast-forward__next"
        onClick={() => {
          handleFastForward(fastForwardStep);
        }}
      ></button>
    </Wrapper>
  );
};

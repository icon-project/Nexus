import styled from 'styled-components/macro';
import { Pagination as AntdPagination } from 'antd';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { colors } from 'components/Styles/Colors';

import prevIcon from 'assets/images/prev-icon.svg';
import bPrevIcon from 'assets/images/blue-prev-icon.svg';
import fastForward from 'assets/images/union.svg';
import bFastForward from 'assets/images/blue-fast-forward.svg';

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

    :hover {
      border-color: ${primaryBrandBase};
      background-image: url('${bFastForward}');
    }
  }

  .fast-forward__next {
    margin-right: 0;
    margin-left: 8px;
    transform: rotate(180deg);
  }
`;

const StyledPagination = styled(AntdPagination)`
  display: inline-flex;
  align-items: center;

  & > li:not(:last-child) {
    margin-right: 8px;
    text-align: center;
  }

  > .ant-pagination-item,
  > .ant-pagination-prev,
  > .ant-pagination-next,
  > .ant-pagination-jump-next,
  > .ant-pagination-jump-prev {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    cursor: pointer !important;
    ${SubTitleMixin.smBold};

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

    .ant-pagination-item-container {
      svg {
        display: none;
      }

      .ant-pagination-item-ellipsis {
        color: ${primaryBrandLight};
      }
    }

    button.ant-pagination-item-link {
      display: none;
    }

    :hover {
      border-color: ${primaryBrandBase};
      color: ${primaryBrandBase};

      .ant-pagination-item-ellipsis {
        color: ${primaryBrandBase};
      }
    }

    :active {
      background-color: rgba(84, 101, 255, 0.2);
    }

    &.ant-pagination-item-active {
      color: ${primaryBrandBG};
      background-color: ${primaryBrandBase};
      border-color: ${primaryBrandBase};
    }
  }

  > .ant-pagination-jump-next,
  > .ant-pagination-jump-prev {
    .anticon {
      opacity: 0 !important;
    }

    :hover,
    :focus {
      .ant-pagination-item-ellipsis {
        opacity: 1;
      }
    }

    .ant-pagination-item-ellipsis {
      color: ${primaryBrandLight};
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

    :hover {
      :after {
        background-image: url('${bPrevIcon}');
      }
    }

    &.ant-pagination-next {
      :after {
        transform: rotate(180deg);
      }
    }
  }
`;

export const Pagination = ({ current, total, pageSize, setCurrent, ...props }) => {
  const totalPage = Math.ceil(total / pageSize);
  //const fastForwardStep = 2;
  // const handleFastForward = (step) => {
  //   const page = current + step;
  //   if (page < 1) return;
  //   if (page > totalPage) {
  //     setCurrent(totalPage);
  //     return;
  //   }
  //   setCurrent(page);
  // };
  return (
    <Wrapper>
      <button
        className="fast-forward fast-forward__prev"
        onClick={() => {
          setCurrent(1);
        }}
      ></button>
      <StyledPagination current={current} total={total} pageSize={pageSize} {...props} />
      <button
        className="fast-forward fast-forward__next"
        onClick={() => {
          setCurrent(totalPage);
        }}
      ></button>
    </Wrapper>
  );
};

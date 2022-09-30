import { useRef } from 'react';
import styled from 'styled-components/macro';

import leftArrow from 'assets/images/left-arrow.svg';

const Wrapper = styled.div`
  width: 100%;
  position: relative;

  .container {
    overflow-y: scroll;
    width: 100%;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }

    .content {
      white-space: nowrap;
    }
  }

  button {
    background: transparent center / 40% no-repeat url('${leftArrow}');
    width: 15px;
    height: 15px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -20px;

    &.next {
      transform: translateY(-50%) rotate(180deg);
      left: unset;
      right: -20px;
    }
  }
`;

export const HorizontalScrollContainer = ({ children }) => {
  const containerRef = useRef();

  const sideScroll = (direction, speed, distance, step) => {
    const element = containerRef.current;
    let scrollAmount = 0;

    var slideTimer = setInterval(function () {
      if (direction == 'left') {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  };

  const onNext = () => {
    sideScroll('right', 25, 100, 10);
  };

  const onBack = () => {
    sideScroll('left', 25, 100, 10);
  };

  return (
    <Wrapper>
      <div className="container" ref={containerRef}>
        <div className="content">{children}</div>
      </div>
      <button onClick={onBack} type="button"></button>
      <button onClick={onNext} className="next" type="button"></button>
    </Wrapper>
  );
};

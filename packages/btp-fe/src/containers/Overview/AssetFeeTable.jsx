import { useRef } from 'react';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
  width: 100%;

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
    color: white;
    background-color: transparent;
  }
`;

export const AssetFeeTable = () => {
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
        <div className="content">
          Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem
          ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum
          dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
          amet.Lorem ipsum dolor sit amet
        </div>
      </div>
      <button onClick={onBack} type="button">
        Prev
      </button>
      <button onClick={onNext} type="button">
        Next
      </button>
    </Wrapper>
  );
};

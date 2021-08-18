import { css } from 'styled-components/macro';

export const skeleton = css`
  .skeleton-loading {
    position: relative;

    &:after {
      content: '';
      background-color: lavender;
      height: 100%;
      width: var(--skeleton-width, 100%);

      position: absolute;
      top: 0;
      left: 0;
    }
  }
`;

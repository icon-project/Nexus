import { useCallback } from 'react';
import { Modal } from './Modal';
import { useSelect, useDispatch } from '../../hooks/useRematch';

export const ModalWrapper = () => {
  const { display, options } = useSelect(({ modal }) => ({
    display: modal.selectDisplay,
    options: modal.selectOptions,
  }));

  const { setDisplay } = useDispatch(({ modal: { setDisplay } }) => ({
    setDisplay,
  }));

  const memoizedSetDisplay = useCallback((param) => setDisplay(param), [setDisplay]);

  return <Modal {...options} display={display} setDisplay={memoizedSetDisplay} />;
};

export const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const maxValue = (max, msg) => (value) =>
  isNaN(value) || +value <= +max ? undefined : msg || `Should be less than ${max}`;

const globalColors = {
  white: '#ffffff',
  black: '#000000',
  solitude: '#f0f2f5',
  primaryBlue: '#1890ff',
  primaryBrand: '#5465FF',
  grayBG: '#1D1B22',
  grayText: '#EFF1ED',
};

export const colors = (() => {
  const lightTheme = {
    // Text
    textColor: 'rgba(0,0,0,.85)',
    textColorWhite: 'rba(255,255,255,.85)',
    //background
    backgroundColor: globalColors.white,
    contentBgColor: globalColors.solitude,
    settingThemeBackgroundColor: globalColors.primaryBlue,
    ...globalColors,
  };

  return lightTheme;
})();

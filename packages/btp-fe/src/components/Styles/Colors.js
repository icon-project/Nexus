const globalColors = {
  white: '#ffffff',
  black: '#000000',
  solitude: '#f0f2f5',
  primaryBlue: '#1890ff',
  primaryBrand: '#5465FF',
  grayBG: '#1D1B22',
  grayText: '#EFF1ED',
  darkBG: '#131217',
  primaryBrandLight: '#99A3FF',
  primaryBrandBase: '#5465FF',
  primaryBrandBG: '#EBEDFF',

  grayscaleAccent: '#312F39',
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

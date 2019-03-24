const size = {
  smallest: '25em', //275px
  smaller: '31.25em', //500px
  small: '37.5em', //600px
  medium: '56.25em', //900px
  large: '80em', //1300px
  larger: '90em', //1300px
  largest: '97em', //1500px
};

export const device = {
  smallest: `(max-width: ${size.smallest})`,
  smaller: `(max-width: ${size.smaller})`,
  small: `(max-width: ${size.small})`,
  medium: `(max-width: ${size.medium})`,
  large: `(max-width: ${size.large})`,
  largest: `(max-width: ${size.largest})`,
};

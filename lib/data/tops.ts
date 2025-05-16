export interface Top {
  name: string;
  image: string;
  price: string;
  colors: Color[];
  colorImages?: {
    [key: string]: string;
  };
}

export interface Color {
  name: string;
  value: string;
}

export const TOPS: Top[] = [
  { 
    name: 'SoftMotion Sports Bra',
    image: 'https://uk.oneractive.com/cdn/shop/files/250416_NOOS_SOFTMOTION_SPORTS_BRA_WHITE_PDP_1440x1800_01_550x@2x.jpg?v=1744979912',
    price: '£38.00',
    colors: [
      { name: 'True Blue', value: '#8896B2' },
      { name: 'Soft Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Granite Blue', value: '#4A3B39' },
    ],
    colorImages: {
      '#8896B2': 'https://uk.oneractive.com/cdn/shop/files/250328_APRILNOOS_SOFTMOTION_SPORTSBRA_TRUEBLUE_PDP_1440x1800_01_550x@2x.jpg?v=1744106154',
      '#000000': 'https://uk.oneractive.com/cdn/shop/files/250410_NOOS_SOFTMOTION_SPORTS_BRA_SOFTBLACK_PDP_1440x1800_01_550x@2x.jpg?v=1745331780',
      '#FFFFFF': 'https://uk.oneractive.com/cdn/shop/files/250416_NOOS_SOFTMOTION_SPORTS_BRA_WHITE_PDP_1440x1800_01_550x@2x.jpg?v=1744979912',
      '#4A3B39': 'https://uk.oneractive.com/cdn/shop/files/250123_LIFTING_TEAM_SOFTMOTION_SPORTS_BRA_GRANITEBLUE_PDP_1440x1800_01_550x@2x.jpg?v=1740753645'
    }
  },
  { 
    name: 'Go To Seamless Fitted Crop Top',
    image: 'https://uk.oneractive.com/cdn/shop/files/240624_GOTOSEAMLESS_FITTED_CROP_T_SHIRT_TRUEBLUE_PDP_1440x1800_02_700x@2x.jpg?v=1721809150',
    price: '£38.00',
    colors: [
      { name: 'True Blue', value: '#8896B2' },
      { name: 'Sand', value: '#D2B48C' },
      { name: 'Lemon Drop', value: '#FFD700' },
      { name: 'Charged Orange', value: '#FF4500' },
      { name: 'Coal Grey', value: '#4A4A4A' },
    ],
    colorImages: {
      '#8896B2': 'https://uk.oneractive.com/cdn/shop/files/240624_GOTOSEAMLESS_FITTED_CROP_T_SHIRT_TRUEBLUE_PDP_1440x1800_02_700x@2x.jpg?v=1721809150',
      '#D2B48C': 'https://uk.oneractive.com/cdn/shop/files/240624_GOTOSEAMLESS_FITTED_CROP_T_SHIRT_SAND_PDP_1440x1800_01_700x@2x.jpg?v=1721809161',
      '#FFD700': 'https://uk.oneractive.com/cdn/shop/files/Go_To_Seamless_Fitted_Crop_Top_Lemon_Drop_Yellow_01_550x@2x.jpg?v=1719833779',
      '#FF4500': 'https://uk.oneractive.com/cdn/shop/files/GO_TO_SEAMLESS_FITTED_CROP_TOP_CHARGED_ORANGE_01_550x@2x.jpg?v=1718090918',
      '#4A4A4A': 'https://uk.oneractive.com/cdn/shop/files/GO_TO_SEAMLESS_FITTED_CROP_TOP_COAL_GREY_01_550x@2x.jpg?v=1718090944'
    }
  },
  { 
    name: 'Classic Oversized Lightweight Long Sleeve Top',
    image: 'https://uk.oneractive.com/cdn/shop/files/250307_BEYOND_MOVEMENT_CLASSIC_OVERSIZED_LIGHTWEIGHT_LONG_SLEEVE_TOP_CLOUDBLUE_PDP_1440x1800_01_700x@2x.jpg?v=1744214522',
    price: '£42.00',
    colors: [
      { name: 'Cloud Blue', value: '#B0C4DE' },
      { name: 'Moss Brown', value: '#8B7355' },
    ],
    colorImages: {
      '#B0C4DE': 'https://uk.oneractive.com/cdn/shop/files/250307_BEYOND_MOVEMENT_CLASSIC_OVERSIZED_LIGHTWEIGHT_LONG_SLEEVE_TOP_CLOUDBLUE_PDP_1440x1800_01_700x@2x.jpg?v=1744214522',
      '#8B7355': 'https://uk.oneractive.com/cdn/shop/files/241204_SS25_CLASSIC_OVERSIZED_LIGHTWEIGHT_LONG_SLEEVE_TOP_MOSSBROWN_PDP_1440x1800_01_550x@2x.jpg?v=1738832523'
    }
  }
];
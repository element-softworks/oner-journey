export interface Bottom {
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

export const BOTTOMS: Bottom[] = [
	{
		name: 'Effortless Seamless Shorts',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_SHORTS_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Velvet Pink', value: '#f0647f' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_SHORTS_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_SHORTS_RACINGGREEN_GM_07.png',
			'#f0647f':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_SHORTS_VELVETPINK_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_SHORTS_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Effortless Seamless Leggings',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_LEGGINGS_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Velvet Pink', value: '#f0647f' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_LEGGINGS_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_LEGGINGS_RACINGGREEN_GM_07.png',
			'#f0647f':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_LEGGINGS_VELVETPINK_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EFFORTLESS_SEAMLESS_LEGGINGS_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Soft Motion Cycling Shorts',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_CYCLING_SHORTS_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Velvet Pink', value: '#f0647f' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_CYCLING_SHORTS_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_CYCLING_SHORTS_RACINGGREEN_GM_07.png',
			'#f0647f':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_CYCLING_SHORTS_VELVETPINK_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_CYCLING_SHORTS_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Soft Motion Shorts',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_SHORTS_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Velvet Pink', value: '#f0647f' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_SHORTS_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_SHORTS_RACINGGREEN_GM_07.png',
			'#f0647f':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_SHORTS_VELVETPINK_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_SHORTS_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Soft Motion Flared Bottoms',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_FLARED_BOTTOMS_RACINGGREEN_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_FLARED_BOTTOMS_RACINGGREEN_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_FLARED_BOTTOMS_WARMSAND_GM_07.png',
		},
	},
];

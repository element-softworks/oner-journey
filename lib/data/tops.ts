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
		name: 'Easy Lift Halter Bralette',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HALTER_BRALETTE_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Velvet Pink', value: '#f0647f' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HALTER_BRALETTE_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HALTER_BRALETTE_RACINGGREEN_GM_07.png',
			'#f0647f':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HALTER_BRALETTE_VELVETPINK_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HALTER_BRALETTE_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Easy Lift High Neck Sports Bra',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HIGH_NECK_SPORTS_BRA_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue ', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Velvet Pink', value: '#f0647f' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HIGH_NECK_SPORTS_BRA_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HIGH_NECK_SPORTS_BRA_RACINGGREEN_GM_07.png',
			'#f0647f':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HIGH_NECK_SPORTS_BRA_VELVETPINK_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_EASYLIFT_HIGH_NECK_SPORTS_BRA_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Soft Motion Bralette',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_BRALETTE_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue ', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Velvet Pink', value: '#f0647f' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_BRALETTE_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_BRALETTE_RACINGGREEN_GM_07.png',
			'#f0647f':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_BRALETTE_VELVETPINK_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_BRALETTE_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Soft Motion Strappy Vest',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_VEST_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue ', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Velvet Pink', value: '#f0647f' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_VEST_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_VEST_RACINGGREEN_GM_07.png',
			'#f0647f':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_VEST_VELVETPINK_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_VEST_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Soft Motion Strappy Mid Vest',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_MID_VEST_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue ', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Velvet Pink', value: '#f0647f' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_MID_VEST_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_MID_VEST_RACINGGREEN_GM_07.png',
			'#f0647f':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_MID_VEST_VELVETPINK_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_STRAPPY_MID_VEST_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Go To Seamless Loose Long Sleeve Top',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_GO_TO_SEAMLESS_LOOSE_LONG_SLEEVE_TOP_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue ', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_GO_TO_SEAMLESS_LOOSE_LONG_SLEEVE_TOP_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_GO_TO_SEAMLESS_LOOSE_LONG_SLEEVE_TOP_RACINGGREEN_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_GO_TO_SEAMLESS_LOOSE_LONG_SLEEVE_TOP_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Go To Seamless Loose Top',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_GO_TO_SEAMLESS_LOOSE_TOP_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue ', value: '#8896B2' },
			{ name: 'Racing Green', value: '#1C4639' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_GO_TO_SEAMLESS_LOOSE_TOP_GLAUCOUSBLUE_GM_07.png',
			'#1C4639':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_GO_TO_SEAMLESS_LOOSE_TOP_RACINGGREEN_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_GO_TO_SEAMLESS_LOOSE_TOP_WARMSAND_GM_07.png',
		},
	},
	{
		name: 'Soft Motion Jacket',
		image: 'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_JACKET_GLAUCOUSBLUE_GM_07.png',
		price: '£38.00',
		colors: [
			{ name: 'Glaucous Blue ', value: '#8896B2' },
			{ name: 'Warm Sand', value: '#b0a79d' },
		],
		colorImages: {
			'#8896B2':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_JACKET_GLAUCOUSBLUE_GM_07.png',
			'#b0a79d':
				'https://merlin-cloud.s3.eu-west-2.amazonaws.com/think-one/250422_SUMMERSEASONAL_SOFTMOTION_JACKET_WARMSAND_GM_07.png',
		},
	},
];

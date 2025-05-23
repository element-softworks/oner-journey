import Link from 'next/link';
import Image from 'next/image';
import { Camera, Shirt } from 'lucide-react';

export default function Home() {
	return (
		<main className="min-h-[100dvh] bg-gray-50 flex items-center justify-center p-6">
			<div className="w-full max-w-3xl bg-white rounded-2xl shadow-md overflow-hidden">
				<header className="flex justify-center py-8">
					<Image
						src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
						alt="ONER logo"
						width={150}
						height={48}
						className="object-contain"
					/>
				</header>

				<section className="px-6 pb-10">
					<h1 className="text-center text-3xl font-bold text-gray-900">
						Choose Your Experience
					</h1>
					<p className="text-center text-gray-600 mt-2 mb-8">
						Select how you'd like to explore ONER
					</p>

					<div className="grid gap-6 sm:grid-cols-2">
						{[
							{
								href: '/outfit-selector',
								label: 'Outfit Selector',
								icon: <Shirt className="h-6 w-6" />,
								img: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg',
								alt: 'Outfit Selector',
							},
							{
								href: '/photo-booth/start',
								label: 'Photo Booth',
								icon: <Camera className="h-6 w-6" />,
								img: 'https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg',
								alt: 'Photo Booth',
							},
						].map(({ href, label, icon, img, alt }) => (
							<Link
								key={href}
								href={href}
								className="group block rounded-xl overflow-hidden border-2 border-gray-200 hover:border-gray-900 transition-colors"
							>
								<div className="relative aspect-video w-full bg-gray-100">
									<Image src={img} alt={alt} fill className="object-cover" />
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
										<span className="flex items-center text-white text-lg font-semibold gap-2">
											{icon}
											{label}
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}

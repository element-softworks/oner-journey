import Link from 'next/link';
import { Camera, Shirt } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="h-screen w-[56.25vh] bg-white relative overflow-hidden p-6">
        <div className="h-full flex flex-col">
          <div className="flex justify-center mb-8">
            <img 
              src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
              alt="ONER"
              className="h-12 w-auto"
            />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Experience</h1>
            <p className="text-gray-600 mb-8">Select how you'd like to explore ONER</p>

            <Link 
              href="/outfit-selector"
              className="w-full max-w-md group"
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-gray-900 transition-colors duration-300">
                <div className="aspect-[16/9] bg-gray-100">
                  <img 
                    src="https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg"
                    alt="Outfit Selector"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="flex items-center text-white gap-3">
                    <Shirt className="h-6 w-6" />
                    <span className="text-lg font-semibold">Outfit Selector</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link 
              href="/photo-booth/start"
              className="w-full max-w-md group"
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-gray-900 transition-colors duration-300">
                <div className="aspect-[16/9] bg-gray-100">
                  <img 
                    src="https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg"
                    alt="Photo Booth"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="flex items-center text-white gap-3">
                    <Camera className="h-6 w-6" />
                    <span className="text-lg font-semibold">Photo Booth</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
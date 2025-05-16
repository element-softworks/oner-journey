import { PhotoBoothContainer } from '@/components/photo-booth-container';

export default function PhotoBoothFormPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="h-screen w-[56.25vh] bg-white relative overflow-hidden">
        <PhotoBoothContainer initialScreen="welcome" />
      </div>
    </div>
  );
}
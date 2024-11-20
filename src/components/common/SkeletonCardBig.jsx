export default function SkeletonCardBig() {
  return (
    <div className="animate-pulse p-4 bg-white shadow rounded-lg max-w-full">
      <div className="h-48 bg-gray-300 rounded mb-4"></div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  );
}

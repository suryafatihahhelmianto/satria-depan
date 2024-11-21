export default function GridCardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Row 1, Column 1 */}
      <div className="bg-gray-300 rounded-lg shadow-lg p-4 animate-pulse h-40">
        {/* Skeleton Content */}
        <div className="h-6 bg-gray-400 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      </div>

      {/* Row 1, Column 2 */}
      <div className="bg-gray-300 rounded-lg shadow-lg p-4 animate-pulse h-40">
        {/* Skeleton Content */}
        <div className="h-6 bg-gray-400 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      </div>

      {/* Row 2, Column 1 */}
      <div className="bg-gray-300 rounded-lg shadow-lg p-4 animate-pulse h-40">
        {/* Skeleton Content */}
        <div className="h-6 bg-gray-400 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      </div>

      {/* Row 2, Column 2 */}
      <div className="bg-gray-300 rounded-lg shadow-lg p-4 animate-pulse h-40">
        {/* Skeleton Content */}
        <div className="h-6 bg-gray-400 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      </div>
    </div>
  );
}

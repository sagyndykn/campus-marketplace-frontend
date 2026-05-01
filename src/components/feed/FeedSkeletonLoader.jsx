function GridSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded-full w-16" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex">
      <div className="flex-shrink-0 bg-gray-100" style={{ width: 150, height: 120 }} />
      <div className="flex-1 p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded-full w-16" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-20 mt-3" />
      </div>
    </div>
  );
}

function TileSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-24 bg-gray-100" />
      <div className="p-2 space-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-14" />
      </div>
    </div>
  );
}

function SwipeSkeleton() {
  return (
    <div className="max-w-sm mx-auto px-4 py-4">
      <div className="flex justify-center gap-1.5 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full bg-gray-100 animate-pulse" style={{ width: i === 0 ? 24 : 8 }} />
        ))}
      </div>
      <div className="bg-gray-100 rounded-2xl animate-pulse" style={{ height: 460 }} />
    </div>
  );
}

const CONFIG = {
  gallery: { count: 8, Component: GridSkeleton, className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' },
  list:    { count: 5, Component: ListSkeleton, className: 'flex flex-col gap-3' },
  tile:    { count: 12, Component: TileSkeleton, className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2' },
};

export default function FeedSkeletonLoader({ viewMode }) {
  if (viewMode === 'swipe') return <SwipeSkeleton />;
  const { count, Component, className } = CONFIG[viewMode] || CONFIG.gallery;
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}

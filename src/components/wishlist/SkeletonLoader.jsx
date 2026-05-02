function GallerySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-48 bg-gray-100 dark:bg-gray-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse flex">
      <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-800" style={{ width: 140, height: 110 }} />
      <div className="flex-1 p-3 space-y-2">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-16" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-20 mt-3" />
      </div>
    </div>
  );
}

function TileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-24 bg-gray-100 dark:bg-gray-800" />
      <div className="p-2 space-y-1.5">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-14" />
      </div>
    </div>
  );
}

const SKELETON_CONFIG = {
  gallery: { count: 8, Component: GallerySkeleton, className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' },
  list: { count: 5, Component: ListSkeleton, className: 'flex flex-col gap-3' },
  tile: { count: 12, Component: TileSkeleton, className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2' },
};

export default function SkeletonLoader({ viewMode }) {
  const { count, Component, className } = SKELETON_CONFIG[viewMode] || SKELETON_CONFIG.gallery;
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}

import React from "react";

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />
  );
};

export const PostSkeleton = () => (
  <div className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-16 h-2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4" />
    </div>
    <Skeleton className="w-full h-48 rounded-2xl" />
  </div>
);

export const CommunitySkeleton = () => (
  <div className="h-40 bg-white/5 rounded-3xl animate-pulse flex items-end p-6">
    <div className="space-y-2 w-full">
      <Skeleton className="w-1/3 h-4" />
      <Skeleton className="w-1/2 h-2" />
    </div>
  </div>
);

export default Skeleton;

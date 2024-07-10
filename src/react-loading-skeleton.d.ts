declare module 'react-loading-skeleton' {
    import React from 'react';
  
    interface SkeletonProps {
      count?: number;
      duration?: number;
      width?: number | string;
      height?: number | string;
      circle?: boolean;
      style?: React.CSSProperties;
    }
  
    const Skeleton: React.FC<SkeletonProps>;
  
    export default Skeleton;
  }
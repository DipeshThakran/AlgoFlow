import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Wrapper = ({ sketch, ...props }) => {
  const wrapperRef = useRef();
  const p5InstanceRef = useRef();

  useEffect(() => {
    // Remove any previous instance
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }
    // Create new instance
    p5InstanceRef.current = new p5(sketch, wrapperRef.current);
    // Forward initial props
    if (p5InstanceRef.current && p5InstanceRef.current.updateWithProps) {
      p5InstanceRef.current.updateWithProps(props);
    }
    // Cleanup on unmount
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [sketch]);

  // Forward prop updates
  useEffect(() => {
    if (p5InstanceRef.current && p5InstanceRef.current.updateWithProps) {
      p5InstanceRef.current.updateWithProps(props);
    }
  }, [props]);

  return <div ref={wrapperRef} style={{ width: '100%', height: '100%' }} />;
};

export default P5Wrapper;
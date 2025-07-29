import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Wrapper = ({ sketch }) => {
  const wrapperRef = useRef();

  useEffect(() => {
    const p5Instance = new p5(sketch, wrapperRef.current);
    return () => p5Instance.remove(); // Cleanup
  }, [sketch]);

  return <div ref={wrapperRef} />;
};

export default P5Wrapper;
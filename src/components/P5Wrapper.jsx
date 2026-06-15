import React, { useEffect, useRef, useState, useCallback } from 'react';
import p5 from 'p5';

const P5Wrapper = ({ sketch, width: propWidth, height: propHeight, ...props }) => {
  const containerRef = useRef();
  const p5InstanceRef = useRef();
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure the parent container's width so the canvas fills it
  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      const parent = containerRef.current.parentElement;
      if (parent) {
        setContainerWidth(parent.clientWidth);
      }
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    if (containerRef.current.parentElement) {
      ro.observe(containerRef.current.parentElement);
    }

    return () => ro.disconnect();
  }, []);

  // Determine the actual width/height to use
  // If explicit width prop is given (e.g. race mode cards), use that.
  // Otherwise, fill the measured parent width.
  const actualWidth = propWidth || containerWidth || 800;
  const actualHeight = propHeight || 450;

  // Create/destroy the p5 instance when the sketch function changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Create a dedicated wrapper node for this instance
    const wrapperNode = document.createElement('div');
    wrapperNode.style.lineHeight = '0';
    containerRef.current.appendChild(wrapperNode);

    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    const myP5 = new p5(sketch, wrapperNode);
    p5InstanceRef.current = myP5;

    if (myP5 && myP5.updateWithProps) {
      myP5.updateWithProps({
        ...props,
        width: actualWidth,
        height: actualHeight,
      });
    }

    return () => {
      if (myP5) {
        myP5.remove();
      }
      if (p5InstanceRef.current === myP5) {
        p5InstanceRef.current = null;
      }
      // Completely remove the wrapper node from the DOM
      if (wrapperNode && wrapperNode.parentNode) {
        wrapperNode.parentNode.removeChild(wrapperNode);
      }
    };
  }, [sketch]);

  // Forward prop updates (including recalculated size) on every render
  useEffect(() => {
    if (p5InstanceRef.current && p5InstanceRef.current.updateWithProps) {
      p5InstanceRef.current.updateWithProps({
        ...props,
        width: actualWidth,
        height: actualHeight,
      });
    }
  }, [props, actualWidth, actualHeight]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%' }}
    />
  );
};

export default P5Wrapper;
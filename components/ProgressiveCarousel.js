import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const ProgressSliderContext = createContext(undefined);

export const useProgressSliderContext = () => {
  const context = useContext(ProgressSliderContext);
  if (!context) {
    throw new Error('useProgressSliderContext must be used within a ProgressSlider');
  }
  return context;
};

export const ProgressSlider = ({
  children,
  duration = 5000,
  fastDuration = 400,
  vertical = false,
  activeSlider,
  className,
}) => {
  const [active, setActive] = useState(activeSlider);
  const [progress, setProgress] = useState(0);
  const [isFastForward, setIsFastForward] = useState(false);
  const frame = useRef(0);
  const firstFrameTime = useRef(performance.now());
  const targetValue = useRef(null);
  const [sliderValues, setSliderValues] = useState([]);

  useEffect(() => {
    const getChildren = React.Children.toArray(children).find(
      (child) => child.type === SliderContent
    );
    if (getChildren) {
      const values = React.Children.toArray(getChildren.props.children).map(
        (child) => child.props.value
      );
      setSliderValues(values);
    }
  }, [children]);

  useEffect(() => {
    if (sliderValues.length > 0) {
      firstFrameTime.current = performance.now();
      frame.current = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(frame.current);
    };
  }, [sliderValues, active, isFastForward]);

  const animate = (now) => {
    const currentDuration = isFastForward ? fastDuration : duration;
    const elapsedTime = now - firstFrameTime.current;
    const timeFraction = elapsedTime / currentDuration;

    if (timeFraction <= 1) {
      setProgress(
        isFastForward
          ? progress + (100 - progress) * timeFraction
          : timeFraction * 100
      );
      frame.current = requestAnimationFrame(animate);
    } else {
      if (isFastForward) {
        setIsFastForward(false);
        if (targetValue.current !== null) {
          setActive(targetValue.current);
          targetValue.current = null;
        }
      } else {
        const currentIndex = sliderValues.indexOf(active);
        const nextIndex = (currentIndex + 1) % sliderValues.length;
        setActive(sliderValues[nextIndex]);
      }
      setProgress(0);
      firstFrameTime.current = performance.now();
    }
  };

  const handleButtonClick = (value) => {
    if (value !== active) {
      const elapsedTime = performance.now() - firstFrameTime.current;
      const currentProgress = (elapsedTime / duration) * 100;
      setProgress(currentProgress);
      targetValue.current = value;
      setIsFastForward(true);
      firstFrameTime.current = performance.now();
    }
  };

  return (
    <ProgressSliderContext.Provider
      value={{ active, progress, handleButtonClick, vertical }}
    >
      <div className={cn('relative', className)}>{children}</div>
    </ProgressSliderContext.Provider>
  );
};

export const SliderContent = ({ children, className }) => {
  return <div className={cn('', className)}>{children}</div>;
};

export const SliderWrapper = ({ children, value, className }) => {
  const { active } = useProgressSliderContext();
  return (
    <AnimatePresence mode='popLayout'>
      {active === value && (
        <motion.div
          key={value}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn('', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const SliderBtnGroup = ({ children, className }) => {
  return <div className={cn('', className)}>{children}</div>;
};

export const SliderBtn = ({ children, value, className, progressBarClass }) => {
  const { active, progress, handleButtonClick, vertical } = useProgressSliderContext();
  return (
    <button
      className={cn(className)}
      style={{
        position: 'relative',
        opacity: active === value ? 1 : 0.5,
      }}
      onClick={() => handleButtonClick(value)}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
        role='progressbar'
        aria-valuenow={active === value ? progress : 0}
      >
        <span
          className={cn(progressBarClass)}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            [vertical ? 'height' : 'width']:
              active === value ? `${progress}%` : '0%',
          }}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </button>
  );
};

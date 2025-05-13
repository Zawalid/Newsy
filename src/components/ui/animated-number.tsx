import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, Easing } from 'motion/react';

export function useAnimatedValue<T>(
  initialValue: number = 0,
  value: number,
  options: {
    duration?: number;
    ease?: Easing | Easing[] | undefined;
    toFixed?: boolean;
    formatter?: (val: number) => T;
  } = {}
) {
  const {
    duration = 0.8,
    ease = 'easeOut',
    toFixed = true,
    formatter = (val: number) => val as unknown as T,
  } = options;

  const animatedValue = useMotionValue(initialValue);
  const roundedValue = useTransform(animatedValue, (val) => (toFixed ? Math.round(val) : val));
  const formattedValue = useTransform(roundedValue, formatter);

  useEffect(() => {
    const animation = animate(animatedValue, value, { duration, ease });
    return () => animation.stop();
  }, [value, animatedValue, duration, ease]);

  return {
    animatedValue,
    roundedValue,
    formattedValue,
  };
}

export function useAnimatedPercent(percent: number) {
  const { animatedValue } = useAnimatedValue(0, percent);
  const width = useTransform(animatedValue, (value) => `${value}%`);

  return width;
}

export function AnimatedNumber({
  value,
  className,
  formatter = (val: number) => val.toLocaleString(),
  toFixed = true,
}: {
  value: number;
  className?: string;
  formatter?: (val: number) => string;
  toFixed?: boolean;
}) {
  const { formattedValue } = useAnimatedValue(0, value, { formatter, toFixed });

  return <motion.span className={className}>{formattedValue}</motion.span>;
}

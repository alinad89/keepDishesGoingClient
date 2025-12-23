import { useMemo } from 'react';
import './Snowfall.css';

interface SnowflakeProps {
  left: number;
  animationDuration: number;
  size: number;
  opacity: number;
  delay: number;
}

function Snowflake({ left, animationDuration, size, opacity, delay }: SnowflakeProps) {
  return (
    <div
      className="snowflake"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        animationDuration: `${animationDuration}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function Snowfall() {
  const snowflakes = useMemo(() => {
    const count = 60; // Number of snowflakes
    const flakes: SnowflakeProps[] = [];

    for (let i = 0; i < count; i++) {
      flakes.push({
        left: Math.random() * 100,
        animationDuration: 8 + Math.random() * 7, // 8-15 seconds
        size: 2 + Math.random() * 4, // 2-6px
        opacity: 0.3 + Math.random() * 0.5, // 0.3-0.8
        delay: Math.random() * 5, // 0-5 seconds
      });
    }

    return flakes;
  }, []);

  return (
    <div className="snowfall-container">
      {snowflakes.map((flake, index) => (
        <Snowflake key={index} {...flake} />
      ))}
    </div>
  );
}

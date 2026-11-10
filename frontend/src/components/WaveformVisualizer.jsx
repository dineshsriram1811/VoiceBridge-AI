import React, { useEffect, useRef } from 'react';

/**
 * Animated Waveform Visualizer
 * Supports live microphone frequency data or animated idle/playback waves
 */
export default function WaveformVisualizer({ isRecording, isPlaying, recorderRef, barCount = 32, className = '' }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const freqData = new Uint8Array(64);

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const spacing = width / barCount;
      const barWidth = Math.max(3, spacing - 3);

      if (isRecording && recorderRef?.current) {
        // Live frequency data from microphone
        recorderRef.current.getFrequencyData(freqData);

        for (let i = 0; i < barCount; i++) {
          const freqIndex = Math.floor((i / barCount) * (freqData.length / 2));
          const value = freqData[freqIndex] || 0;
          const percent = value / 255;
          const barHeight = Math.max(6, percent * height * 0.95);
          const x = i * spacing + (spacing - barWidth) / 2;
          const y = (height - barHeight) / 2;

          // Gradient from Primary Blue to Secondary Teal
          const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
          gradient.addColorStop(0, '#2563EB');
          gradient.addColorStop(1, '#14B8A6');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 4);
          ctx.fill();
        }
      } else if (isPlaying) {
        // Animated rhythm wave during audio playback
        phase += 0.08;
        for (let i = 0; i < barCount; i++) {
          const sinVal = Math.sin(phase + i * 0.3);
          const cosVal = Math.cos(phase * 0.7 + i * 0.2);
          const amplitude = Math.abs(sinVal * cosVal);
          const barHeight = Math.max(8, amplitude * height * 0.85);
          const x = i * spacing + (spacing - barWidth) / 2;
          const y = (height - barHeight) / 2;

          const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
          gradient.addColorStop(0, '#14B8A6');
          gradient.addColorStop(1, '#2563EB');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 4);
          ctx.fill();
        }
      } else {
        // Gentle resting idle state
        phase += 0.02;
        for (let i = 0; i < barCount; i++) {
          const gentleVal = Math.sin(phase + i * 0.15) * 0.25 + 0.35;
          const barHeight = Math.max(4, gentleVal * (height * 0.35));
          const x = i * spacing + (spacing - barWidth) / 2;
          const y = (height - barHeight) / 2;

          ctx.fillStyle = '#CBD5E1';
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 2);
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, isPlaying, barCount, recorderRef]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={380}
        height={64}
        className="w-full h-full max-w-md"
      />
    </div>
  );
}


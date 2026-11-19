import { useEffect, useRef } from "react";

const PerspectiveGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      drawGrid();
    };

    const drawGrid = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear canvas with black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Grid settings - fuchsia color
      const horizonY = height / 2;
      const vanishingPointX = width / 2;
      const gridColor = "rgba(217, 70, 239, 0.6)"; // fuchsia-500
      const gridColorBright = "rgba(217, 70, 239, 0.8)"; // brighter fuchsia
      
      // Number of grid lines - more lines for denser grid
      const numHorizontalLines = 20;
      const numVerticalLines = 24;

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      // Draw top grid (ceiling)
      drawPerspectiveGrid(
        ctx,
        width,
        0,
        horizonY,
        vanishingPointX,
        numHorizontalLines,
        numVerticalLines,
        gridColor,
        gridColorBright,
        true
      );

      // Draw bottom grid (floor)
      drawPerspectiveGrid(
        ctx,
        width,
        horizonY,
        height,
        vanishingPointX,
        numHorizontalLines,
        numVerticalLines,
        gridColor,
        gridColorBright,
        false
      );
    };

    const drawPerspectiveGrid = (
      ctx: CanvasRenderingContext2D,
      width: number,
      startY: number,
      endY: number,
      vanishingPointX: number,
      numHorizontalLines: number,
      numVerticalLines: number,
      gridColor: string,
      gridColorBright: string,
      isTop: boolean
    ) => {
      const horizonY = isTop ? endY : startY;
      const sectionHeight = endY - startY;

      // Draw horizontal lines (perspective depth lines)
      for (let i = 0; i <= numHorizontalLines; i++) {
        const t = i / numHorizontalLines;
        // Use exponential easing for better perspective
        const easedT = Math.pow(t, 1.5);
        const y = startY + easedT * sectionHeight;

        // Make lines fade as they approach the vanishing point
        const alpha = (1 - t) * 0.8 + 0.2;
        ctx.strokeStyle = i % 3 === 0 ? gridColorBright : gridColor;
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Draw vertical lines (converging to vanishing point)
      for (let i = 0; i <= numVerticalLines; i++) {
        const t = (i - numVerticalLines / 2) / (numVerticalLines / 2);
        const xOffset = t * width * 0.9;
        const x = vanishingPointX + xOffset;

        // Lines converge to the vanishing point
        ctx.strokeStyle = i % 3 === 0 ? gridColorBright : gridColor;
        
        // Calculate opacity based on distance from center
        const distanceFromCenter = Math.abs(t);
        const alpha = 0.4 + (1 - distanceFromCenter) * 0.4;
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.moveTo(x, isTop ? startY : endY);
        ctx.lineTo(vanishingPointX, horizonY);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default PerspectiveGrid;


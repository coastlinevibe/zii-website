import React, { useRef, useEffect } from 'react';

const ParticleText = ({ text = "No Data? No Problem!", className = "" }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouse = useRef({ x: undefined, y: undefined, radius: 90 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 2;
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 40 + 5;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        let dx = mouse.current.x - this.x;
        let dy = mouse.current.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (mouse.current.radius - distance) / mouse.current.radius;
        if (force < 0) force = 0;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.current.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    function init() {
      particlesArray = [];
      
      // Responsive font size
      let fontSize = Math.min(canvas.width / 10, 105);
      const isMobile = canvas.width < 768;
      
      if (isMobile) {
        fontSize = Math.min(canvas.width / 8, 35);
      }

      ctx.font = `900 ${fontSize}px "Arial Black", Gadget, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Lime green gradient matching your brand
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#BFFF00");
      gradient.addColorStop(0.5, "#A4E800");
      gradient.addColorStop(1, "#BFFF00");

      ctx.fillStyle = gradient;
      
      const textX = canvas.width / 2;
      
      // Split text into 2 lines for mobile
      if (isMobile) {
        const line1 = "No Data?";
        const line2 = "No Problem!";
        const lineHeight = fontSize * 1.2;
        const startY = (canvas.height / 2) - (lineHeight / 2) - 80; // Moved up by 80px
        
        ctx.fillText(line1, textX, startY);
        ctx.fillText(line2, textX, startY + lineHeight);
      } else {
        const textY = canvas.height / 2;
        ctx.fillText(text, textX, textY);
      }

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Particle density - adjust for performance
      const gap = isMobile ? 3 : 4;

      for (let y = 0; y < textCoordinates.height; y += gap) {
        for (let x = 0; x < textCoordinates.width; x += gap) {
          const alphaIndex = (y * 4 * textCoordinates.width) + (x * 4) + 3;
          if (textCoordinates.data[alphaIndex] > 128) {
            const r = textCoordinates.data[alphaIndex - 3];
            const g = textCoordinates.data[alphaIndex - 2];
            const b = textCoordinates.data[alphaIndex - 1];
            const color = `rgb(${r},${g},${b})`;
            particlesArray.push(new Particle(x, y, color));
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(p => {
        p.draw();
        p.update();
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.current.x = touch.clientX - rect.left;
      mouse.current.y = touch.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.current.x = undefined;
      mouse.current.y = undefined;
    };

    const handleTouchEnd = () => {
      mouse.current.x = undefined;
      mouse.current.y = undefined;
    };

    const handleResize = () => {
      resizeCanvas();
      init();
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    init();
    animate();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto',
        zIndex: 10,
        cursor: 'pointer'
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default ParticleText;

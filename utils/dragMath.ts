export type Rect = { x: number; y: number; width: number; height: number };

export const clampToBounds = (x: number, y: number, cw: number, ch: number, iw: number, ih: number) => {
  const minX = Math.min(0, cw - iw);
  const maxX = Math.max(0, cw - iw);
  const minY = Math.min(0, ch - ih);
  const maxY = Math.max(0, ch - ih);
  return { 
    x: Math.max(minX, Math.min(x, maxX)), 
    y: Math.max(minY, Math.min(y, maxY)) 
  };
};

// Calculate visible image bounds when using resizeMode="cover"
export const getVisibleImageBounds = (containerWidth: number, containerHeight: number, imageAspectRatio: number) => {
  const containerAspectRatio = containerWidth / containerHeight;
  
  if (imageAspectRatio > containerAspectRatio) {
    // Image is wider than container - letterboxed on top/bottom
    const visibleHeight = containerHeight;
    const visibleWidth = containerHeight * imageAspectRatio;
    const offsetX = (visibleWidth - containerWidth) / 2;
    
    return {
      x: -offsetX,
      y: 0,
      width: visibleWidth,
      height: visibleHeight
    };
  } else {
    // Image is taller than container - letterboxed on left/right
    const visibleWidth = containerWidth;
    const visibleHeight = containerWidth / imageAspectRatio;
    const offsetY = (visibleHeight - containerHeight) / 2;
    
    return {
      x: 0,
      y: -offsetY,
      width: visibleWidth,
      height: visibleHeight
    };
  }
};

// Calculate overlap area between two rectangles
export const overlapArea = (rect1: Rect, rect2: Rect): number => {
  const overlapX = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));
  const overlapY = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));
  return overlapX * overlapY;
};
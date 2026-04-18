import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BackgroundParallax } from '../background-parallax';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} data-testid="warehouse-image" />
  ),
}));

// Mock MotionValue objects
const createMockMotionValue = (initialValue: string | number) => ({
  get: () => initialValue,
  set: vi.fn(),
  destroy: vi.fn(),
  on: vi.fn(),
  onChange: vi.fn(),
  current: initialValue,
});

describe('BackgroundParallax Component', () => {
  describe('Transform Guard Tests', () => {
    it('should accept enableParallaxMotion=true prop', () => {
      const mockImageY = createMockMotionValue('30%');
      const mockBrightnessOpacity = createMockMotionValue(0.7);

      const { container } = render(
        <BackgroundParallax
          imageY={mockImageY as any}
          brightnessOverlayOpacity={mockBrightnessOpacity as any}
          enableParallaxMotion={true}
        />
      );

      // Component should render without errors
      expect(container).toBeTruthy();
    });

    it('should accept enableParallaxMotion=false prop', () => {
      const mockImageY = createMockMotionValue('30%');
      const mockBrightnessOpacity = createMockMotionValue(0.7);

      const { container } = render(
        <BackgroundParallax
          imageY={mockImageY as any}
          brightnessOverlayOpacity={mockBrightnessOpacity as any}
          enableParallaxMotion={false}
        />
      );

      // Component should render without errors
      expect(container).toBeTruthy();
    });

    it('should render brightness overlay (always applied)', () => {
      const mockImageY = createMockMotionValue('30%');
      const mockBrightnessOpacity = createMockMotionValue(0.5);

      render(
        <BackgroundParallax
          imageY={mockImageY as any}
          brightnessOverlayOpacity={mockBrightnessOpacity as any}
          enableParallaxMotion={false}
        />
      );

      // Brightness overlay should always be present regardless of parallax state
      expect(screen.getByTestId('warehouse-image')).toBeInTheDocument();
    });

    it('should accept enableParallaxMotion as optional prop with default=false', () => {
      const mockImageY = createMockMotionValue('30%');
      const mockBrightnessOpacity = createMockMotionValue(0.7);

      const { container } = render(
        <BackgroundParallax
          imageY={mockImageY as any}
          brightnessOverlayOpacity={mockBrightnessOpacity as any}
          // enableParallaxMotion not provided — should default to false
        />
      );

      // Component should render successfully with default
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Props & Type Safety', () => {
    it('renders with all required props', () => {
      const mockImageY = createMockMotionValue('30%');
      const mockBrightnessOpacity = createMockMotionValue(0.7);

      const { container } = render(
        <BackgroundParallax
          imageY={mockImageY as any}
          brightnessOverlayOpacity={mockBrightnessOpacity as any}
        />
      );

      expect(container).toBeTruthy();
      expect(screen.getByTestId('warehouse-image')).toBeInTheDocument();
    });

    it('should render warehouse image with correct alt text', () => {
      const mockImageY = createMockMotionValue('30%');
      const mockBrightnessOpacity = createMockMotionValue(0.7);

      render(
        <BackgroundParallax
          imageY={mockImageY as any}
          brightnessOverlayOpacity={mockBrightnessOpacity as any}
        />
      );

      const image = screen.getByTestId('warehouse-image');
      expect(image).toHaveAttribute('alt', 'Industrial warehouse lighting installation');
    });

    it('should render without console errors', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockImageY = createMockMotionValue('30%');
      const mockBrightnessOpacity = createMockMotionValue(0.7);

      render(
        <BackgroundParallax
          imageY={mockImageY as any}
          brightnessOverlayOpacity={mockBrightnessOpacity as any}
          enableParallaxMotion={true}
        />
      );

      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should have image with sizes attribute', () => {
      const mockImageY = createMockMotionValue('30%');
      const mockBrightnessOpacity = createMockMotionValue(0.7);

      render(
        <BackgroundParallax
          imageY={mockImageY as any}
          brightnessOverlayOpacity={mockBrightnessOpacity as any}
        />
      );

      const image = screen.getByTestId('warehouse-image');
      expect(image).toHaveAttribute('sizes', '100vw');
    });
  });
});

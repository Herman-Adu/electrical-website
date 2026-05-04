import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectGallery } from "@/components/projects/project-gallery";
import type { ProjectGalleryImage } from "@/types/projects";

// --- Mocks ---

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useTransition: () => [false, (fn: () => void) => fn()],
  };
});

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    button: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props}>{children}</h3>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useInView: () => true,
  useReducedMotion: () => false,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock("@/lib/use-animated-borders", () => ({
  useAnimatedBorders: () => ({ sectionRef: { current: null }, lineScale: 0 }),
  AnimatedBorders: () => null,
}));

// --- Helpers ---

function makeImages(count: number): ProjectGalleryImage[] {
  return Array.from({ length: count }, (_, i) => ({
    src: `/image-${i}.jpg`,
    alt: `Image ${i}`,
    caption: `Caption ${i}`,
  }));
}

// --- Tests ---

describe("ProjectGallery", () => {
  beforeEach(() => {
    // Reset body overflow side-effect between tests
    document.body.style.overflow = "";
  });

  it("renders null when images array is empty", () => {
    const { container } = render(<ProjectGallery images={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows exactly 6 images in the grid when given 10 images (before load-more)", () => {
    render(<ProjectGallery images={makeImages(10)} />);
    // Each image button has aria-label "View Image N in lightbox"
    const imageButtons = screen.getAllByRole("button", {
      name: /View Image \d+ in lightbox/,
    });
    expect(imageButtons).toHaveLength(6);
  });

  it("does not render load-more button when images.length is exactly 6", () => {
    render(<ProjectGallery images={makeImages(6)} />);
    const loadMoreButton = screen.queryByRole("button", { name: /\d+ more/i });
    expect(loadMoreButton).toBeNull();
  });

  it("shows '+ 4 more' button text when 10 images are given (10 - 6 = 4)", () => {
    render(<ProjectGallery images={makeImages(10)} />);
    expect(
      screen.getByRole("button", { name: /Load 4 more images/i }),
    ).toBeInTheDocument();
    // Button visible text
    expect(screen.getByText("+ 4 more")).toBeInTheDocument();
  });

  it("shows all 10 images in grid after clicking load-more", () => {
    render(<ProjectGallery images={makeImages(10)} />);
    const loadMoreBtn = screen.getByRole("button", {
      name: /Load 4 more images/i,
    });
    fireEvent.click(loadMoreBtn);
    const imageButtons = screen.getAllByRole("button", {
      name: /View Image \d+ in lightbox/,
    });
    expect(imageButtons).toHaveLength(10);
  });

  it("load-more button disappears after clicking", () => {
    render(<ProjectGallery images={makeImages(10)} />);
    const loadMoreBtn = screen.getByRole("button", {
      name: /Load 4 more images/i,
    });
    fireEvent.click(loadMoreBtn);
    expect(
      screen.queryByRole("button", { name: /Load \d+ more images/i }),
    ).toBeNull();
  });

  it("opens lightbox at correct full-array index when clicking 6th visible image (index 5)", () => {
    const images = makeImages(10);
    render(<ProjectGallery images={images} />);
    // Click the 6th image button (index 5 in grid = index 5 in full array)
    const imageButtons = screen.getAllByRole("button", {
      name: /View Image \d+ in lightbox/,
    });
    fireEvent.click(imageButtons[5]);
    // Lightbox should be open — the lightbox image should show image 5 (alt "Image 5")
    // The lightbox img is the one with object-contain class (not the grid thumbnails)
    const lightboxImages = screen
      .getAllByRole("img")
      .filter((img) => img.className?.includes("object-contain"));
    expect(lightboxImages).toHaveLength(1);
    expect(lightboxImages[0]).toHaveAttribute("alt", "Image 5");
  });

  it("lightbox navigates full array — open at index 5, click next → shows image 6; counter shows 6 / 10", () => {
    const images = makeImages(10);
    render(<ProjectGallery images={images} />);
    // Open lightbox at grid index 5 (= full-array index 5)
    const imageButtons = screen.getAllByRole("button", {
      name: /View Image \d+ in lightbox/,
    });
    fireEvent.click(imageButtons[5]);
    // Click next
    const nextBtn = screen.getByRole("button", { name: /Next image/i });
    fireEvent.click(nextBtn);
    // Lightbox should now show image index 6
    const lightboxImages = screen
      .getAllByRole("img")
      .filter((img) => img.className?.includes("object-contain"));
    expect(lightboxImages[0]).toHaveAttribute("alt", "Image 6");
    // Counter: "7 / 10" (1-based display of index 6)
    expect(screen.getByText("7 / 10")).toBeInTheDocument();
  });

  it("shows all 5 images and no load-more button when images.length is 5", () => {
    render(<ProjectGallery images={makeImages(5)} />);
    const imageButtons = screen.getAllByRole("button", {
      name: /View Image \d+ in lightbox/,
    });
    expect(imageButtons).toHaveLength(5);
    expect(
      screen.queryByRole("button", { name: /Load \d+ more images/i }),
    ).toBeNull();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageGallery from "@/components/ImageGallery";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
} from "react";

type NextImageMockProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  alt: string;
  src: string;
  priority?: boolean;
  fill?: boolean;
};

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ alt, src, priority, ...props }: NextImageMockProps) => {
    const domProps: Record<string, unknown> = { ...props };
    delete domProps.fill;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={alt}
        src={src}
        data-priority={priority}
        {...(domProps as ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  },
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    button: ({
      children,
      ...props
    }: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
}));

describe("ImageGallery", () => {
  const mockImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ];
  const mockAlt = "Test Vehicle";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render main gallery with first image", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    const mainImage = screen.getByAltText(`${mockAlt} - Slika 1`);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute("src", mockImages[0]);
  });

  it("should render thumbnail navigation", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    // Thumbnails use "Thumbnail {index + 1}" as alt text
    mockImages.forEach((_, index) => {
      const thumbnail = screen.getByAltText(`Thumbnail ${index + 1}`);
      expect(thumbnail).toBeInTheDocument();
    });
  });

  it("should change image when thumbnail is clicked", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    // Click second thumbnail (using aria-label)
    const secondThumbnail = screen.getByLabelText(/Slika 2 od 3/i);
    fireEvent.click(secondThumbnail);

    // Main image should update
    const mainImage = screen.getByAltText(`${mockAlt} - Slika 2`);
    expect(mainImage).toBeInTheDocument();
  });

  it("should navigate to next image when next button clicked", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    const nextButton = screen.getByLabelText(/Sljedeća slika/i);
    fireEvent.click(nextButton);

    // Should show second image
    const mainImage = screen.getByAltText(`${mockAlt} - Slika 2`);
    expect(mainImage).toBeInTheDocument();
  });

  it("should navigate to previous image when prev button clicked", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    // First go to second image
    const nextButton = screen.getByLabelText(/Sljedeća slika/i);
    fireEvent.click(nextButton);

    // Then go back
    const prevButton = screen.getByLabelText(/Prethodna slika/i);
    fireEvent.click(prevButton);

    // Should be back to first image
    const firstImage = screen.getByAltText(`${mockAlt} - Slika 1`);
    expect(firstImage).toBeInTheDocument();
  });

  it("should open lightbox when main image is clicked", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    const mainImageContainer = screen
      .getByAltText(`${mockAlt} - Slika 1`)
      .closest("div");
    if (mainImageContainer) {
      fireEvent.click(mainImageContainer);
    }

    // Lightbox should be visible (check for close button)
    const closeButton = screen.getByLabelText(/Zatvori galeriju/i);
    expect(closeButton).toBeInTheDocument();
  });

  it("should close lightbox when close button clicked", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    // Open lightbox
    const mainImageContainer = screen
      .getByAltText(`${mockAlt} - Slika 1`)
      .closest("div");
    if (mainImageContainer) {
      fireEvent.click(mainImageContainer);
    }

    // Close lightbox
    const closeButton = screen.getByLabelText(/Zatvori galeriju/i);
    fireEvent.click(closeButton);

    // Close button should not be visible anymore
    expect(
      screen.queryByLabelText(/Zatvori galeriju/i)
    ).not.toBeInTheDocument();
  });

  it("should navigate images with keyboard in lightbox", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    // Open lightbox
    const mainImageContainer = screen
      .getByAltText(`${mockAlt} - Slika 1`)
      .closest("div");
    if (mainImageContainer) {
      fireEvent.click(mainImageContainer);
    }

    // Find lightbox container
    const lightbox = screen.getByLabelText(/Zatvori galeriju/i).closest("div");
    if (lightbox) {
      // Press right arrow
      fireEvent.keyDown(lightbox, { key: "ArrowRight" });

      // Press left arrow
      fireEvent.keyDown(lightbox, { key: "ArrowLeft" });

      // Press Escape
      fireEvent.keyDown(lightbox, { key: "Escape" });
    }
  });

  it("should display zoom indicator icon", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    // The zoom indicator shows an icon, check for the icon class
    const zoomIcon = document.querySelector(".lucide-zoom-in");
    expect(zoomIcon).toBeInTheDocument();
  });

  it("should handle single image correctly", () => {
    const singleImage = [mockImages[0]];
    render(<ImageGallery images={singleImage} alt={mockAlt} />);

    const image = screen.getByAltText(`${mockAlt} - Slika 1`);
    expect(image).toBeInTheDocument();

    // Navigation buttons should not be present for single image
    expect(screen.queryByLabelText(/Sljedeća slika/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Prethodna slika/i)).not.toBeInTheDocument();
  });

  it("should loop from last image to first when next clicked", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    // Navigate to last image
    const nextButton = screen.getAllByLabelText(/Sljedeća slika/i)[0];
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Click next again - should loop to first
    fireEvent.click(nextButton);

    const firstImage = screen.getByAltText(`${mockAlt} - Slika 1`);
    expect(firstImage).toBeInTheDocument();
  });

  it("should loop from first image to last when prev clicked", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    // Click prev on first image
    const prevButton = screen.getAllByLabelText(/Prethodna slika/i)[0];
    fireEvent.click(prevButton);

    // Should show last image
    const lastImage = screen.getByAltText(
      `${mockAlt} - Slika ${mockImages.length}`
    );
    expect(lastImage).toBeInTheDocument();
  });

  it("should have priority loading on main image", () => {
    render(<ImageGallery images={mockImages} alt={mockAlt} />);

    const mainImage = screen.getByAltText(`${mockAlt} - Slika 1`);
    expect(mainImage).toHaveAttribute("data-priority");
  });
});

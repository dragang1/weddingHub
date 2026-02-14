import Image from "next/image";

type GalleryProps = {
  galleryImages: string[];
  videoLinks: string[];
};

function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id =
        u.pathname.replace(/\D/g, "") || u.pathname.split("/").pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function GalleryImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (src.startsWith("http")) {
    return (
      <div
        className={`group/img relative overflow-hidden rounded-card bg-accent-soft/20 ${className ?? "aspect-[4/3]"}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover/img:scale-105"
          sizes={
            sizes ??
            "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/img:opacity-100" />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-card bg-accent-soft/15 text-muted/40 ${className ?? "aspect-[4/3]"}`}
    >
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
        />
      </svg>
    </div>
  );
}

export function Gallery({ galleryImages, videoLinks }: GalleryProps) {
  const validImages = galleryImages.filter(
    (src) => src && typeof src === "string"
  );
  const heroImage = validImages[0];
  const firstRowRest = validImages.slice(1, 5);
  const restImages = validImages.slice(5);

  return (
    <div className="space-y-4">
      {validImages.length > 0 && (
        <>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <div className="relative col-span-2 row-span-2 min-h-[200px] sm:min-h-0">
              <GalleryImage
                src={heroImage}
                alt="Galerija 1"
                className="h-full w-full min-h-[200px] sm:min-h-0"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            {firstRowRest.slice(0, 4).map((src, i) => (
              <div key={i} className="relative aspect-[4/3]">
                <GalleryImage
                  src={src}
                  alt={`Galerija ${i + 2}`}
                  className="h-full w-full"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
          {restImages.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {restImages.map((src, i) => (
                <GalleryImage key={i} src={src} alt={`Galerija ${i + 6}`} />
              ))}
            </div>
          )}
        </>
      )}
      {videoLinks.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {videoLinks.map((url, i) => {
            const embed = embedUrl(url);
            if (!embed) return null;
            return (
              <div
                key={i}
                className="aspect-video overflow-hidden rounded-card bg-ink shadow-card"
              >
                <iframe
                  src={embed}
                  title={`Video ${i + 1}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

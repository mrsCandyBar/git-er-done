declare module "canvas-confetti" {
  function confetti(options?: confetti.Options): Promise<undefined> | null;

  namespace confetti {
    interface Origin {
      x?: number;
      y?: number;
    }

    interface Options {
      angle?: number;
      colors?: string[];
      decay?: number;
      disableForReducedMotion?: boolean;
      drift?: number;
      flat?: boolean;
      gravity?: number;
      origin?: Origin;
      particleCount?: number;
      scalar?: number;
      shapes?: Array<"square" | "circle" | "star" | string>;
      spread?: number;
      startVelocity?: number;
      ticks?: number;
      zIndex?: number;
    }
  }

  export default confetti;
}

import { Suspense, lazy, Component, type ReactNode } from 'react';

const ShaderGradientCanvas = lazy(() =>
  import('@shadergradient/react').then((m) => ({
    default: m.ShaderGradientCanvas,
  }))
);

const ShaderGradient = lazy(() =>
  import('@shadergradient/react').then((m) => ({
    default: m.ShaderGradient,
  }))
);

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const GradientFallback = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-[#0e1c36] via-[#1a3a3a] to-[#2a1a12]" />
);

class GradientErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <GradientFallback />;
    return this.props.children;
  }
}

export function ShaderGradientBg() {
  if (prefersReduced) {
    return <GradientFallback />;
  }

  return (
    <GradientErrorBoundary>
      <Suspense fallback={<div className="absolute inset-0 bg-surface" />}>
        <div className="absolute inset-0">
          <ShaderGradientCanvas
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            pointerEvents="none"
          >
            <ShaderGradient
              type="waterPlane"
              color1="#0e1c36"
              color2="#2a6b6b"
              color3="#c27c5e"
              uSpeed={0.1}
              grain="on"
              envPreset="dawn"
              cDistance={3.6}
              cPolarAngle={90}
            />
          </ShaderGradientCanvas>
        </div>
      </Suspense>
    </GradientErrorBoundary>
  );
}

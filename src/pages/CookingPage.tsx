import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Panel } from "@/components/Panel";

export function CookingPage() {
  const animatedBg = typeof window !== "undefined" ? localStorage.getItem("animatedBg") !== "false" : true;

  return (
    <AnimatedBackground animated={animatedBg}>
      <Panel
        sx={{
          width: 600,
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          background: "white",
          boxShadow: 3,
          position: "relative",
        }}
      >
        {/* ...existing content... */}
      </Panel>
    </AnimatedBackground>
  );
}
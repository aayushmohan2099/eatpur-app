import { Html, useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        {/* Percentage */}
        <p
          style={{
            fontSize: 18,
            color: "#D4AF37", // gold tone
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {progress.toFixed(0)}%
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: 120,
            height: 4,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#D4AF37",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>
    </Html>
  );
};

export default Loader;
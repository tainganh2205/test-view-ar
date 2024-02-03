import { Canvas } from "@react-three/fiber";
import { PresentationControls, Stage, useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";

function Model(props) {
  const { scene } = useGLTF(props.path);
  return <primitive object={scene} {...props} />;
}

const models = [
  {
    key: "bmw",
    image: "/bmw.png",
    glpPath: "/bmw.glb"
  },
  {
    key: "dislo",
    image: "/dislo.png",
    glpPath: "/dislo.glb"
  }
];

function App() {
  const [activeGlb, setActiveGlb] = useState("/bmw.glb");
  const [isARMode, setIsARMode] = useState(false);

  const enterAR = async (modelPath) => {
    try {
      await navigator.xr.requestSession("immersive-ar", { requiredFeatures: ["hit-test"] });
      // Tự động đặt camera vào chế độ AR khi nhấp vào nút AR
      // Lưu ý: Cần phải có môi trường AR thực tế để xem hiệu ứng đầy đủ.
      setActiveGlb(modelPath); // Cập nhật mô hình khi vào chế độ AR
      setIsARMode(true);
    } catch (error) {
      console.error("Error entering AR mode", error);
    }
  };

  const exitAR = () => {
    setIsARMode(false);
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <div style={{ width: "15%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, cursor: "pointer" }}>
          {models.map((model) => (
            <div key={model.key}>
              <img
                alt={model.key}
                width={"100%"}
                src={model.image}
                onClick={() => setActiveGlb(model.glpPath)}
              />
              <button  onClick={() => enterAR(model.glpPath)}>
                View In Ar
              </button>
              <span>{model.key}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        {isARMode ? (
          <ARCanvas path={activeGlb} exitAR={exitAR} />
        ) : (
          <Canvas3D path={activeGlb} />
        )}
      </div>
    </div>
  );
}

const ARCanvas = ({ path, exitAR }) => {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
      <color attach="background" args={["#101010"]} />
      <PresentationControls speed={2.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
        <Stage environment={"sunset"}>
          <Model scale={0.01} path={path} />
        </Stage>
      </PresentationControls>
      <button onClick={exitAR} style={{ position: "absolute", top: "10px", left: "10px" }}>
        Back to 3D
      </button>
    </Canvas>
  );
};

const Canvas3D = ({ path }) => {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
      <color attach="background" args={["#101010"]} />
      <PresentationControls speed={2.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
        <Stage environment={"sunset"}>
          <Model scale={0.01} path={path} />
        </Stage>
      </PresentationControls>
    </Canvas>
  );
};

export default App;

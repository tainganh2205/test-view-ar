import {Canvas} from "@react-three/fiber";
import {PresentationControls, Stage, useGLTF} from "@react-three/drei";
import {useState} from "react";

function Model(props) {
  const {scene} = useGLTF(props.path);
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
  const [isVRMode, setIsVRMode] = useState(false);

  const enterAR = async (modelPath) => {
    try {
      await navigator.xr.requestSession("immersive-ar", {requiredFeatures: ["hit-test"]});
      setActiveGlb(modelPath);
      setIsARMode(true);
      setIsVRMode(false);
    } catch (error) {
      console.error("Error entering AR mode", error);
    }
  };

  const enterVR = async (modelPath) => {
    try {
      await navigator.xr.requestSession("immersive-vr");
      setActiveGlb(modelPath);
      setIsVRMode(true);
      setIsARMode(false);
    } catch (error) {
      console.error("Error entering VR mode", error);
    }
  };

  const exitXRMode = () => {
    setIsARMode(false);
    setIsVRMode(false);
  };

  return (
    <div style={{display: "flex", gap: "0.5rem"}}>
      <div style={{width: "15%"}}>
        <div style={{display: "flex", flexDirection: "column", gap: 20, cursor: "pointer"}}>
          {models.map((model) => (
            <div key={model.key}>
              <img
                alt={model.key}
                width={"100%"}
                src={model.image}
                onClick={() => setActiveGlb(model.glpPath)}
              />
              <button onClick={() => enterAR(model.glpPath)}>
                View In Ar
              </button>
              <button onClick={() => enterVR(model.glpPath)}>
                View In VR
              </button>
              <span>{model.key}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        {isARMode ? (
          <ARCanvas path={activeGlb} exitAR={exitXRMode}/>
        ) : isVRMode ? (
          <VRCanvas path={activeGlb} exitVR={exitXRMode}/>
        ) : (
          <Canvas3D path={activeGlb} enterVR={enterVR}/>
        )}
      </div>
    </div>
  );
}

const ARCanvas = ({path, exitAR}) => {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{fov: 45}} style={{position: "absolute"}}>
      <color attach="background" args={["#101010"]}/>
      <PresentationControls speed={2.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
        <Stage environment={"sunset"}>
          <Model scale={0.01} path={path}/>
        </Stage>
      </PresentationControls>
      <button onClick={exitAR} style={{position: "absolute", top: "10px", left: "10px"}}>
        Back to 3D
      </button>
    </Canvas>
  );
};

const VRCanvas = ({path, exitVR}) => {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{fov: 45}} style={{position: "absolute"}}>
      <color attach="background" args={["#101010"]}/>
      <PresentationControls speed={2.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
        <Stage environment={"sunset"}>
          <Model scale={0.01} path={path}/>
        </Stage>
      </PresentationControls>
      <button onClick={exitVR} style={{position: "absolute", top: "10px", left: "10px"}}>
        Back to 3D
      </button>
    </Canvas>
  );
};

const Canvas3D = ({path, enterVR}) => {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{fov: 45}} style={{position: "absolute"}}>
      <color attach="background" args={["#101010"]}/>
      <PresentationControls speed={2.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
        <Stage environment={"sunset"}>
          <Model scale={0.01} path={path}/>
        </Stage>
      </PresentationControls>
    </Canvas>
  );
};

export default App;

import {Canvas} from "@react-three/fiber";
import {PresentationControls, Stage, useGLTF} from "@react-three/drei";
import {useState} from "react";

function Model(props) {
  const {scene} = useGLTF(props.path);
  return <primitive object={scene} {...props} />
}

const models = [{
  key: "bmw",
  image: "/bmw.png",
  glpPath: "/bmw.glb"
}, {
  key: "dislo",
  image: "/dislo.png",
  glpPath: "/dislo.glb"
}]

function App() {
  const [activeGlb, setActiveGlb] = useState("/bmw.glb")
  return (
    <div style={{display: 'flex', gap: "0.5rem"}}>
      <div style={{width: "15%"}}>
        <div style={{display: 'flex', flexDirection: "column", gap: 20, cursor: 'pointer'}}>
          {
            models.map(model => (
              <div key={model.key} onClick={() => setActiveGlb(model.glpPath)}>
                <img alt={model.key} width={"100%"} src={model.image}/>
                <span>{model.key}</span>
              </div>
            ))
          }
        </div>
      </div>
      <div>
        <GlbDom path={activeGlb}/>
      </div>
    </div>
  );
}

const GlbDom = ({path}) => {
  return <Canvas dpr={[1, 2]} shadows camera={{fov: 45}} style={{"position": "absolute"}}>
    <color attach="background" args={["#101010"]}/>
    <PresentationControls speed={2.5} global zoom={.5} polar={[-0.1, Math.PI / 4]}>
      <Stage environment={"sunset"}>
        <Model scale={0.01} path={path}/>
      </Stage>
    </PresentationControls>
  </Canvas>
}
export default App;

import React, { useEffect, useRef, Suspense, lazy } from "react";
import Box from "../Box";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

function DeviceCard({ product, info }) {
  const ModelPs5 = () => {
    const fbxRef = useRef();

    useEffect(() => {
      const loader = new FBXLoader();
      if (info) {
        loader.load("/models/Ps5FBX.fbx", (object) => {
          object.scale.set(0.023, 0.023, 0.023);
          fbxRef.current.add(object);
          fbxRef.current.rotation.set(0, 0.4, 0);
          object.position.set(0, -2, 0);
        });
      } else {
        loader.load("/models/Ps5FBX.fbx", (object) => {
          object.scale.set(0.023, 0.023, 0.023);
          fbxRef.current.add(object);
          fbxRef.current.rotation.set(0, 90, 0);
          object.position.set(0, -2, 0);
        });
      }
    }, []);

    return <group ref={fbxRef} />;
  };
  const ModelXbox = () => {
    const fbxRef = useRef();

    useEffect(() => {
      const loader = new FBXLoader();
      if (info) {
        loader.load("/models/seriess.fbx", (object) => {
          object.scale.set(0.009, 0.009, 0.009);
          fbxRef.current.add(object);
          fbxRef.current.rotation.set(-5, 0, -0.3);
          object.position.set(0, 0, -2.5);
        });
      } else {
        loader.load("/models/seriess.fbx", (object) => {
          object.scale.set(0.009, 0.009, 0.009);
          fbxRef.current.add(object);
          fbxRef.current.rotation.set(-5, 0, -0.8);
          object.position.set(0, 0, -2.5);
        });
      }
    }, []);
    return <group ref={fbxRef} />;
  };
  return (
    <div>
      <Box>
        {product && product.toLowerCase().includes("ps5") ? (
          <Canvas style={{ height: "50vh" }}>
            <ambientLight intensity={1} />

            <directionalLight position={[0, 10, 5]} intensity={1} />
            <ModelPs5 />
            <OrbitControls enableZoom={false} />
          </Canvas>
        ) : product && product.toLowerCase().includes("xbox") ? (
          <Canvas style={{ height: "50vh" }} className="">
            <ambientLight intensity={1} />
            <directionalLight position={[20, 10, 50]} intensity={5} />
            <ModelXbox />
            <OrbitControls enableZoom={false} />
          </Canvas>
        ) : (
          ""
        )}
        <h1 className="font-PeydaBold text-center text-lg">{info}</h1>
      </Box>
    </div>
  );
}

export default DeviceCard;

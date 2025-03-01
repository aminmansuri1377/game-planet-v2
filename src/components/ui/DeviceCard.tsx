import React, { useEffect, useRef, Suspense, lazy, useState } from "react";
import Box from "../Box";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { trpc } from "../../../utils/trpc";
import ToastContent from "./ToastContent";
import { toast } from "react-hot-toast";

function DeviceCard({ product, info, buyerId }) {
  const [isSaved, setIsSaved] = useState(false);
  // console.log("buyerId", buyerId && buyerId);
  // console.log("productid", product && product);
  const { data: savedProducts } = trpc.main.getSavedProducts.useQuery({
    buyerId,
  });
  useEffect(() => {
    if (savedProducts) {
      setIsSaved(savedProducts.some((sp) => sp.productId === product.id));
    }
  }, [savedProducts, product.id]);

  const saveProductMutation = trpc.main.saveProduct.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Product saved successfully!" />
      );
      // reset();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const unsaveProductMutation = trpc.main.unsaveProduct.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Product unsaved successfully!" />
      );
      // reset();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });
  const handleSave = (e) => {
    e.stopPropagation();

    if (isSaved) {
      unsaveProductMutation.mutate({ buyerId, productId: product.id });
    } else {
      saveProductMutation.mutate({ buyerId, productId: product.id });
    }
    setIsSaved(!isSaved);
  };
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
        <button onClick={handleSave}>
          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
        {product && product.name.toLowerCase().includes("ps5") ? (
          <div>
            <Canvas style={{ height: "50vh" }}>
              <ambientLight intensity={1} />

              <directionalLight position={[0, 10, 5]} intensity={1} />
              <ModelPs5 />
              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>
        ) : product && product.name.toLowerCase().includes("xbox") ? (
          <div>
            <Canvas style={{ height: "50vh" }} className="">
              <ambientLight intensity={1} />
              <directionalLight position={[20, 10, 50]} intensity={5} />
              <ModelXbox />
              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>
        ) : (
          ""
        )}
        <h1 className="font-PeydaBold text-center text-lg">{info}</h1>
      </Box>
    </div>
  );
}

export default DeviceCard;

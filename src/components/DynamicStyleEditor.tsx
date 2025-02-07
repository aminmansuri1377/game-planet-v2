import { useState } from "react";

const DynamicStyleEditor = () => {
  const [textShadowColor, setTextShadowColor] = useState(
    "rgba(255, 255, 255, 0.7)"
  );
  const [backgroundColor, setBackgroundColor] = useState("#00154b");
  const [borderColor, setBorderColor] = useState("rgb(128, 0, 128)");

  const handleSubmit = (e) => {
    e.preventDefault();
    document.documentElement.style.setProperty(
      "--text-shadow-color",
      textShadowColor
    );
    document.documentElement.style.setProperty(
      "--background-color",
      backgroundColor
    );
    document.documentElement.style.setProperty("--border-color", borderColor);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Dynamic Style Editor</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Text Shadow Color</label>
          <input
            type="color"
            value={textShadowColor}
            onChange={(e) => setTextShadowColor(e.target.value)}
            className="border rounded p-1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Background Color</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="border rounded p-1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Border Color</label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="border rounded p-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Styles
        </button>
      </form>

      <div
        className="mt-6 p-4 rounded shadow"
        style={{
          backgroundColor: backgroundColor,
          textShadow: `0px 0px 5px ${textShadowColor}`,
          border: `2px solid ${borderColor}`,
        }}
      >
        <p className="glow-text">
          This is a dynamically styled text with a glow effect!
        </p>
      </div>
    </div>
  );
};

export default DynamicStyleEditor;

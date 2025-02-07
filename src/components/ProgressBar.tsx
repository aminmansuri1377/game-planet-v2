interface ProgressBarProps {
  current: number;
  total: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  height = 8,
  color = "#3C3DBF",
  backgroundColor = "#e0e0e0",
}) => {
  const percentage = (current / total) * 100;

  return (
    <div
      style={{
        height,
        width: "100%",
        backgroundColor,
        borderRadius: "5px",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${percentage}%`,
          backgroundColor: color,
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

export default ProgressBar;

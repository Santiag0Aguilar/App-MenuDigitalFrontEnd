export const ColorPicker = ({ tempColor, setTempColor }) => {
  const presetColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  return (
    <div className="color-picker-card">
      <h3>Color Principal</h3>

      <div className="color-preview" style={{ background: tempColor }}>
        <span>{tempColor}</span>
      </div>

      <div className="preset-colors">
        {presetColors.map((color) => (
          <button
            key={color}
            className={`color-preset ${tempColor === color ? "active" : ""}`}
            style={{ background: color }}
            onClick={() => setTempColor(color)}
          />
        ))}
      </div>

      <input
        type="color"
        value={tempColor}
        onChange={(e) => setTempColor(e.target.value)}
      />
    </div>
  );
};

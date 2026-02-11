import { useState } from "react";
import { useUI } from "../../contexts/UIContext";
import { menuAPI } from "../../services/api";
import { ColorPicker } from "./ColorPicker.jsx";
import { TemplateSelector } from "./TemplateSelector.jsx";
import "./UICustomization.css";

export const UICustomization = () => {
  const { primaryColor, templateType, updatePrimaryColor, updateTemplateType } =
    useUI();

  const [tempColor, setTempColor] = useState(primaryColor);
  const [tempTemplate, setTempTemplate] = useState(templateType);
  const [saving, setSaving] = useState(false);

  const hasChanges =
    tempColor !== primaryColor || tempTemplate !== templateType;

  const handleSave = async () => {
    setSaving(true);
    try {
      await menuAPI.updateMenu({
        primaryColor: tempColor,
        templateType: tempTemplate,
      });

      // Sync global UI state
      updatePrimaryColor(tempColor);
      updateTemplateType(tempTemplate);
    } catch (error) {
      console.error("Error guardando UI:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ui-customization">
      <ColorPicker tempColor={tempColor} setTempColor={setTempColor} />

      <TemplateSelector
        tempTemplate={tempTemplate}
        setTempTemplate={setTempTemplate}
      />

      <button
        className="save-btn global"
        onClick={handleSave}
        disabled={!hasChanges || saving}
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
};

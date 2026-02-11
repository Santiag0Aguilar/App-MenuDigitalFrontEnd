import { useState } from 'react';
import { useUI } from '../../contexts/UIContext';
import { menuAPI } from '../../services/api';
import './UICustomization.css';

export const ColorPicker = () => {
  const { primaryColor, updatePrimaryColor } = useUI();
  const [tempColor, setTempColor] = useState(primaryColor);
  const [saving, setSaving] = useState(false);

  const presetColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await menuAPI.updateMenu({ primaryColor: tempColor });
      updatePrimaryColor(tempColor);
    } catch (error) {
      console.error('Error guardando color:', error);
    }
    setSaving(false);
  };

  return (
    <div className="color-picker-card">
      <h3>Color Principal</h3>
      <p className="card-description">
        Personaliza el color de tu menú digital
      </p>

      <div className="color-preview" style={{ background: tempColor }}>
        <span>{tempColor}</span>
      </div>

      <div className="preset-colors">
        {presetColors.map((color) => (
          <button
            key={color}
            className={`color-preset ${tempColor === color ? 'active' : ''}`}
            style={{ background: color }}
            onClick={() => setTempColor(color)}
            title={color}
          />
        ))}
      </div>

      <div className="custom-color">
        <label htmlFor="color-input">Color personalizado:</label>
        <input
          id="color-input"
          type="color"
          value={tempColor}
          onChange={(e) => setTempColor(e.target.value)}
        />
      </div>

      <button 
        className="save-btn"
        onClick={handleSave}
        disabled={saving || tempColor === primaryColor}
      >
        {saving ? 'Guardando...' : 'Guardar Color'}
      </button>
    </div>
  );
};

export const TemplateSelector = () => {
  const { templateType, updateTemplateType } = useUI();
  const [tempTemplate, setTempTemplate] = useState(templateType);
  const [saving, setSaving] = useState(false);

  const templates = [
    {
      id: 'TEMPLATE_1',
      name: 'Clásico',
      description: 'Diseño tradicional con cards',
      preview: '📋',
    },
    {
      id: 'TEMPLATE_2',
      name: 'Moderno',
      description: 'Estilo minimalista con listas',
      preview: '📱',
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await menuAPI.updateMenu({ templateType: tempTemplate });
      updateTemplateType(tempTemplate);
    } catch (error) {
      console.error('Error guardando template:', error);
    }
    setSaving(false);
  };

  return (
    <div className="template-selector-card">
      <h3>Plantilla de Menú</h3>
      <p className="card-description">
        Elige el estilo de tu menú digital
      </p>

      <div className="templates-grid">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`template-option ${tempTemplate === template.id ? 'active' : ''}`}
            onClick={() => setTempTemplate(template.id)}
          >
            <div className="template-preview">{template.preview}</div>
            <div className="template-info">
              <div className="template-name">{template.name}</div>
              <div className="template-desc">{template.description}</div>
            </div>
          </button>
        ))}
      </div>

      <button 
        className="save-btn"
        onClick={handleSave}
        disabled={saving || tempTemplate === templateType}
      >
        {saving ? 'Guardando...' : 'Guardar Plantilla'}
      </button>
    </div>
  );
};

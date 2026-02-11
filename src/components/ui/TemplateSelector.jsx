export const TemplateSelector = ({ tempTemplate, setTempTemplate }) => {
  const templates = [
    {
      id: "TEMPLATE_1",
      name: "Clásico",
      description: "Diseño tradicional",
      preview: "📋",
    },
    {
      id: "TEMPLATE_2",
      name: "Moderno",
      description: "Minimalista",
      preview: "📱",
    },
  ];

  return (
    <div className="template-selector-card">
      <h3>Plantilla de Menú</h3>

      <div className="templates-grid">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`template-option ${
              tempTemplate === template.id ? "active" : ""
            }`}
            onClick={() => setTempTemplate(template.id)}
          >
            <div>{template.preview}</div>
            <div>{template.name}</div>
            <small>{template.description}</small>
          </button>
        ))}
      </div>
    </div>
  );
};

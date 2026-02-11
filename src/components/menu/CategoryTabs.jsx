import { useState } from 'react';
import './CategoryTabs.css';

const CategoryTabs = ({ categories, onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  const activeCategories = categories.filter(cat => cat.isActive);

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <div className="category-tabs">
      <div className="category-tabs-scroll">
        <button
          className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('all')}
        >
          Todos
        </button>
        {activeCategories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
            style={activeCategory === category.id && category.color ? {
              backgroundColor: category.color,
              borderColor: category.color,
            } : {}}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;

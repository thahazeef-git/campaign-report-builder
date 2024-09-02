import dynamic from "next/dynamic";
import React from 'react';

const ChartComponent = dynamic(() => import("./ChartComponent"), {
  loading: () => <></>,
});

const RenderComponent = ({component, displayType, data, index, components, setComponents, setOriginalComponents, filters}) => {
  const totalValue = data?.datasets[0]?.data?.reduce((acc, value) => acc + value, 0);

  const handleRemoveComponent = () => {
    const updatedComponents = components?.filter((_, i) => i !== index);
    setComponents(updatedComponents);
    setOriginalComponents(JSON.parse(JSON.stringify(updatedComponents)));
  };

  switch (displayType) {
    case 'bar':
    case 'line':
      return (
        <div className="relative bg-white p-4 rounded-lg border border-gray-300">
          <ChartComponent type={displayType} data={data} componentName={component} />
          <button
            className="absolute top-0 right-0 text-gray-500 text-xl pr-3"
            onClick={handleRemoveComponent}
          >
            &times;
          </button>
        </div>
      );
    case 'card':
    default:
      return (
        <div className="relative bg-white p-4 pr-9 rounded-lg border border-gray-300">
          <button
            className="absolute top-0 right-0 text-gray-500 text-xl pr-2"
            onClick={handleRemoveComponent}
          >
            &times;
          </button>
          <h3 className="text-lg font-semibold">{component}</h3>
          <p className="text-gray-700">{filters?.deviceType || 'All Devices'}: {totalValue}</p>
        </div>
      );
  }
};

export default RenderComponent;
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/ReportBuilder.module.css';
import axios from 'axios';
import { setupMockApi, exportToPDFAndPNG, availableComponents } from '../helper/index';
import { auth, db } from '../components/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from 'firebase/firestore';
import dynamic from "next/dynamic";

const RenderComponent = dynamic(() => import("../components/RenderComponent"), {
  loading: () => <></>,
});

const OptionsModal = dynamic(() => import("../components/OptionsModal"), {
  loading: () => <></>,
});

const Filters = dynamic(() => import("../components/Filters"), {
  loading: () => <></>,
});

// Create an instance of axios
const api = axios.create();

// Setup mock API
setupMockApi(api);

const ReportBuilder = () => {
  const [components, setComponents] = useState([]);
  const [originalComponents, setOriginalComponents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [filters, setFilters] = useState({
    campaignName: '',
    startDate: '',
    endDate: '',
    deviceType: '',
  });
  const [customCalculation, setCustomCalculation] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.push('/login').then(() => {
        alert('User not authenticated');
      });
    }
  }, [user, loading]);

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('text/plain', component);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add(styles.dragging);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove(styles.dragging);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const component = e.dataTransfer.getData('text/plain');
    setCurrentComponent(component);
    setIsModalOpen(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    try {
      const updatedComponents = await Promise.all(
        components.map(async (comp) => {
          const response = await api.get('/chart-data', { params: { ...updatedFilters, component: comp?.component } });
          let newData = response.data;
          const updatedDatasets = comp.data.datasets.map((dataset, index) => ({
            ...dataset,
            data: newData.datasets[index].data,
            label: updatedFilters.deviceType || 'All Devices',
          }));

          return {
            ...comp,
            data: {
              ...comp.data,
              datasets: updatedDatasets,
            },
          };
        })
      );

      setComponents(updatedComponents);
      setOriginalComponents(JSON.parse(JSON.stringify(updatedComponents)));
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const handleModalSubmit = async (displayType, color) => {
    try {
      const response = await api.get('/chart-data', { params: { ...filters, color, component: currentComponent } });
      let data = response.data;
      data.datasets.forEach(dataset => {
        dataset.label = filters.deviceType || 'All Devices';
      });
      setComponents([...components, { component: currentComponent, displayType, color, data }]);
      setOriginalComponents(JSON.parse(JSON.stringify([...components, { component: currentComponent, displayType, color, data }])));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const handleCustomCalculationChange = (e) => {
    setCustomCalculation(e.target.value);
  };

  const applyCustomCalculation = () => {
    if (!customCalculation || customCalculation.trim() === '') {
      setComponents(JSON.parse(JSON.stringify(originalComponents)));
      return;
    }
    else {
      const newComponents = components.map((component) => {
        const newData = component.data.datasets[0]?.data.map((value) => {
          return eval(customCalculation.replace(/value/g, value));
        });

        let temp = { ...component, data: { ...component.data, datasets: [...component.data.datasets] } };

        if (temp.data.datasets[0]) {
          temp.data.datasets[0].data = newData;
        }

        return temp;
      });

      setComponents(newComponents);
    }
  };

  const saveReport = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      await addDoc(collection(db, 'reports'), {
        uid: user.uid,
        components,
        filters,
        customCalculation,
        createdAt: new Date(),
      });
      alert('Report saved successfully', 'Success');
    } catch (error) {
      alert('Error saving report', 'Error');
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      router.push('/login').then(() => {
        alert('Logged out successfully', 'Success');
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Campaign Report Builder</title>
      </Head>
      <div className="mx-auto h-full">
        <div className="flex justify-between items-center mb-6 bg-white p-4 shadow-md">
          <img src="https://zocket.ai/_astro/zocket.YMlk0GML.svg" alt="logo" />
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={exportToPDFAndPNG}>Export</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={saveReport}>Save Report</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={logout}>Logout</button>
          </div>
        </div>

        <Filters filters={filters} handleFilterChange={handleFilterChange} />

        <div className="flex items-center space-x-6 pl-4 pr-4">
          <div className="w-full h-full">
            <div className="dropzone p-4 border-2 border-dashed border-gray-300 rounded mb-3 flex flex-wrap justify-evenly" onDrop={handleDrop} onDragOver={handleDragOver}>
              {components.map(({ component, displayType, color, data }, index) => (
                <div key={index} className="ml-4 mb-5 mt-3">
                  <RenderComponent
                    component={component}
                    displayType={displayType}
                    data={data}
                    index={index}
                    components={components}
                    setComponents={setComponents}
                    setOriginalComponents={setOriginalComponents}
                    filters={filters}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {availableComponents.map((label, index) => (
              <div
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer flex items-center w-[270px]"
                draggable
                onDragStart={(e) => handleDragStart(e, label)}
                onDragEnd={handleDragEnd}
              >
                <img src="https://img.icons8.com/?size=96&id=imXBRy8ILzI5&format=png&color=228BE6" alt="logo" width={20} className='mr-3' />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4">
          <h3 className="text-xl font-semibold mb-3">Custom Calculation </h3>
          <form className="flex space-x-2">
            <input
              type="text"
              value={customCalculation}
              onChange={handleCustomCalculationChange}
              placeholder="e.g., value*2"
              className="p-2 border border-gray-300 rounded w-[12rem]"
            />
            <button type="button" onClick={applyCustomCalculation} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
              Apply
            </button>
          </form>
        </div>

      </div>
      <OptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};

export default ReportBuilder;
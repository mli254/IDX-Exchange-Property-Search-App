import { useState, useEffect } from 'react';
import './App.css'
import ListingsPage from './components/ListingsPage'
import api from './api/client.js'

function App() {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);

      const response = await api.fetchProperties({ limit: 5, offset: 5, });
      if (response) {
        setProperties(response);
      }

      setLoading(false);
    };

    loadProperties();
  }, []);

  return (
    <>
    {loading ? (
      <h2>Loading...</h2>
    ) : (
      <div className="font-bold">
        <ListingsPage/>
        <p>{JSON.stringify(properties)}</p>
      </div>
    )}
    </>
  )
}

export default App

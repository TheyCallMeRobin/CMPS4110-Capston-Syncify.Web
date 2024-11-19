import React, { useEffect, useState } from 'react';
import { UnitsService } from '../api/generated/UnitsService';


const UnitsDropdown = ({ value, onChange }) => {
  const [units, setUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const response = await UnitsService.getUnits();
        setUnits(response.data || []);
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  if (loading) {
    return <div>Loading units...</div>;
  }

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select a unit</option>
      {units.map((unit) => (
        <option key={unit} value={unit}>
          {unit}
        </option>
      ))}
    </select>
  );
};

export default UnitsDropdown;

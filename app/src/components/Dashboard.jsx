import { useMemo, useState } from 'react';
import PetPicker from './PetPicker.jsx';
import TaskList from './TaskList.jsx';
import CareLog from './CareLog.jsx';
import useLocalPetId from '../hooks/useLocalPetId.js';

export default function Dashboard() {
  const [selectedPetId, setSelectedPetId] = useLocalPetId('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPetMeta, setSelectedPetMeta] = useState(null);

  const handleSelectPet = (petId) => {
    setSelectedPetId(petId);
    if (!petId) {
      setSelectedPetMeta(null);
    }
  };

  const selectedPet = useMemo(() => {
    if (!selectedPetId) {
      return null;
    }

    if (selectedPetMeta?.id === selectedPetId) {
      return selectedPetMeta;
    }

    return { id: selectedPetId, name: 'Selected pet' };
  }, [selectedPetId, selectedPetMeta]);

  const onTaskCompleted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      data-testid="pet-care-dashboard"
      className="container mx-auto min-h-screen bg-base-200 px-4 py-4 sm:px-6"
    >
      <div className="rounded-box bg-base-100 shadow-sm">
        <div className="navbar border-b border-base-300 px-4">
          <a href="/" className="text-xl font-semibold">
            Pet Care Planner
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-12">
          <aside className="sm:col-span-4">
            <PetPicker
              value={selectedPetId}
              onChange={handleSelectPet}
              onSelectPet={handleSelectPet}
              onPetLoaded={setSelectedPetMeta}
            />
          </aside>
          <main className="space-y-4 rounded-box bg-base-200 p-3 sm:col-span-8">
            <TaskList pet={selectedPet} onCompleteTask={onTaskCompleted} refreshKey={refreshKey} />
            <div className="divider my-1" />
            <CareLog
              pet={selectedPet}
              refreshKey={refreshKey}
              onRefresh={() => setRefreshKey((prev) => prev + 1)}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

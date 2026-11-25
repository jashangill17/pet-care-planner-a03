import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PetPicker from '../components/PetPicker.jsx';
import TaskList from '../components/TaskList.jsx';
import CareLog from '../components/CareLog.jsx';

export default function PetsPage() {
  // The selected pet now comes from the URL (/pets/:petId), not localStorage,
  // so a selected pet can be bookmarked or shared.
  const { petId = '' } = useParams();
  const navigate = useNavigate();

  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPetMeta, setSelectedPetMeta] = useState(null);

  // Selecting a pet changes the URL. On plain /pets, PetPicker picks the first
  // pet for us; we use "replace" there so the Back button doesn't bounce back
  // to /pets.
  const handleSelectPet = useCallback(
    (newPetId) => {
      if (!newPetId || newPetId === petId) {
        return;
      }
      navigate(`/pets/${newPetId}`, { replace: !petId });
    },
    [navigate, petId],
  );

  const selectedPet = useMemo(() => {
    if (!petId) {
      return null;
    }

    if (selectedPetMeta?.id === petId) {
      return selectedPetMeta;
    }

    return { id: petId, name: 'Selected pet' };
  }, [petId, selectedPetMeta]);

  const onTaskCompleted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
      <aside className="sm:col-span-4">
        <PetPicker
          value={petId}
          onChange={handleSelectPet}
          onPetLoaded={setSelectedPetMeta}
        />
      </aside>
      <section className="space-y-4 rounded-box bg-base-200 p-3 sm:col-span-8">
        <TaskList pet={selectedPet} onCompleteTask={onTaskCompleted} refreshKey={refreshKey} />
        <div className="divider my-1" />
        <CareLog
          pet={selectedPet}
          refreshKey={refreshKey}
          onRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
      </section>
    </div>
  );
}

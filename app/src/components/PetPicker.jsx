import { useEffect, useMemo, useState } from 'react';
import { fetchPets } from '../api/pet-care-api.js';
import { titleCase } from '../util/index.js';

export default function PetPicker({
  pets: petsProp,
  loading: loadingProp,
  error: errorProp,
  value = '',
  onChange,
  onSelectPet,
  onPetLoaded,
}) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const useExternalPets = Array.isArray(petsProp);

  useEffect(() => {
    if (useExternalPets) {
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchPets();
        if (!active) {
          return;
        }
        setPets(data);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err.message || 'Failed to load pets');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [useExternalPets]);

  const renderedPets = useExternalPets ? petsProp : pets;
  const renderedLoading = useExternalPets ? Boolean(loadingProp) : loading;
  const renderedError = useExternalPets ? errorProp : error;

  const selectedPetId = value || '';
  const selectedPet = useMemo(
    () => renderedPets.find((pet) => pet.id === selectedPetId) || null,
    [renderedPets, selectedPetId],
  );

  useEffect(() => {
    if (renderedLoading || renderedError || !renderedPets.length) {
      return;
    }

    const resolvedPetId = selectedPetId || renderedPets[0].id;
    const pet = renderedPets.find((item) => item.id === resolvedPetId) || null;
    onPetLoaded?.(pet);

    if (!selectedPetId) {
      onChange?.(resolvedPetId);
      onSelectPet?.(resolvedPetId);
    }
  }, [
    renderedLoading,
    renderedError,
    renderedPets,
    selectedPetId,
    onChange,
    onSelectPet,
    onPetLoaded,
  ]);

  return (
    <section aria-label="Pet picker" data-testid="pet-picker" className="space-y-3">
      <h2 className="text-xl font-semibold">Pets</h2>
      {renderedLoading && <p>Loading pets...</p>}
      {renderedError && (
        <div role="alert" className="alert alert-error">
          <span>{renderedError}</span>
        </div>
      )}
      {!renderedLoading && !renderedError && (
        <>
          <div className="space-y-2">
            {renderedPets.map((pet) => (
              <button
                type="button"
                key={pet.id}
                className={`w-full rounded-box border p-2 text-left transition ${pet.id === selectedPetId
                  ? 'border-primary bg-primary/10'
                  : 'border-base-300 bg-base-100'
                  }`}
                onClick={() => {
                  onPetLoaded?.(pet);
                  if (onChange) {
                    onChange(pet.id);
                  }
                  if (onSelectPet) {
                    onSelectPet(pet.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  {pet.avatarUrl ? (
                    <img
                      src={pet.avatarUrl}
                      alt={pet.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : null}
                  <div>
                    <p className="font-semibold">{pet.name}</p>
                    <p className="text-sm opacity-75">
                      {titleCase(pet.species) || 'Pet'}{pet.breed ? ` - ${pet.breed}` : ''}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {!renderedPets.length && <p>No pets available.</p>}
          </div>
        </>
      )}
      {selectedPet ? (
        <p className="text-sm opacity-80">Selected: {selectedPet.name}</p>
      ) : null}
    </section>
  );
}

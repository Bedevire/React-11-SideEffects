import { useRef, useState, useEffect } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const currentIDs = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const myPlaces = currentIDs.map((id) => {
  return AVAILABLE_PLACES.find((place) => place.id === id);
}
);

function App() {
  const selectedPlace = useRef();

  const [modalisOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([...AVAILABLE_PLACES]);
  const [pickedPlaces, setPickedPlaces] = useState(myPlaces);
  
  useEffect(() =>{
    navigator.geolocation.getCurrentPosition((position) => {
      
      const sortedPlaces = sortPlacesByDistance(
        availablePlaces, 
        position.coords.latitude,
        position.coords.longitude
      );
  
      setAvailablePlaces(sortedPlaces);
    });
  }, []);



  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        console.log('We already have a place with the ID ' + id);
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    
    let currentIDs = JSON.parse(localStorage.getItem('selectedPlaces') || []);
    if(currentIDs.indexOf(id) === -1){
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...currentIDs]));
    }

  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );

    let currentIDs = JSON.parse(localStorage.getItem('selectedPlaces'));
    const newIDs = currentIDs.filter((id) => id !== selectedPlace.current);
    localStorage.setItem('selectedPlaces', JSON.stringify(newIDs));

   setModalIsOpen(false);
  }

  return (
    <>
      <Modal open={modalisOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces} 
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;

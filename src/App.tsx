import { Routes, Route, Navigate } from 'react-router-dom';

import { AllComponents } from './pages/AllComponents'
import { ComponentInfo } from './pages/ComponentInfo'

import NavigationBar from './components/NavBar';


function App() {

  return (
    <div className='d-flex flex-column vh-100'>
      <NavigationBar />
      <div className='container-xl d-flex flex-column px-2 px-sm-4 flex-grow-1'>
        <Routes>
          <Route path="/" element={<Navigate to="/components" />} />
          <Route path="/components" element={<AllComponents />} />
          <Route path="/components/:component_id" element={<ComponentInfo />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
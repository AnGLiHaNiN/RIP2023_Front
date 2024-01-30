import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

import AllComponents from './pages/AllComponents';
import ComponentInfo from './pages/ComponentInfo';
import AllMedicines from './pages/AllMedicines';
import MedicineInfo from './pages/MedicineInfo';
import Registration from './pages/Registration';
import Authorization from './pages/Authorization';
import NavigationBar from './components/NavBar';
import WithAuthCheck from './components/WithAuthCheck';
import { MODERATOR, CUSTOMER } from './ds';
import { AppDispatch } from "./store";
import { setLogin, setRole } from "./store/userSlice";


function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const login = localStorage.getItem('login');
    const role = localStorage.getItem('role');
    if (login && role) {
      dispatch(setLogin(login));
      dispatch(setRole(parseInt(role)));
    }
  }, [dispatch]);

  return (
    <div className='d-flex flex-column vh-100'>
      <NavigationBar />
      <div className='container-xl d-flex flex-column px-2 px-sm-4 flex-grow-1'>
        <Routes>
          <Route path="/" element={<Navigate to="/components" />} />
          <Route path="/components" element={<AllComponents />} />
          <Route path="/components/:component_id" element={<ComponentInfo />} />

          <Route path="/medicines" element={<WithAuthCheck allowedRoles={[CUSTOMER, MODERATOR]}><AllMedicines /></WithAuthCheck>} />
          <Route path="/medicines/:medicine_id" element={<WithAuthCheck allowedRoles={[CUSTOMER, MODERATOR]}><MedicineInfo /></WithAuthCheck>} />

          <Route path="/registration" element={<Registration />} />
          <Route path="/authorization" element={<Authorization />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
import { Routes, Route } from 'react-router-dom';
import Wingo from './Games/Wingo';

const Games = () => {
  return (
    <Routes>
      <Route path="/wingo" element={<Wingo />} />
      {/* <Route path="k3" element={<K3 />} />
      <Route path="5d" element={<FiveD />} /> */}
    </Routes>
  );
};

export default Games; 
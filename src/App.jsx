import React, { useEffect } from "react";

import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import MedicalRecord from './pages/records/index';
import { useStatecontext } from "./context";
import { usePrivy } from "@privy-io/react-auth";
import Profile from "./pages/Profile";
import SingleDecordDetials from "./pages/records/single-record-detials";

const App = () => {
  const navigate = useNavigate();
  const { currentUser } = useStatecontext();

  const { user, authenticated, ready, login } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      login();
    } else if(user && !currentUser){
        //  navigate('/onboarding')
    }
  }, [ ready, login,  navigate]);

  return (
    <div className="relative flex min-h-screen flex-row bg-[#13131a] p-4">
      <div className="relative mr-10 hidden sm:flex">
        <Sidebar />
      </div>
      <div className="mx-auto max-w-[1280px] flex-1 max-sm:w-full sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/medical-records" element={<MedicalRecord />} />
          <Route path="/medical-records/:id" element={<SingleDecordDetials />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;

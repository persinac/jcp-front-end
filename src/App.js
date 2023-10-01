import './App.css';
import 'semantic-ui-css/semantic.min.css'
import 'sidecar.css'; // custom CSS file
import React from "react";
import Home from "./components/Home";
import NavigationBar from "./components/Navbar";
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom"
import Programs from "./components/Program/Programs";
import AthleteManagement from "./components/AthleteManagement";
import Settings from "./components/Settings/Settings";

function App() {
  return (
    <div className={'container-fluid'}>
        <BrowserRouter>
            <NavigationBar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/programs" element={<Programs />} />
                <Route exact path="/athletes" element={<AthleteManagement />} />
                <Route exact path="/settings" element={<Settings />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}



export default App;

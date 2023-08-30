import './App.css';
import 'semantic-ui-css/semantic.min.css'
import React, { useState }from "react";
import IncrementDecrementComponent from "./components/IncrementDecrement";
import UserInput from "./components/UserInput";
import Home from "./components/Home";
import NavigationBar from "./components/Navbar";
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom"
import Programs from "./components/Programs";

function App() {
  return (
    <div className={'container-fluid'}>
        <BrowserRouter>
            <NavigationBar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/programs" element={<Programs />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}



export default App;

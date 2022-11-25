import './App.css';
import 'semantic-ui-css/semantic.min.css'
import React, { useState }from "react";
import IncrementDecrementComponent from "./components/IncrementDecrement";
import UserInput from "./components/UserInput";

function App() {
  return (
    <div className={'container-fluid'}>
        {/*<IncrementDecrementComponent />*/}
        <UserInput />
    </div>
  );
}



export default App;

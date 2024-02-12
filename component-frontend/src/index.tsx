import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Scenario from './Scenario';
import AdjValue from './AdjValue';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path='/Scenario' element={<Scenario />}/>
        <Route path='/AdjValue' element={<AdjValue/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);



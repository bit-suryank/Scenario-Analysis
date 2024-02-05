import './App.css';
import Scenario from './Scenario';
import AdjValue from './AdjValue';
import { Route, Routes } from 'react-router-dom';
import { withStreamlitConnection, StreamlitComponentBase } from 'streamlit-component-lib';


class App extends StreamlitComponentBase {
  render() {
    return (
      <div className='App'>
        <Routes>
          <Route path='/' element={<Scenario />}/>
          <Route path='/AdjValue' element={<AdjValue/>}/>
        </Routes>
      </div>
    )
  }
}

export default withStreamlitConnection(App)
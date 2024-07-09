import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className='App'>
      <h1 className='App-header'>Pomodoro Clock</h1>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-6 remove-padding'><label className='w-100' id='break-label'>Break Length</label></div>
          <div className='col-sm-6 remove-padding'><label className='w-100' id='session-label'>Session Length</label></div>
        </div>
        <div className='row'>
          <div className='col-sm-2 remove-padding'><button className='w-100' id='break-decrement'>-</button></div>
          <div className='col-sm-2'><label id='break-length' value='5' className='w-100'>5</label></div>
          <div className='col-sm-2 remove-padding'><button className='w-100' id='break-increment'>+</button></div>
          <div className='col-sm-2 remove-padding'><button className='w-100' id='break-decrement'>-</button></div>
          <div className='col-sm-2'><label id='session-length' value='25' className='w-100'>25</label></div>
          <div className='col-sm-2 remove-padding'><button className='w-100' id='break-increment'>+</button></div>
        </div>
      </div>
    </div>
  );
}

export default App;

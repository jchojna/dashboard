import React from 'react';
import TextPanel from './TextPanel';
import '../scss/App.scss';

function App() {
  return (
    <div className="App">
        <h1 className="App__heading">Enterprise Shiny Dashboards</h1>
        <TextPanel
          key="profit"
          id="profit"
          heading="Total profit"
          value="2674862"
          percentage="4,5"
        />
        <TextPanel
          key="users"
          id="users"
          heading="Active users"
          value="657"
          percentage="8,5"
        />
        <TextPanel
          key="orders"
          id="orders"
          heading="New orders"
          value="245"
          percentage="3,9"
        />
        <TextPanel
          key="complaints"
          id="complaints"
          heading="Open complaints"
          value="12"
          percentage="-5,3"
        />
    </div>
  );
}

export default App;

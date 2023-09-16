import logo from './logo.svg';
import './App.css';
import Calculator from './Calculator';

function App() {
  return (
    <div className="App">
        <div className="sidenav">
            <div className="title">
                ChatGPT<br/>
                CO2<br/>
                Calculator
            </div>
            <div className="members">
                <span>FtO2023</span><br/>
                <span>Team Climate Alert</span><br/>
                <span>Jerry | Cree | Hyunju</span><br />
                <span>YUKA | Haemin | Gavin</span>
            </div>
            <div className="desc">
                The lorem ipsum is a placeholder text used in publishing and graphic design.
                This filler text is a short paragraph that contains all the letters of the
                alphabet.
            </div>
        </div>
        <div className="main">
            <div className="question">Put any questions you want to ask in ChatGPT!</div>
            <div className="desc">
                When you submit it, you'll calculate the words you typed and tell you
                how much electricity you use and how much carbon dioxide you generate in the
                atmosphere!
            </div>
            <Calculator />
        </div>
    </div>
  );
}

export default App;

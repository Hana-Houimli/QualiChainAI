import ChatBox from "./components/ChatBox";
import "./App.css";


function App() {


  return (

    <div className="app-container">


      <header className="app-header">

        <h1>
          QualiChain AI
        </h1>

        <span>
          Pharmaceutical Compliance Assistant
        </span>

      </header>



      <main className="chat-container">

        <ChatBox />

      </main>


    </div>

  );

}


export default App;
// import logo from './logo.svg';
import './App.css';
// import Todo from './components/Todo';
// import AddTodo from './components/AddTodo';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux"
import { store } from "../src/store/store"
import CardGames from './components/CardGames';
import Login from './loginsignup/Login';
import Signup from './loginsignup/Signup';
// import Main from './components/Main.js';
import Leaderboard from './components/Leaderboard';
import Main from './components/Main';

function App() {
  return (

    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main/>} ></Route>
            <Route path="/cardgame" element={<CardGames/>} ></Route>
            <Route path="/leaderboard" element={<Leaderboard/>} ></Route>
            <Route path="/login" element={<Login />}  ></Route>
            <Route path="/register" element={<Signup />}></Route>

          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

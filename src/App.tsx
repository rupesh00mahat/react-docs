import { Provider } from "react-redux";
import "./App.css";
import LoginPage from './ui/LoginPage';
import ProtectedRoutes from './ui/ProtectedRoutes';
import HomePage from './ui/Homepage/HomePage';
import store from './store/store';
import Document from "./ui/document/Document";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes/>}>
          <Route path="/" element={<HomePage/>}/>
        </Route>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="document/:id" element={<Document/>}/>
      </Routes>
    </BrowserRouter>
    
  </Provider>;
}

export default App;

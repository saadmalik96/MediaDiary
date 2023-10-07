import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Movies from './components/Movies';
import TV from './components/TV';
import Suggest from './components/Suggest';


const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv" element={<TV />} />
                <Route path="/suggest" element={<Suggest />} />
            </Routes>
        </Router>
    );
}

export default App;

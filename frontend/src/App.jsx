import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import DeveloperTool from './components/DeveloperTool';
import PublicChangelog from './components/PublicChangelog';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="public" element={<PublicChangelog />} />
                    <Route path="developer" element={<DeveloperTool />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
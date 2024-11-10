import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProject from './components/CreateProject';
import DocumentationPage from './components/DocumentationPage';
import OsCommander from './components/OsCommander';
import AssistantInteraction from './components/AssistantInteraction';
import VoiceCommandSender from './components/VoiceCommandSender';
import PrivateRoute from './auth/PrivateRoute';
import Register from './auth/Register';
import Login from './auth/Login';
import Home from './pages/Home';
import Footer from './components/Footer';
import Navbar from './components/Navbar';


const App = () => {
return (
  <Router>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project-list" element={<ProjectList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/create" element={<CreateProject />} />
        <Route path="/os-command1" element={<OsCommander />} />
        <Route path="/os-command" element={<PrivateRoute><VoiceCommandSender /></PrivateRoute>} />
        <Route path="/assistant" element={<AssistantInteraction />} />
        <Route path="/documentation" element={<DocumentationPage />} />
      </Routes>
    <Footer/>
  </Router>
);
};

export default App;

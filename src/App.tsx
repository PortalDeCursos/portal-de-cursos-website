import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';
function NavigationReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <BrowserRouter>
      <NavigationReset />
      <div className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:p-4">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="main" className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cursos" element={<CoursesPage />} />
            <Route path="/cursos/:courseId" element={<CourseDetailsPage />} />
            <Route path="/projetos" element={<ProjectsPage />} />
            <Route path="/projetos/:projectId" element={<ProjectDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

import { Route, Routes } from 'react-router'
import PortalLayout from '../../shared/components/layout/PortalLayout'
import HomePage from '../../features/home/pages/HomePage'
import CoursesPage from '../../features/courses/pages/CoursesPage'
import CourseDetailsPage from '../../features/courses/pages/CourseDetailsPage'
import ProjectsPage from '../../features/projects/pages/ProjectsPage'
import ProjectDetailsPage from '../../features/projects/pages/ProjectDetailsPage'
import NotFoundPage from '../../shared/pages/NotFoundPage'

export default function AppRoutes() {
  return <Routes>
    <Route element={<PortalLayout />}>
      <Route index element={<HomePage />} />
      <Route path="cursos" element={<CoursesPage />} />
      <Route path="cursos/:courseId" element={<CourseDetailsPage />} />
      <Route path="projetos" element={<ProjectsPage />} />
      <Route path="projetos/:projectId" element={<ProjectDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
}

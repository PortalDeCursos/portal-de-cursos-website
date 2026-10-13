import type { Project } from './types';
export function filterCourseProjects(projects: Project[], courseId: string, category = '') {
  return projects.filter(
    (project) => project.courseId === courseId && (!category || project.category === category),
  );
}

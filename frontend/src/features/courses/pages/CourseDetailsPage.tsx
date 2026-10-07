import { useParams, useSearchParams } from "react-router";
import useCatalog from "../hooks/useCatalog";
import { courseDetails } from "../data/mocks/courseDetails";
import { projects } from "../../projects/data/mocks/projects";
import CourseIdentity from "../components/details/CourseIdentity";
import CourseTabs from "../components/details/CourseTabs";
import CourseOverview from "../components/details/CourseOverview";
import CourseCurriculum from "../components/details/CourseCurriculum";
import CourseFaculty from "../components/details/CourseFaculty";
import CourseProjects from "../components/details/CourseProjects";
import CourseCoordination from "../components/details/CourseCoordination";
import CourseDetailsSkeleton from "../components/details/CourseDetailsSkeleton";
import type { CourseTab } from "../types/details";
import NotFoundPage from "../../../shared/pages/NotFoundPage";
import "../styles/details.css";
const validTabs: CourseTab[] = [
  "overview",
  "curriculum",
  "faculty",
  "projects",
];
export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const [params, setParams] = useSearchParams();
  const catalog = useCatalog();
  const course = catalog.courses.find((item) => item.id === courseId);
  const requestedTab = params.get("tab") as CourseTab | null;
  const activeTab =
    requestedTab && validTabs.includes(requestedTab)
      ? requestedTab
      : "overview";
  function changeTab(tab: CourseTab) {
    const next = new URLSearchParams(params);
    next.set("tab", tab);
    setParams(next);
  }
  function changeCategory(category: string) {
    const next = new URLSearchParams(params);
    if (category) next.set("type", category);
    else next.delete("type");
    setParams(next, { replace: true });
  }
  if (catalog.status === "loading")
    return (
      <div className="course-details-page">
        <div className="container course-details-content">
          <CourseDetailsSkeleton />
        </div>
      </div>
    );
  if (catalog.status === "error")
    return (
      <div className="container page" role="alert">
        <h1 className="page-title">Não foi possível carregar o curso</h1>
        <p className="my-6 text-muted">
          Verifique sua conexão e tente novamente.
        </p>
        <button
          type="button"
          className="primary-button"
          onClick={catalog.retry}
        >
          Tentar novamente
        </button>
      </div>
    );
  if (!course) return <NotFoundPage />;
  const details = courseDetails[course.id];
  return (
    <div className="course-details-page">
      <div className="container course-details-content">
        <CourseIdentity course={course} details={details} />
        <CourseTabs active={activeTab} onChange={changeTab} />
        {validTabs.map((value) => (
          <div
            key={value}
            role="tabpanel"
            id={"course-panel-" + value}
            aria-labelledby={"course-tab-" + value}
            hidden={activeTab !== value}
            tabIndex={activeTab === value ? 0 : -1}
            className="course-tab-panel"
          >
            {activeTab === value && value === "overview" && (
              <CourseOverview course={course} details={details} />
            )}
            {activeTab === value && value === "curriculum" && (
              <CourseCurriculum course={course} details={details} />
            )}
            {activeTab === value && value === "faculty" && (
              <CourseFaculty details={details} />
            )}
            {activeTab === value && value === "projects" && (
              <CourseProjects
                course={course}
                projects={projects}
                category={params.get("type") ?? ""}
                onCategoryChange={changeCategory}
              />
            )}
          </div>
        ))}
        <CourseCoordination course={course} details={details} />
      </div>
    </div>
  );
}

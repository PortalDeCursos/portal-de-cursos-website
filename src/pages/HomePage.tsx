import { courses } from '../mocks/courses';
import { projects } from '../mocks/projects';
import HomeHero from './home/HomeHero';
import HomeCourseSection from './home/HomeCourseSection';
import HomeProjectSection from './home/HomeProjectSection';
import SubmissionBanner from './home/SubmissionBanner';
import './pages.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="container home-content">
        <HomeHero />
        <HomeCourseSection courses={courses} />
        <HomeProjectSection projects={projects} />
        <SubmissionBanner />
      </div>
    </div>
  );
}

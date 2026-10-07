import { Outlet } from 'react-router'
import NavigationReset from '../../../app/routes/NavigationReset'
import Header from './Header'
import Footer from './Footer'

export default function PortalLayout() {
  return <div className="flex min-h-screen flex-col">
    <NavigationReset />
    <a href="#main" className="sr-only focus:not-sr-only focus:p-4">Pular para o conteúdo</a>
    <Header />
    <main id="main" className="flex-1"><Outlet /></main>
    <Footer />
  </div>
}

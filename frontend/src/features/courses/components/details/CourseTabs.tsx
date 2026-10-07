import type { KeyboardEvent } from 'react'
import DesignIcon from '../../../../shared/components/ui/DesignIcon'
import type { CourseTab } from '../../types/details'
const tabs: { value: CourseTab; label: string; icon: string }[] = [
  { value: 'overview', label: 'Visão geral', icon: 'detail-imgContainer8' },
  { value: 'curriculum', label: 'Grade curricular', icon: 'detail-imgContainer9' },
  { value: 'faculty', label: 'Professores', icon: 'detail-imgContainer10' },
  { value: 'projects', label: 'Projetos aprovados', icon: 'detail-imgContainer11' },
]
export default function CourseTabs({ active, onChange }: { active: CourseTab; onChange: (tab: CourseTab) => void }) {
  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null
    if (next === null) return
    event.preventDefault()
    onChange(tabs[next].value)
    document.getElementById('course-tab-' + tabs[next].value)?.focus()
  }
  return <div className="course-tabs" role="tablist" aria-label="Seções do curso">{tabs.map((tab, index) => <button key={tab.value} type="button" id={'course-tab-' + tab.value} role="tab" aria-selected={active === tab.value} aria-controls={'course-panel-' + tab.value} tabIndex={active === tab.value ? 0 : -1} onClick={() => onChange(tab.value)} onKeyDown={event => handleKey(event, index)}><DesignIcon name={tab.icon} />{tab.label}</button>)}</div>
}

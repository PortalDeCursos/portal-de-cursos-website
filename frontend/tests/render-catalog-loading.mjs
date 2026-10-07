import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
import ts from 'typescript'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
const require = createRequire(import.meta.url)
const cache = new Map()
function loadComponent(filename) {
  const full = path.resolve(filename)
  if (cache.has(full)) return cache.get(full)
  const module = { exports: {} }
  cache.set(full, module.exports)
  const compiled = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
  const localRequire = specifier => {
    if (!specifier.startsWith('.')) return require(specifier)
    const target = path.resolve(path.dirname(full), specifier)
    if (target.endsWith('.css')) return {}
    if (target.endsWith('.png')) return '/src/assets/logo.png'
    return loadComponent(fs.existsSync(target) ? target : fs.existsSync(target + '.tsx') ? target + '.tsx' : target + '.ts')
  }
  vm.runInNewContext(compiled, { require: localRequire, module, exports: module.exports }, { filename: full })
  cache.set(full, module.exports)
  return module.exports
}
const Header = loadComponent('src/shared/components/layout/Header.tsx').default
const Footer = loadComponent('src/shared/components/layout/Footer.tsx').default
const CatalogHeader = loadComponent('src/features/courses/components/catalog/CatalogHeader.tsx').default
const Skeleton = loadComponent('src/features/courses/components/catalog/CatalogSkeleton.tsx').default
const loadingMarkup = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/cursos'] }, React.createElement('div', null, React.createElement(Header), React.createElement('main', { className: 'catalog-page' }, React.createElement('div', { className: 'container catalog-content' }, React.createElement(CatalogHeader), React.createElement(Skeleton))), React.createElement(Footer))))
assert.match(loadingMarkup, /role="status" aria-label="Carregando cursos"/)
assert.equal((loadingMarkup.match(/class="catalog-skeleton-card"/g) ?? []).length, 2)
assert.doesNotMatch(loadingMarkup, /id="course-search"/)
const cssFile = fs.readdirSync('dist/assets').find(file => file.endsWith('.css'))
fs.mkdirSync('reports', { recursive: true })
fs.writeFileSync('reports/catalog-loading.html', '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verificação visual — carregamento do catálogo</title><link rel="stylesheet" href="/dist/assets/' + cssFile + '"><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet"></head><body>' + loadingMarkup + '</body></html>')
console.log('Snapshot do componente real de carregamento gerado; sem controles de filtro ativos e com 2 cartões skeleton.')


const DetailsSkeleton = loadComponent('src/features/courses/components/details/CourseDetailsSkeleton.tsx').default
const Identity = loadComponent('src/features/courses/components/details/CourseIdentity.tsx').default
const Tabs = loadComponent('src/features/courses/components/details/CourseTabs.tsx').default
const ProjectsPanel = loadComponent('src/features/courses/components/details/CourseProjects.tsx').default
const Coordination = loadComponent('src/features/courses/components/details/CourseCoordination.tsx').default
const course = loadComponent('src/features/courses/data/mocks/catalog.ts').catalogCourses[0]
const details = loadComponent('src/features/courses/data/mocks/courseDetails.ts').courseDetails.tads
function renderDetailsSnapshot(filename, children) {
  const markup = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/cursos/tads'] }, React.createElement('div', null, React.createElement(Header), React.createElement('main', { className: 'course-details-page' }, React.createElement('div', { className: 'container course-details-content' }, ...children)), React.createElement(Footer))))
  fs.writeFileSync(filename, '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verificação visual — detalhes do curso</title><link rel="stylesheet" href="/dist/assets/' + cssFile + '"><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet"></head><body>' + markup + '</body></html>')
  return markup
}
const detailLoading = renderDetailsSnapshot('reports/course-details-loading.html', [React.createElement(DetailsSkeleton)])
assert.match(detailLoading, /aria-label="Carregando detalhes do curso"/)
const detailEmpty = renderDetailsSnapshot('reports/course-details-no-projects.html', [React.createElement(Identity, { course, details }), React.createElement(Tabs, { active: 'projects', onChange() {} }), React.createElement(ProjectsPanel, { course, projects: [], category: '', onCategoryChange() {} }), React.createElement(Coordination, { course, details })])
assert.match(detailEmpty, /Nenhum projeto publicado para este curso no momento/)
assert.match(detailEmpty, /Conhecer biblioteca geral de projetos/)
assert.equal(details.curriculum.flatMap(semester => semester.subjects).length, details.moduleCount)
assert.equal(details.moduleCount * 75, details.hours)
console.log('Snapshots dos componentes reais de detalhes: carregamento e curso sem projetos. Matriz demonstrativa validada: 32 componentes, 2.400 horas.')

const AppRoutes = loadComponent('src/app/routes/AppRoutes.tsx').default
for (const route of ['/', '/cursos', '/cursos/tads', '/projetos', '/projetos/inexistente', '/inexistente']) {
  const markup = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(AppRoutes)))
  assert.equal((markup.match(/<header\b/g) ?? []).length, 1, route)
  assert.equal((markup.match(/<footer\b/g) ?? []).length, 1, route)
  assert.equal((markup.match(/<main id="main"/g) ?? []).length, 1, route)
  if (route === '/cursos') assert.match(markup, /Carregando cursos/)
  if (route === '/cursos/tads') assert.match(markup, /Carregando detalhes do curso/)
  if (route === '/inexistente') assert.match(markup, /Página não encontrada/)
}
console.log('Seis rotas verificadas com um único header rodapé e conteúdo principal.')

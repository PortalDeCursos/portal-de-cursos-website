import { readdir } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('src')
const invalidName = /[áéíóúãõçÁÉÍÓÚÃÕÇ]/
const invalidDirectory = /(^|\/)servicos(\/|$)/
const failures = []

async function visit(directory) {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const relative = path.relative(process.cwd(), path.join(directory, entry.name))
    const normalized = relative.split(path.sep).join('/')

    if (invalidName.test(entry.name) || invalidDirectory.test(normalized)) {
      failures.push(normalized)
    }

    if (entry.isDirectory()) {
      await visit(path.join(directory, entry.name))
    }
  }
}

await visit(root)

if (failures.length > 0) {
  console.error('Nomes de arquivos ou pastas fora do padrão:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
}

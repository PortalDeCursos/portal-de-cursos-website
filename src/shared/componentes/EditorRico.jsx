import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import { Bold, Heading2, Italic, List, ListOrdered, Quote, Redo2, Undo2 } from 'lucide-react'
import './editor-rico.css'

export default function EditorRico({
  id,
  titulo,
  ajuda,
  placeholder,
  valor = '',
  aoAlterar,
  erro,
  idErro,
  limite,
  alturaMinima = 120,
  obrigatorio = true,
}) {
  const idAjuda = `${id}-ajuda`
  const idContador = limite ? `${id}-contador` : null

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Digite aqui…',
      }),
      Markdown.configure({
        html: false,
        tightLists: true,
        bulletListMarker: '-',
      }),
    ],
    content: valor || '',
    editorProps: {
      attributes: {
        id,
        class: 'editor-rico__area',
        'aria-label': titulo,
        'aria-invalid': erro ? 'true' : 'false',
        'aria-describedby': [idAjuda, idContador, erro ? idErro : null].filter(Boolean).join(' '),
        style: `min-height: ${alturaMinima}px`,
      },
    },
    onUpdate: ({ editor: instancia }) => {
      const md = instancia.storage.markdown.getMarkdown()
      aoAlterar(md)
    },
  })

  useEffect(() => {
    if (!editor) return
    const atual = editor.storage.markdown.getMarkdown()
    if ((valor || '') !== atual) {
      editor.commands.setContent(valor || '', false)
    }
  }, [editor, valor])

  const excedeuLimite = Boolean(limite && (valor || '').length > limite)

  return (
    <div className="editor-rico formulario-submissao__campo-largo">
      <label className="editor-texto__rotulo" htmlFor={id}>
        {titulo} {obrigatorio && <span aria-hidden="true">*</span>}
      </label>
      {ajuda && (
        <p className="editor-texto__ajuda" id={idAjuda}>
          {ajuda}
        </p>
      )}

      <div
        className={`editor-rico__caixa${erro || excedeuLimite ? ' editor-rico__caixa--erro' : ''}`}
      >
        <div className="editor-rico__barra" role="toolbar" aria-label={`Formatação de ${titulo}`}>
          <button
            type="button"
            className="editor-rico__botao"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            aria-pressed={editor?.isActive('bold') || false}
            aria-label="Negrito"
            title="Negrito (Ctrl+B)"
          >
            <Bold size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="editor-rico__botao"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            aria-pressed={editor?.isActive('italic') || false}
            aria-label="Itálico"
            title="Itálico (Ctrl+I)"
          >
            <Italic size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="editor-rico__botao"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-pressed={editor?.isActive('heading', { level: 2 }) || false}
            aria-label="Subtítulo"
            title="Subtítulo"
          >
            <Heading2 size={15} aria-hidden="true" />
          </button>

          <span className="editor-rico__divisor" aria-hidden="true" />

          <button
            type="button"
            className="editor-rico__botao"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            aria-pressed={editor?.isActive('bulletList') || false}
            aria-label="Lista com marcadores"
            title="Lista com marcadores"
          >
            <List size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="editor-rico__botao"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            aria-pressed={editor?.isActive('orderedList') || false}
            aria-label="Lista numerada"
            title="Lista numerada"
          >
            <ListOrdered size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="editor-rico__botao"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            aria-pressed={editor?.isActive('blockquote') || false}
            aria-label="Citação"
            title="Citação"
          >
            <Quote size={15} aria-hidden="true" />
          </button>

          <span className="editor-rico__divisor" aria-hidden="true" />

          <button
            type="button"
            className="editor-rico__botao"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            aria-label="Desfazer"
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="editor-rico__botao"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            aria-label="Refazer"
            title="Refazer (Ctrl+Y)"
          >
            <Redo2 size={15} aria-hidden="true" />
          </button>
        </div>

        <EditorContent editor={editor} />
      </div>

      {limite && (
        <small
          className={`editor-texto__contador${excedeuLimite ? ' editor-rico__contador--erro' : ''}`}
          id={idContador}
        >
          {(valor || '').length}/{limite} caracteres
        </small>
      )}
      {erro && (
        <small id={idErro} className="formulario-submissao__erro-campo">
          {erro}
        </small>
      )}
    </div>
  )
}

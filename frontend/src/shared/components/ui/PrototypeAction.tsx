import { useRef } from "react";
import type { ReactNode } from "react";
export default function PrototypeAction({
  children,
  className,
  title = "Submeter projeto",
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => dialog.current?.showModal()}
      >
        {children}
      </button>
      <dialog
        ref={dialog}
        aria-label={title}
        className="prototype-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <h2>{title}</h2>
        <p>
          Este é um ambiente demonstrativo. Esta funcionalidade ainda não está
          disponível e depende da integração com o sistema institucional.
        </p>
        <button
          type="button"
          className="primary-button"
          onClick={() => dialog.current?.close()}
        >
          Entendi
        </button>
      </dialog>
    </>
  );
}

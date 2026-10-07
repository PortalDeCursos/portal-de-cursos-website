import { Link } from "react-router";
import type { ButtonHTMLAttributes, ReactNode } from "react";
const style = "primary-button";
type Props =
  | { to: string; children: ReactNode }
  | (ButtonHTMLAttributes<HTMLButtonElement> & { to?: never });
export default function Button(props: Props) {
  if (props.to !== undefined)
    return (
      <Link to={props.to} className={style}>
        {props.children}
      </Link>
    );
  return (
    <button
      type="button"
      {...props}
      className={style + " " + (props.className ?? "")}
    />
  );
}

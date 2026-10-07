export default function DesignIcon({ name }: { name: string }) {
  return (
    <img
      src={"/design/" + name + ".svg"}
      alt=""
      className="design-icon"
      aria-hidden="true"
    />
  );
}

import { publicAsset } from '../../utils/publicAsset'
export default function DesignIcon({ name }: { name: string }) {
  return (
    <img
      src={publicAsset("design/" + name + ".svg")}
      alt=""
      className="design-icon"
      aria-hidden="true"
    />
  );
}

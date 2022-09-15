import { ReactionSpeed } from "@ferld/games";
import style from "@ferld/games/style.css";

export function links() {
  return [{ rel: "stylesheet", href: style }]
}

export default function Index() {
  return (
    <ReactionSpeed style={{ height: "100%" }} />
  );
}


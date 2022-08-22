import { ReactionSpeed } from "@eliya/games";
import style from "@eliya/games/style.css";

export function links() {
  return [{ rel: "stylesheet", href: style }]
}

export default function Index() {
  return (
    <ReactionSpeed style={{ height: "100%" }} />
  );
}


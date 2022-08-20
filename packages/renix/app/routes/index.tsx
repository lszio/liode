import { ReactionSpeed } from "@eliya/games";
import style from "@eliya/games/style.css";

export function links() {
  return [{ rel: "stylesheet", href: style }]
}

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <ReactionSpeed style={{ height: "50vh" }} />
    </div>
  );
}

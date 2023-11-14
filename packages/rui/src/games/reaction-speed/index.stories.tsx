import Game from "./index";

export default {
  title: "GAMES/ReactionSpeed",
  component: Game,
};

export const Primary = () => <Game style={{ height: "calc(100vh - 40px)" }} />;

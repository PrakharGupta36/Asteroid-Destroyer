import useGame from "./hooks/State";
import Game from "./pages/Game";
import Intro from "./pages/Intro";

export default function App() {
  const { start } = useGame();

  return (
    <main className='grid place-items-center w-[100dvw] h-[100dvh]'>
      {start ? <Game /> : <Intro />}
    </main>
  );
}

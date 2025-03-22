import useGame from "@/hooks/State";
import SettingsGame from "../Settings/components/SettingsGame";

function SpaceshipHealth() {
  const { spaceshipHealth } = useGame();

  return (
    <section>
      <div className='absolute bottom-0 left-0 z-10 m-8 grid gap-1'>
        <span className='text-white'> Spaceship Health </span>
        <div className='rounded-sm w-50 h-4 grid place-items-start overflow-hidden border-2 bg-white '>
          {" "}
          <div
            className='transition-all ease-in-out duration-500 h-full rounded-xs relative '
            style={{
              width: `${spaceshipHealth}%`,
              background: `linear-gradient(90deg, ${
                spaceshipHealth > 90
                  ? "#8ef88e, #4caf50"
                  : spaceshipHealth > 70
                  ? "#4caf50, #2e7d32"
                  : spaceshipHealth > 50
                  ? "#6b8e23, #556b2f"
                  : spaceshipHealth > 30
                  ? "#ff9800, #ff5722"
                  : spaceshipHealth > 15
                  ? "#ff3b3b, #8b0000"
                  : "#8b0000, #550000"
              })`,
              boxShadow:
                spaceshipHealth > 90
                  ? "0px 0px 10px 3px rgba(144, 238, 144, 0.7)"
                  : spaceshipHealth < 15
                  ? "0px 0px 10px 3px rgba(255, 0, 0, 0.7)"
                  : "none",
              animation:
                spaceshipHealth < 15
                  ? "flicker 0.15s infinite alternate"
                  : "none",
            }}
          />
        </div>
      </div>
      <div className='absolute bottom-0 right-0 z-10 mx-7 my-8 grid gap-1 border-2 p-3 rounded-lg bg-black text-white text-sm'>
        <div className=''> Controls </div>
        <div>
          <ul>
            <li> A - Turn Left </li>
            <li> D - Turn Right </li>
            <li> Space - Lasers </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function GameUI() {
  return (
    <>
      <SpaceshipHealth />
      <SettingsGame />
    </>
  );
}

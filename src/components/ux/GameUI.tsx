import useGame from "@/hooks/State";
import SettingsGame from "../settings/components/SettingsGame";

function SpaceshipHealth() {
  const { spaceshipHealth } = useGame();

  return (
    <div className=' absolute bottom-0 z-10 m-4 grid gap-1'>
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

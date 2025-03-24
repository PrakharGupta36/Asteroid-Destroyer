import useGame from "@/hooks/State";
import SettingsGame from "../Settings/components/SettingsGame";

const getHealthBarStyle = (health: number) => {
  const colors = [
    {
      threshold: 90,
      gradient: "#8ef88e, #4caf50",
      glow: "0px 0px 15px 5px rgba(144, 238, 144, 0.6)",
    },
    { threshold: 70, gradient: "#4caf50, #2e7d32" },
    { threshold: 50, gradient: "#6b8e23, #556b2f" },
    { threshold: 30, gradient: "#ff9800, #ff5722" },
    {
      threshold: 15,
      gradient: "#ff3b3b, #8b0000",
      glow: "0px 0px 15px 5px rgba(255, 0, 0, 0.6)",
    },
    { threshold: 0, gradient: "#8b0000, #550000" },
  ];

  const { gradient, glow } =
    colors.find(({ threshold }) => health > threshold) ||
    colors[colors.length - 1];

  return {
    width: `${health}%`,
    background: `linear-gradient(90deg, ${gradient})`,
    boxShadow: glow || "none",
    animation: health < 15 ? "flicker 0.15s infinite alternate" : "none",
  };
};

function SpaceshipHealth() {
  const { spaceshipHealth } = useGame();

  return (
    <div className='absolute bottom-0 left-0 z-10 m-6 grid gap-2 py-5 px-3 health border border-gray-300/50 shadow-md'>
      <span className='text-white font-bold text-lg tracking-wide drop-shadow-md'>
        Spaceship Health
      </span>
      <div className='w-52 h-4 overflow-hidden border-2 border-gray-300/70 bg-gray-900 rounded-full relative'>
        <div
          className='h-full transition-all ease-in-out duration-500 rounded-full'
          style={getHealthBarStyle(spaceshipHealth)}
        />
      </div>
    </div>
  );
}

function SpaceshipControls() {
  return (
    <div className='absolute bottom-0 right-0 z-10 mx-7 my-8 grid gap-2 border-2 p-4 rounded-lg bg-black/80 text-white text-sm controls shadow-lg'>
      <span className='font-extrabold text-lg tracking-wide text-gray-200 drop-shadow-md'>
        Controls
      </span>
      <ul className='space-y-2 text-gray-300 font-medium'>
        <li className='hover:text-white transition duration-200'>
          A - Turn Left
        </li>
        <li className='hover:text-white transition duration-200'>
          D - Turn Right
        </li>
        <li className='hover:text-red-400 transition duration-200'>
          Space - Lasers
        </li>
      </ul>
    </div>
  );
}

export default function GameUX() {
  return (
    <>
      <section>
        <SpaceshipHealth />
        <SpaceshipControls />
      </section>
      <SettingsGame />
    </>
  );
}

import { ButtonFancy } from "../../UI/buttonFancy";
import Settings from "../Settings";

export default function SettingsMenu() {
  return <Settings trigger={<ButtonFancy>Settings</ButtonFancy>} />;
}

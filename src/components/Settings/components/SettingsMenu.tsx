import { ButtonFancy } from "../../ui/buttonFancy";
import Settings from "../Settings";

export default function SettingsMenu() {
  return <Settings trigger={<ButtonFancy>Settings</ButtonFancy>} />;
}

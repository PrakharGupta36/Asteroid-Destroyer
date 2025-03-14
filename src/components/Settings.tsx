import useGame from "@/hooks/State";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { ButtonFancy } from "./ui/buttonFancy";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export default function Settings() {
  const { settings, setSettings } = useGame();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonFancy> Settings</ButtonFancy>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Your settings will be saved in the browser.
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <div className='grid gap-3'>
          {settings.map((e) => (
            <div key={e.id} className='flex justify-between items-center'>
              <div>{e.text}</div>
              <Switch
                disabled={e.id === 1}
                checked={e.value}
                onClick={() => setSettings(e.id, !e.value)}
              />
            </div>
          ))}
        </div>

        <Separator />
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

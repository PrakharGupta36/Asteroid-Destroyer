import { useRef } from "react";
import useGame from "@/hooks/State";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

export default function SettingsGame() {
  const { settings, setSettings, pause, setPause } = useGame();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog open={pause} onOpenChange={setPause}>
      <DialogTrigger asChild className='absolute top-0 z-10 m-4'>
        <Button ref={btnRef} className='border'>
          Pause (ESC)
        </Button>
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

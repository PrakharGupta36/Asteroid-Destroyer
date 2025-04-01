import React, { useEffect, useMemo } from "react";
import useGame from "@/hooks/State";
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
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function Settings({
  trigger,
  pause,
  setPause,
}: {
  trigger: React.ReactNode;
  pause?: boolean;
  setPause?: (value: boolean) => void;
}) {
  const { settings, setSettings, showStory, overlay } = useGame();
  const clickAudio = useMemo(() => new Audio("/sounds/clickAudio.mp3"), []);
  const btnAudio = useMemo(() => new Audio("/sounds/btnAudio.mp3"), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.shiftKey &&
        event.key.toLowerCase() === "s" &&
        !showStory &&
        !overlay
      ) {
        setPause?.(!pause);

        if (settings[1].value) {
          btnAudio.currentTime = 0;
          btnAudio.play();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pause, setPause, btnAudio, settings, showStory, overlay]);

  return (
    <Dialog open={pause} onOpenChange={setPause}>
      <DialogTrigger autoFocus={false} asChild tabIndex={-1}>
        {trigger}
      </DialogTrigger>
      <DialogContent className='bg-[#121212] text-white border-4 rounded-3xl border-[#333]'>
        <DialogHeader>
          <DialogTitle className='text-white'>Settings</DialogTitle>
          <DialogDescription className='text-gray-400'>
            Your settings will be saved in the browser.
          </DialogDescription>
        </DialogHeader>

        <Separator className='bg-[#333]' />

        {/* Tabs Section */}
        <Tabs defaultValue='general'>
          <TabsList className='w-full bg-[#1d1d1d] text-gray-300'>
            <TabsTrigger
              value='general'
              className='data-[state=active]:bg-[#333] data-[state=active]:text-white'
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value='sounds'
              className='data-[state=active]:bg-[#333] data-[state=active]:text-white'
            >
              Sounds
            </TabsTrigger>
            <TabsTrigger
              value='graphics'
              className='data-[state=active]:bg-[#333] data-[state=active]:text-white'
            >
              Graphics
            </TabsTrigger>
          </TabsList>

          <TabsContent value='general'>
            <div className='grid gap-3'>
              {settings
                .filter((e) => e.category === "general")
                .map((e) => {
                  return (
                    <div
                      key={e.id}
                      className='flex justify-between items-center bg-[#222] p-3 rounded-lg'
                    >
                      <div className='text-gray-300'>
                        {e.text === "Restart" ? "Restart Game" : e.text}
                      </div>
                      {e.text === "Restart" ? (
                        <Button
                          onClick={() => {
                            window.location.reload(); // or a custom reset logic
                          }}
                        >
                          Restart
                        </Button>
                      ) : (
                        <Switch
                          checked={e.value}
                          onClick={() => setSettings(e.id, !e.value)}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value='sounds'>
            <div className='grid gap-3'>
              {settings
                .filter((e) => e.category === "sound")
                .map((e) => (
                  <div
                    key={e.id}
                    className='flex justify-between items-center bg-[#222] p-3 rounded-lg'
                  >
                    <div className='text-gray-300'>{e.text}</div>
                    <Switch
                      checked={e.value}
                      onClick={() => {
                        setSettings(e.id, !e.value);
                        if (!settings[1].value) {
                          clickAudio.currentTime = 0;
                          clickAudio.play();
                        }
                      }}
                    />
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value='graphics'>
            <div className='grid gap-3'>
              {settings
                .filter((e) => e.category === "graphics")
                .map((e) => (
                  <div
                    key={e.id}
                    className='flex justify-between items-center bg-[#222] p-3 rounded-lg'
                  >
                    <div className='text-gray-300'>{e.text}</div>
                    <Switch
                      disabled={e.id === 1}
                      checked={e.value}
                      onClick={() => setSettings(e.id, !e.value)}
                    />
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className='bg-[#333]' />
        <DialogFooter>
          <DialogClose asChild>
            <Button className='bg-[#333] hover:bg-[#444] text-white'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

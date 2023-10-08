import time
import keyboard
import pyautogui
import os
import datetime

from enum import *
from typing import *
from colorama import Fore
from PIL import Image, ImageGrab, ImageChops


previous_colors = []
os.environ["PYGAME_HIDE_SUPPORT_PROMPT"] = "1"
onDownload = os.path.exists(r".\Latest.log")

import pygame


def downloadRequirements(
        prev: bool,
        /,
        *urls) -> None:
    """Downloads requirements with given urls"""
    
    global onDownload
    print(f"{Fore.CYAN}Collecting requirements...{Fore.RESET}")
    
    import requests
    start = time.time()

    for requirement in urls:
        filename = requirement[-requirement[::-1].find("/"):requirement.find("?")]

        if os.path.exists(rf".\se\{filename}") and not prev:
            print(rf"Requirement already satisfied: in .\\se\\{filename}")
            continue
        res = requests.get(requirement, stream=True)

        if res.status_code != 200:
            exit(f"{Fore.RED}Failed to get response from the server while trying to download required contents.{Fore.RESET}")

        if not os.path.exists(r".\se"):
            os.mkdir(r".\se")

        progress = ["|", "/", "-", "\\"]

        total = int(res.headers.get("content-length", 0))

        dl = 0

        with open(r".\Latest.log", "w"):...

        with open(rf".\se\{filename}", "wb") as se:
            dl_path = f"{os.path.dirname(__file__)}\\se\\{filename}"
            print(f"  Downloading -> {dl_path}")

            for ch in res.iter_content(chunk_size=8192):
                se.write(ch)
                dl += len(ch)

                per = (dl / total) * 100
                bar = Fore.GREEN +"".join(["━" for _ in range(int(per / 3))]) +Fore.RED +"".join(["━" for _ in range(33, int(per / 3), -1)]) +Fore.RESET
                bar += Fore.GREEN if per == 100 else Fore.YELLOW

                print(f"    {bar} {dl}/{total} bytes ({per:.2f}%){Fore.RESET}", end="\r")

                with open(r".\Latest.log", "a", encoding="cp437") as log:
                    log.write(f"\n[{datetime.datetime.now().strftime('%Y/%m/%d/%H:%M:%S')}] Downloading -> {dl_path}>=({per:.2f}%)\n    with ?cp437 --decode=bytes")
        print("")

    os.remove(r".\Latest.log")

    end = time.time()

    print(f"\n{Fore.CYAN}Download completed.({(end-start):.3f}s){Fore.RESET}")


def onKeyPress(event: keyboard._keyboard_event.KeyboardEvent) -> None:
    """Called when any key was pressed"""


def ElapsedTime(view: int=2):
    def wrapper(func: function):
        def _wrapper(*args, **kwargs):
            start = time.time()
            
            result = func(*args, **kwargs)

            end = time.time()
            print(f"Function '{func.__name__}' took {(end-start)*1000:.{view}f} milliseconds to execute.")
            return result
        return _wrapper
    return wrapper


class Watch:
    def __init__(self,
            screenshot: Image=None
            ) -> None:
        """The Watch Class"""

        self.latest, self.detectRange = screenshot, 1.0
        os.environ["PYGAME_HIDE_SUPPORT_PROMPT"] = "1"
        pygame.init()
        pygame.mixer.init()


    def get_colors(self,
            top_left: Tuple[int],
            bottom_right: Tuple[int]
            ) -> Image.Image:
        """Take a shot in the self area"""

        self.latest = ImageGrab.grab(bbox=(top_left[0], top_left[1], bottom_right[0], bottom_right[1]), all_screens=True)
        return self.latest
    

    def hasChanged(self,
            new_colors: List[Tuple[int]],
            previous_colors: List[Tuple[int]]
            ) -> bool:
        """Detect change within the self range"""

        diff_count = 0
        if len(new_colors) != len(previous_colors):
            return True
        for new_color, prev_color in zip(new_colors, previous_colors):
            if new_color != prev_color:
                diff_count += 1
            if (diff_count / len(new_colors)) * 100 >= self.detectRange:
                return True
        return False
    

    def saveDifference(self,
            prev: Image,
            path: str=r".\diff.png"
            ) -> Image:
        """Save difference between previous Image and self latest one"""

        if not self.latest:
            raise RuntimeError("Don't call before the first screenshot assignment.")
        diff = ImageChops.difference(self.latest, prev)
        diff.save(path)
        return diff



def main():
    main = Watch(None)
    try:
        if (
            not os.path.exists(r".\se\notify.mp3") or 
            not os.path.exists(r".\se\Buttermilk_Bouquet.mp3")
            ) or onDownload:
            downloadRequirements(onDownload,
                "http://tickets.kanokiw.com:2293/.downloads/notify.mp3?per=kanokiw",
                "http://tickets.kanokiw.com:2293/.downloads/Buttermilk_Bouquet.mp3?per=kanokiw"
                )
            
        print(f"{Fore.GREEN}Move your cursor to position 1, then press F12{Fore.RESET}")
        keyboard.wait("f12")
        pos = pyautogui.position()
        pos_1 = [pos.x, pos.y]
        print(f"{Fore.GREEN}Move your cursor to position 2, then press F12{Fore.RESET}")
        keyboard.wait("f12")
        pos = pyautogui.position()
        pos_2 = [pos.x, pos.y]
        pos_1[0], pos_2[0] = sorted([pos_1[0], pos_2[0]])
        pos_1[1], pos_2[1] = sorted([pos_1[1], pos_2[1]])
        print("Enter how much percentage change to call you: float(0 < x <= 100)")

        while True:
            per = input("> ")
            if len(per) == 0:
                print(f"{Fore.BLUE}Detection range set to default value: 1.0%{Fore.RESET}")
                break
            try:
                per = float(per)
                if not 0 < per <= 100:
                    print(f"{Fore.RED}Please Enter the value: float(0 < x <= 100){Fore.RESET}")
                    continue
                main.detectRange = per
                break
            except ValueError:
                print(f"{Fore.RED}Please Enter a Number: float(0 < x <= 100){Fore.RESET}")

        print(f"Press F12 to start")
        keyboard.wait("f12")
        print(f"{Fore.GREEN}Started with detection range {main.detectRange}%.{Fore.RESET}")
        keyboard.on_press(onKeyPress)

        while True:
            latest_image = main.get_colors(pos_1, pos_2)
            new_colors = list(latest_image.getdata())
            if main.hasChanged(new_colors, previous_colors) and previous_colors != []:
                print(f"{Fore.RED}Detected selected area has changed more than {main.detectRange}%.{Fore.RESET}")
                pygame.mixer.music.load(r".\se\notify.mp3")
                pygame.mixer.music.play()
            previous_image, previous_colors = latest_image, new_colors
            time.sleep(1)
    except KeyboardInterrupt:
        pygame.mixer.music.stop()
        pygame.mixer.quit()
        pygame.quit()
        exit(f"\nThank you and good bye...")
    except Exception as exc:
        if exc.__class__ == RuntimeError: ...
        elif exc.__class__ == ...: ...


if __name__ == "__main__":
    main()
 
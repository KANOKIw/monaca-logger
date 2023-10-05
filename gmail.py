import os
import shutil
import re


if __name__ == "__main__":
    for filename in os.listdir("./src/"):
        shutil.copyfile("./src/"+filename, "./gmail/"+filename+"d")

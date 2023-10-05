import os
import shutil

for filename in os.listdir("./src/"):
    shutil.copyfile("./src/"+filename, "./gmail/"+filename+"d")

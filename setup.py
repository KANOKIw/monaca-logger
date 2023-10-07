import os
import shutil
import io

from py_modules.minify import minifier


minify = minifier()
    

def main():
    with open("./src/logger.js", encoding="utf-8") as f:
        code = f.read()
    code = minify.javascript(code)
    with open("./src/logger.min.js", "w", encoding="utf-8") as f:
        f.write(code)
        
    for filename in os.listdir("./src/"):
        shutil.copyfile("./src/"+filename, "./gmail/"+filename+"d")

if __name__ == "__main__":
    main()

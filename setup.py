import os
import shutil
import io

from py_modules.minify import minifier


minify = minifier()
    

def main():
    for filename in os.listdir("./src/"):
        shutil.copyfile("./src/"+filename, "./gmail/"+filename+"d")

    with open("./src/logger.js") as f:
        code = f.read()
    code = minify.javascript(code)
    with open("./src/logger.min.js", "w") as f:
        f.write(code)

if __name__ == "__main__":
    main()

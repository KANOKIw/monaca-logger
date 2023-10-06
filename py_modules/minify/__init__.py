import re

class minifier:
    def __init__(self) -> None:
        pass

    def javascript(self, code: str) -> str:
        code = re.sub(r'\/\*[\s\S]*?\*\/', '', code)
        code = re.sub(r'(?<!:|\/)\/{2}.*?(?=\n|$)', '', code)
        code = re.sub(r'\s*({|})\s*', r'\1', code)
        code = re.sub(r'\s+', ' ', code)
        code = code.strip()
        
        return code

"""Find the unclosed triple-quoted string in training_loop.py."""
import tokenize, io, ast, sys

path = "weaponized_ai/training_loop.py"
with open(path, "rb") as f:
    src = f.read()

# Approach: parse tokens and track triple-string opens/closes
# tokenize yields STRING tokens for complete strings, and reports errors on EOF
gen = tokenize.tokenize(io.BytesIO(src).readline)
try:
    for tok in gen:
        pass
    print("No token errors — file is clean.")
except tokenize.TokenError as e:
    print("TokenError:", e)

# Also try compile to get the SyntaxError with lineno
try:
    compile(src, path, "exec")
    print("compile OK")
except SyntaxError as e:
    print(f"SyntaxError at line {e.lineno}: {e.msg}")
    # Print 5 lines around the error
    lines = src.decode("utf-8", errors="replace").splitlines()
    start = max(0, e.lineno - 5)
    end   = min(len(lines), e.lineno + 3)
    for i, l in enumerate(lines[start:end], start + 1):
        marker = " <--" if i == e.lineno else ""
        print(f"  {i:4}: {l}{marker}")

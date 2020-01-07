import img2pdf
import sys

# opening from filename
with open(sys.argv[2],"wb") as f:
    f.write(img2pdf.convert(sys.argv[1]))
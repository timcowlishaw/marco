#!/usr/bin/python
# -*- coding:utf-8 -*-

import sys
import os
import time
DRY_RUN = os.environ.get("MARCO_DRY_RUN", "false").lower() == "true"
FORCE_UPDATE = os.environ.get("MARCO_FORCE_UPDATE", "false").lower() == "true"
if not DRY_RUN:
    sys.path.append(r'./lib/e-Paper/Raspberry Pi/python2/lib')
    import epd4in2
    import epdconfig
from PIL import Image, ImageOps
import requests
import hashlib
SERVER_URL = os.environ["MARCO_SERVER_URL"]
SCREEN_ID = os.environ["MARCO_SCREEN_ID"]
TMP_PATH = "/tmp/marco_last_image.png"

def md5_digest(data, block_size=2**20):
    md5 = hashlib.md5()
    md5.update(data)
    return md5.hexdigest()


def check_image_updated(png):
    last_png = None
    if os.path.isfile(TMP_PATH):
        with open(TMP_PATH, "rb") as f:
            last_png = f.read()
            return md5_digest(png) != md5_digest(last_png)
    else:
        return True


def update_temp_image(png):
    with open(TMP_PATH, "wb") as f:
        f.write(png)


def update_screen(png):
    epd = epd4in2.EPD()
    image = Image.new('1', (epd.width, epd.height), 255)
    png = Image.open(TMP_PATH)
    r, g, b, a = png.split()
    image.paste(ImageOps.invert(a), (0, 0))
    epd.init()
    epd.Clear()
    epd.display(epd.getbuffer(image))
    time.sleep(2)
    epd.sleep()

if __name__ == "__main__":
    url = "%s/receive/%s" % (SERVER_URL, SCREEN_ID)
    response = requests.get(url, allow_redirects=True)
    png = response.content
    if FORCE_UPDATE or check_image_updated(png):
        update_temp_image(png)
        if not DRY_RUN:
            update_screen(png)
        sys.exit("Image updated.")
    else:
        sys.exit("Image not updated, exiting.")

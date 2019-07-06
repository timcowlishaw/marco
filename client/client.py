#!/usr/bin/python
# -*- coding:utf-8 -*-

import sys
import os
DRY_RUN = os.environ.get("MARCO_DRY_RUN", "false").lower() == "false"
if not DRY_RUN:
    sys.path.append(r'./lib/e-Paper/Raspberry Pi/python2/lib')
    import epd4in2
    import epdconfig
from PIL import Image
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
    image = Image.open(TMP_PATH)
    epd.init()
    epd.Clear()
    epd.display(epd.getbuffer(image))

    from PIL import ImageDraw, ImageFont
    font18 = ImageFont.truetype('../lib/Font.ttc', 18)
    Limage = Image.new('1', (epd.height, epd.width), 255)  # 255: clear the frame
    draw = ImageDraw.Draw(Limage)
    draw.text((2, 0), 'hello world', font = font18, fill = 0)
    draw.text((2, 20), '4.2inch epd', font = font18, fill = 0)
    draw.text((20, 50), u'微雪电子', font = font18, fill = 0)
    draw.line((10, 90, 60, 140), fill = 0)
    draw.line((60, 90, 10, 140), fill = 0)
    draw.rectangle((10, 90, 60, 140), outline = 0)
    draw.line((95, 90, 95, 140), fill = 0)
    draw.line((70, 115, 120, 115), fill = 0)
    draw.arc((70, 90, 120, 140), 0, 360, fill = 0)
    draw.rectangle((10, 150, 60, 200), fill = 0)
    draw.chord((70, 150, 120, 200), 0, 360, fill = 0)
    epd.display(epd.getbuffer(Limage))



    epd.sleep()

if __name__ == "__main__":
    url = "%s/receive/%s" % (SERVER_URL, SCREEN_ID)
    response = requests.get(url, allow_redirects=True)
    png = response.content
    if check_image_updated(png):
        update_temp_image(png)
        if not DRY_RUN:
            update_screen(png)
        sys.exit("Image updated.")
    else:
        sys.exit("Image not updated, exiting.")

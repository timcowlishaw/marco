# Marco

Marco is an experiment in slow, asynchronous communication with pictures. It's a webapp for sending picture messages, and an e-ink 'picture frame' that receives them.

To use it, you'll need to run the webapp in `webapp/` somewhere  - it runs on node and sqlite and is dockerised. The picture frame devices are made with a Raspberry Pi Zero-W and a [Waveshare 4.2inch e-paper display](https://www.waveshare.com/wiki/4.2inch_e-Paper_Module), soon to be mounted in a standard 6*4 picture frame (more on that when i've finished it).

To get started, checkout this repository on both the client pis, and on the server.

On the server you can get started with 

`cd webapp/ && docker-compose up`

on the client you need to do a few things:

 - Use `raspi-config` to turn on SPI
 - `sudo apt-get install python-pip`
 - `cd client`
 - `sudo pip install -r requirements.txt`
 - `git submodule init`
 - `git submodule update`

Choose a name for your screen (any short string), and go to the webapp and send an image to it. 

Then you can run, eg: `MARCO_SERVER_URL="http://example.com" MARCO_SCREEN_ID=your_name python client.py` to display the last sent image.

To make it automatically update every 5 minutes, add something like this to your crontab with `crontab -e`:

`*/5 * * * * cd ~/marco/client && MARCO_SERVER_URL="http://example.com" MARCO_SCREEN_ID=your_name python client.py`

Bear in mind there's absolutely no security or authentication built in - putting the web interface behind some sort of auth mechanism would be a good idea if it lives on the open internet. Use at your own risk!


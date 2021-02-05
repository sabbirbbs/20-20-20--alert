#!/usr/bin/python3
from playsound import playsound
import keyboard
import time
import sys

print("Eye Care 20-20-20\n16.01.2021\n************\n")

try:
	timi = int(sys.argv[1])
except:
	timi = 1200

try:
	while True:
		print(f"waiting {timi} second.")
		time.sleep(timi)
		playsound("beep.mp3")
		playsound("beep.mp3")
		playsound("beep.mp3")
except KeyboardInterrupt:
	print("\rStoping the alert.")
	sys.stdout.flush()

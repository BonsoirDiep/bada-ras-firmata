# BaDa IOTs KZ With ConfigurableFirmata

Connect Raspberry Pi3 to Arduino Uno via serial port

	// Code for Arduino Uno: https://github.com/firmata/ConfigurableFirmata
	
Control and monitoring
```text
	index.js(with command: npm start) -> badaiots-kz.herokuapp.com/nguoidung/theodoi.html
	index2.js(is not ready yet)       -> badaiots-kz.herokuapp.com/nguoidung/theodoi2.html
```

On Raspberry Pi 3, run:

  ```bash
  git clone https://github.com/BonsoirDiep/bada-ras-firmata.git
  npm install
  ```

In "config.json": You need "productKey" - *if not want to be limited by the demo*
```bash
  npm start
```
***
Design [here](https://badaiots-kz.herokuapp.com/nguoidung/thietke.html) (You need "productKey" signup and request productKey (can send mail to: thandieu13@gmail.com))

Note:
```text
id [ 3, 5, 6, 9, 10, 11]         -> node with type "ao"
id [ 7, 8, 12, 13]               -> node with type "do"
id [ 2, 4]                       -> node with type "one"
id [ 14, 15, 16, 17, 18, 19]     -> node with type "ai"
```
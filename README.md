# BaDa IOTs KZ With ConfigurableFirmata

Connect Raspberry Pi3 to Arduino Uno via serial port

	// Code for Arduino Uno: https://github.com/firmata/ConfigurableFirmata
	
Control and monitoring
```text
   -> badaiots-kz.herokuapp.com/nguoidung/theodoi
```

On Raspberry Pi 3, run:

  ```bash
  git clone https://github.com/BonsoirDiep/bada-ras-firmata.git
  npm install
  ```

"productKey" [here](https://badaiots-kz.herokuapp.com/huongdan)
In "config.json": You need "productKey"
```bash
  npm start
```
***
Design [here](https://badaiots-kz.herokuapp.com/thietke)

Note:
```text
id [ 3, 5, 6, 9, 10, 11]         -> node with type "ao"
id [ 7, 8, 12, 13]               -> node with type "do"
id [ 2, 4]                       -> node with type "one"
id [ 14, 15, 16, 17, 18, 19]     -> node with type "ai"
```

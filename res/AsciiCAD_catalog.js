//     ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████ 
//    ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██    
//    ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██    
//    ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██    
//     ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██    
//                                                                                      
//                                                                                      
//     ██████  █████  ████████  █████  ██       ██████   ██████                         
//    ██      ██   ██    ██    ██   ██ ██      ██    ██ ██                              
//    ██      ███████    ██    ███████ ██      ██    ██ ██   ███                        
//    ██      ██   ██    ██    ██   ██ ██      ██    ██ ██    ██                        
//     ██████ ██   ██    ██    ██   ██ ███████  ██████   ██████  

// Hardcoded catalog (extend freely)

const CATALOG = [
{
name: 'A2GameSocket',
type: 'AppleII',
description: '',
MFR: 'A2GameSocket',
pin_data: null,
text_data:[
'┌─────────┐\n' +
'┤+5V•   NC├\n' +
'┤SW0   AN0├\n' +
'┤SW1   AN1├\n' +
'┤SW2   AN2├\n' +
'┤STRO  AN3├\n' +
'┤PDL0 PDL3├\n' +
'┤PDL2 PDL1├\n' +
'┤GND┌─┐ NC├\n' +
'└───┘ └───┘\n'
],
image_data:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAC1QTFRF4drQWIV3S2BdQnFlbG5pN1dVI0dI2NDFDRYSzMS2lZKHe4V+uLSopqCTJC4ohFQH4wAABcdJREFUeJxllN9r21YUx+9GQDhOHhS1fai7hyi+ZjRrwNEU2PpSPCUwKxlU6hVjYYPZ0aUwFtSSYRw7eyjrEAxMXobx2kJbEkz9A5bUwWuUjDQLBDfOw0K6osR+6WgJlPlv2LlS2mXbebAF93PP9/y6B63X1gsfPeKFxPYK0T/RFFG0cytUM+hUdYxSQlFZUUT9PL9CFYPqv9jMcmdMJUan1gEwCVoYrx48vLT0VgfMFDSMX3Q6RkJdoFcaTykdXEYLaiW/Py7PXmVXKaVH7H+qfUgnD/ZoYu0QOTFRNC7tBqfh4Ogl7XgiX9Y3ja+aK3Sq1EbOxGrNuDD/I9z8bN+MeQ5EcWKPXIagEkUOleOVwth71iZ4KKbS1pa9Wv7Y4hoZ/gzo0Q93UE1RYoZZBe3cM5RCAcXKulag0UUMBiQwKk+sliMX8osMmMsjsICLZp8xwKT04jIArcLY+dZTD9j2AWvW7SKEUiOxfsgKpRiGHmFAlnlIpV0r2wgyCSNZrSAlHncw0WQ/Bgulm7ddCLIrzGJIVAIg4aZXREyu+gC3r1Q9YNALcmIHgYISdjCdZgCHgvjoPADbQcLODdMAQK2pzUV6nMX1oc4r15pzgzIDaHQFKePPUKm9aTBgdht907FfsSyCApMwnRqTUNX5+8xDca5hzRzZvof+EQCSzq4Xg1Ie9QAuhdJXc1+zSgaHT7Ms1gIg0UC3RokHQKnRT3EvzaAwwDTiLAtVHdU0H+BYobIecFmWACAYwbmCwyKZZhJeL7IPrB43KAq64fUCJFJPYGoiXpDI8oBZd0bsH5GpubaDdrdUx2ntKbFPPaCQ5zwgg0UpOZJcb6GDPVGMz2+Gd9/NFdN5dLvAgKybkbFuyIlHHOJ5Xnq/sjx5308zlWISMFECNmSdQC+k6LAcVYaHWZDWP8BMf5+RlKWLPBKcJTkhRfu+YGmmLR8INGawQKiU5M8itbKsSVJUGOp4pU5xx1ngfpkmR8xBtJPdIhoeINrzDgOQB2Tca8ME2iXp76Anu7uSFFrqUwDINo4lsu61KL48QpOhCqpV9ygNOZFpkEidiEHvIwLU+grSwhGaiDfHWJCpdOpNFhq4kCSio86fA5JUmV8//B6yCFgwtn4dRP20IYGhzstwDA82xydfQCULluV5mINeiFFiwmBCu3dqYwnlQgzn6nN+kG4KehEd1gXPg6JUrD+oRqAOrwHmIcMLWJckgQFhJULNK5mhXD1VOC5UAGLolwlsIBOAsjNKzc/jz3N1K2DB1PWwicqERUEmvkQ7vwgeDsd8ADx4gCj288xeS2i1IbvOFWCgUJpVMijCcyREJEiplUvLRPvcwTYLEiEuzZoFABDwg8q1dv4Wz58bvGnXe/8NiETEInJqYUVxYpPll7l6ACSyrQLLIhhjLjDWUHXBcZzqHonk7Dp7F7/mxlmpg6cwI0SMVhdahTsb143pGx0G9EbsHwDY7g6xCAgD9kHCXTQoxABFePvIvuFJDPTBKdYwKi2o5VgYTx6IEOS29a1t34QgHwRFnmhMBJX2IQspGooc5RjQZdvfuR4AE8NEwENYwXQS6mTXA3kUOLL/8p4/JlFMsKghR1WgF4OHK3aOxYC2wg0odSEoG8wF0WAVt/JPzfDuHQZw0IsULFJU6OYJc2GYyHEG1TEzsbZp+3XwNi3X6B4QiC6AC6SqKvSCKLBqiz2vV3GvG2T3o6zdqtPKP4aP09N2sfckoPeJOmu3m6lBuymVyHQx4G0YzrV6YFeTqD8Pq8te44kuyy7b1fAyGpBFNxtYCRi2H3j2LUv8ervdZNYulZx7UeHYQ+ns7/65xIf4pSX+P+agZh4JEownkfwbp4CUThh63LwL1yTi4aG7AbSxgR6/uR9y0G91C16QLvkOHjSzFjd3QmIJCR9wcC5DGowpbnA9P/cKJyV4/iHPy9HjC+dm75XPNu+xz1DIcVadEvJSiB4n/X9z/gaj2A9b2L01LQAAAABJRU5ErkJggg=="
}
,
{
name: 'ATTiny85',
type: 'MCU',
description: '',
MFR: 'ATTINY85V-10PU',
pin_data: null,
text_data:[
'╔══╧════╧════╧════╧══╗\n' +
'║ GND  PB4  PB3  PB5 ║\n' +
'║           TX     ● ║\n' +
'║                    ║\n' +
'║     [U# ATTiny85]  ║\n' +
'║ SDA                ║\n' +
'║ MISO MOSI SCL      ║\n' +
'║ PB0  PB1  PB2  VCC ║\n' +
'╚══╤════╤════╤════╤══╝'
,
'╔═════════════════╗\n' +
'║  [U# ATTiny85]  ║\n' +
'║                 ║\n' +
'╢PB0 MISO SDA  GND╟\n' +
'╢PB1 MOSI      PB4╟\n' +
'╢PB2 SCL    TX PB3╟\n' +
'╢VCC           PB5╟\n' +
'║              ●  ║\n' +
'╚═════════════════╝'
,
'╔══╧════╧════╧════╧═══╗\n' +
'║ VCC  PB2  PB1  PB0  ║\n' +
'║      SCL  MOSI MISO ║\n' +
'║                SDA  ║\n' +
'║  [U# ATTiny85]      ║\n' +
'║                     ║\n' +
'║ ●    TX             ║\n' +
'║ PB5  PB3  PB4  GND  ║\n' +
'╚══╤════╤════╤════╤═══╝'
,
'╔════════════════════╗\n' +
'║   [U# ATTiny85]    ║\n' +
'║ ●                  ║\n' +
'╢ PB5            VCC ╟\n' +
'╢ PB3 TX     SCL PB2 ╟\n' +
'╢ PB4       MOSI PB1 ╟\n' +
'╢ GND   SDA MISO PB0 ╟\n' +
'╚════════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAA9fX1ZmVmPj0+fAufOQAAAAR0Uk5TAP/7Xe+ZR0gAAAGFSURBVHicldI9SgNBFADgga1sklOk8AAWm0JP8R7upE4gq+AVvIHVDGFjO8Gsi9gaLALpLJJTRDBVwCrBwvdmdnd21kJ9kMB88/4WRogyuksRRv85PEfmKoRzwDDlA+AmSFAAct+AA1AU/txVDAM/OQYbddvIOKgnd9wZsKrZllBN7qgKyskHqOPVz3RNisZMW3LdmMlhLoOWIGHA4DPmFk7GkDtDZVeLMYPEwpiKGGCUz1xLgBHBGeSQupaAM4IepcoyIZUWJGCZMGfY0V3iWqYJw9aATO1MyC30UkCj7Eyd8GI9uhuObQIm/C08hdrxrwJJt0OeiXOGU7uBoaUkHsrPlwypzvDIEG35qKhlhuuJfSpUDkpKzHFlIaZ6pXKJiwpeaO9MS3wbRA7uqG1OsK7glp6PJtjcV7BTBNSyhndDsGjCkYBaetgYrddTD7tlnOnVxMOF6D4FQH+fOgohmnro/4BlC9xTdVC0oPH6/whFC8RXG8R/4aEFYt8G8Qs8tqBe6huGHP6l63xHWgAAAABJRU5ErkJggg=='
}
,
{
name: 'ATTinyX12',
type: 'MCU',
description: '',
MFR: 'ATTINY412',
pin_data: 
{
"mcu": "ATtiny24/ATtiny24A",
"package": "PDIP-14 / SOIC-14",
"pins": [
{
"pin_num": 1,
"port": "VCC",
"PWM": false,
"digital": false,
"Power": "VCC"
},
{
"pin_num": 2,
"port": "PB0",
"PWM": false,
"digital": true,
"alt": ["PCINT8", "XTAL1", "CLKI"]
},
{
"pin_num": 3,
"port": "PB1",
"PWM": false,
"digital": true,
"alt": ["PCINT9", "XTAL2"]
},
{
"pin_num": 4,
"port": "PB3",
"PWM": false,
"digital": true,
"alt": ["PCINT11", "RESET", "dW"]
},
{
"pin_num": 5,
"port": "PB2",
"PWM": true,
"digital": true,
"alt": ["PCINT10", "INT0", "OC0A", "CKOUT"]
},
{
"pin_num": 6,
"port": "PA7",
"PWM": true,
"digital": true,
"analog": "ADC7",
"alt": ["PCINT7", "ICP", "OC0B"]
},
{
"pin_num": 7,
"port": "PA6",
"PWM": true,
"digital": true,
"analog": "ADC6",
"I2C": "SDA",
"SPI": "MOSI",
"alt": ["PCINT6", "OC1A"]
},
{
"pin_num": 8,
"port": "PA5",
"PWM": true,
"digital": true,
"analog": "ADC5",
"SPI": "MISO",
"alt": ["PCINT5", "OC1B", "DO"]
},
{
"pin_num": 9,
"port": "PA4",
"PWM": false,
"digital": true,
"analog": "ADC4",
"I2C": "SCL",
"SPI": "SCK",
"alt": ["PCINT4", "USCK", "T1"]
},
{
"pin_num": 10,
"port": "PA3",
"PWM": false,
"digital": true,
"analog": "ADC3",
"alt": ["PCINT3", "T0"]
},
{
"pin_num": 11,
"port": "PA2",
"PWM": false,
"digital": true,
"analog": "ADC2",
"alt": ["PCINT2", "AIN1"]
},
{
"pin_num": 12,
"port": "PA1",
"PWM": false,
"digital": true,
"analog": "ADC1",
"alt": ["PCINT1", "AIN0"]
},
{
"pin_num": 13,
"port": "PA0",
"PWM": false,
"digital": true,
"analog": "ADC0",
"alt": ["PCINT0", "AREF"]
},
{
"pin_num": 14,
"port": "GND",
"PWM": false,
"digital": false,
"Power": "GND"
}
],
"power_pins": [
{ "name": "VCC", "pin_num": 1, "voltage": "1.8–5.5V (device dependent)" },
{ "name": "GND", "pin_num": 14, "voltage": "0V" }
],
"notes": {
"digital_audio": "Not supported on ATtiny24 (no I2S/SPDIF).",
"serial": "No hardware UART. USI can be used for I2C/SPI; UART can be bit-banged.",
"I2C": "Provided via USI: SCL=PA4 (USCK/SCL), SDA=PA6 (SDA).",
"SPI": "Provided via USI: SCK=PA4 (USCK), MISO=PA5 (DO/MISO), MOSI=PA6 (SDA/MOSI).",
"CAN_bus": "Not supported."
}
}
,
text_data:[
'╔══╧════╧════╧════╧══╗\n' +
'║ PA1  PA7  PA6  VCC ║\n' +
'║ SDA  RX   TX    ●  ║\n' +
'║                    ║\n' +
'║  [U## ATTinyX12]   ║\n' +
'║                    ║\n' +
'║ SCL  UPDI SCK      ║\n' +
'║ PA2  PA0  PA3  GND ║\n' +
'╚══╤════╤════╤════╤══╝'
,
'╔════════════════════╗\n' +
'║  [U## ATTinyX12]   ║\n' +
'║                    ║\n' +
'╢ PA2 SCL    SDA PA1 ╟\n' +
'║                    ║\n' +
'╢ PA0 UPDI    RX PA7 ╟\n' +
'║                    ║\n' +
'╢ PA3 SCK     TX PA6 ╟\n' +
'║                    ║\n' +
'╢ GND         ●  VCC ╟\n' +
'║                    ║\n' +
'╚════════════════════╝'
,
'╔══╧════╧════╧════╧═══╗\n' +
'║ PA1  PA7  PA6  VCC  ║\n' +
'║ SDA  RX   TX    ●   ║\n' +
'║                     ║\n' +
'║   [U## ATTinyX12]   ║\n' +
'║                     ║\n' +
'║      UPDI SCK       ║\n' +
'║ PA2  PA0  PA3  GND  ║\n' +
'╚══╤════╤════╤════╤═══╝'
,
'╔════════════════════╗\n' +
'║ ● [U## ATTinyX12]  ║\n' +
'║                    ║\n' +
'╢ VCC            GND ╟\n' +
'║                    ║\n' +
'╢ PA6 TX     SCK PA3 ╟\n' +
'║                    ║\n' +
'╢ PA7 RX    UPDI PA0 ╟\n' +
'║                    ║\n' +
'╢ PA1 SDA    SCL PA2 ╟\n' +
'║                    ║\n' +
'╚════════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAGRoaNjY2Wlpa1tbWhYWF4+Pjtra2iYmJw8PDKiwzSgAAAAp0Uk5TAP/8+Br3/fhahha3s/EAAAJ/SURBVHic1ZWxT9tAFMZvMFIYz24Cq8+N6Nj49XBHSzgKjLF7NWyV2l7EVgXsU7YKguRuSEAj/ts+21xydhw6deg3REq+3/fy3vOLQsi/krV8xYzC08J/tzv7PEsYpU7YHY6iAtCm1O4EzqpwrZ9bpc90uNbbtr/KfJcaMru0oscCGi7KMQAM0y1tuuz57XANrLvsdbheQukHDZy2CzDG089Gl3ejVjgLlMIKhxq4XQM2tT0lgjgYJmaXFeCkMYUBF1ylqfCbuzzB93YuhXt8nGU8gfXI+omfAqUHX5UTB0qI2Oj4ox4TgcG8P+VHtu5lODWX3cMtD4ajVGfdmLO4WvZLl1biUrv/PZ9XLvjsql/uabNL6wbHOJAzlzKADI76wmZ+Y4xyThtcNoyhD8JxdSv0vTEnSrBp3wHPWKq+mXH9oYinTvOhHBpjoEas/dT0sq2ta9LSYySjHYDu8mEXoLu87TjJSm+ac25Lj7EHOwB9+r2/ATvmtBlooGtOm6G277ZhrytsAejhjQBwDYz9pl1W4CoBfZWkxxrp8sUXvgef1oCe066eqJcmAL4nfoUasGATxvaCxANI1TXZCH8OrK7NYwwzfr5UDeCm6huhIPPL8IJYc88ETso8j5nn42UXqxK44iYwRj9QWJ0rFZIHdkGsDC4MYA9QzIPzlVJ4QByBVX4ZboB99HmqluSJBYQ8CQyvpDQAC17CT5Cip9CbNABSFNEEMDwR4sU7k/KeNDT2gpCM0zp8T/Zz1QImWaI9Kb/g30IUtoC09n4QK29scT2JlNdYWH7D8HPYDaCXzzAcddg4ai4vccTFY6dbAr/lovxH2+W/Gq4VdX/1f6A/CEK+3lEmwEYAAAAASUVORK5CYII='
}
,
{
name: 'ATTinyX24',
type: 'MCU',
description: '',
MFR: 'ATTINY3224',
pin_data: null,
text_data:[
'╔═══════════════════╗\n' +
'║ ●  [U# ATTinyX24] ║\n' +
'║                   ║\n' +
'╢ VCC           GND ╟\n' +
'║                   ║\n' +
'╢ PA4       SCK PA3 ╟\n' +
'║                   ║\n' +
'╢ PA5  RX1 MISO PA2 ╟\n' +
'║                   ║\n' +
'╢ PA6  TX1 MOSI PA1 ╟\n' +
'║                   ║\n' +
'╢ PA7      UPDI PA0 ╟\n' +
'║                   ║\n' +
'╢ PB3 RX0   SCL PB0 ╟\n' +
'║                   ║\n' +
'╢ PB2 TX0   SDA PB1 ╟\n' +
'╚═══════════════════╝'
,
'╔══╧════╧════╧════╧════╧════╧════╧══╗\n' +
'║ PB2  PB3  PA7  PA6  PA5  PA4  VCC ║\n' +
'║ TX0  RX0                       ●  ║\n' +
'║                                   ║\n' +
'║          [U# ATTinyX24]           ║\n' +
'║                                   ║\n' +
'║                TX1  RX1           ║\n' +
'║ SDA  SCL UPDI  MOSI MISO SCK      ║\n' +
'║ PB1  PB0  PA0  PA1  PA2  PA3  GND ║\n' +
'╚══╤════╤════╤════╤════╤════╤════╤══╝'
,
'╔═══════════════════╗\n' +
'║   [U# ATTinyX24]  ║\n' +
'║                   ║\n' +
'╢ PB1 SDA   TX0 PB2 ╟\n' +
'║                   ║\n' +
'╢ PB0 SCL   RX0 PB3 ╟\n' +
'║                   ║\n' +
'╢ PA0 UPDI      PA7 ╟\n' +
'║                   ║\n' +
'╢ PA1 MOSI RX1  PA6 ╟\n' +
'║                   ║\n' +
'╢ PA2 MISO TX1  PA5 ╟\n' +
'║                   ║\n' +
'╢ PA3 SCK       PA4 ╟\n' +
'║                   ║\n' +
'╢ GND        ●  VCC ╟\n' +
'╚═══════════════════╝'
,
'╔══╧════╧════╧════╧════╧════╧════╧══╗\n' +
'║ GND  PA3  PA2  PA1  PA0  PB0  PB1 ║\n' +
'║      SCK  MISO MOSI UPDI SCL  SDA ║\n' +
'║           RX1  TX1                ║\n' +
'║                                   ║\n' +
'║           [U# ATTinyX24]          ║\n' +
'║                                   ║\n' +
'║ ●                        RX0  TX0 ║\n' +
'║ VCC  PA4  PA5  PA6  PA7  PB3  PB2 ║\n' +
'╚══╤════╤════╤════╤════╤════╤════╤══╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAC1QTFRFAAAAJiYmFxcXNzc4bW1urKytTE1N297fxcfIjo6Ptbe4ycnKtLa3iYmK5ufoGiz2AAAAAA90Uk5TAP///vj4/Qoo/WH8n7rxUfwZowAAAwhJREFUeJy9lc9r02AYx99bwpiHJ6mBHXZo9hd0tUGcO8RtascuwjIJK4MuU3B66EFsqR30MOl+9TC6zGWtMhDp5k7CIpTKGHiYslOZbEOcN0Ud9G/wSdLWvMuamz6H5PB8eZ7P+32eNyHkP0Yymcz55Zmjr8rvhI+gM9T3S8/6CD6AYK775DviANJdH8EsYEwnU+2asLIl4L+p9TacdgGAtpxMzRHwldLFBfIhRwDSMWEuaMIe2lkhehP6cwsfvYoZp8DDs7rMf1GqGx6CVyCKCKAXJn5YnB5BOs6JYhBbyBNmnFdKnhazgAIR+CGtEA2BcEIILWFrEOZEDrrq2vIgoiDnT0qRB5ia7NFAqE8tr0II+BGV4mRrIgi9Ah7kZV0uRO4ARL5TnJc4BOSCHEBgV9bGB2TgjXV3iycWICfaPoYCevEtHpjifAz2GRvD6Cs2OP+u30x00qUAQy3gc0Td3WsKDkYnrSbNiOo68l4+izY5map5JLqbjAqr+NJbc2ejsVTNXSJiFHG9+DW8KbbgqXqM03SXGDJX8BXILTjrp5h7DmerBBimwzlhc87j8M5x3hsYRc6uM90WsGXCjpufOVcTQVHG8DXUmnuHEZujOK+MPcB7xA8nGpxL6hqZ4d2cRmTA4iy/qWctwWuzTDIUZ0BXLcWjisOZL2XJwQ5leEhV4xan4XBuEuYcJ1803lGcrPE+dUhx2m7xt5qGL6rPSf6+u4mwjI/w1aZgy9wgS4M33H5aBeKtCvlSgtneofzEkAKt3WQ2PX5iAW3avZss+klxgiSVXXmSqayRTNhdQrvmzpOt6j766eIUwvuUIIOmUJzhfvqKMjnLz9PWfgrhY3I+2JVYssUpdWc9ggz62dng5OO3PXnyDPcz0/BTCngLkDTOfXEnbn9NtGlvnjBzeNHM015sIkkbFwgsjRHLIWdQu97mm5xWh0laE3tC3jM6MY9+pgflnu52P5+0kkBOOdiuACHIuV19MZVtK0DOT7HcnE+epCrrfn8/9LN64psnC4ofwD+IPwq/D/44ndVIAAAAAElFTkSuQmCC'
}
,
{
name: 'ATTinyX26',
type: 'MCU',
description: '',
MFR: 'ATTINY3226',
pin_data: null,
text_data:[
'╔═══════════════════╗\n' +
'║ ● [U# ATTinyX26]  ║\n' +
'║                   ║\n' +
'╢ VCC           GND ╟\n' +
'╢ PA4       SCK PA3 ╟\n' +
'╢ PA5  RX1 MISO PA2 ╟\n' +
'╢ PA6  TX1 MOSI PA1 ╟\n' +
'╢ PA7      UPDI PA0 ╟\n' +
'╢ PB5           PC3 ╟\n' +
'╢ PB4           PC2 ╟\n' +
'╢ PB3 RX0       PC1 ╟\n' +
'╢ PB2 TX0       PC0 ╟\n' +
'╢ PB1 SDA   SCL PB0 ╟\n' +
'╚═══════════════════╝'
,
'╔══╧════╧════╧════╧════╧════╧════╧════╧════╧════╧══╗\n' +
'║ PB1  PB2  PB3  PB4  PB5  PA7  PA6  PA5  PA4  VCC ║\n' +
'║ SDA  TX0  RX0                                 ●  ║\n' +
'║                                                  ║\n' +
'║                  [U# ATTinyX26]                  ║\n' +
'║                                                  ║\n' +
'║                               TX1  RX1           ║\n' +
'║ SCL                     UPDI  MOSI MISO SCK      ║\n' +
'║ PB0  PC0  PC1  PC2  PC3  PA0  PA1  PA2  PA3  GND ║\n' +
'╚══╤════╤════╤════╤════╤════╤════╤════╤════╤════╤══╝'
,
'╔═══════════════════╗\n' +
'║   [U# ATTinyX26]  ║\n' +
'║                   ║\n' +
'╢ PB0 SCL   SDA PB1 ╟\n' +
'╢ PC0       TX0 PB2 ╟\n' +
'╢ PC1       RX0 PB3 ╟\n' +
'╢ PC2           PB4 ╟\n' +
'╢ PC3           PB5 ╟\n' +
'╢ PA0 UPDI      PA7 ╟\n' +
'╢ PA1 MOSI TX1  PA6 ╟\n' +
'╢ PA2 MISO RX1  PA5 ╟\n' +
'╢ PA3 SCK       PA4 ╟\n' +
'╢ GND         ● VCC ╟\n' +
'╚═══════════════════╝'
,
'╔══╧════╧════╧════╧════╧════╧════╧════╧════╧════╧══╗\n' +
'║ GND  PA3  PA2  PA1  PA0  PC3  PC2  PC1  PC0  PB0 ║\n' +
'║      SCK  MISO MOSI UPDI                     SCL ║\n' +
'║           RX1  TX1                               ║\n' +
'║                                                  ║\n' +
'║                  [U# ATTinyX26]                  ║\n' +
'║                                                  ║\n' +
'║  ●                                 RX0  TX0  SDA ║\n' +
'║ VCC  PA4  PA5  PA6  PA7  PB5  PB4  PB3  PB2  PB1 ║\n' +
'╚══╤════╤════╤════╤════╤════╤════╤════╤════╤════╤══╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAC1QTFRFAAAAMDA1ODc6S0pLr6ywd3V3U1JUqqirrqqupaGji4eJvbq9paGiY2JlhYSGSoSKUAAAAA90Uk5TAP//+vc6xLNEE/cLeXgP3WrViwAAAlNJREFUeJztVL+LE0EUnkaSJRKYWbjCbl4ghXDNDGcXsFjYuEkhHASuUCSplRRp/IGkCIhgcWAsLK4xW8hVW+Q45Zot0igWx6UPabwu/4Oz82N/ZDOxFnzVst/33vu+92YGof9hi9qT9X5CD4724hsGjes9+BmjBA5PrfhFHzAm8MKG12+AUMFoPrbgS5GfBLR2Nqn1gGoCrHYLFBhJCASa6zL+iclkVYSUh3GnD5AU1zLcbZ3CgEgGamTgwyLuLKkUR0UB3aQ4jB4o9XJOqkRhGBuFE12mpHOjDCQIocSoOEit/u4r8zQhGBvi02y1fiNzqCqQ4hg/0wRpQJXO2cycSgMqkwidGe4eaYG6AN5qgO+3t3GguXxM3a7agGzKaIMBzuffm7V8Qfiox0IJZ9JmpsA/8SP07QvWvgmDvAF3duBfeWPkMTN6QWiwHCFYedHkEXonJGph0OBZBSBeNBpfftVD0j8hl98aRYuXjji6y1zZLIh3KvITE+iWF6QreNYMx4vXzg+5qAFLz1DawLtexBXfHAUOxQERTkT+sPrG7HrJITsjMr+1GE+7UWROyxlnhQJY5gcpjtAxzxHIeXMUz9vR+/yNSXQSc1LD1WR4N1ijfNzydAsch/G0g34VL3d9YBhu2JoMK37p7hudicBpxwnKj8OSy5t//mAxrHSjzyVclEg2ScK300412PX81I4FgdNwOG2jDztfH7ESN3wuDHq2F1BYDeN5x3k1thCcQdMmUMfF0/nDWhBbcRGXHYtAE1XP1t/ET8sDnMb3v+D/bPwB1max/B27DpQAAAAASUVORK5CYII='
}
,
{
name: 'CH340N',
type: 'Power-Driver',
description: 'USB to TTL Serial Port Module CH340N 5V to 3.3V Converter Adapter Board',
MFR: 'CH340N',
pin_data: null,
text_data:
[
'╔═══╤═════╤═══╗\n' +
'║   ╰─USB─╯   ║\n' +
'║  [CH340N]   ║\n' +
'║             ║\n' +
'║  TXD GND RTS║\n' +
'║3V3 RXD 5V   ║\n' +
'╚═╤═╤═╤═╤═╤═╤═╝'
,
'╔═╧═╧═╧═╧═╧═╧═╗\n' +
'║  5V  RXD 3V3║\n' +
'║RTS GND TXD  ║\n' +
'║             ║\n' +
'║  [CH340N]   ║\n' +
'║  ╭──USB──╮  ║\n' +
'╚══╧═══════╧══╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAApaWlSUlJaGhoioqKk5OTlZWVvb29tLS08fHxLCU2VgAAAAp0Uk5TAP7+/fskivURF2gpfKwAAAH7SURBVHic7dS/r9MwEAdwSxBwR1OrnTlH7PG5iNV2JNYsrWB7em1D14hCGCtQo/Jfc3Z/Jm3KG2B7Nyaffn2202Psuf5JDZ4IpsVfQFP2icEhYFtO7wEK4OWmH8SA2bIfzMoiKR/hZhsBNCGgeVQPfSDZB8DkVgSBhMSnxAGY7zcEgWZJW/gJAMqMrvc6YLvQI58DIJHxlRhQAJuWvxS99alOx93NDhifLYvkK72nCGP9x2UX0DmVjdKAOvXKG+yIeFDbeQgweWaHCimj6IJkrsHoNJcOtfK5/VZ0wAutKcCuc4OYGo9ZvWqDl9SeVmipA8RMq6EQqxZ4hQp0tkbM0SNqnYqz2CdoChBjaeJrWkycRQSvK1o9ryQCokIIAScRAf8ihFZW0oVpryGTB7E5AsbrSmqVrx1QAFhxqB+b81ctqpBRe+XAiFONNkfAGxFWMVJfBAzBjjbHfxaf0XMHmOv09HtHdvSbnUQeHimXncBQhVVYS3iAt6JV8nwtvIlC2eoSuMu7j0LDXsjYjDStr6NZhN5NFC5ux71vAbYlkXtRk3ChRaE+sCshva2DsHEjnzuA7Uq5wL0IZze5HkF8uysPGUKqh5szijfzIKR4867oGWLbBYmaVuidcnuhiv4xyBe02cm9OclndbW6O0j5rimePmn/J3iuQ/0BH/+EHeDJmf4AAAAASUVORK5CYII='
} 
,
{
name: '8SSR',
type: 'Power-Driver',
description: '8 x Solid State Relay - Low Level Trigger',
MFR: '8SSR',
pin_data: null,
text_data:
[
'╔══════════════════════════╗\n' +
'╢DC+ [8 Solid State Relay] ║\n' +
'╢DC-   Low Level Trigger   ║\n' +
'╢CH1                       ║\n' +
'╢CH2                       ║\n' +
'╢CH3     ┏━━━━━━━━┓  SW1⌈⊘⌉╟\n' +
'╢CH4     ┗━━━━━━━━┛     ⌊⊘⌋╟\n' +
'╢CH5     ┏━━━━━━━━┓  SW2⌈⊘⌉╟\n' +
'╢CH6     ┗━━━━━━━━┛     ⌊⊘⌋╟\n' +
'╢CH7     ┏━━━━━━━━┓  SW3⌈⊘⌉╟\n' +
'╢CH8     ┗━━━━━━━━┛     ⌊⊘⌋╟\n' +
'╢⌈⊘⌉DC+  ┏━━━━━━━━┓  SW4⌈⊘⌉╟\n' +
'╢⌊⊘⌋DC-  ┗━━━━━━━━┛     ⌊⊘⌋╟\n' +
'╢⌈⊘⌉CH1  ┏━━━━━━━━┓  SW5⌈⊘⌉╟\n' +
'╢⌊⊘⌋CH2  ┗━━━━━━━━┛     ⌊⊘⌋╟\n' +
'╢⌈⊘⌉CH3  ┏━━━━━━━━┓  SW6⌈⊘⌉╟\n' +
'╢⌊⊘⌋CH4  ┗━━━━━━━━┛     ⌊⊘⌋╟\n' +
'╢⌈⊘⌉CH5  ┏━━━━━━━━┓  SW7⌈⊘⌉╟\n' +
'╢⌊⊘⌋CH6  ┗━━━━━━━━┛     ⌊⊘⌋╟\n' +
'╢⌈⊘⌉CH7  ┏━━━━━━━━┓  SW8⌈⊘⌉╟\n' +
'╢⌊⊘⌋CH8  ┗━━━━━━━━┛     ⌊⊘⌋╟\n' +
'╚══════════════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAC1QTFRFAAAAEhYavcDDLjE0REZIlbjspqeqa21ujY6PX5Xe////paqyw8/fpK69IGnBGnTlUAAAAA90Uk5TAP/8///7/P7++hU4EZT//rqySQAAAxJJREFUeJzdk0FrE0EUx3PPehhS6H2w0xStsMxAeo07ZHOOrGUvPQzpZqVUsA27K+IlltkViYdggnvJB/DUi6VQhSL0IDEghUpLvRUtveQz+CZ2myZN0rPO9f147/f+bzf14ZaX+m/ft+7PqXXt5BB/mgYcWFwsTiE6lkVzTn1/8gBMDJQTi5OIbhzgij6Z0GKbemQLoSL5PmFAmyJPvEKIjwUO3uOsjjIbeBOxcUAnflRUBplaVmfbYwYcWWe06ILBzJbOTm9afm2RM5rxMBgwnYkbgXesUGTzKCOVgU5reITQTmLDdEIdzdTKiCEARohu6QHVi04FDAw1As81h47WeSzxFgIDcKQIUGxbpWtxaietnCRg4JFnCqCFOQuA08EGpRWac13IIMoDwDZWbctq3NtL6neauEzhRMpABwPTgXrcwEla6Xi5RjbhRKIMQIZSb7UJAE4maB+b73L9DLysnslnqOlBA7uxnjhqJXKm51x1BVgkn+HiSdOymyTJQTuSuKyjJVyGjBXgrVqqQf1qg2a1BsuhAlwBAINJqC80RbJC2rKNnBOp76CiAO68blh2jNeS+iF+StES+KMZuBKaCf4OWN9OBAiGBJFKEBmQ8ayMwTAmyYpda9nD8wi+IqL3M/ahgd0urV2uqFkL59UNF/rPVhTACkQZ/pJJhlrcPue8hqE/VYAp22qAkxhCh7bJuSlAAwCDem7vwlpp1bcHwArjnBcgJAUs+U7vwr5wBmfuHPUB7lUVwEWl+LYXt64yTKX2dhZ4/8ECBgrcIPR7v+W1Ty19XOnXDQVQ6URR+HxgqBx2w+olwLgTiGzk+y+Hfqq0jEyDcYMh5mFfRmFQeZEael1R5pQZDH4KV0ZuIN8M11PaTlA1KDQxseO6viR7qVHihwMEfXjXwzIMhgyTLKRbNZiY9yU0WB/z26e6MtoMnCj0woCcjqnDrl4Fbh6Ffi258ihx7JgickNJxg3oa2ASRMVQjjG8fJ+FiwO3PqkBvN0oks5YwyuNmpg8QL2uwFMGqBZf7k+tA7F/C/Dvvj+wrUBCQQBVrQAAAABJRU5ErkJggg=='
}
,
{
name: 'XIAO_ESP32-C3',
type: 'MCU',
description: '',
MFR: 'Z4T-XIAOESP32C3',
pin_data: null,
text_data:[
'╔═════╤═══════╤══════╗\n' +
'║     ╰──USB──╯      ║\n' +
'║                    ║\n' +
'║ [U# XIAO ESP32-C3] ║\n' +
'║                    ║\n' +
'╢D0 A0             5V╟\n' +
'╢D1 A1            GND╟\n' +
'╢D2 A2            3V3╟\n' +
'╢D3          MOSI D10╟\n' +
'╢D4 SDA      MISO  D9╟\n' +
'╢D5 SCL       SCK  D8╟\n' +
'╢D6 TX         RX  D7╟\n' +
'╚════════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAHyEl4uHmtK+yfHZ3WlRTNjU4oYVkbmNaoI18rvRBjQAAAAp0Uk5TAP///f7+/fGIPaqpVkYAAAMySURBVHichZbBctowEIZzDEfNYKXXrswDVLLpGSy7Z8Byzwq2Mr01kzSGW3IJyS2nJLxtV3ZsSybTLpix8Yf2/3cXwdlZH+/Pxy6eXs4+iVfTh/4c0KQNbcjnAOmC/g8gJ8D7E8ajA9jrZ+e+zZ67wOMmJqYnJg/2PTUGyJcOOG/k+ys0Wjsl5+QEyIpyQch9Bxi7RJk5wELqFTUdMKlvkZh6QJFndd2lmOzeFmOA0Kv9AOwn1y0QZB+58ANXL2+9zfrwsUKQIlC1wMWwwnn9h7RAie7Jdt4A9Gft22w0VIqootFgY7Bpr5r81NjnGGhtorZKY6dJQIsmxY+RTZPRapVEVKZUNSJ3I5sqM6YqjCnx+LDZA/VhhSk05tG0HSm8no5tBsS0dwmS+sQmVYZ0Q9uf3DtAwoXqh94YIWIXQOEcMBgIG815hCmGOhyKBEYR+zbveoDjAyLOZ67N3RsCSbSUYSLXmySRqYxir5u3OgGZyzyWyTpOpAVmqOG3M5MJRFIk4VIupcCFRDJD657NscjQtVmnPcC4NcoED8mQorVpb4RYhKYUjIfTsU1bIYYH51gwTOHa3L/fnWqY7g+DzdqMAAahb5NamzxWlsu2EBsU6dlEYC6jMio4hCUH1OzZTAu7AmRCiiVkHGaXtg4qH7pZFxbYZukaoAT4iv0Kg3po9/6ILmK23lp9UwSqNYQXR6eb1uY3s77sgASlXAw22xQxu9zAEkABzDBTiF+cXqQxKDKG7dwgMF8CK63IYYdpbcYwT0S8BmY2MK+4Z1MVDcAqWdlx3QBIBCrl2Fw1pWaSD70Iaq+b+bhZzBva4510b2LDGbs6ujZXOTSzwkUkcCBxYpiTAkWSFli282RfGX5d/zm0zO8mWZ4CyrNZSidShTGtR1tQG8GqO3Nd7I7XQY6f1GTz3e42mhqtfZuFyKXKM4r6b/RWykhKz6YhQmlaZYEQIBbbWJkqx+vBZqAj3HiKLGC1EIvNvDBVSamzR5WLqDJGpQG7GYC0//WcPJSZqHDZLIAuhcmp6n/1zl4DXWL9xQr3MiF0kOZYClL86oHJk1K2QEohFhmDeUSs2v8IfwEGVmNubcXoKQAAAABJRU5ErkJggg=='
}
,
{
name: 'Teensy 4.0',
type: 'MCU',
description: '',
MFR: 'Teensy_40',
pin_data: null,   
"text_data":[
'╔═══════════╤═══════╤══════════════╗\n' +
'║           ╰──USB──╯              ║\n' +
'║                                  ║\n' +
'║         [Teensy 4.0]             ║\n' +
'║      ARM Cortex-M7 600MHz        ║\n' +
'║                                  ║\n' +
'╢GND                            VIN╟\n' +
'╢RX1  CRX2   -0                 GND╟\n' +
'╢TX1  CTX2   -1                 3V3╟\n' +
'╢     OUT2   -2  23- MCLK1 CRX1  A9╟\n' +
'╢     LRCLK2 -3  22-       CTX1  A8╟\n' +
'╢     BCLK2  -4  21- BCLK1 RXS   A7╟\n' +
'╢     IN2    -5  20-       TXS   A6╟\n' +
'╢     OUT1D  -6  19-  SCL0       A5╟\n' +
'╢RX2  OUT1A  -7  18-  SDA0       A4╟\n' +
'╢TX2  IN1    -8  17-  SDA1 TX4   A3╟\n' +
'╢     OUT1C  -9  16-  SCL1 RX4   A2╟\n' +
'╢MQSR CS     -10 15-       RX3   A1╟\n' +
'╢MOSI CTX1   -11 14-       TX3   A0╟\n' +
'╢MISO MQSL   -12 13- CRX1  SCK  LED╟\n' +
'║                                  ║\n' +
'╚══════════════════════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAO1xXYntyjJ6Pu7ur5uPfxdLCYqmOwcGkz8msWUisjAAAAAp0Uk5TAP/9+fX0E3isXC+tOyYAAAKVSURBVHiclZRBaxsxEIVNUzbJUaOF5ippS51bLamtc7Qkp/Y12YUeDQGTY0tKfa4N7vpWbCjJv+2MHKeHHR86xodFHzNvZp7U6/1XFPPerFcUR07n++jNZkeAB+v6DUb7ZYHxtQu0S/eWgFRbE+N7Btg9A00w6Z4BHpzKQNMEcCsG+FaNynxeCwiC0fA9qDKNmzrVwjrbBYrNLpbpQ7qt6ou78p4B/MCCTy76WG7LRwZQQmtxCMVmAA3KWCG1Vhyw2RLgrABt/I4Bhj8BhMhVqj4nMh85raQ2WnNtOgUjTA8ajwUzqGK6MiPsJBJQrhhgskTAaUyi1cVdFzjFowGNggDJaDg1oPKMCOA1BOoDci8msCLjYdDu8u43U0Jr55ymiNWSAXTOTyUk/rtAMR1kiYoAOegC5+tVQMBQBne1Y0q4vREIMNWWAdR+BIBjQiWzLjAhJ2hNAIDqAufrNHoegzSXWyaDV7TsrMH1OYA07A0lsQ4DDEWWmecggNPgUYMm60vTX3JdqMOupL86piGvSgFIywB5kpBnxWv44wYvc+hzGSYvV1Omj0c0iIMpKy6DfbaroXsju8DZxlsCwBmHl48BpoZaFLJO0V0vO+foydyigOiDGVoOQA1CRJk82v9NFzhrDbpeBZlS1PIdA2wIwBcSFxavfzEl8HFyXtgMXHEA7kjQGiQuBbgSrcFd1P62ikEBJ3Ljnbcp1VWIcfqpC5w4cuS4iVWQcf25C7zKi8pAUIbRcLIyag/EwA/qiUSOG+rBToZMhkgPRIy1TPZm7RkNQC+QNzdyPBK+4jJYK15cVXaB1/fyUT5CC62YCNfnMkCLwBM86bXiNKBpdf45MRQTJkOxyJFtJ4AB/pHz+WLx4/D1F50MqomekmLCAAAAAElFTkSuQmCC'
}
,
{
name: 'Teensy 4.1',
type: 'MCU',
description: '',
MFR: 'Teensy_41',
pin_data: 
{
"board": "Teensy 4.1",
"pins": [
{ "pin_num": 0, "PWM": true, "serial": "Serial1_RX", "digital": true, },
{ "pin_num": 1, "PWM": true, "serial": "Serial1_TX", "digital": true, },
{ "pin_num": 2, "PWM": true, "serial": "Serial2_RX", "digital": true, },
{ "pin_num": 3, "PWM": true, "serial": "Serial2_TX", "digital": true, },
{ "pin_num": 4, "PWM": true, "digital": true, },
{ "pin_num": 5, "PWM": true, "digital": true, },
{ "pin_num": 6, "PWM": true, "digital": true, },
{ "pin_num": 7, "PWM": true, "digital": true, },
{ "pin_num": 8, "PWM": true, "serial": "Serial3_TX", "digital": true, },
{ "pin_num": 9, "PWM": true, "serial": "Serial3_RX", "digital": true, },
{ "pin_num": 10, "PWM": true, "digital": true, "SPI": "SPI0_CS", },
{ "pin_num": 11, "PWM": true, "digital": true, "SPI": "SPI0_MOSI", },
{ "pin_num": 12, "PWM": true, "digital": true, "SPI": "SPI0_MISO", },
{ "pin_num": 13, "PWM": true, "digital": true, "SPI": "SPI0_SCK", },
{ "pin_num": 14, "PWM": true, "serial": "Serial4_TX", "digital": true, "analog": "A0", },
{ "pin_num": 15, "PWM": true, "serial": "Serial4_RX", "digital": true, "analog": "A1", },
{ "pin_num": 16, "PWM": true, "serial": "Serial5_RX", "digital": true, "analog": "A2", },
{ "pin_num": 17, "PWM": true, "serial": "Serial5_TX", "digital": true, "analog": "A3", },
{ "pin_num": 18, "PWM": false, "digital": true, "analog": "A4", "I2C": "I2C0_SDA", },
{ "pin_num": 19, "PWM": false, "digital": true, "analog": "A5", "I2C": "I2C0_SCL", },
{ "pin_num": 20, "PWM": true, "digital": true, "analog": "A6", "I2C": "I2C1_SDA", },
{ "pin_num": 21, "PWM": true, "digital": true, "analog": "A7", "I2C": "I2C1_SCL", },
{ "pin_num": 22, "PWM": true, "serial": "Serial6_RX", "digital": true, "analog": "A8", },
{ "pin_num": 23, "PWM": true, "serial": "Serial6_TX", "digital": true, "analog": "A9", },
{ "pin_num": 24, "PWM": true, "digital_audio": "I2S1_BCLK", "digital": true, "analog": "A10", },
{ "pin_num": 25, "PWM": true, "digital_audio": "I2S1_LRCLK", "digital": true, "analog": "A11", },
{ "pin_num": 26, "PWM": true, "digital_audio": "I2S1_TX", "digital": true, "analog": "A12", },
{ "pin_num": 27, "PWM": true, "digital_audio": "I2S1_RX", "digital": true, "analog": "A13", },
{ "pin_num": 34, "PWM": true, "digital_audio": "MQS_R", "digital": true, },
{ "pin_num": 35, "PWM": true, "digital_audio": "MQS_L", "digital": true, },
{ "pin_num": 36, "PWM": true, "digital": true, "CAN_bus": "CAN1_TX", },
{ "pin_num": 37, "PWM": true, "digital": true, "CAN_bus": "CAN1_RX", },
{ "pin_num": 38, "PWM": true, "digital": true, "CAN_bus": "CAN2_TX", },
{ "pin_num": 39, "PWM": true, "digital": true, "CAN_bus": "CAN2_RX", }
],
"power_pins": [
{ "name": "VIN", "voltage": "5–6V" },
{ "name": "3V3", "voltage": "3.3V" },
{ "name": "VBAT", "voltage": "3.0–3.6V" },
{ "name": "USB_5V", "voltage": "5V" },
{ "name": "GND", "voltage": "0V" }
]
}
,
text_data:[
'╔═══════════════════════════════════════════════╗\n' +
'║                 [U# Teensy 4.1]               ║\n' +
'╢3V3_Analog         ARM Cortex-M7           AGND╟\n' +
'╢ADC0   A0/D15         480MHz          AudioOut2╟\n' +
'╢ADC1   A1/D16                         AudioOut1╟\n' +
'╢ADC2   A2/D17                          AudioIn2╟\n' +
'╢ADC3   A3/D18                          AudioIn1╟\n' +
'╢ADC4   A4/D19            D14 USART1_Rx/I2C4_SDA╟\n' +
'╢ADC5   A5/D20            D13 USART1_Tx/I2C4_SCL╟\n' +
'╢ADC6   A6/D21            D12 I2C1_SDA /UART4_Tx╟\n' +
'╢ADC7   A7/D22 DAC_OUT2   D11 I2C1_SCL /UART4_Rx╟\n' +
'╢ADC8   A8/D23 DAC_OUT1   D10 SPI1_MOSI/UART2_Tx╟\n' +
'╢ADC9   A9/D24 SAI_MCLK   D9 SPI1_MISO          ╟\n' +
'╢ADC10 A10/D25 SAI2_SDB   D8 SPI1_SCK  /SPDIFRX1╟\n' +
'╢          D26 SAI2_SDA   D7 SPI1_CS            ╟\n' +
'╢          D27 SAI2_FS    D6 SD_CLK.  /USART5_Tx╟\n' +
'╢ADC11 A11/D28 SAI2_SCK   D5 SD_CMD.  /USART5_Rx╟\n' +
'╢USART1_Tx D29 USB_D-     D4 SD_Data0           ╟\n' +
'╢USART1_Rx D30 USB_D+     D3 SD_Data1           ╟\n' +
'╢3V3_Digital              D2 SD_Data2 /USART3_Tx╟\n' +
'╢VIN                      D1 SD_Data3 /USART3_Rx╟\n' +
'╢DGND                    D0 USB ID              ╟\n' +
'║                    ╭──USB──╮                  ║\n' +
'╚════════════════════╧═══════╧══════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAB5QTFRFAAAAc5J7TFJUVHhl3NLLoaeI9vj1ibiT28JwhK+BLPkEGgAAAAp0Uk5TAPv//vz8FSD9imlocvAAAAJsSURBVHic1dVBa9swFAdwnyZ2lBWR9Ojn9gNIQpAc0yqHHjXZ1L15sK5Xl7ENHV3X4N4WSpPs20520jWVnQ5WGMyHXN7P7y89ySQI/ocnf7387u8B+gNAm9XrwE5U8RpAk1qN88MAbbRSan0YWJo6sCgOgW1dqfN8GKDN7agD6mIY2JLugPo+BKw2IWzr5/NvfYCWJa7gpAOPk/s++FoazW7hWCr1k+pVD9jS0CQ945Cqc63vexHooSSyVqqKwRyn5Y/eIm9qgsXoTpkKIlqOe9u0pZCKyDslSMjIZeED9KABJ3ORzGNW43rtjxo91ABxShIMIHA9DnxgSw4xxDQNncO08AEiBtyrACkHwFl72i9AFwCxCCHSQJtZ4IMuIATiWlCCae9O7gJiwTkc7wJegKVr4B4Sux+azQof2KptEOOYcGBYrgIPIFIJ0XZw+4xwNg48gDala9BluB1OWeEDqzVpR9AOirHJOvCAlSXWYSykbpeRHRUecAG0mhohTPoBmHwOeAJWEoYJDQk/OY3EXsAO2KkmQmIZRjxanGRHuQfQhgp3BBPNY8zmTO436MDN1Lj9CSYYy7TIxrkH3jcCtx04F1jqbH+FHbheSjMy3NXdALHIXgS04GNDk4WRDDhOGW5muQ+ucJioOQvBENeArgIfXJPRQinDjWvAmnHQA7ltv9KFm1RKSlkMAPTYgjPcaNb4Ads52ER9UGcsxeWsV99O8kuSziMgrO4F7M7iU6pOuZBlb4VPAF3pRGBymR8CweclkdOqv8Lg+UYRSi6G6r/v5M3kfihg71bj9WD9+buwww3e8pf0L8Gbn18sp7KgkeW1twAAAABJRU5ErkJggg=='
}
,
{
name: 'Arduino Nano',
type: 'MCU',
description: 'Arduino Nano with ATmega328P microcontroller.',
MFR: 'Arduino Nano',
pin_data: null,
text_data:[
'╔═══════════╤═══════╤═══════════╗\n' +
'║           ╰──USB──╯           ║\n' +
'╢D13 SCK [Arduino Nano] MISO D12╟\n' +
'╢3V3         16MHz      MOSI D11╟\n' +
'╢AREF                     SS D10╟\n' +
'╢A0/D14                       D9╟\n' +
'╢A1/D15                       D8╟\n' +
'╢A2/D16                       D7╟\n' +
'╢A3/D17                       D6╟\n' +
'╢A4/D18 SDA                   D5╟\n' +
'╢A5/D19 SCL                   D4╟\n' +
'╢A6                      INT1 D3╟\n' +
'╢A7                      INT0 D2╟\n' +
'╢5V                          GND╟\n' +
'╢RESET                     RESET╟\n' +
'╢GND                      RXD D0╟\n' +
'╢VIN                      TXD D1╟\n' +
'║                               ║\n' +
'╚═══════════════════════════════╝'],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAEXSQeJunysvOPUBBS32NPICVHXmUd4mNzNbcCOcmxgAAAAp0Uk5TAP/++vuh9TM8KPPBRGkAAAHFSURBVHicnZRBTwIxEIU5ep1dnfu2pIlHW7LRI1C5a4DIsQs0HP0JEqNnE07+W6dlUQ8zJdoLm/TjvXmdaQeDP63PvArAwdG6K/z9MJna4TV9fHDANlR6Mm2H2uDymQNW+9ploL26eOGA3cMJwDdWIQBqPR1Z2wCwwLaDtfPeWej4GnZLAqxKgGCBsLbOaQuRtwgR9cg5ZYkULGpyUNq1kbfYdjXtE9EKRQasVKVU0xk5Zr+kmI/fgBizX1JM+Fn/s8hF4ixZCDHT/sYH0SIpoPezUkwS8CQhxcwCWYK3iACXCRgXYmaFKFlEkthkhxjkmElAjJm2NrMgHtQun2Q+6vdys7pQ7iYqATh1s2oKMSFGmhssxFSq3M21o5snxiQLnYFCzCMgdxPSxaEfvsizQxtjF6oGDSoxpr6pbyqLTuzmCRC7qZsjIF1/aiNSDWBi5ItEpEZBA0Y79ilOMZE0wKhXFoh5mpKFoNC/D/TgCjX8PEGloS29UXmijlPJn6Rz/diawPfiVp2Alu/mt0IUFKiGs9f/cjgbTsbR8BYJSNd/bATglwV/kk97skgKULkXDljt+xoIYBUWi8Xcz72/pw8W4NcX3Eyu7NIFgekAAAAASUVORK5CYII='
}
,
{
name: 'Daisy Seed',
type: 'MCU',
description: 'Daisy Seed is a development board based on the ARM Cortex-M7 microcontroller.',
MFR: 'Daisy Seed',
pin_data: null,
text_data:[
'╔═══════════════════════════════════════════════╗\n' +
'╢3V3_Analog        [U# Daisy Seed]          AGND╟\n' +
'╢ADC0   A0/D15        ARM Cortex-M7    AudioOut2╟\n' +
'╢ADC1   A1/D16         480MHz          AudioOut1╟\n' +
'╢ADC2   A2/D17                          AudioIn2╟\n' +
'╢ADC3   A3/D18                          AudioIn1╟\n' +
'╢ADC4   A4/D19            D14 USART1_Rx/I2C4_SDA╟\n' +
'╢ADC5   A5/D20            D13 USART1_Tx/I2C4_SCL╟\n' +
'╢ADC6   A6/D21            D12 I2C1_SDA /UART4_Tx╟\n' +
'╢ADC7   A7/D22 DAC_OUT2   D11 I2C1_SCL /UART4_Rx╟\n' +
'╢ADC8   A8/D23 DAC_OUT1   D10 SPI1_MOSI/UART2_Tx╟\n' +
'╢ADC9   A9/D24 SAI_MCLK   D9 SPI1_MISO          ╟\n' +
'╢ADC10 A10/D25 SAI2_SDB   D8 SPI1_SCK  /SPDIFRX1╟\n' +
'╢          D26 SAI2_SDA   D7 SPI1_CS            ╟\n' +
'╢          D27 SAI2_FS    D6 SD_CLK.  /USART5_Tx╟\n' +
'╢ADC11 A11/D28 SAI2_SCK   D5 SD_CMD.  /USART5_Rx╟\n' +
'╢USART1_Tx D29 USB_D-     D4 SD_Data0           ╟\n' +
'╢USART1_Rx D30 USB_D+     D3 SD_Data1           ╟\n' +
'╢3V3_Digital              D2 SD_Data2 /USART3_Tx╟\n' +
'╢VIN                      D1 SD_Data3 /USART3_Rx╟\n' +
'╢DGND                    D0 USB ID              ╟\n' +
'║                    ╭──USB──╮                  ║\n' +
'╚════════════════════╧═══════╧══════════════════╝'],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAA2qg/MTMz2LV01KtJ19XPoINMYFdCxad+1rUs7IThTgAAAAp0Uk5TAPr//7P+/f5ZWoTOXAoAAAFnSURBVHicvZSxSsRAEIbzCsN4eYAUpl6HxNbACteGsNeH02AdjmxrQMVSwca3dTabHAj3GxH1b/MxX2Z2Z5PkmHer2Vr7YO1LciqvlRG6zLJzOrs6DYwidJFludkCgCgCRACoiGIFqOAIEFTImoJlTbHWxQL8XCFiAiBfKUrvBzYIEDZErcB/GGmK4EGxTIGDom4OAp6ymBwqFgAq1oBVRfWPCnSaq4pxmSRUMHM4CbhZdAxScBnPCirS+JNYsQBQMQPw0v6CopwBqCi/qcB7sQB/2AX5KbiLuJlEFinY6H0weDd1u8V7/Y4UY1NQn28agQrn0qzfuwYqXNP1nt3uDgK7rs8VuIEKraCKskUV0i4ougFVGKnTNpng4sxLgZ9BHbW+ccwGzSFMkpi4xopwDjVevUrEiTRSw9e+KZzGYIVsAtDiLswEDPDCjKZQx+2A7sObtdd7BQ4WVNA8BsU9+qp5DvkMfAAoh7C+1ipazQAAAABJRU5ErkJggg=='
}
,
{
name: 'FanstelBLE',
type: 'MCU',
description: 'Compact, Lowest Cost BLE 5.2 Module based on Nordic NRF52',
MFR: 'BC805M',
instructions:'https://www.mouser.com/datasheet/2/915/Fanstel_01282921_BC805M-1991530.pdf?srsltid=AfmBOopO7jHS7nlUla2l5xjwrb8fOhMJLuO4hD-Gcxs01p5W5C_G_JFV',
pin_data: null,
text_data:[
'╔═══════════════════╗\n' +
'║    [U# BC805M]    ║\n' +
'║    NRF52 64MHz    ║\n' +
'║                   ║\n' +
'╢SWDIO          P001╟\n' +
'╢SWCLK          P000╟\n' +
'╢P020           P004╟\n' +
'╢P021           P014╟\n' +
'╢P018           P005╟\n' +
'╢P016            VDD╟\n' +
'╢P012            GND╟\n' +
'╚═══════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAcHVjkJeDEE5CKXVYvMGrtbqjy9HET3VlmpuGH+vLkwAAAAp0Uk5TAP/+////tyvBQHwYTJYAAAKPSURBVHicpZTBjtowEIa59WyDpfZoUz9AsJF6BRup14xw712pXe2xHHYfYKWqVy6Ifdv+4wRib6Kyq44gRPjTzD//TDKbzWYfnv5Mxu+nWR+PMXo3ji+zAgCCr8M38E2OEeAzECeB0B2H643zFbAI8T+B7uQNgHsXEGoN/84wCYT3lHgDIGLc+AUm0UwDMUmy+CzCTqrFRBcx2Y211nxerFK7H3cRPNkNWRXx0+r9OIPzSWljyCyd3+OSgXJhLjvk+YMLgJU2ZYlXywZACjmRoQCEEPXKCY44RAUcwo7whxSmDyJc7NfXwBBGG2FkCahWvAqILIB4C1iMAZQZRJ5oIoMRn4Y200YLS0lXwObnAFDTCqsSVcD2fgBaDyBRn0EmI4TS8uEKnOcADDJII6U0NqGY0vHjFXj5xYBIpCjh1BCKKb39NpT44bsuLI5TskQM7ArgwBoIfaRMpNQyUIg8Akgy6W5UvYZtIfI5akHS4jBX4n4rkadjZKMMaSkvPlQZHu8ASM6OMfOY2Ay9Lpw8RLSZjIRZ3IXNOdaDyJdj7Jy0CfXBcIawKp0EgC5bNoq9yIAvRPIsjKVqmm41GHUg12JE1V5Kty6cbBs4Q0r0PuRwhcjzMwBrSWAIRnO/6NKVTs6vAGbJvWqhXShFAoAJKME6tWanXDluavKiX0J3Ggonvze8hDCa60vJhtcilx6AlZp4HfiCjt1qyHCeuzwsjX2xeWkA+MpJGCWug8wiMItB5Ck7iS5TUpI3jk2fV05mQPKsTV7LDNwXJZquRE6PXrjQshTpd+Onuw03nu5293ADUIWTdxMAqWIn202/TMYMK1E8emcXm/zfPL9Gu/OmcPIc4jY/dB2Qb7Vw+SX2F+n5Mq1W0UcQAAAAAElFTkSuQmCC'
}
,
{
name: 'TMC2209 V4.0',
type: 'Power-Driver',
description: 'Ultra-silent motor driver IC for two phase stepper motors',
MFR: 'TMC22209',
instructions:'https://wiki.fysetc.com/docs/Silent2209',
pin_data: null,
text_data:[
'╔═══════════════════╗\n' +
'║                   ║\n' +
'║  [TMC2209_V4_#]   ║\n' +
'║                   ║\n' +
'╢EN               VM╟\n' +
'╢MS1             GND╟\n' +
'╢MS2              A2╟\n' +
'╢TX               A1╟\n' +
'╢RX               B1╟\n' +
'╢CK               B2╟\n' +
'╢STEP            VIO╟\n' +
'╢DIR             GND╟\n' +
'╚═══════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAA5eXmzMrGy7mbp6mrVZ7N8fLxhH971tnYVk1GSJDrPwAAAAp0Uk5TAP37/v7+GP91/w66yssAAANxSURBVHiczZW9b+NGEMUXVxAqM6uN5XTZ4UZSSokHf5SkeaHSHk5ASp4Kgi1pAoQ7WTYEtacYEPTf5s2StnwHJwiS5gaGKfL95nF2d3ap1HcQ+T/Lwf8ByvzvgMG6KKc70pR/BRRQtkXJUCzRnIjtugOKXAXbcre5Jx0TOdIAmC1r9kC500SEnJD0MBHFaKdjtjq0ZwJ8JmfJ+gTNTgDNDH9CDR2goQjAYkzaK0QJXlb1gEt8Av58OGsSMpmlrDrvXoFUqSGNIeCXi0cpUWtptPfAhrKYTAOg0qlJTJxVo5YIDqMGExGoR5pUZA6Ei27I1KhA5gGVj7IegAO13VCJKjoF01oAa9pGHPuHUuvQht19BwzvjpW4iBJF0dxfZh49E2Cmj8cvfX4kMdNhFGGUx9oDpSU40ItBF3Oqm8nRngMosEYZJ5mrWxtFf15HrQDWPGWH378IkH/GFKSpy7I2fjGIyByb9G5PPeDqZJK1ExtGt5e3195BH7OD21MOYIU5qps0STSF8L/1DiisyeKK1gA2fp2sjUfVqUiLdxxi64EHP+I03Y94GF1Hh8tbDxCn+PeDd2Dcj9I2rfVrBz91ZwBK0qntmuEEEJn2GQhIJ8PL2fNSiCwdIsCkOvcApvCyRqWNn4i5rBPWHF3z0xMBGMgtFiChpkLLS2uReSJqrPRRIQA2Ahq3jVsAB2ktMtJ0lbxGAC193VAb/4pHaMsMF6RzLNZbAKzDxLR2Upk9ASSHjtD9HrAekKLu4sx3dbfNoMhmcprP/Cj8VnrZN2ytYY3Jt3qI3Zere11xLfstgUKdEnK/mc7hcD+xnDo2Amjd70tmDmVWxnDYuBmnzwpLRO9vuhlnRpHBhm848Tl8ailOfSSFADY8CaF/vnyOjwDUSodzIO9F+bT8Oj7KEbTR8Pv0YflW/CFAqd9QJGG3XI4FCH78Vp0ul4tVsiv0tpAagl+6x7hMPywXpdsVm3ExmKogXPtjUICFKOmuWE1xUubqYatWAuQeGCTIWS2KwGFEYzWYK/Wwll8Bd0Cwc0hYqOAGI/pZlVfeW9CrDlAFrB4v4NSlXvnUjQD9WS2pr4ALFcwBrNXg4jUwVu8WSoUeEG8AwbYHJPVx2wG+TlGKVx+UARTU+e43pXb+8P/2iyMAlOCtj09XQ/Hfvln/FvgO4i+kdiUapRI1FgAAAABJRU5ErkJggg=='
}
,
{
name: 'OLED_SSD1306',
type: 'Display',
description: '',
MFR: 'SSD1306',
pin_data: null,
text_data:[
'╔═══╧═══╧═══╧═══╧═══╗\n' +
'║  GND VCC SCL SDA  ║\n' +
'║┌─────────────────┐║\n' +
'║│                 │║\n' +
'║│    [SSD1306]    │║\n' +
'║│  64 x 32 OLED   │║\n' +
'║│                 │║\n' +
'║└─────────────────┘║\n' +
'╚═══════════════════╝'
,
'╔═══════════════════╗\n' +
'║┌─────────────────┐║\n' +
'║│                 │║\n' +
'║│    [SSD1306]    │║\n' +
'║│  64 x 32 OLED   │║\n' +
'║│                 │║\n' +
'║└─────────────────┘║\n' +
'║  SDA SCL VCC GND  ║\n' +
'╚═══╤═══╤═══╤═══╤═══╝'
,
'╔════════════════════════════╧═══╧═══╧═══╧═════════════════════════╗\n' +
'║ [SSD1306]  64x32 OLED     GND VCC SCL SDA                        ║\n' +
'║┌────────────────────────────────────────────────────────────────┐║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║│                                                                │║\n' +
'║└────────────────────────────────────────────────────────────────┘║\n' +
'╚══════════════════════════════════════════════════════════════════╝\n'     
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAAgMNESlTWmNv3eLlvsLHOERYZ3iMNEhm19jYkDYxiQAAAAp0Uk5TAP/+/x/6/DmTiZs+NYQAAAHnSURBVHicjdU9b9swEAZgDgSUlTLg3cdW9UxCBLoJiD1otUDPldQma5oWQbIlaAChc50C/bflUUpj8UvlJEAP717cQTYh/3nuh5s0uIWhWgAwLIG0QADP43Ow1y3vsEZWEVqHASCAp4HUO7ILgEsYD/u5I/XJJ5k+voqhPlX05IKLL1ZgG3ZN6J+KOkEu8lIfoDzYGs+nirhJM2aE0AeOIh9o7YbIGFuX+si1sDUe/JDMirIBeTYxB7C11qLUCLbeai1gK61L8R6Tbr+7YGMF1/pqnIhbYwJGNM04MKcGnQDr9QRgOwctc8UckH/ADAwFjwIUJiYXUTAJFzy9ATt0L8M5QCHgQwLYoSeBGdgxDVivFsDKBV898G4O7pbAN7UEZLsE5mKlPntAbc6B+DQH99KIGXicg+yHVOeCu8D0EGspkkC2/C2oB+jvvlBmA5sYqKX59FneqxjYG2Bur1+D9l6LRiEwogsD00OBrT0G9YFpcjXelRsLvA+c/hrv5jZGAJgYo7BBQwBjYIUWFxsEdI8iN2uTbRBMMQoUsqsCYIwBPa4egsDGKLo+DuiLFFwVcYDCvCykKsLvbQwF0CuIAVI3En9g4gCnATzewsboIAUwRgcpYGKojlcpsZfyYxLQF+39rcXOX9eIntwzgoWWAAAAAElFTkSuQmCC'
}
,


{
name: 'OLED+encoder+knobs',
type: 'Display',
description: '',
MFR: 'SSD1306',
pin_data: null,
text_data:[
'╔═══╧══╧═══╧═══╧═══╧═══╧═══╧═══╧═══╧═══════════╗\n' +
'║ COM SDA SCL PSH TRA TRB BAK GND VCC          ║\n' +
'║┌───────────────────────────────┐     ▢▢      ║\n' +
'║│ [SSD1306 + R + B]  64x32 OLED │             ║\n' +
'║│                               │   / ⎺⎺ \\    ║\n' +
'║│                               │ ⎛        ⎞  ║\n' +
'║│                               │|          | ║\n' +
'║│                               │ ⎝        ⎠  ║\n' +
'║│                               │   \\ __ /    ║\n' +
'║│                               │             ║\n' +
'║└───────────────────────────────┘     ▢▢      ║\n' +
'╚══════════════════════════════════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAASdAAAEnQB3mYfeAAAAC1QTFRFAAAACwcCDkx5ME96FQ8vQWuNMmeMVHGDsLq+IDhtbYV9t8XMr6aeusv2zdr8ivpZZAAAAA90Uk5TAP/////////8///A/6X/PHnZEgAAAfNJREFUeJztlLFLHEEUxqcRBbli0SJFqjcQdbHJvCJRLkUgRUgnsm4gIETjpj3cYsJViZdiuCwWmmZL3eKW4Qorm5BCRdniChsrsRT/Dd/M7t2Ct5tWCH6wO4+d33wzs2/eMPak/0k3Vtd/rIom11/6bvq9oXw/DKWAQqGU4F5esyN25Xm76x9vb9W67NztDvuhfSbhDZsmYMIMtg6r2yGOAOQILdZgLeNgAd+XUoYjIFMdmGdTzC/XAKUQutEg6vBfF8wrtYq5RAF0zwglYMV5IEMATzCBOqBcKYhaB+C22agC9q1DqpQhWBB8HgfoF6QHjpPO9SqBGF3V/EnBbKZEtYOrsrcmel8HAGobzSTAttbGp1gC/JGHO8C+VgACeAEc1uwC+EkeIk1RsYvSIal1KIDTOgATx3lJuzit3oXg+NqZIeC5rnFwI33yjKJUbVcDcwPU9Ks+9NUGAV/ePVBsson9ZDnJszkG5OluZofwT4BzsAemFkB78kQVQD0ouEadnyhvLQiCzaU4jn/Ts7cQ75nhIuoPsi68APaJHRMA3BCU52HlCkxVhFx1qTYnA2OBBigLj4pXa1ik0suBrWk0xGCnLD4ZLocGuGQTBLSK26RRAu1eU7vfp1jj5tzzvo3um0l8Ja10r01vpR7n2nvSI+keGesWBctHqZ8AAAAASUVORK5CYII='
}
,


{
name: 'TFT-COM28380',
type: 'Display',
description: 'TFT Touch Screen 320*240 with ILI9341 and XPT2046',
MFR: 'COM-28380',
pin_data: null,
text_data:[
' ┌────────────────────────────────────────────────┐\n' +
' │  ╔═COM-28380 Touch Screen 320*240═══════════╗  │\n' +
' │  ║                                   ┌T_IRQ ║  ├─\n' +
' │  ║                                   │T_DO  ║  ├─\n' +
' │  ║                           XPT20466│T_DIN ║  ├─\n' +
' │  ║                                   │T_CS  ║  ├─\n' +
' │  ║                                   └T_CLK ║  ├─\n' +
' │  ║                                   ┌MISO  ║  ├─\n' +
'─┤  ║                                   │LED   ║  ├─3V3\n' +
'─┤  ║ SD_SCK                            │SCK   ║  ├─\n' +
'─┤  ║ SD_MISO                           │MOSI  ║  ├─\n' +
'─┤  ║ SD_MOSI                   ILI9341 │DC    ║  ├─\n' +
'─┤  ║ SD_CS                             │RST   ║  ├─\n' +
' │  ║                                   │CS    ║  ├─\n' +
' │  ║                                   │GND   ║  ├─GND\n' +
' │  ║                                   └VCC   ║  ├─5V\n' +
' │  ╚══════════════════════════════════════════╝  │\n' +
' └────────────────────────────────────────────────┘\n'],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAFCc2rhIPjT84hnx4zMrIpV9ZRlJVt5iWfEtK1b+H0wAAAAp0Uk5TAP/8+/r/k/4RPOYmyfEAAAFVSURBVHic7dQxT4NAFAfwF4emjKQmN/sYGjflFRrHlmuJM+1erSG6SSQSt8bBMDYORr6t964Uq95RByfT/0Tu/R4Q7h4AhxyyL2VVVVdrY+EtTaWUhcro/nNd+UoXYlVw62RPaYqnut7lhqbQgB5RDZzse3EDgoQuuZwuLQCRQgY0NAJXAY9BJ4iNQDQAT1rACuAZ+8YnCLcGr22gt7aDYwb0G7BEYQe9hQK+GQjXV3dYQPfG/7ENGyAZ3IEz8DMLIH0Hh1oA0hk4kz2gIz0zcDW4gE5kA/lIgyPs20CGeB62gGKsT4ztSysQIQ6nLSCOPL//CNcmIPiYx3L04BHgzl7p41/wdPBr5TJIcAweCfa5HppM8JWUkzknGUhEoKjQnXm9Op/PpKQmIQSzTUH1yWi7mqqocSzL7gqIBhHtJLwtV18Gesq6fNEdVfVe/vWf5JD/lQ+QJpbNzPkPXwAAAABJRU5ErkJggg=='
} 
,
{
name: 'TFT-ST7789V2',
type: 'Display',
description: '2.4 inch TFT Display 240x280 with ST7789V2 Driver',
MFR: 'ST7789V2',
pin_data: null,
text_data:[
'╔═╧═╧═╧═╧═╧═╧═╧═╧═╧═╗\n' +
'║GND SCL RES CS  RES║\n' +
'║  VCC SDA DC  BLK  ║\n' +
'║                   ║\n' +
'║  ╭──ST7789V2───╮  ║\n' +
'║  │             │  ║\n' +
'║  │             │  ║\n' +
'║  │             │  ║\n' +
'║  │             │  ║\n' +
'║  │             │  ║\n' +
'║  │ TFT display │  ║\n' +
'║  │  240 x 280  │  ║\n' +
'║  │             │  ║\n' +
'║  │             │  ║\n' +
'║  │             │  ║\n' +
'║  │             │  ║\n' +
'║  │             │  ║\n' +
'║  ╰─────────────╯  ║\n' +
'╚═══════════════════╝'],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAJyMj/v7+ZYSlo7TLD264GoHJwL/DS57TTklLW9vMyQAAAAp0Uk5TAP4Q+/f5hSc8P1j1BksAAAGySURBVHic3dSxb4JAFAbwS5uIjC/awa1jV3N3adcGWrvrGeYmwHqJiehGmoqMEif+2x7I4cHd4dCl6Vvvl4/PBx56RINzh/4nyKJ8GER5lA6BUZAcggHghixizwOgAIBlYgfVOUB5sgEXLjMrLaAAOaURuACa6IACdKECNaAVCnCLLoATGkepCnrnMDsd2PqrBU4/QAgW74IW6OcAD3HSAu0B9azDTwlMAQAskCXNAUBjCcwBkxfeAEsASZtFaTtqAj7kJktLwFECS8CCN8DWgMuXZW9wAaO5EfhpA8ahEUwX8nvI2KsxgDfgKWQrQ8R0IcE2zphvDRAgTEaMeJYGFThEISG4L2SAADvK/BXuiTag+hU5rYDvGQPqRW0oIR5We1wDanCP6erN95WMa0ANXMB06RG/zVACLi/rDBMsirQZSsAFiP/MhGIimtYbI0pAA5xSCLEMUWQO5J3rYL8XPVYCMIJZjHTA9xvA4hGUMbbmGkAO50nV1GN51g1o7wee1D3W6bYbcL1AElFE9IjCIzKDugicacAHAC/Rd4psADmiCNKmcw3eBIjfAob5G+DX8wMlrItB+ZBHngAAAABJRU5ErkJggg=='
}
,
{
name: 'ENS160+AHT2X',
type: 'Sensor',
description: 'Air Quality Sensor ENS160 with AHT2X Temperature and Humidity Sensor',
MFR: 'COM-28380',
pin_data: null,
text_data:[
'╔═════════════════════════════════╗\n' +
'║ [ENS160+AHT2X_#]                ║\n' +
'║ AQI  0-5                        ║\n' +
'║ TVOC 0-65000                    ║\n' +
'║ eCO2 400-65000                  ║\n' +
'║                                 ║\n' +
'║ VIN 3V3 GND SCL SDA ADO  CS INT ║\n' +
'╚══╤═══╤═══╤═══╤═══╤═══╤═══╤═══╤══╝'],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAL2qkmaa2ZYao0NPbUmF6LzhOqrvJUo/AwcbL5e1P5QAAAAp0Uk5TAP78/vz//xJZf3NBpVAAAAKSSURBVHic7VQ9b9swEM3mdDzRCrKKlB14JCm5XUMSATJKtLQ7rjgXaIBYWz6G5gcYCPpvexRlw45lD90K9AAJFt7hvXePR19c/K+/qbfn8/garn+cxSVl387gly+pMfzXSXz0Qowxt6dF3qFrgFMUaygAGxKA52EDr1UNY6MB4Hqw4SWuXQGhhkTW4FxDeWgY8LmGqnaNFyCGD4isXyvn7HfFCsg6G598jryBemW1LaIwyCeRVtfOUU7rJZTYMEGK9wOB1EydS3U2X4oqM6obZk/k8o2ldw8LxXKIJsWKzsMkewnAlZivrLIApSvragki2adYA1w9KMhyByAainjE+F4YiAOLEhhPPTGZL+OmRFzyrchP/Ei7BAk+UY2JokkpMNWQeMvHRvqGOA9HMXccpMWOXqRVmUm8qzwXXcO0gLhiQCkLFKMNU0AoF1W56JRygEpmumSCh0m+4ARKSNFMWX/alRVmUeuc9T43OjVAc13GTYeTJkmN0jIqe58tmiRCLYraVb4hFiQzRhc+jutO5FFDqplE/413QShIY3IuFH59DT650ehz4oIGByKYRVL8PQtZKC/CcCkgCltnLeQ4BYj7sDCbhBjGk/mSTFb9KNLiUBH9uNhSmIQgpcjLQEEwK3Tzsd2sjZYANBG5nNx2aVUlvsVst3kjwyPDE5JXsiOILfcCe5vZqjH2aFFWu+tDtgZ6n4wB/j0ksWv6Djo7WO1WwVjh4ljngk1xiHuKzABhcePssYCvJyMZIYKXLgjcHF1QFElxWrIcEujzTHE3wn7Sp2McKTB+PEuP3xzhIU9Ib/kJgeCTd5f/IMKDetT+jI8n3Pc5POGuWlyzUwYCxW8dnRYIImp4wl093Z/H/836A07RrdM9ywO5AAAAAElFTkSuQmCC'
}
,
{
name: 'DCF77',
type: 'Sensor',
description: 'DCF77 Time Signal Receiver Module',
MFR: 'DCF77',
pin_data: null,
text_data:[
' ■■■■■■■■■■■░░░░■\n' +
'╔═══════════════╪══╗\n' +
'║ [DCF77]          ║\n' +
'║                  ║\n' +
'║ PON OUT GND VDD  ║\n' +
'╚══╤═══╤═══╤═══╤═══╝'
,
'╔════════╗ █\n' +
'║[DCF77] ║ █\n' +
'║        ║ █\n' +
'╢PON     ║ █\n' +
'╢OUT     ║ ░\n' +
'╢GND     ║ ░\n' +
'╢VDD     ╫─█\n' +
'╚════════╝'
,
'╔══╧═══╧═══╧═══╧═══╗\n' +
'║ VDD GND OUT PON  ║\n' +
'║                  ║\n' +
'║            DCF77 ║\n' +
'╚═╪════════════════╝\n' +
'  ■░░░░■■■■■■■■■■■■\n' 
,
'  ╔════════╗\n' +
'█─╫     VDD╟\n' +
'░ ║     GND╟\n' +
'░ ║     OUT╟\n' +
'█ ║     PON╟\n' +
'█ ║        ║\n' +
'█ ║  DCF77 ║\n' +
'  ╚════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAC1QTFRF////Mzg3WHNUEVIhKm05HyYl8vPxfolx39zalS0rwTw4bh0crKiex8XAQVg/M27gOgAAArNJREFUeJzNVb9v00AU9uR6sAcXoVAVOpzTFgmwhJ9RN0tNLMFQhgh5j1iyIpe2Q1GVWmJAapA6poWdZGcIXkIqKjGAQsWPIpUh5xQzgP8G7s5Oarf1dWDhLUne+/y+7768dxaE/y7EXp0P8NQ5bl1W1QIX8FZV1T6nPlEhgF8cwFOHAApVTgeHtujmA8Tjizg2Kcckh0NmHI84HLO0xVUOx3MKmKnnAxTGwbN75SKOhxTAs1u6TDmuc1q8Y3ZzABOMo5sPuNjuT/9stzBLAdc4gM18uxs/jvoju1fPlr816oJ4RJ5coYCp7um6YlNh4ofE7s7LU3XxcfE+/ZT6zO6p1k41C/CMDZsJawjCF2e63WpmT6qUzWF5Lmkx4XTa7eaLDGAPwC4vsK+HgjRNAK1m+qQ1oGEy5XJV8f0d0uJVSqEGBYAA7rEf++KuTzlSMg8sbVIDQzOqsczvvt9Oy5T1gXvbBWMIzD+5LsccY5kHaBAGYWBhuMk4VsV1PyPT0/HMhqVbRaPHxnVLeEZbtJrdkQmL0TFajHARu2xcpX1l139DOMbT/TGYjArLCwi7IZNZ+8rOsf1zbENgDWYuhRFBMJnSk3XC0TqZbkkHSwMduyhaYy22bvh+J71BXkCM1OeXwcBxTt71XxPAmEOhTluaBYB+x96+32bTPfZ6jyLuOA8MHceHF09tUA1MDRzHsbCeGBxv0JWxTG0+MggAEP6TpNgGnYy/56IBAQxLQyMxmG3QyVgpyNUcp4LtsplMvEg2KH2r9kJkqToum/ZSkiEblL5JaghpJReBuWYnaaWSuUgk10VGFICJSqPnDoVMeKFewstg2+dsXdzRxcNQA/NuNQcg9FywRqN9btQ06vet3Dpxk9QXcglIfCaAPIUsZIAlXp386SbvnUeixn+tkhZnU38BhaTzrdNgVFcAAAAASUVORK5CYII='
}
,
{
name: 'CurrentSensor226',
type: 'Sensor',
description: 'INA226 High-Side Voltage and Current Sensor',
MFR: 'INA226',
pin_data: null,
text_data:[
'╔═╧════╧════╧════╧═╗\n' +
'║ V+  AMP+ AMP- V- ║\n' +
'║                  ║\n' +
'║ [INA226$#]       ║\n' +
'║                  ║\n' +
'║ GND SCL SDA VCC  ║\n' +
'╚══╤═══╤═══╤═══╤═══╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAt496tL6f1YJBuRMdSEpExKeKljY7vKqaiWllxbqCyQAAAAp0Uk5TAP36/f/+jvwfc9nVT2oAAAKvSURBVHic5ZMxb9swEIU5Gep4pGW2I1koziqJgNtRMQGho4IQRjfLQ+CMQhSw3dLFsDcvbaJ/26McJyaVIkO79cEgLPHDu3dHipB/pOujVhJ15v6styf7Eb4V4ETls9YnwCg/KnveF+9DQB0AY6SRsQmBMkVgzvIsMTE1iUkufUA1wJRK4TaL40qaBAxMfSCFsVIALDMgKhMnsQmATHKlBAKxlBU6QADkFzRXWOc2ExIujUCbAEhbDFmoYxfG0OmgzWAObwJemxHL5257jkByibtuCYA8zaF3EO44kqEDAjn7Y4YIR4RHyfKZXVh4UgCgNMqYq1brxj1+OwWcJ+jSWn5nbavTECDybLsSunQZGUNgcr8JgDUZCV24jD1wTiLhA0t88wRAq7MlIfUAkAcAL4YDQodzMjoAggEC52TjtUmkxAuPAMZ3GTJ5XYcASs8VNmpTBEQwKCL7QV0IB8gxzoGlfpvKTVEX3AHYRS8PsL0a3gg5hsND6wFAOcU5iEJQhSUyCfKjB9QSqGgLoW3ZQltCjV+pF1Jsph9WSrdlb24nG7b2bhSpr/lEjDEm9iJ5CSs2Eb4DUHDpS2M0nWkYHHdOZ5S1RXtnjGtznutc+XNoLHbXWASupNKYI/UnuaJYQ1BuDgCFaTDqlXSXFjg6LKx9BWDpzFr8OQCE6zUAsMMWp6ARqKDmQ4ABBwuNK1FNfoxpFZaQFI4ZqgbGr2RwuwfAcjwMLOgfN2bQJUADd7gIPrwPvGt1IUUzjbHYFIGye/CAm+5Ba97glaliW6Hfl67zgO6+cwf1pIXW3/e7tQeQXfsCGK078m49dIhNZXCJEbB7H7j57ICfpjNfcVm4DL8+eQ7b7ln1DpfH7cZz6BXtyYZESzLceQF2ZLQkN28B3f8A7P/OYUuie/J4+vI3t3YN1A2lMzQAAAAASUVORK5CYII='
}
,
{
name: 'HumiditySensor22',
type: 'Sensor',
description: 'DHT22 Temperature and Humidity Sensor',
MFR: 'DHT22',
pin_data: null,
text_data:
[
'╔═══════╗\n' +
'║[DHT22]║\n' +
'║       ║\n' +
'║       ║\n' +
'║ + D - ║\n' +
'╚═╤═╤═╤═╝'
,
'╔══════════╗\n' +
'╢ +        ║\n' +
'╢ D [DHT22]║\n' +
'╢ -        ║\n' +
'╚══════════╝'
,
'╔═╧═╧═╧═╗\n' +
'║ - D + ║\n' +
'║       ║\n' +
'║       ║\n' +
'║[DHT22]║\n' +
'╚═══════╝'   
,
'╔══════════╗\n' +
'║        - ╟\n' +
'║[DHT22] D ╟\n' +
'║        + ╟\n' +
'╚══════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAA1NXUvr685+fmDg4OpaSfQUA8zs7MdHJsfXp1+LVFjQAAAAp0Uk5TAP3/Hf74/IX7Y2s63FgAAAIcSURBVHic3ZTBitswEIYDfgIpmPaqAdE9uuigFxCix9agrvauCO3RhLD0WjauclvwC3ck24mVOHssSyeDCdKnmX9GYjab/8KajwTIO+i8LMindWJarTpyh5gWJUF7B6i+4j6V+7uAxAy0JVuxDoguJSCMflmR0YwCCeEsubghmkkgqRmhBLrtLTDuAyG/0/dGRjMmSECbZVwX24wBMD4jn/N3XxYryAVAx1BdWUpOQLPznAWAFcQsgJ4dALZXAIZmOcsPdGg5LIXmFpA6VZAdWsyxBJIGToBhlBr/AU8BYAHIrJERw7IAgwpQxgIQ0z21SSnQlmIwKIBuBLIMyAqhAKZOUhRCMQ7kAAVQTa1i6SRa2i+Ay3NJSMvgBjjLwDp4SsDbtgQ2s4zUczxuTP/UFEAlZyDdhLExuOcCmF5lvjbg5mfwvXougFkoAtzYPvSvSg0FMBM0CfA+KLRBLIFZKCpw0bsE6DgsgUkoN77HXyb8qVkAI0G51dGH2Dul/UhcCk6l0AfcdvFoEQhOhaEYQUhQG3qvjqT23uleHe1bMaNEV8eYDsKDi70KcX84lUNMvhjvkzynXHj9Zk7i19WUq6TNBSjtdNzt7Zu4HoPVi80VaqV2dpDfb+dkdehTAOX0H/kkmpVBmgmt9HFfHYpGXWo54FXp8IhvbR3YSINtepw31mYjlrI7D4nV4SntOcA6UMnyTb5r/wD4APYXVEeax8UgV4IAAAAASUVORK5CYII='
} 
,
{
name: 'Optocopler137',
type: 'OpAmp-Opto',
description: 'High Speed Optocoupler',
MFR: '6N137',
instructions:'https://www.vishay.com/docs/84732/6n137_vo2601_vo2611.pdf',
pin_data: null,
text_data:[
'╔═══════════╗\n' +
'║ [6N137_#] ║\n' +
'║           ║\n' +
'╢(NC)    VCC╟\n' +
'╢VF+      VE╟\n' +
'╢VF-      VO╟\n' +
'╢(NC)    GND╟\n' +
'╚═══════════╝'
,
'╔═════════╗\n' +
'║ [6N138] ║\n' +
'╢(NC)  VCC╟\n' +
'╢VF+    VE╟\n' +
'╢VF-    VO╟\n' +
'╢(NC)  GND╟\n' +
'╚═════════╝\n'    
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAA8On31s/hyL3T+fn5pp2t1NDd39zm5+Lwt6/ApoTanQAAAAp0Uk5TAP///gr8cjSvtXR6DwUAAAJYSURBVHic1dS9c9MwFABwDSqm43M5jrF+btqsSJjQzUOapGPjU++ypTThjs3lXEq20JZjxwf8u8jPki3bqVlYeEPurPfL09OHzWL2l/g/AV/FvWB8Bas+wL8AQNYDZjoPr9L4KeABlOIJwL+CEfFOwK8AOsIBfAZ1vIy74Bm48T1uA882ABiQaIGqQfAhcGpYwG+qfKjzRB5d4DboAx6QSGswqbM6deAHBLYVmFYNUHFEpGaPLHB2CPUSMKC8jycG0BGa/2PRgl/m8dgAp0GkRFDWwmFMYNpYAMBrm0ckUO+QqVGso6hjwQ00wzZQgfsAuoE14KanXXkogGd2pTELpVUASw2eY0eU+VBd+I8WNEVZX6oE9WHEn7AtyoEwUhEeanBfPgetCdAfJCW4xqbw7eNgcVscZ/wgUbiirJ8E/mC1J/Vxjr9J4dYwDajiKAm8j6QUYdWob8Ech2xP6PP+oUFVw+4gRhq8Y/tiyNhmkWuBjQBUKglFvJ9gxsbZRlZCVOB3LkXsJeK0uA/X0s5CP9GFj29ZAdhntShuVClqkKDeYgJsmtKd9HISgkCo9BIP2ZqATtO1n5hJBC1AYXjEbktgXxwjNICB+ik0OBO4ct9uWooQusHB5bmUI3YWiTcuMEvRDYapLnfC+AfVqGBE0SDzkuIM2F3rA0JLUYnAmM/DUfXdcT5Bk1xG6pcGbB4e7wJsJqPFnZQpzwWmuwDfnGZcyiVbq2i5CzCeMQ22bLpZ7KxAkdP+OKMtwPNw2xzpVBAv+sFajfrBubrsB/xj1g86Ax3wz+MPhMOw/hNWW5oAAAAASUVORK5CYII='
} 
,
{
name: 'L78L-voltRegulator',
type: 'Power-Driver',
description: 'Positive voltage regulator',
MFR: 'L78L',
instructions:'https://www.st.com/resource/en/datasheet/l78l.pdf',
pin_data: null,
text_data:[
'╔═══════════╗\n' +
'╢VI       VO╟\n' +
'║ [U# L78L] ║\n' +
'║    GND    ║\n' +
'╚═════╤═════╝\n' 
,
'╔═════╧═════╗\n' +
'║    GND    ║\n' +
'║ [U# L78L] ║\n' +
'╢VO       VI╟\n' +
'╚═══════════╝\n' 
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAC1QTFRFAAAAHhobAQEBJiIj9PT00dHRJSQkRUREJiMkTkxMKScor6+vj46OgH9/NzY2AjO0pQAAAA90Uk5TAP7+1/3oIA+p+nRi9xdJMYB5gAAAA0dJREFUeJzFlM9r02AYx99TUwoLPA2TvDKF5iC6k7E6yw6eksPoEMQGka6wrbB1O0hBWEthw7Zs1iGDYCqr9GAZDhw79FKGSA+TFg96KA4dOibVgT/3R/i++dEm6bqrz6Xp8/3k+36fN2+CUJ9q9RPMSo+6O5nNmWT33xJA26l7coJQ2Jy19CzADac+LehV+GHpwHUsBg4OUcbQhcAIaTBUBzhv6TVJrudMwH+BdFhVB8wUTE2SpDHLQBgmLR82gOs68JHost8yEC6SlhcMC04fK0KAN6YOQmCdbJAPDAtulRL2BfzCoBRtEUC34LLwkAByxLaA0JCkcN0DukXQGCQi7XYNAsRPipExsUp1OEuAg1dCxyDgp4liKA7wJCgClHi6h1c6CQUYPqhJShWxInBEh8Y6Afags8Al5V1r4HWUNI9oiCG1PDGJ0IcA+E2DQYnOsEgfLQWKt3CTDE2eEoCRkIwghY39r2BQ8QQUYwh912+nLkCBqAH4MJV3C0oLTXdGFP4qkmwC6BEU1dL4z+U7aMoCVPIga3LVBD6rQ2NYq8cV9I0mIAAdAQ3UrbPKVHBz/Ti6oKGEQMcI+Itk/UPbGbsXLMfY5s4cQjMbJGMAtG5CoxYyzf3j6Fe6l/M5YnKNAIrznL6IZRpGpkxO4MnJczogNCd/Wo6ZkRIr5Gx2RrAstFjCYXqIXDWnLC67e6kF2/vl0Xb2XPqXX+KI3SKcct7u2RCBn+w25huOWOyfPD3MK7Y1tsPd66XUkaifdqdFF9jKg1k2C2bbvNhPZkRLd1jcN29f2wBb2S3Mn6xdd1iY+UUHYLcwyht0ApzbwsvD6Ras6AwBo0mXQzbkWCEoPncBIc5mESSJLjsBJpjtxuTpSA9cIabyvDUpfe8hNOICfLwZk6NPBDfVcy6AqWR5Ix7VVe22eyNQ+iyNGaL2Q7sweNOtI5bGpPGhVB7jH/cCTDzP6fFKKh6f/R3uARDLi+Srgst3IS8n43Kyl6jkMeASHl9Ly8l0qd0LpHmM3wMoSW+kyqye4MCIBVHht5Q2W37aq9Iin89G20fehPzmyQALq1rVo709WaWVQlerTPZMfwAh8lFbmjwNePnsNJVUok+8/1z/AONQABzAc1SDAAAAAElFTkSuQmCC' 
} 
,
{
name: 'DigitalIsolator',
type: 'OpAmp-Opto',
description: 'High-Speed, Robust EMC, Reinforced Dual Digital Isolator',
MFR: 'ISO7720DR',
instructions:'https://www.ti.com/lit/ds/symlink/iso7720.pdf?ts=1767651970378',
pin_data: null,
text_data:[
'╔═══════════════════╗\n' +
'║    [ISO7720DR]    ║\n' +
'║VCC1     ┊┊    VCC2║\n' +
'╢         ┊┊        ╟\n' +
'║INA⌠⟍    ┊┊⌠⟍  OUTA║\n' +
'╢───┤⎎ ≻──┊┊┤  ≻────╫─\n' +
'║INB⎩⟋⌠⟍  ┊┊⎩⟋⌠⟍OUTB║\n' +
'╢─────┤⎎ ≻┊┊──┤  ≻  ╟\n' +
'║GND1 ⎩⟋  ┊┊  ⎩⟋GND2║\n' +
'╢         ┊┊        ╟\n' +
'╚═══════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAFhslIygz3t3bPEFM6errWl9qjI2Q39vbqaywT2ZA/QAAAAp0Uk5TAP//+vwX+s6FWD2UHeMAAAJgSURBVHic7VQ9b9swFOQioB5JCOhMgvDeEm7U0aygrAQK1faYmJGbMf4qshUwjGSvnSD/to+PFC0rlqaOfRAECe90d+9IipD/9c/r7djfH9ji0fQBXrXIF29lZz9ZCyFk8dipM7gVroCkQ+eHFoL1kIACF5TBrYNkoKFNXTFH8t7ri+DY5pShk2OLJFkK9zFihHdyjphoR8C41/DjNL0mByG8AFKwQHLSgRB8L/gQ7UwmugnwGkhyjAp13z1AGjXoLipQ2mTgNc98X8fsOw0aBMh5FmI+Y/AUAODDKqtjvghghd2ggmjO4BGUc8HTqjCokLcYkIIzOrT3aMHqXEcKFhhcqpVXAAtC5q1B3bqAAk45wWTPEB4wtAuM+iWE0piFuZVlVXGPgANmA5c8I3EKGxIYXHHYa/m4YbWw136tBtUtrbPPdQgb3ivtFcgHdTUOn7lx6oHTMKQDqBsaEZGksIuwt78rRZnmfj+CkPT7s8qDAgC+wHvxy+u4RXYk0g6DAgDAA5urJa0RIs95oRcmAr7OtnqlPtcRYK5W3pEIGJWzV6UewIEce4RMbRHPxW41giVVCnrpahvWIrVRIdkpD1hz+rGOhKZ5VIDWb7yb2fabUtwfL1mZkwVlMC1Dkj84saw4lYt4LncqIwEAz2v4eg5+YwiETJ0F4MkM3g9arNRSnmYgpjToNEO2EZltlfrEfrZ+IKCwDwCgVA/ppgWYogUYZYTg9XX7J1U+Zx6wR0D5/k+YtCa+XDscZXqlOvrkaeUn7gQkz4bUyV0uPMs4Sk/1eAw6T1k/gJT7/n6r/gKPkLIFOsHCUAAAAABJRU5ErkJggg=='
} 
,
{
name: 'Resistor',
type: 'Discrete',
description: 'Resistor',
MFR: 'R',
pin_data: null,
text_data:
[
'  ⎽⎽⎽⎽⎽\n' +
'§[###$Ω]§\n' +
'  ⎺⎺⎺⎺⎺'
,
'  ⎽⎽⎽⎽\n' +
'§[##$Ω]§\n' +
'  ⎺⎺⎺⎺'
,
'  ⎽⎽⎽\n' +
'§[#$Ω]§\n' +
'  ⎺⎺⎺'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAB5QTFRFAAAAzLKK3wsKp4llhUkO1cWpzMnEX19f0L8l1kM6uVcIQAAAAAp0Uk5TAP/////9d////yyk2eIAAADrSURBVHic7ZKxbsIwEIbdIcz94xqREZgYw6WqupI8ABY6ZjIkL9ChM+qSFXXK29aXFKSYIBYWJH/ycNL/6RzfRalA4Gmp6PVcTqw5XOWW29O0LyPMjth6ecRsDX+eWBPAgicwI55z8su73IW2MTxsEQGIV3J04Uo0R0wHwksvJAsnpL2AgVDeFuQ9FUvbpBNwEcy+E/Z1XVuMCTAuqtW344vGBP0h2f1vuH4FxgSZw7qbw5sIukm9OSgQrZdysoIcDaXeMkqizZJat4vUasp+6N3bhbK0yc3/fTrL/QbSo73cOsHI/xAIBB7IH1KuPbXzHyuIAAAAAElFTkSuQmCC'
}
,
{
name: 'Inductor',
type: 'Discrete',
description: 'Inductor',
MFR: 'L',
pin_data: null,
text_data:
[
'─◠◠◠◠─'
,'│\n' +
'Ȝ\n'  +
'Ȝ\n' +
'│'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAB5QTFRFAAAAk2I9SEZGXFxdent9jpKTrayqtYJZgHp1uL7BOwpWWQAAAAp0Uk5TAP///v77Nv95945lfPQAAAGUSURBVHic7ZMxT8MwEIW9EHV1FrP28gsal9IV1aDuEIlurYRMVxeJW4GqVUd+Mmc3Tdv4TBgYGHhDFOm+vHt3joVoZJebKuhxOxeMbF0mmamN69m+/mCCppFHtjFnuosA01LboteqT96+ByY6ArQ2h4QkzQHa3Fb3wyp8zwOkstBDE94SAEAKEOuiCMAwJNCjdl0sSiiPwCAyEAuZQ+Fb+Iw3kgGcdDlAXgwU0msMPEsnSYhIT6cYByWlQkUAGSi2hfLf7l0kcg4uNAg9kGtBxsHeE4oNiU4eeqRCYq1ESIlYT5rYA9Z7oDBsixByP4njQ6pDSNW1B5faQz1n4rAWTcjuPbAtsvezw3KXbaB3LY+HRXvI2xa90qfD5peBGIDTPeQxQP9rv9mDBBbw8klxBbpkWvhbAa4vwxXkMtC10PBCV8/fXRYghABtkg5ePwWYKWpgpTVFGKcBctDjrd3t5ixwtXu1T7NPwShb+yEquxUXPCCWHwCjioxTAHmMrQeyWbv9CdMJzP6B3wGE7QIam78FfAFEf9bLnKjzgQAAAABJRU5ErkJggg=='
}
,
{
name: 'StepperMotor',
type: 'Discrete',
description: 'Stepper motor',
MFR: 'gen',
pin_data: null,
text_data:
[
'─┐\n' +
'─Ȝ  Ⓜ\n' +
'─┘┌◠◠◠┐\n' +
'──┘ │ │\n' +
'────┘ │\n' +
'──────┘'
,
'     ┌─\n' +
'  Ⓜ ᘍ─\n' +
'┌◠◠◠┐└─\n' +
'│ │ └──\n' +
'│ └────\n' +
'└──────'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAmZmZfn5+ERISKysrWlpaREREoaCgi4uLW1pa3PQKVwAAAAp0Uk5TAP7+//78/RiLUVU9lU0AAALASURBVHicxZW7j9NAEIctJORLx1pESeuVDFeze+khG/f2Zay78hx7aoRkLnQnRBToKO6h/LfMeNePWE5okBi5ynz5zew8dj3vX9r957Nuf7u7PeffQoYA+5Mi/o4BLG9OEH4FkBmj9OpynNhCimapyFbvRwW+y7UxlohfRoAvMjJsDOjV4TAM40tZ1ABpxCUi3twPBMQ746wECEUg5VEcPxVOwORRKGoL+lEqaARy6fxCzHvEDjbWH4uePbT+SZkpCyR9oJOocKNqYiXEqMQzUoH0UECIWXMGRK6POs6AzcWYxBtlKxiOA19tC5Qq0wHwxgI/jPVrGAI2CX/tgAUOQwQ/uSV+4YC4AQJspS73lGOTQlw6IMp6WvsOMGUgrULUy2bmvXaANnkopfVzy63JeQ9IJZkI2d9KgKBOuAhGSqAvzRgAIaZceewBseT/GkReIIqxuaJ8y7lXZRYoVvR3LDRNZA1M1YKAcNYAOsoDybsT41IvAJKpurI9d8AHmz/Ppja6Bj7ST3PPATq0FSgKs1yUWQkJHcA2tMr4mJ+aKtMC6jgFTFwdHbBoChdhsVS6TKO6EPVYVkBAzQdFKGSGS14fKVMn4L0iwAq8VXc1oGtCRG4eLoCC1ileU94BQKEM0oQHENqJ8vloSURBNqxA9wiNDha0pOFDB4iYQl7TWQkALjYiAW5od2udTXlppgSxApeaKgHNZVRlBgK8c4UgBWonlQnSZnEuCBBN/+tp4WYLGTar58OytzKyG5d2eZ8KnbcESWTW3233NtMmbse0ndgmBT5HXd1EHFt3gdByUXVXg8XrX0HedqPVohwAXt+21GNeJ/4Cm/DgpvxGN2jC96Oz8FiAiYPOhexsPwQ87xD3/GOPgv+Yd8DYje9NntPG/2vMTxpPzn/ycbMacPv7FOBNHrHEl7PP518e1/9jfwCJyQTxTNHBRgAAAABJRU5ErkJggg=='
}
,
{
name: 'DimmerModule',
type: 'Electric',
description: 'Connected lighting micromodule (with dimmer option) 0 648 99',
MFR: 'LEG-064899',
instructions:'https://assets.legrand.com/pim/NP-FT-GT/LE13719AA_EN.pdf',
pin_data: null,
text_data:
[
'╔════════════╗\n' +
'║ [ZLD23 RF] ║\n' +
'║            ║\n' +
'║            ║\n' +
'║ SW DI L  N ║\n' +
'╚═╤══╤══╤══╤═╝'
,
'╔══════════════╗\n' +
'╢SW            ║\n' +
'╢DI            ║\n' +
'╢L             ║\n' +
'╢N  [ZLD23 RF] ║\n' +
'╚══════════════╝'
,
'╔═╧══╧══╧══╧═╗\n' +
'║ SW DI L  N ║\n' +
'║            ║\n' +
'║            ║\n' +
'║ [ZLD23 RF] ║\n' +
'╚════════════╝'
,
'╔══════════════╗\n' +
'║ [ZLD23 RF]  N╟\n' +
'║             L╟\n' +
'║            DI╟\n' +
'║            SW╟\n' +
'╚══════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAABABAMAAABfBbL4AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAB5QTFRFQEA/TEpFVVVSZGRh+/v7Ojo4JCIgzdHGqaymgIV8Tqo1JgAAA3tJREFUeJx1ls9r21gQx+fJSOxxpFLD3qQnEuqbLOFufMsh4B4llxfaW6E07HGhATvHJQXLt9ROifPfdn48y1I2OwHbeu+j+fGdkV7gim3dsl0dbSGXP/jnJcjK/bSqyvntEfhQ5VU1evQA4/vS5mW1UUftYVtZa/OLtt3cEvD9z2e2/X4+31di35rn5/e1LD4S8Ku0YlNbBrJf3kwS+/6rLP9FQPpTgbNwvFQPNyNw559l8YKAs5lzrnbLsTsBzo0/AtmyA5wAwQBwYT0EwiNwLUBYQ9gD6uW4zqwH5gK4Xgggb2OX57JvzU5C1Aqs33bAGwWqvBAPPsmdm7m6SoFyaLRei9AB7y5hQR4m7T0BlAh468p8JznA02pdLMdNEsdBHCceoCqcB3CzWj0QEBv6g1iBr6ELPVDg0+1CAIxN1gHAtSsAT7cfUgbivgdg9TRJGLX/UpIgIUwXgpUkYOZmwHeRkgrYowdfxfptAW8OO9AQ0AtxKhMvVuuUPQQYIKXZA/KHQZn4Hw8pElAqENW8aQz0ABBgyjoUAiCg6XuIaqQyC5hs7pABuhtPIYIYoy8I964AMy9gGTW8BWGXZBBgSDdswxkYandDQA19Jel3WKN0k9qNTVTzDMFJqIAuJElqFrW7iZxr+lKzh6hJpVlcJgMUIoOkn+TnfyTEZrUQoEnIQ3rygOEfOlEstYag+wdJEnBHVYwOP7kKm6R+YMLah/h0CXsCgAa5iZZxxikiq8EAqc7A4qzzEJqMPJyAGI20e4oX7VZyqA0Ynfval/lJgcOqVR3QYCCCgzZLqyBgozqIUNADor+1zMPmhZId4JOctFtorjXEAABK8oGnOudu0mNAE6kjxUBgseHngnrBRgAEJFRgOw8owNXOvwap3YZDdB5MpjrsjwAy0EuSUAFKkQ7CLwg9Y8Cqh5T7G8rj1wc+cg4KTGMx+F8gHW4Zg6gAaA5TvZ16p4001sIAkCIyWk8ymyWEZtkLQDMwMc0LMhD3gAmHuCH7BhJEYngAQ5oPAc6cvCETr4NJNAd0HiiKRLLUYhHkCVbAeUA36BWaxTS9RiQZeFCA+iDfdGigz8HrULwQ6uiBPgMp00s9tPNRd6jd29cs1S8+Fu/KV4mcP6offHbTgbzLyKs9tN62li4TPpqPh/v3GWVWnQ53S8J1h7usvPbvgfCXvwHpjk3M774arQAAAABJRU5ErkJggg=='
}     
,
{
name: 'NPN',
type: 'Discrete',
description: 'Transistor',
MFR: 'gen',
SPICE: 'QNPN',
pin_data: null,
text_data:
[
'⸝⎻⎺⎻⸜\n' +
'│⎺⎺⎺│\n' +
'└┬┬┬┛'
,
'       │\n' +
'  ⟋  ⎺⎺│ ⟍\n' +
' ⎛   ╷⟋   ⎞\n' +
'─────┤    ▕\n' +
' ⎝   ╵↘   ⎠\n' +
'  ⟍  __│ ⟋\n' + 
'       │'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAB5QTFRFAAAAR0dHr6+vbW1tlpaWs7Ozt7e3TExMjIyMVVVV9weW8wAAAAp0Uk5TAP72/7VsF6YvSZ1EwLoAAADWSURBVHicY2BABhnTy8vLKxsYcACO6YJgID4BhwKovKCgJA4DYPKC4mQq4CTWBGFhHArYINLGxrhMYADJA6VxWgFRgMcNDBAn4LGikEgFuK0ohPrTEEdQwxQY41dgbGyIX4GwISETDHFGN8wNBKwAOQK/FcK4FUyEGlA5A58CQ0HcqRqcpMSLHXDJMzB0FgoWm+FTwNBkMdmsKAC/AgUnfAqSNJoJKFBtGlVAjAKmwaIggaYKWKihQI0yBawjRoHGUFCgFkpAgQMeaZACNnz6gVWnK4YQAJ4OXF8E1+IVAAAAAElFTkSuQmCC'    } 
,
{
name: 'PNP',
type: 'Discrete',
description: 'Transistor',
MFR: 'gen',
SPICE: 'QPNP',
pin_data: null,
text_data:
[
'⸝⎻⎺⎻⸜\n' +
'│⎺⎺⎺│\n' +
'┗┬┬┬┘'
,
'       │\n' +
'  ⟋  ⎺⎺│ ⟍\n' +
' ⎛   ╷⟋   ⎞\n' +
'─────┤    ▕\n' +
' ⎝   ╵↖   ⎠\n' +
'  ⟍  __│ ⟋\n' +
'       │'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAB5QTFRFAAAAR0dHr6+vbW1tlpaWs7Ozt7e3TExMjIyMVVVV9weW8wAAAAp0Uk5TAP72/7VsF6YvSZ1EwLoAAADWSURBVHicY2BABhnTy8vLKxsYcACO6YJgID4BhwKovKCgJA4DYPKC4mQq4CTWBGFhHArYINLGxrhMYADJA6VxWgFRgMcNDBAn4LGikEgFuK0ohPrTEEdQwxQY41dgbGyIX4GwISETDHFGN8wNBKwAOQK/FcK4FUyEGlA5A58CQ0HcqRqcpMSLHXDJMzB0FgoWm+FTwNBkMdmsKAC/AgUnfAqSNJoJKFBtGlVAjAKmwaIggaYKWKihQI0yBawjRoHGUFCgFkpAgQMeaZACNnz6gVWnK4YQAJ4OXF8E1+IVAAAAAElFTkSuQmCC'    } 
,
{
name: 'GND',
type: 'Net',
description: 'Ground',
MFR: 'gen',
pin_data: null,
text_data:[
'§\n' +
'╧ '
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAC1QTFRF////AAAAAAAAAQEB2traAAAA6urqAAAAaGhoCgoKSEhIAAAAPj4+mJiYvLy8rab/nAAAAA90Uk5T/wD+4fYi2pjPyJpUysXI+BOEWwAAAq1JREFUeJyFlc9rE0EUxwcNoZVuIIQllL3Id6npUit2tUpERaQXj7GIBy/BetBDwVR6kF4kSOlBQTfgj5tHES+Jh1wlQkXIIVgQvYXgRf8K38zO28xsd+v3kuy+z755b+a9eaJs6RbJfiPMh34nBPz6TiMbuPMIWsF2FnA7RCJ/5zCg7Jf3nv/c+yaR7TTgkb2+K5ScLwahAXcLuNQUWsVftErXAtaBK8LQDaBmAh6w2DQBcQC0DKCHYGzZRXGAWiMBKMJ9trCj+9qFiB2cZvuDq/xvEkchATfEO37dDthFKXYhgcrUgWj716YuljSwhRdZwAz8hgI8+OMsgBJpKWAeyyILEBtYUEDPWMECHJkHARHG2YCI0CXAM3JIARMKQpSrOJUHzGKVgHUzBBuQQQiKcZQHFMOAgC2/mQeIARqiHJoxpoDv6AoXi/nAMbSEhzP5wCxeiipO5gNzWCHgbD4wg1Uxb23DIWCBgIdHAxV8zgccBRyxhKOW+G8MGri3JjXwf6vfKcBpFiIY8kdJmlwODizFX8mN8nTJpoA4teO01clh/f1g6H1TvbtLh1UOA5GrNh039VUzF4h8VXJP9GNhTYu3ohjWVNHycR5whFxjJ6h9ZdlzxQySXRgLncQKAS6CNMB3RFs1DkWp636Tk3zKIVD/E3ATF7JzmNPNW7Wa09CEOk8CdEUlvSWT5G0pyuZWV1AP59npOdIrcwUFVOHrr67LHLiRBpSkvicj6K82JLDMu4QGAxXoQit8HA6HI3awlNy0bmTf9VJ/9EAQPA32bbsTxg54XkTwf5j2UsQTRQNVWAOB7lC5SebM+kRnuMv2zSgZOAkghxbeqGVKz2jABd0UEBOov/3aUQfOdmOwusngBS4mdnM0u/2Q526jnAWQ+o879dfWbE8BGfoHc2felG0TA6YAAAAASUVORK5CYII=' 
}
,
{
name: 'NetLabel',
type: 'Net',
description: '',
MFR: 'gen',
pin_data: null,
text_data:
CharRotation(oCOM.rangeChars(0x2460, 0x2468))
,
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRF6unpwsHBwLKp28vBp2VCpJuVoH5qwINcjEwt151ws47AjAAAAoZJREFUeJyFkz9v2zAQxQX4C+SY2lkrOkqQzTGHomvBSPYYAdRew6I7F0Jt70LlrIVQQd+2xz+WRUp2b7J0Pz6+ezoHTFUQBBPGKKVsEfg1YaZoqDmv2LJjxo4S1Bwess1XbNJ7FD17cLpLbM6tqLXQMdpr6N3IlnNtwxwdM6sYyrSue5dj0ptkom2Gt4cYzm6U+kMMuyNDXISvD2EPX9M9nx900Wtf4N7rqgsvAE7WEzB29Mfq3rC7Xn+YAmOvvSc87vmZODmjwNzrujvhCCyw3xzbnz0FVwCAfT181OuehOsAgS+rjzq5mPQcAMxZs27+sPm4AAJRjgsXZRtYjI4AQB75seYyBQDMZvny4maArx9X6yYRCsCidUPvPGC2WtexoAYQbRt9HgBVnaQWiHZ/5XvvIwUhwIMCqAXIthahsWMqEumzAkKwQFFbN2D2A4jYqqA6gNdWSxVTQKaBtFNoQuiVAnYcx8xzfTWQxAcg2u7bdi9zKlQWhBc+oJMsdZKREJTH4AEqSQzKmJhmsfQV4BOa5DZJsju2eRq6gJNkdiykRDdnJsBfbpICK8uzOKaaCdD7cx8AKlIaiWx7aqUa3ARV1XHYRanQSO55G0uRiw6gjneSyV97KWVK0GS2U1dIm6StiCcNj/NUTTHdJm2zlxsizlul8uBly99EaoLix8IkiY6tDOFlU77hk0myOnB7+iwz1QANbZLVodtJ/UHCESDtrYkKSwHfrgFYTwrYULgAbg4wXSGQw/8AdGMBjBqGwHcgkQHWA2BmAHvFaRSoe0BV/4bbwOEmMDuVI0BlAYz14SZA8M87BqCv8h3Myv0Y8+AD3BsTjRcW0CtXJMLZOD2ZBv4Bve8VMOQWYwoAAAAASUVORK5CYII='
}
,
{
name: 'Capacitor',
type: 'Discrete',
description: 'Polarised Capacitor',
MFR: 'gen',
SPICE: 'C',
pin_data: null,
text_data:[
'  +[###$F]\n' +
'─┨┠─'
,
'  +[##$F]\n' +
'─┨┠─'
,
' + [##$F]\n' +
'─┨┠─'
,
'─┨┠─\n' +
'  +[##$F]'
,
'─┨┠─\n' +
' + [##$F]'
,
'§§§§§─┨┠─\n' +
'[##$F] +'
,
'§§§§§─┨┠─\n' +
'[##$F]+'
,
'[###]\n' +
'─┨┠─'
,
'─┨┠─\n' +
'[###]'
,
'┴+\n' +
'┬'
,
'┴\n' +
'┬+'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAB5QTFRF///+KsX429/YHWuTIZrMJkZZesbpEyMrX4KOubaqeGVSLAAAAnZJREFUeJzt0ztv2zAQAGCBW8aDVCNjYKBBNAok46wCqSBrcbxYo+MCQtbCUZmxSCqD3oqgSa1/W0qyUj/TDt1absZ9uuPd0UHwTx1WFCdvxl0Kb4ozjviWYDeRwSg5LE4BlBSHqww9gOiwYPVHCBEifUjEL0pEXEHEca9g9Q1PQzNKUlBc610Rv4CIMJXyE4AIRbojPIBRohAN91fVsF2Fxd8FSJxlUhJ0Z1OwukIDWSmlMdCLjSHUqjRpxIkw6QFM10GsJRoFMpNKqCYa8WSwVmT4fqbVjFT67i7jbY5McpierAGLWuNI6JR3ADINg6KvwoY/rBUafX4A3RQgCDlXyWDVSwNQouZKdp9HRqVa8Q/qcrICz5ZbazT4VbVAkJeKi8G0B6WvTxp412GW3Q0KL86L1TTqZSm5zrjRHRBKDIrQwLwHcU2ShEIrOpBwMb0JBRR9H3G9dHws0PZCpnM/q+vqum+09kITH78KSCKMHN2/TqKub7+qBpT9MrLkuKruJ7/2uXSP6IEt2xwpjM5dNf78CgK2dO6xAU0OpfxunaP8em1hcXVRtaARzcrCKi/r9WezpJUYWxNynQ6I7OJpr7A2UZm5ICof2HoO9kyu6sAMQuGI8om//VoKVnnR5cAoqohe/Bjip70C9VVe5adsuCWOvKCmETXOrVtMA+ajw2BDoK9NKMUx0WJxErCNcDuO3E/IIFxROY9bcbIpzigvXI7cjWcPwVkj6p0c5Bxe3Frxxf9oxBZoe3mE+WVRPzVP5dt23N+U/D2KYhI04mixRyxp3j3HVrhdwCqcd/+ZZkpHu8B/5Vbz25jj3vNXxO/A//On5ydsJeXI5TLNqQAAAABJRU5ErkJggg=='
}
,
{
name: 'DC Voltage source',
type: 'Power-Driver',
description: 'DC Voltage source',
MFR: 'gen',
SPICE: '',
pin_data: null,
text_data:[ 
'╭─╵─╮\n' +
'( ± )\n' +
'╰─╷─╯[###V]'
,
'╭─-─╮\n' +
'┤- +├\n' +
'╰───╯\n' +
'[###V]'
,
'╭─╵─╮\n' +
'( ∓ )\n' +
'╰─╷─╯[###V]'
,
'╭─-─╮\n' +
'┤+ -├\n' +
'╰───╯\n' +
'[###V]'
,
'  │\n' +
' ╱ \╲\n' +
'( ± )\n' +
' \╲ ╱\n' +
'  │'
,
'  ╱ \╲\n' +
'─(- +)─\n' +
'  \╲ ╱'
,
'  │\n' +
' ╱ \╲\n' +
'( ∓ )\n' +
' \╲ ╱\n' +
'  │'
,
'  ╱ \╲\n' +
'─(+ -)─\n' +
'  \╲ ╱'
 ],
image_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAADAwM+fn5mZmZFJcBpQAAAAR0Uk5TAP//4UkifesAAAGqSURBVHiczVIhcsMwEJTHI+gpMusjSsz9BIOcPePxOKjEJSUlLugrTMsMfJ5A8XxCLekHKh7Ypqc7KU0yfUBFJO2dTne7q9Rf6+4aaGTTj+GegZxsCCgAPhUQAgkA7H0CQMdAsUVLoRSOXyBPHe4olPWItuQ/EJGKFMM8zL5IUn8jTkrlzoxLx5+CQ7NXFudx9YAGaHEu6eWKuBGgR3pcUyl8Z2CpCUhPQFFjjaYSwHpgxAbtGaAHtJ9w9oSAyY/FgJ9SjzgDlNwwf5u1uPhxLfWxeiChoRB864vbdWG4teHf0DBDdsAdpWZ1HL9ojrbyBL0EgrJrCiPJWSSZTqVwub0SqohC/d91K5veRyC2XoZ7KjQoG2dJQHIjHaRuKXh0YS4hvQ2ZkbG8tZe2hMO9FNHPjSm918yDFMndm1dMt2awXCQolw/GsXKsLYUAjZtJMK8++bRMGwJYbO0BcwZ4j1OGAheeJE3wx2jcxJ2Rsxeyg+6Nk95zMlnlM+dFGtP9KxsF3NyFWQ4gmVNgCJ42nNnE8XOoLgkKjP1SmFyTnEYZTrp8yHaj/lo/FwTfFs2YvaAAAAAASUVORK5CYII='
}
,
{
name: 'DC Current source',
type: 'Power-Driver',
description: 'Current source',
MFR: 'gen',
SPICE: '',
pin_data: null,
text_data:[ 
'╭─╵─╮\n' +
'( ↑ )\n' +
'╰─╷─╯'
,
'╭─-─╮\n' +
'┤ → ├\n' +
'╰───╯'
,
'╭─╵─╮\n' +
'( ↓ )\n' +
'╰─╷─╯'
,
'╭─-─╮\n' +
'┤ ← ├\n' +
'╰───╯'
,
'  │\n' +
' ╱ \╲\n' +
'( ↑ )\n' +
' \╲ ╱\n' +
'  │'
,
'  ╱ \╲\n' +
'─( → )─\n' +
'  \╲ ╱'
,
'  │\n' +
' ╱ \╲\n' +
'( ↓ )\n' +
' \╲ ╱\n' +
'  │'
,
'  ╱ \╲\n' +
'─( ← )─\n' +
'  \╲ ╱'
 ],
image_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAADAwM+fn5mZmZFJcBpQAAAAR0Uk5TAP//4UkifesAAAGqSURBVHiczVIhcsMwEJTHI+gpMusjSsz9BIOcPePxOKjEJSUlLugrTMsMfJ5A8XxCLekHKh7Ypqc7KU0yfUBFJO2dTne7q9Rf6+4aaGTTj+GegZxsCCgAPhUQAgkA7H0CQMdAsUVLoRSOXyBPHe4olPWItuQ/EJGKFMM8zL5IUn8jTkrlzoxLx5+CQ7NXFudx9YAGaHEu6eWKuBGgR3pcUyl8Z2CpCUhPQFFjjaYSwHpgxAbtGaAHtJ9w9oSAyY/FgJ9SjzgDlNwwf5u1uPhxLfWxeiChoRB864vbdWG4teHf0DBDdsAdpWZ1HL9ojrbyBL0EgrJrCiPJWSSZTqVwub0SqohC/d91K5veRyC2XoZ7KjQoG2dJQHIjHaRuKXh0YS4hvQ2ZkbG8tZe2hMO9FNHPjSm918yDFMndm1dMt2awXCQolw/GsXKsLYUAjZtJMK8++bRMGwJYbO0BcwZ4j1OGAheeJE3wx2jcxJ2Rsxeyg+6Nk95zMlnlM+dFGtP9KxsF3NyFWQ4gmVNgCJ42nNnE8XOoLgkKjP1SmFyTnEYZTrp8yHaj/lo/FwTfFs2YvaAAAAAASUVORK5CYII='
}
,
{
name: 'AC Voltage source',
type: 'Power-Driver',
description: 'AC Voltage source',
MFR: 'gen',
SPICE: '',
pin_data: null,
text_data:[ 
'╭─╵─╮\n' +
'( ~ )\n' +
'╰─╷─╯'
,
'╭─-─╮\n' +
'┤ ~ ├\n' +
'╰───╯'
,
'  │\n' +
' ╱ \╲\n' +
'( ~ )\n' +
' \╲ ╱\n' +
'  │'
,
'  ╱ \╲\n' +
'─( ~ )─\n' +
'  \╲ ╱'
 ],
image_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAADAwM+fn5mZmZFJcBpQAAAAR0Uk5TAP//4UkifesAAAGqSURBVHiczVIhcsMwEJTHI+gpMusjSsz9BIOcPePxOKjEJSUlLugrTMsMfJ5A8XxCLekHKh7Ypqc7KU0yfUBFJO2dTne7q9Rf6+4aaGTTj+GegZxsCCgAPhUQAgkA7H0CQMdAsUVLoRSOXyBPHe4olPWItuQ/EJGKFMM8zL5IUn8jTkrlzoxLx5+CQ7NXFudx9YAGaHEu6eWKuBGgR3pcUyl8Z2CpCUhPQFFjjaYSwHpgxAbtGaAHtJ9w9oSAyY/FgJ9SjzgDlNwwf5u1uPhxLfWxeiChoRB864vbdWG4teHf0DBDdsAdpWZ1HL9ojrbyBL0EgrJrCiPJWSSZTqVwub0SqohC/d91K5veRyC2XoZ7KjQoG2dJQHIjHaRuKXh0YS4hvQ2ZkbG8tZe2hMO9FNHPjSm918yDFMndm1dMt2awXCQolw/GsXKsLYUAjZtJMK8++bRMGwJYbO0BcwZ4j1OGAheeJE3wx2jcxJ2Rsxeyg+6Nk95zMlnlM+dFGtP9KxsF3NyFWQ4gmVNgCJ42nNnE8XOoLgkKjP1SmFyTnEYZTrp8yHaj/lo/FwTfFs2YvaAAAAAASUVORK5CYII='
}
,
{
name: 'Voltmeter',
type: 'Multimeter',
description: 'Voltmeter',
MFR: 'gen',
SPICE: '',
pin_data: null,
text_data:[ 
'─(V)─'
 ],
image_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAADAwM+fn5mZmZFJcBpQAAAAR0Uk5TAP//4UkifesAAAGqSURBVHiczVIhcsMwEJTHI+gpMusjSsz9BIOcPePxOKjEJSUlLugrTMsMfJ5A8XxCLekHKh7Ypqc7KU0yfUBFJO2dTne7q9Rf6+4aaGTTj+GegZxsCCgAPhUQAgkA7H0CQMdAsUVLoRSOXyBPHe4olPWItuQ/EJGKFMM8zL5IUn8jTkrlzoxLx5+CQ7NXFudx9YAGaHEu6eWKuBGgR3pcUyl8Z2CpCUhPQFFjjaYSwHpgxAbtGaAHtJ9w9oSAyY/FgJ9SjzgDlNwwf5u1uPhxLfWxeiChoRB864vbdWG4teHf0DBDdsAdpWZ1HL9ojrbyBL0EgrJrCiPJWSSZTqVwub0SqohC/d91K5veRyC2XoZ7KjQoG2dJQHIjHaRuKXh0YS4hvQ2ZkbG8tZe2hMO9FNHPjSm918yDFMndm1dMt2awXCQolw/GsXKsLYUAjZtJMK8++bRMGwJYbO0BcwZ4j1OGAheeJE3wx2jcxJ2Rsxeyg+6Nk95zMlnlM+dFGtP9KxsF3NyFWQ4gmVNgCJ42nNnE8XOoLgkKjP1SmFyTnEYZTrp8yHaj/lo/FwTfFs2YvaAAAAAASUVORK5CYII='
}
,
{
name: 'Ammeter',
type: 'Multimeter',
description: 'Ammeter',
MFR: 'gen',
SPICE: '',
pin_data: null,
text_data:[ 
'─(A)─'
 ],
image_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAADAwM+fn5mZmZFJcBpQAAAAR0Uk5TAP//4UkifesAAAGqSURBVHiczVIhcsMwEJTHI+gpMusjSsz9BIOcPePxOKjEJSUlLugrTMsMfJ5A8XxCLekHKh7Ypqc7KU0yfUBFJO2dTne7q9Rf6+4aaGTTj+GegZxsCCgAPhUQAgkA7H0CQMdAsUVLoRSOXyBPHe4olPWItuQ/EJGKFMM8zL5IUn8jTkrlzoxLx5+CQ7NXFudx9YAGaHEu6eWKuBGgR3pcUyl8Z2CpCUhPQFFjjaYSwHpgxAbtGaAHtJ9w9oSAyY/FgJ9SjzgDlNwwf5u1uPhxLfWxeiChoRB864vbdWG4teHf0DBDdsAdpWZ1HL9ojrbyBL0EgrJrCiPJWSSZTqVwub0SqohC/d91K5veRyC2XoZ7KjQoG2dJQHIjHaRuKXh0YS4hvQ2ZkbG8tZe2hMO9FNHPjSm918yDFMndm1dMt2awXCQolw/GsXKsLYUAjZtJMK8++bRMGwJYbO0BcwZ4j1OGAheeJE3wx2jcxJ2Rsxeyg+6Nk95zMlnlM+dFGtP9KxsF3NyFWQ4gmVNgCJ42nNnE8XOoLgkKjP1SmFyTnEYZTrp8yHaj/lo/FwTfFs2YvaAAAAAASUVORK5CYII='
}
,
{
name: 'Diode',
type: 'Discrete',
description: 'Diode',
MFR: 'Diode',
SPICE: 'D',
pin_data: null,
text_data:[
'─▶├'
,
'│\n'+
'▼\n'+
'┬\n'+
'│'
,
'┤◀─'
,
'│\n'+
'┴\n'+
'▲\n'+
'│'
]
,
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAjIKAmkQw0W1J0dTVvLy8RzQutbCuuLq6uLi4l8L6gAAAAAp0Uk5TAPj///0P//tltQW66gsAAAGbSURBVHicrZSxTsMwEIa7WCqjU6hhjCN1r/0EEUZeydRkLIPLGhLkshUpKHOlVPC4XAISi+9cBF396ct/v92bWX6akb+2vrkngS6mmJuYov+zgnVW0IqytS8xRSRFaWpaAYNEUsz/QXHmjTAcKqc6qw+UYH0uTqX3b7jC18I3HB+G9V40ek1UetHeSq1SfBhmrJRyRSgGq4DYoinmbaNkpiWq2GitFZXifQIylYpwF2xoVDaGyNb7sKKzSmsApOJhRVUn4zfSJOXXQQU7JhnEWKWcIykKLgGQ2yQT4RSM19CDepBSI5da+IWegGwdrpMdAZB6BPhVWCEauRgB7bZhxWCTry6cCysqz6fCV849Iik4hFBwjnwDunj6BvghCLAhhyrcCCCXXplGjwKHPRsYZBIgESbFEo6dwB/3Ec7Npb/DgFnh3C43xNZiS7fzxhD7onDbU2VyQvEKT64zPra1LD7IpDljd1pxIIne8Gc6RZvTKWYbw/ckwEBBp6iMjygGi/wJfxQ1sgp+oYimMIIExhQ0AAoaAEUEYMMncg+EkMAhsPUAAAAASUVORK5CYII='
},
{
name: 'Shottky Diode',
type: 'Discrete',
description: 'Shottky Diode',
MFR: 'gen',
SPICE: 'D',
pin_data: null,
text_data:[
'─▶S─'
,
'│\n'+
'▼\n'+
'ᔕ\n'+
'│'
,
'─S◀─\n'
,
'│\n'+
'ᔕ\n'+
'▲\n'+
'│'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAC1QTFRF////9vf3MSspIBsY6unoQz472NfWYV1YxcPBU05Kt7WxcmtjhX10qKGblo+GcDC5fAAAAf9JREFUeJztkz1r20AYx6VvEMFhOj/HEQqd7j6BwZiSUXAYEToEhBAtyVAwh5DpVEz6Yg8OQhibrlVb0bGlVchWaLGVqRTXqWeDE3+HnuwUat8RdS3kv2j4Pc//Hj0vhnGr/0VmGa+X8fRmjrriRl7rZAst2Vl/6oejPNElVtxVBOqMz5O2JqDy/qtVcP9ScldT+K+sdSD5w/lo2nYtJeDO1UiE3y3kX4yXxzo+j4TIPtffXo2niVtV37+MeCPMwuP52TLxqjsqFwEQEfBPQy1HqYhiG/oc9meSKwWgC9GD3R4QgHuJV9PkRwFAw2YUYLddU/PfRbwJTpMxBkB+qDyNbHDiAMsACvzDdgBKg37fIVHBGeX8wVYLzG4QB31hYwYMFwH7B5v8pexPL26u8zFwJ3y68RPmG07uCrHiDDB1woW7GfAISOPjmlOgMFi0t9p43+aCY/k8lk0gTq7MEX3hmK46IBXn6h6gZ9fvS4MiX5mT+WKVToFBI9ftAepIBwyAwTnTztn/diIdGCWSq/6G6c9bdlEA0eeb3s9Xs7EsgvAnWl5PB7PkeTGC1kTLu5J7/gklen90NJALWqs8JsOJp+6RgQ6zZdKuWtbroc7fMPZG+bRYQHNvotlDqez8+gKRzl/q9M+FWpaWG1Pdhf4tzeQ2VcaNMm6U8Vv9o34DokDEiYBD3R8AAAAASUVORK5CYII='
}
,
{
name: 'LED',
type: 'Discrete',
description: 'LED',
MFR: 'gen',
pin_data: null,
text_data:[
' ⬈⬈\n' +  
'─▶├§'
,
'│\n'+
'▼⬈⬈\n'+
'┬\n'+
'│'
,
' ⬈⬈\n' + 
'§┤◀─'
,
'§\n'+
'┴\n'+
'▲⬈⬈\n'+
'│'  
,
'│\n'+
'⏄ ⇉\n'+
'│'  
],
image_data: 
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAA5ujrjpOYw8bK8vT1WV5lJyowu77BkZacj5OZzWhluwAAAAp0Uk5TAP79/hX+/1jMa9ghZAAAAAGSSURBVHic3dTNS8MwFADwHAZ1xzbsLq8E57F5VDwOFLajZEun10Gq3mQOhzfxY/Poyel/a9KtMjSvGXjzHQprfrz3eH0ZY4ydbsX8dbb1i/2M/hMiLHu/3tfRQhewJMEJYhyj7N5QCW7tuRVkiggyB7jsEl0MVAViKYga0zReg+LZD5INSMzY32MNuCYArwGEMsC1H3R2BTFcNJeIqQzfIA2BcA8hQJXYBSC6D5qeU026jcvsoEgAWqeYIQmgMJBKAEUBrY1WR8ZQQA4x12lelqZLgZgLlGVZUiWGduVRmgbApWgCHYW5Qqkt6FEZhJ0V0AD5epKl/2q1EindrC0AL+jbGVb3Xxbgu3t20qICGS+U72JEHISqSsTFxLfWFmxKUBkSBZvQw0MfkCC0BhDCABz4mpyvPuB41b9/nCzn1L/Ui6s9VTPimLH3kX20r3o02K8AeV6DQIbo34O7P4O8AhMStIT7mnv6jQTa7eIgBBozXIYyjANAjCpAbSRjizP7iAx5zhYPDjSs3KerHrVp4IkvOPx66zRN23wAAAAASUVORK5CYII='
}
,
{
name: 'Switch',
type: 'Discrete',
description: 'Switch',
MFR: 'gen',
SPICE: 'SW',
pin_data: null,
text_data:[
'  ╷\n' +
'─•⎺•─'
,
'─•⏊•─'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRF/v7+EhMTIiMi0tPSOz4+TFFQ5ubmY2ZlhYeGsLGwxrJ6QgAAApNJREFUeJztlE1vm0AQhpGsEue4yJV6ZQJyjpG2NvgYuqu0xzastr5ZQtqq19jWwi2V8+Uzctz8286yYNzWplJPPXRsDjAPM+/MDuM4/+1vLHuZdfp7+dOqEzjheX7R4Xe/AJPPXQpGHvAyOypD0Y0Qck3HxxLQrTCWU3rEH1V+KYuDhEvpQliTJS0P+WMuUl4Rc/pbDPTTEU8ZMnhhjl+VZvjoLeMmAgIoU03oXrW9lxKBO8ZM/FRojXf3It8R7qPGdyYACEj868U1jZjUtw3QZ3q5orFPwGjUWqdn2QiAP9Qh8AQgmdOIEOIBQxPJGR0REszrkz3dApA5jYk1ZC7fZXjnPc4t8AoIeY0qfQtgFHhQaiueZAP4nlyh7m9NCHgzVop+l8s2wvu16QNpbKqUirCk6wYAMsDuNiLIsMxUbBpSRzjxPQgA2/vR+gd5mX1dpizlDQDGvJJuK5kex3x3nGHLd4CHPzZcTe7BRz92dVO1Q+xF8H1IBiV9TILgc0kjPFfgjF/vpcDqknNKPzExpTGeeQKM/6Sh6tAHmgCfmmNlRoJN4TojIJYIruglGRSTZQ3UncyiOgJmOb8k3nS5YFajrlP0dwAiZLgQlZ/JfF2PXT/ZAR65uucW4Fo3H+HpTRuBeEEF8FTIYvcZGxH4sgVCrNEMt5C3ytkjdicZWoFC5hduO9ZRgk22UMBYNfxmDczaud4kfp0ksD0SBT5ucyAB9cQFVQZZmJddNWuJu5oIK6BeRG4LOL2FJcJUcKkP7aHeDXimzBQTHF51fVOKH+IwFgf9jhNjKRDmT8c3YYynMizGHZtyAxAWs+N+046Qqg7AcbfTWdcuRmLsqP32HGRUdmzX1pZ1y8Cejv+Q45+zH54M0rz1tPHvAAAAAElFTkSuQmCC'
}
,
{
name: 'DP Switch',
type: 'Discrete',
description: 'Double Pole Switch',
MFR: 'TL2202EEYA',
pin_data: null,
text_data:[
'─○▏▕○─\n' +
'─○▏▕○─\n' +
'─○  ○─'
,
'╔══════╗\n' +
'╫o[S##]║\n' +
'║   /─o╫\n' +
'╫o─/   ║\n' +
'╫o─    ║\n' +
'║   /─o╫\n' +
'╫o─/   ║\n' +
'╚══════╝'
,
'╔══════╗\n' +
'║   /─o╫\n' +
'╫o─/   ║\n' +
'║    ─o╫\n' +
'║   /─o╫\n' +
'╫o─/   ║\n' +
'║[S##]o╫\n' +
'╚══════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAALy8vIiAgggQJUw0RJyUmHx8fKSkpgICAQBETL8gyHgAAAAp0Uk5TAP/+//++fiHy1vJeSnQAAAHRSURBVHictdXNT8IwFADwcdB6fU38uLYu3rG9cDQrJtwcQbiqCUFvaMLk6kHiXSL/ru+1G7CuXTjoS4DB+9G+vq1bkvxxsMVk3gqKdW/WJoq1UoOHlglGCqM/i4JRRkDfRsHaoNBmEAXfxmTamF4cKIOh2gAK1Q501gZecA0IfqLgOCVgNrFespE2KjOXehPJD41dhTb992B+ylPsQoq96I4Dk7ApcKNRZDrrwrg5xgIQ4Crp1QWYNPLCAmWUA74oMG9BVgGon/Qh/cTTEtzQt6sayGkEkBZcS6vP6oBbkSLQ9ogLD+AvICVgJ8o8+AA4lyRsHvC9AcACqPIBANu8/QyMIORePgjAFQhxQKLMRwCIKu+BYQVcwwKtllWuAtJvtawD6dfgAdkssgZ4qNViB3ig1XyvSHfQqGE7QrlSH3ACkoAIdtJNgeezOmMeeHSrkLtLwgO4bSTNLbedhLsaYE/49/1O8ntve9LWLIu00dyc7M1dMaE1uuhQBdwBsQqAkw+OhboL+jkIPse5W8XpbBkEq6TIyy0TA3QXEBzHD4LOih44ICbLCDimOwbL5RyHej0PABeLCwJJ/LF09GVBPA4BLP7McqAtfQBgrc/V/4lfpAJ//mhZe2QAAAAASUVORK5CYII='    }
,
{
name: 'TRS plug',
type: 'Connector',
description: 'TRS Connector',
MFR: 'gen',
pin_data: null,
text_data:[
'│───▅─▅⏜\\\n' +
'│───▀─▀⏝/'
,
' /\\\n' +
'❪  ❫\n' +
'████\n' +
'│  │\n' +
'████\n' +
'│  │\n' +
'┴──┴\n' 
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAC1QTFRFAAAADxAMsqamKS8ok63C////hZGgvJhk2dDGQ1BOeF48hn1rT3OCr8HRucjLCgJnuAAAAA90Uk5TAP/////////9/////x+FnLzkQQAAApJJREFUeJztk79r20AUx4/S0C4OCE2m26WxnaqLfNBW9uqx9hAQZHZS0eBO8aDgUdBENFMqCCjOkmQwkTaburWuU4dA4YYQSikUZcpQ+uN/6HuSqziO5KVLh37Xz+e9d/dOIuR//pFczsa5y6ez8EXNMIxZ1YYQp9nCfAEoGJl83dGE8UKIrP6rTJXAyBS+ApdkTYiPWQ2Ag3GQJdx2GAowJGPET+biDGyRLlw2qeJgC9dN5TpkZR1baGmCHmdrF2fcFObGXF85REHLwrpupQlz35J620wZoevLH/7Um9yJ7jnd/uGziBeDt3T1upCji0iW97A88DdsG4V8sqjwfNR9icZI1xXPL9m2NYh2PeZ3B70t8RqFpaPRft+GKOqkUFS9zXUXTz+Qu1BuW8qxlGzy87uLjYpZ3XHf6IrD7mG5FTjRY2kM+PxhZbNY7MgltzxStaAMvBBETyXJDIUfcs/cLr2SnuxK0N4q27QVuOpYwE0+qJgndHNbzasSnG7rEW1xz40/GMbgDLl2ry0dmQuSpMowfKna4jw4ib4XxjRY1K1KBxYyUiV5gdkWHXSHBg9cBwzkcM07j/HZtP6gssCoyd0mNfjIBQP6H+CP872N06r9wB/kFT4E3uLCjQJ8Dc4YXdj3uX9c5U1KC0brvRACMfAaIR2YwCrKvuezPYocIzCnxloNhB0P4nc0z+sCNyZTqzVCQr4EHod4Pk04FEZphGfwzrYFHfhzaxo3fiEmBDYPQ4ZJ+bg4jGks2ApPThfRehhefYkoTE2vnxFyTbjicfdrnES8MMmn/iU6XU8yhXR+JcTnv8ETIb7eWbpwP15OPQXHwnh7qZwkvH7zfIkQYtLrCTmnnzJKx8mFuZn87/MbaoVhRwxcKOwAAAAASUVORK5CYII='
}
,
{
name: 'TRSjack',
type: 'Connector',
description: 'TRS Connector',
MFR: 'gen',
pin_data: null,
text_data:[
' ╔════════╗\n' +
'█║[J##]┌TN╫\n' +
' ║^^^──▾─T╫\n' +
' ║││  ┌─RN╫\n' +
' ║│└──▾──R╫\n' +
' ║└──────S╫\n' +
' ╚════════╝'
,
' ╔════════╗\n' +
' ║┌──────S╫\n' +
' ║│┌──▴──R╫\n' +
' ║││  └─RN╫\n' +
' ║vvv──▴─T╫\n' +
'█║[J##]└TN╫\n' +
' ╚════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAC1QTFRFAAAAEBYZP0RFKS0uaWliqKifjIyDOj0+5OTghIaDVllZPkFAsbKvYmhllJWOtb6L3AAAAA90Uk5TAP///v/9/cH9HCd1Fp2ZrWtXmAAAAytJREFUeJy9lb9rFEEUx7cxcDEczM1hf7ObCyYozMySYJm9uS0twu2xltmbGdKGFJLE0siWqRSMhnQWsdEUgQPBRiXhCEJsAgYsjFXwb3Bm9sft3a3p9BV7MO8z733fmzdzlvV/bfpxf1f/Vi4vL0qBNwBuv7Wsmdec3dst8e9hAMBSf+8DCrtuCTD9DmiDG5Q2Pf9jWYLManTxetJ/G+cAgHRrwn+6Doq2NO6vHI34AeyPiTgEYwa3X41UsD4OALj0fRhk5mjCr5GtnHiBywAldbfQwon9+vMgqeC8dLvaBedvEKCjkrt/TQCo7icywBEtV4ghyYByQvnRZgrQ0jIQQk8yoIwgI0B5ALR5UUgxBmk/cmQKmCV7PAFCzW5WBTSfYXxq/GjWTwBSU1t0gEwrTAKg5kMDOJLZDYDsXAisoRR4pAHCmOdENkBmP80qMMAPBbxHrBsx5HvQqFRiKMmA+2ogps8paQXc6VFMsBZKvdxvWv3FCTgnIbObEUhDDAHVycq3wKPUacdOhLGRiGnuR18VILitVtiabLm9QpMTO7CsalcH6HIZ9ljSSpgAjRT43LEhEjJgnHl0uRBBH8acAj5xX/BwR3Saa6tNzwBGQ8MAqsorEUgp4h3Z8lxGc8A2xzmnbs6ZaAHYFDH3XIHcRgbgBFBtqHZ0Vr/LEWGINVINdnLeGpjq6UOucbXo6cwJkCpNAKIX/YZNHMccqPLhdGAWFHCLMz0o9V4NKcCopHZWqr55U9LTtwx2KGKMIgPgdCJ1n6xqZCbSFZRxzrLBTQbGvGTVVT0jkM16jLc7BBd6qfuoDqunQkLXvsN92eZeMrnJefeTx+En9NSM4roUXSFsbK618S8cJM/Lc7u9rBZdBTBO9PzToUJtZzx+qmTUhejMPkWAZsB8/oT+imM1KXURcJ/bOgAZKjS2H8YrGC+KwBEc50Dhsa5cxSuLkR+s+GGkExhgYRhAhRDRmpTPWHvHy4H+yEO9L6QMIxbu0AyYt0btJJDcEfHJcQYcjAHW4HcQhNdW5XDDAJN/J9bMYDDQv3uKIIUSJ+1Upenf4Lesl8fbNwX4B/YHUtUNX0hI4CYAAAAASUVORK5CYII='
}
,
{
name: 'DIPcon',
type: 'Bridge',
description: 'DIP Connector',
MFR: 'gen',
pin_data: null,
text_data:[
'─━ ##)─'
,
'─(## ━─'
],
image_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAC1QTFRFAAAAb29xX19iRUZJenp94cxuLy8y4tyrCQoK4NKI4tSJZ2dmraugXV1cdnZ1ftRuOAAAAA90Uk5TAP/+/f/7/xP/YrlpCa0psaAYsQAAAqVJREFUeJztlDFvEzEUx72gU9ARyRd/AfsQe89SxZLBrVc2TqhZT7o5DBEqH6DKmAVV7cCGEGtW1AjYqkqVuLJVGQgDQ5p+Bt57ti/Xa1IGVjz4Kff/vb/fe74cY/8XY9HwL/rJ8cNAJx88bB7l+TY9Pv0ERPRhO5DnEwhvNwHRG0a5BxQ2AO8GePypt9gE5B9hP8wpRHek85MhAQMfJvdzj6kwCh20iC5awIHrjQJYLCvlpQ6Z+1wfzvM9pbgHRq6i0BuE2+VcwUo88IgKi0Z57p0+V4p0CRc2cRVhiHxvL/eUJIBzyH3lXKm3EYTLs8ppPJEAPHaKL+ywNud+uXZDb/HtD5UpJaXkNRC75tFi2D270hpL4+uF7QaLFzojd4X5UggPMG8+DTIWYK0QVnDDjTN/v5xrMofkBA2s5bhBcOb7XiZT3CHdWGvABoBu5WXliqfNumXQ4VchuTu6Ub1TjcAaFinMDPMTtdaRwJPwiIXaCUdz4QFjwyIgtTR2UoQlB+FKIOAbXKrgrdV0+Mp5hhU1IMlFA3gNw6HfIdnQINbAEzg5qwEBAEwo6DiHLjxO8QkeIoRxI3a60jjq70Ds4EPQhBux6yGFEeMbC4BRFi8Qr7Cuvwfy7hiBFb5+TwGwpm6PY3YAsAieGZw9+gTzsgwA+wlAbz0bk1DuuCwC0IXBiCzIqVYpAQXsJQFxBf1Rp9agWFJuA2Arif8Sf7aXxkeIeaCLd53yhCp/7oCjsgGwBVg8K1zlAGD9JQC7es6CRcJ73rwGiqJ/E74t8VTx/WYu7Pp69nv99blQSXIH0P3Zl+bnqVtJRcNxgJ7PWGutVFJ4c51d37Rlxi6VKmrzDTpjU4nmGsw3yvDmgUPRLq254qsCsrfKWGb/XuUtiy1n/+v6A60wIVbY3iQaAAAAAElFTkSuQmCC'
}
,
{
// todo invoke junctions ●○
name: 'DIPjump',
type: 'Bridge',
description: 'DIP Jumper',
MFR: 'gen',
pin_data: null,
text_data:[
'┬●┬\n' +
'┴●┴'
,
'─○─\n' +
'─○─'
],
image_data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAC1QTFRFAAAAb29xX19iRUZJenp94cxuLy8y4tyrCQoK4NKI4tSJZ2dmraugXV1cdnZ1ftRuOAAAAA90Uk5TAP/+/f/7/xP/YrlpCa0psaAYsQAAAqVJREFUeJztlDFvEzEUx72gU9ARyRd/AfsQe89SxZLBrVc2TqhZT7o5DBEqH6DKmAVV7cCGEGtW1AjYqkqVuLJVGQgDQ5p+Bt57ti/Xa1IGVjz4Kff/vb/fe74cY/8XY9HwL/rJ8cNAJx88bB7l+TY9Pv0ERPRhO5DnEwhvNwHRG0a5BxQ2AO8GePypt9gE5B9hP8wpRHek85MhAQMfJvdzj6kwCh20iC5awIHrjQJYLCvlpQ6Z+1wfzvM9pbgHRq6i0BuE2+VcwUo88IgKi0Z57p0+V4p0CRc2cRVhiHxvL/eUJIBzyH3lXKm3EYTLs8ppPJEAPHaKL+ywNud+uXZDb/HtD5UpJaXkNRC75tFi2D270hpL4+uF7QaLFzojd4X5UggPMG8+DTIWYK0QVnDDjTN/v5xrMofkBA2s5bhBcOb7XiZT3CHdWGvABoBu5WXliqfNumXQ4VchuTu6Ub1TjcAaFinMDPMTtdaRwJPwiIXaCUdz4QFjwyIgtTR2UoQlB+FKIOAbXKrgrdV0+Mp5hhU1IMlFA3gNw6HfIdnQINbAEzg5qwEBAEwo6DiHLjxO8QkeIoRxI3a60jjq70Ds4EPQhBux6yGFEeMbC4BRFi8Qr7Cuvwfy7hiBFb5+TwGwpm6PY3YAsAieGZw9+gTzsgwA+wlAbz0bk1DuuCwC0IXBiCzIqVYpAQXsJQFxBf1Rp9agWFJuA2Arif8Sf7aXxkeIeaCLd53yhCp/7oCjsgGwBVg8K1zlAGD9JQC7es6CRcJ73rwGiqJ/E74t8VTx/WYu7Pp69nv99blQSXIH0P3Zl+bnqVtJRcNxgJ7PWGutVFJ4c51d37Rlxi6VKmrzDTpjU4nmGsw3yvDmgUPRLq254qsCsrfKWGb/XuUtiy1n/+v6A60wIVbY3iQaAAAAAElFTkSuQmCC'
}
,   
{
name: 'PowerDeliveryUnit',
type: 'Power-Driver',
description: '140W USB-C Fast Charge Trigger Board Module PD/QC Decoy Board PD3.1 28V/36V/48V',
MFR: 'PD',
pin_data: null,
text_data:[
'╔════════════╗\n' +
'╟─╮[PD3.1] + ╟\n' +
'║ │USB-C     ║\n' +
'╟─╯        - ╟\n' +
'╚════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAA5+fnNoFqK2zeXJztLz5NkKu5pLS6Z5uPb6fBLANYmAAAAAp0Uk5TAPv+/f3/GPv7fGnkMyUAAAKhSURBVHicxZW9b9swEMU9CcjIDpVnIoI5h3LTnYd8jFVAOKOBBkk0ynBCZQzTmOetqFPH/m97pC0nViVlKnqLBj797r0jKfV6/6yuPxSMu9ejm5/dgrxgnYjolbHPXYKbIu5EXBtWdiGi16LvWAeCHKKzj62IyDB2dzlgrAUR3RSMxaJgcQsid4wiUE0Yaxz4bdFn1IT1R4zdNzSJfg/0Nw9IHJqiAZE/a829QODINLiI3J2+DBb62jQNa2UTrX2MgpmiQZCjMFpnJDDBad1DtEJuycTgUxGy3jcABLeEiEceENdTRtyi5ZxcPArfwCxrgl96xKmoRzagBsbULOSJzrxAaHLh9+OhWlmPNw6tTgQJElJc0l5gBcjhxD9ucZJZHopciNjNKmsvAKQ9QJxQgmyrGJUPVYYrADgf0wio6NXg4lkPyirCNSgpYZmv/PvUnIIK7hK3G9ILSH2Rnq/XyGmMWvhGxDDjnUP19cimcFquiI0Zljw4Xb4B1NSYQwCz4jbh3BmScD6vABHAaRwXU5WeOxSaAAYtudgBSADGFNPhIeAgZMCyLPlst00HCqCIjbogIacQmZhgieJtG69kCjBVMqXnUeIF1hp8t4tXNAMAmaqh9AgUVpRu/gbovUhSKEmz0B7BKSPi+6/LIghSGGp9AYoGRNd21qsJCK5Sa8nnmfAxx/sC2okU1A9jnsgMWlfun7MF+fdNnmgWXuBwPt4XDLMNAkJZh7WD+l3qw+AiVFribH+9F0mpAyINAtx3GBBfErVDpGd1QLDhBelGMP8LQCXVsaoE9au0TXo83bZoakCHTmZmm7KpAQVZaDcN640NAiKNIVyOFgG5uOsC0LlbLmj9pHXd22h1uBXIrgYbQrvDjQv44C8XffSf/J/1BxnX/ZzwNy6FAAAAAElFTkSuQmCC'
}
,
{
name: 'DC-DC+-12V',
type: 'Power-Driver',
description: 'DC/DC Converters - Through Hole 40W 18-75Vin +/-12V +/-1667mA DIP 1X1',
MFR: 'DKMW40G-12',
instructions:'https://www.meanwellusa.com/webapp/product/search.aspx?prod=SKMW40',
pin_data: null,
text_data:[
'╔════════════╗\n' +
'║[DKMW40G-12]║\n' +
'╢+VIN     +VO╟\n' +
'║         COM╟\n' +
'╢+VIN     -VO╟\n' +
'╚════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAANzY3SUhJYmFh////iIiIW1pZcXFvtre0trSonN4mXAAAAAp0Uk5TAP/++xr+kCcMsXOvzm4AAAJtSURBVHic3dQxbxMxFAdwTyTr86ll9rOuEuPZciu2DIgyn+WdpqJhDCAuGbOUlhmpn5e/fb47X9uUgQk8RX6/+D0/+yzEX4/V/wjuXwaLG77ZvwAWa6r4bH8ULNdE0tLp52PgKxFpRSw3z4MOcVLOWJqJEfxQEiCEYGkmVmO88i1JxBuShjaPweJKehtastqgUFSymYPdurLOBYd/M6UhN9sCLNbSeeuCJ2IAJj2JCJYd1UiA/IpZxRQOLosIOiU5OMRZG7bSKhdiPbw59GCn6hB8CIyoMsxNzb4ORlreJIANBOeDRIFWWWZ20jplpZF0iiSr5RVJD4CyNKLYpq9IO5N2g2NZvaJGYYctkTVsFIoMAbVaFcFrgC9kjMT/CAVqNrqlKoQ2TmCcCvEBGfrWkG6Vbk6a1KaYAPO8FZe5cVjRsuXmBLmUjAkwxT2AlnFFaQzC6IdJBcQ4wHv8RLSKU1z7GidKqQCO8Qyor0hT0L72Tb8cujuBNKWNl8F7y308LTCAJNg4awKaodIueABqFIpcq9tcgBxA3ma87xi1T3GtcrwAWaQW49xyHOd5qUbh070fd5jGRQHyGkUBzOdbXHeahFdTB+LQO3wPthBV0Na1U4J0ozpDhWjITfE3/aX9Vop01EMBb/Otvp6LsYCPA7idi6mAEdyXImeQZ2ICh0UhMogv0X4EohC5gPLr/okv7O66mYH01c0ekF+DGFr8GDzcfWpGYIunMIPlg9g5lYF+5hEDEN9TFsQvDk+BuEOxuyikLgoQs4f0dtvZ+L7M3tE5EBB2/hLPAFJ39vxwFKTRbcXL4Mn4J8C7P4zffy2/PwpFOr0AAAAASUVORK5CYII='
}
,
{
name: 'PCM5102',
type: 'DAC-ADC',
description: 'Low Power Digital Audio Converters I2S Module for Raspberry Projects 0.3V/5V Digital Stereo Converters',
MFR: 'DAC',
pin_data: null,
instructions:'https://docs.cirkitdesigner.com/component/6eb5249e-9d81-4cbb-8a54-a23db8023969/pcm5102a',
text_data:[
'╔══╧════╧════╧════╧════╧════╧════╧════╧════╧═══╗\n' +
'║ FLT  DEMP XSMT FMT  A3V3 AGND ROUT AGND ROUT ║\n' +
'║                                              ║\n' +
'╢ SCK                                       /\ ║\n' +
'╢ BCK                                    ╭─❪  ❫║\n' +
'╢ DIN  H1L H2L                       LOUT╯ ████║\n' +
'╢ LCK  ▯▯▯ ▯▯▯                       ROUT──│  │║\n' +
'╢ GND  H3L H4L                        GND╮ ████║\n' +
'╢ VIN  ▯▯▯ ▯▯▯                 PCM510    ╰─│  │║\n' +
'╚══════════════════════════════════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAB5QTFRFAAAAOjI8UDtYioN+Z15iHRshubWe4uTocmiCsLS62esjNwAAAAp0Uk5TAP/5/f3//Ro1jwaBOcsAAAL+SURBVHic1ZU9j+M2EEDVySmHpNyT4gluRfIEpOSHhbQyzB9gi2DgTsgCcdwtFgfEZXC7wP3dkHt7u/ba3ibNhYIa62nmkTMaF8VPsKb/FXA83n8IzKxZfATMHkJgv30APNBOCvb3TWDWdNCMhl3ReAbKh6YHFgNbXG7q+ZejNH1go2DuUjQDMx428+g6I6U4XgO+GDkiGxx38lIjAcdeQgyUIUZRHRf374EZsx3FnRWIzWPfs8V74ItkVtBGYSRGA65W5xrTsXFbLrfYCbCUbLHF5xp/PXAZWD22NWJsaSlgwc80/pCBR8F619a9Ihr8UilxqmHy+7HWdiAyPV77UVhxKvqVW8VkWxOwCigMxAoF0ryJfk35jVVrvZYUGMBG4ghh+yb6ZJgdBabIGgSUAdVRUefkq+idY8xg46wFcECJYDVFrJGvonuV3oQKsEacUVCSb+jIeDQ/NKaD0xRg9FUyoDgFoghvI2u6F40pJ4F5y8HDkAJohhRYw3NR7r8D5ZNBAnGohsGlrYIj4ZPuN6gOi5dy75VOlQbjVzadFTbKzXVcDqRnx5eGObhkUa09tgKolXZFfDdWYFnWyED56Cq/5CJlB5MuABJjXEKfT+O5afdPxqd+a/SAFF1BqlkX44h6mYryvc8PgmKs7HZQpAUkPWSCEvMKlHeO8vkIg/0MjLgWAMfgU4e4H59e0oC6hXZYQgCkk/NcJ03z6+vXXSpTU7BLwCPkVaXm4KLevc2HtFcUeQsk+AxgV/FOdt9OJsydgy4QTbDOQEssknY3nQD7fOTNBl7W0Ic6BTidUYd05P0mJ0i3H0iUKcDZEEsarB0S8LkFj6DLAc6n3GM+ZkRhXPq1be2ueA+UivrcuaIaUk3jtwugOGg/pPS4QmvR76ZLoHz0eTX602DjVFwCxZ9VBrCkpPu9uAb8ssnAqhvr3XQVKGPlK6/7+LzFK0BxCFCtUkvsihtAGVPjAun+uQUUhzimWbabbgLF/hCV3Re3gZRm//b8p/hT+8/rX2F71gA4BKweAAAAAElFTkSuQmCC'
}
,
{
name: 'SGTL5000',
type: 'DAC-ADC',
description: 'Low Power Stereo Codec with Headphone Amp',
MFR: 'ADC/DAC',
pin_data: null,
instructions:'https://www.reichelt.com/be/nl/shop/product/teensy_shield_-_microsd_audio_f_teensy_4_0-275591?PROVID=2812&gad_source=1&gad_campaignid=17940466725&gbraid=0AAAAADwnxtbkIYn7MoZwvBj2nOUi-lsQm&gclid=CjwKCAiA7LzLBhAgEiwAjMWzCG6YDh9wNbhaTwLT1znB2UIv3eV_tJ1yVbL-R97VikctSrOSp2gKcBoC84UQAvD_BwE#open-modal-image-big-slider',
text_data:[
'╔════════════════╗\n' +
'║   [SGTL5000]   ║\n' +
'║                ║\n' +
'╢SDA      LINEINL╟\n' +
'╢SCL      LINEINR╟\n' +
'║        LINEOUTR╟\n' +
'╢MCLK    LINEOUTL╟\n' +
'╢BCLK            ║\n' +
'╢LRCLK        HPL╟\n' +
'╢TX           HPR╟\n' +
'╢RX        HPVGND╟\n' +
'╢VAG          MIC╟\n' +
'╢CPFILT          ║\n' +
'╢ADDR            ║\n' +
'╢MODE     MICBIAS╟\n' +
'╚════════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAC1QTFRFAAAAGhkZ/v79JyYmXl1d////19fWPj09NzY2RENDfn59qKensbGxf39+WllZ3jTtGgAAAA90Uk5TAP//+f0a/v6hTP36EFgV+Uu22QAAAnlJREFUeJzVlD2LE0EYx7e5IuAtPMzihCunWCFbDQlcbqPFkiXhuMZPILiECEm1GkSSKkSQa47AWVwhB2ZlhYCFiSRgEAQrGxHsFI5tBIW77+AzM5uXzZvt3b+a3f9vd563GU27Cbq/3d65jsDXV9sBvZOPtgF6GyAdbQb0U0AdRBuBX44AjE+bgLOB5QPQgXW8HrjitvcQ4LYZkIt1wK5XAfs17hBAyeyuAql2iQ1xA9ykwCrp7jKwOwpIOBYB+NCqgV3/ngT0FwPTIUAGjCHBDc96FiWAnxjgI4ASQ1UAnppF8m4B0F96FW5w5QuCOKTEDqMZ8AdkgC0WaywDhZMpcFV1SBiA7U0BM4BcjdvVCwWk9j0TkzNmPhKOeLayXQF8a8PeZIgJsgVhKoWJA+nLHe1BRzRoyZeEUP639kUu4DFb0h31/q72/IlcGOv/kDvU2jkfaD9IxIi+A/bEB6OY1trQyIYMu2gvAgHAHqvtl0EA0PTGcOTM6yR84wM0zTegANKHJpt2YtoNLGefxwBQ18twCiSMfU580jNdEWda+yGrMOEUBwp6ws/gvyyfTGQe9+JC5co9bADQUbVaR8P2Mo1iXChRakGMcBSHQLJZDoUKFOrKv5TN4mLd4C0RnBD2nr4VC9JV7f4rCdfDDouuFkloutI/nw+MeDzCQN/jubB8+lF+cjIfuTOZSnmg5iDTkAkcRwtDqwgcK5RdU35y7FWyMvScPML55Nhrqc7UM1SC3eWjp8ty2D6V28xukYXDq8rhunEB1hx/WQ7K4wKsAWQqdJ7AKiAImvSXgFunAjj4vBHAVOjWa1DcE9sv0v9fxSu6HsBN0D/wxtXpWh4ypwAAAABJRU5ErkJggg=='
}
,
{
name: 'W25Q128FV',
type: 'Memory',
description: '128Mbit Serial Flash Memory SPI Module for Arduino Raspberry Pi',
MFR: 'W25Q128JVFIQ',
pin_data: null,
instructions:'https://www.reichelt.com/be/nl/shop/product/teensy_shield_-_microsd_audio_f_teensy_4_0-275591?PROVID=2812&gad_source=1&gad_campaignid=17940466725&gbraid=0AAAAADwnxtbkIYn7MoZwvBj2nOUi-lsQm&gclid=CjwKCAiA7LzLBhAgEiwAjMWzCG6YDh9wNbhaTwLT1znB2UIv3eV_tJ1yVbL-R97VikctSrOSp2gKcBoC84UQAvD_BwE#open-modal-image-big-slider',
text_data:[
'╔══════════════╗\n' +
'╢ /CS      VCC ╟\n' +
'╢ DO  /HLD/RST ╟\n' +
'║ /WP      CLK ╟\n' +
'╢ GND       DI ╟\n' +
'╚══════════════╝'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAC1QTFRFAAAAMC8wPDs9ICAgVFRUcnJx0M7IsbCvxMO8tLOu/f38srGo0M7DlpWQkpGRRgduPAAAAA90Uk5TAP////7yETRstSX69fiThm8nzQAAAqtJREFUeJzN1M9r02AYB/D3lGwX4c2bncRD3saTKKSv/0CzFATtofsBK1J5T7Flo+xgexmDXAzCtut0dB05yc7SiqXxprWy9iL+mEQvYzhE/R9886Nd0yTdQZA9p0I+PM/3ffI2AFyCsi4V0C8AleWz9amgiuUHtSmAX8AYZ89oIqhKGEImImMCwJ1ACAUpZkwAKip0S4iO8QF3KsGghOsrtSjgVTgqITzGCs4Ix0oYH2P5Z4ShYk3WQ6CCYUTUxgB/CiPljqFDcCUjRQUMmljeFmOes70Waj54uAATRPbMA1WJKLEAwluUAe4EERL/HM0ZDFQy7FcCkH8w8CihPStFuwMsLo/jI7IGoroCLD7DXnI8IJp8DKwKggkCpdXsLrBOkXvIuDFExMvsFCcKcU8ZbYIUVS6yPVSLJBATTVA6o60wUBpAwjYVHUNkgUUAVrlJxKbfBONQA1XOrXsAXW1CVyihIEiUtC/u29QbS3fzys3FSaHIWtZwwapz8Hte+ZZHih8EjyIuF7wLs/Ge2/6kOimlmBoPwiJqn13wfP8d3ensDVB6kBpGlbwliDl3Aji0jVL9lX60JLdI+mMQBEMiYO2rd6sPn4JN2+S/P/vZJNfewGETgmV3Cf6d3GzTsmNwb9UbLxQx7wpBxhm5QIdgaxf86RszTttZJPc+IK9HsITRf7Pe07c65nYL359XcvOMCIIfcQj2DN7pG1tOo5FSbBdALZgQAJ3OOl293tbLS+JRCmrodhDx/Bs1Y9Oyvcs12r9aRBykxCKdAJwJVm1a6rxcG2TmBlA7BhOAVbkLNvrmWud1sQVzZgzgKGj06GrH1B+PIk5+zPcNUD9igw7Ov1JhUKKc3QMbbQoSAJvTp7zdBckAPAGztjENALDWA9MBb14AwvUfwD/XXxG3BIyldHjIAAAAAElFTkSuQmCC'
}
,
{
name: 'OpAmp',
type: 'OpAmp-Opto',
description: 'Operational Amplifier',
MFR: 'gen',
pin_data: null,
text_data:[
' ⌠⟍ │\n' +
'─┤ +⟍\n' +
' │    ≻─\n' +
'─┤ -⟋\n' +
' ⎩⟋ │'
,
' ⌠⟍ │\n' +
'─┤ +⟍\n' +
' │    ≻─\n' +
'─┤ -⟋\n' +
' ⎩⟋ │'
,
'   │   │\n' +
'⌌──┴───┴──⌍\n' +
' ⟍  +  - ⟋\n' +
' ──⟍   ⟋──\n' +
'     ү\n' + 
'     │\n' 
,
'   │ ⟋⎫\n' +
'   ⟋- ├─\n' +
'─≺    │\n' +
'   ⟍+ ├─\n' +
'   │ ⟍⎭'
,
'     │\n' +
'     ⅄\n' +
' ──⟋   ⟍──\n' +
' ⟋ +   - ⟍\n' +
'⌎──┬───┬──⌏\n' +
'   │   │\n' 
,
' ⌠⟍ │\n' +
' │  ⟍\n' +
'─┤ +  ⟍\n' +
' │      ≻─\n' +
'─┤ -  ⟋\n' +
' │  ⟋\n' +
' ⎩⟋ │'
,
'     │   │\n' +
'⌌────┴───┴────⌍\n' +
' ⟍   +   -   ⟋\n' +
' ──⟍       ⟋──\n' +
'     ⟍   ⟋\n' +
'       ү\n' + 
'       │\n' 
,
'     │ ⟋⎫\n' +
'     ⟋  │\n' +
'   ⟋  - ├─\n' +
'─≺      │\n' +
'   ⟍  + ├─\n' +
'     ⟍  │\n' +
'     │ ⟍⎭'
,
'       │\n' +
'       ⅄\n' +
'     ⟋   ⟍\n' +
' ──⟋       ⟍──\n' +
' ⟋   +   -   ⟍\n' +
'⌎────┬───┬────⌏\n' +
'     │   │\n' 
]
,
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAB5QTFRFAAAA/f39JCQkOjo6WFhY1NTULi4uTk5OhYWFnJycx40YDgAAAAp0Uk5TAP/6aCb/0///CZcNWMgAAAFNSURBVHic7ZU7b4MwFIVRidg9WGW+TiFjlaBK2RCpulMpImNFoux4SdawtGOH/uD6AYlNbd/u7RnxJ/vcJ1H0L4dmT/syCMQAhyCQLJosCNx11At8KeAh9QLtWntgXiArRRRLePQCnAki8V4QtTs4lEGgbqAIA6TPyjBAOXsJAiSFYxggjT8NGhA21pPvs1VxBQRCVTZMJTDkrq3piUgb+08LqBY9W0m19TbXNuyOWF7uQavmkDtsSOAoBfU7nCUgbJiPVDl/Gz2oC6SN+XC4EQHEqsw6ig8NEFkUqVgFsLmFeVWfFc9CVd7Pb2+ZAOXad5eyXwDYE6bJUZZJI8zx3A7TSFRz6hyJMlL9Cp0j1Uax6NZVLKPcg4FJuc2GIa6GmSTqZ8vZANa0WNujg4ONHja86PijCwRdQdgSQ9egUmiRKqGrGF3m6O/gz+obylxsjlRjyRIAAAAASUVORK5CYII='
}
,
{
name: 'Gates',
type: 'Logic',
description: 'Logic gates',
MFR: 'gen',
pin_data: null,
text_data:[
' ↽──╌_\n' +
'──⎞   `⟍ \n' +
'  ▕ OR  `≻──\n' +
'──⎠    ⟋́\n' +
' ↼──╌́͞'
,
' ↽──╌_\n' +
'──⎞   `⟍ \n' +
'  ▕ NOR `≻ⵔ─\n' +
'──⎠    ⟋́\n' +
' ↼──╌́͞'
,
' ↽───╌_\n' +
'─⎞⎞    `⟍ \n' +
' ▕▕ XOR  `≻─\n' +
'─⎠⎠     ⟋́\n' +
' ↼───╌́͞'
,
' ↽──╌_\n' +
'─⎞⎞   `⟍ \n' +
' ▕▕ XNOR`≻ⵔ─\n' +
'─⎠⎠    ⟋́\n' +
'↼──╌́͞'
,
' ┌─────╴⎽\n' +
'─┤       ⎞\n' +
' │  AND   ⊢─\n' +
'─┤       ⎠\n' +
' └─────╴͞'
,
' ┌─────╴⎽\n' +
'─┤       ⎞\n' +
' │  NAND  ᘰ─\n' +
'─┤       ⎠\n' +
' └─────╴͞'
,
'.  ⌠⟍\n' +
'   │  ⟍\n' +
'───┤BUF ≻───\n' +
'   │  ⟋\n' +
'   ⎩⟋'
,
'   ⌠⟍\n' +
'   │  ⟍\n' +
'───┤NOT ≻ⵔ──\n' +
'   │  ⟋\n' +
'   ⎩⟋'
,
'.  ⌠⟍\n' +
'───┤⎎ ≻───\n' +
'   ⎩⟋'
],
image_data:
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAB5QTFRFAAAA/v7+BAQEQUFBHx8fFBQUNTU1dXV1oaGhxMTEM+NY4QAAAAp0Uk5TAP/4KoDM//8R/1G/ko0AAAIjSURBVHicrdU7b9swEABgAlQAr+pQw2NPopJshGkBHg2JBDoaehRe6yFFxmhwVgFJga7J4KL/tkdKsmWHpy49eLHvMyXenSjGusikkWUhJCNi9m2Tbcoo3VCAP0amKqNgS4GfSWyWUXRDrrBcpyaIBH0Piin8SDKPaYyWTDNe26hyGsADxj6mwW2IsdiXFAgcCOe+JcBFB8K9ZxvahulBo7V/p7wH7wC7aZAcY7eI0lLnrQfcL/CGEGT1ThSSWMEmKh7FSx8A+Iqz44CIByBPdQibPJcOmFUUmQEU5zrYyzuwqtdlOgA41aGrZHZdCnHVCy/ouyl7MHtZt5egmwfFepACiGo9AuyXjf5PFiSHBxD5CIwDAU/C8E8ziA8A2wtvtipx6wd2QJ7crnZe8IorZN9HE3YNbNx86SZsQ4Hg3oFPsZ4Gc4Bp8Nm7wgxr9tqBxnsPbpvuJuei9YJK68Jtsym927Ttzmyhjv1xYYG6BLYX4RHOveCQX4A0eT7sYdRNfu6tAyuc0/r0ixu5RqgRYC9sfV7SgcVZEEO72A8PCjXVTig5MfYoVhB/AEoJPAFvu94VP0CpKzA+gubw9t49/qNwT0TdgQaeGvziOYW6R+8AGRCntQNYe26Iw9aCI9AnsQW/oWynAObpdwGCBKqpPLZ7Os/4P/L/IxSXHFvNSWDUXVYbIN84LMvtW9XQlzBVfBdsJ4DG93I6tYIOtpmQ2pP5C7DoiqmIx+QBAAAAAElFTkSuQmCC'
}
];
// INDUCTORS, TRANSISTORS, SWITCHES, CONNECTORS, POWER SOURCES, MOTORS
/*
Diode:     ─▶│─
Inductor:  ─∿∿∿─
NPN:       ─▶│
PNP:       ─◀│
Switch:    ─o/ o─
Connector: ─( )─
Battery:   ─| |‾─
Motor:     ─Ⓜ─
⎛
⎜
⎝
*/

function CharRotation(char_arr)
{
  var arr = [];
  for(var i=0;i<char_arr.length;i++)
  {
    arr.push("│\n"+char_arr[i]);
    arr.push(char_arr[i]+"─");
    arr.push(char_arr[i]+"\n│");
    arr.push("─"+char_arr[i]);
  }
  return arr;
}

function NetLabelID(catalog_idx,rotation)
{
  const LabelID = CATALOG[catalog_idx].text_data[rotation].replace(new RegExp("[\s\n"+WILDCHAR_U+"]","g"),"");
  return LabelID; 
}

// https://www.charset.org/utf-8/10
const PICKER_TABS = 
{
    Box: oCOM.rangeChars(0x2500, 0x257F).concat(oCOM.rangeChars(0x0331,0x0338)).concat(oCOM.rangeChars(0x035C,0x0361)).concat(oCOM.rangeChars(0x2010, 0x2017)).concat(['‗','ᙿ','᐀','͇','̿','⟋','⟍','≻','≺','⅄','ү','⌎','⌏','⌍','⌌','⎩','⌠','⎠','⎡','⎢','⎣','⎤','⎥','⎦','⎧','⎨','⎩','⌈','⌉','⌊','⌋','⌌','⌍','⌎','⌏','⌐','⌙','⌜','⌝','⌞','⌟','⊢','⊣','⊤','⟝','⟞','⋮','⋯','⋰','⋱','⵰','᯿','⸜','⸝','⸌','⸍','⦧','⦦','⎸ ⎹','▏','▕','⎽']),
    Arrows: oCOM.rangeChars(0x2190, 0x21FF).concat(oCOM.rangeChars(0x27F0, 0x27FF).concat(oCOM.rangeChars(0x2B00, 0x2B11)).concat(oCOM.rangeChars(0x2B60,0x2B65)).concat(oCOM.rangeChars(0x2B95,0x2B95)).concat([,'☚','☛','☜','☝','☞','☟','⎉','⎊','⎋','⎌','⏎','⏏','⏩','⏪','⏫','⏬','⏭','⏮','⏯'])),
    Geometric: oCOM.rangeChars(0x2580, 0x25FF).concat(oCOM.rangeChars(0x20D8, 0x20E4)).concat(oCOM.rangeChars(0x2B12, 0x2B2F)).concat(['❘','❙','❚']),
    Icons: oCOM.rangeChars(0x2600, 0x26FF).concat(oCOM.rangeChars(0x2701, 0x2775)).concat(oCOM.rangeChars(0x2794, 0x27C1)).concat([]),
    AlphaNumeric: oCOM.rangeChars(0x0021, 0x007A).concat(oCOM.rangeChars(0x2460, 0x24FF)),
    Ascii: oCOM.rangeChars(0x20, 0x7F),
    "CP437": ['\x00', '☺','☻','♥','♦','♣','♠','•','◘','○','◙','♂','♀','♪','♫','☼','►','◄','↕','‼','¶','§','▬','↨','↑','↓','→','←','∟','↔','▲','▼']
  .concat(oCOM.rangeChars(0x0020, 0x007E)).concat(['⌂',
  'Ç','ü','é','â','ä','à','å','ç','ê','ë','è','ï','î','ì','Ä','Å',
  'É','æ','Æ','ô','ö','ò','û','ù','ÿ','Ö','Ü','¢','£','¥','₧','ƒ',
  'á','í','ó','ú','ñ','Ñ','ª','º','¿','⌐','¬','½','¼','¡','«','»',
  '░','▒','▓','│','┤','╡','╢','╖','╕','╣','║','╗','╝','╜','╛','┐',
  '└','┴','┬','├','─','┼','╞','╟','╚','╔','╩','╦','╠','═','╬','╧',
  '╨','╤','╥','╙','╘','╒','╓','╫','╪','┘','┌','█','▄','▌','▐','▀',
  'α','ß','Γ','π','Σ','σ','µ','τ','Φ','Θ','Ω','δ','∞','φ','ε','∩',
  '≡','±','≥','≤','⌠','⌡','÷','≈','°','∙','·','√','ⁿ','²','■',' '
])
,
"Unicode1.0.1": [].concat(oCOM.rangeChars(0x0000,0x017e)).concat(oCOM.rangeChars(0x0180,0x01f0))
  .concat(oCOM.rangeChars(0x0250,0x02a8)).concat(oCOM.rangeChars(0x02b0,0x02de))
  .concat(oCOM.rangeChars(0x02e0,0x02e9)).concat(oCOM.rangeChars(0x0300,0x0341))
  .concat(oCOM.rangeChars(0x0370,0x0372)).concat(oCOM.rangeChars(0x0384,0x0386))
  .concat(oCOM.rangeChars(0x0388,0x038a)).concat(['\u038c']).concat(oCOM.rangeChars(0x038e,0x03a1))
  .concat(oCOM.rangeChars(0x03a3,0x03ce)).concat(oCOM.rangeChars(0x03d0,0x03f5))
  .concat(oCOM.rangeChars(0x0401,0x040c)).concat(oCOM.rangeChars(0x040e,0x044f))
  .concat(oCOM.rangeChars(0x0451,0x045c)).concat(oCOM.rangeChars(0x045e,0x0486))
  .concat(oCOM.rangeChars(0x0490,0x04c4)).concat(oCOM.rangeChars(0x04c7,0x04c8))
  .concat(oCOM.rangeChars(0x04cb,0x04cc)).concat(oCOM.rangeChars(0x0531,0x0556))
  .concat(oCOM.rangeChars(0x0559,0x055f)).concat(oCOM.rangeChars(0x0561,0x0586)).concat(['\u0589'])
  .concat(oCOM.rangeChars(0x05b0,0x05b9)).concat(oCOM.rangeChars(0x05bb,0x05c3))
  .concat(oCOM.rangeChars(0x05d0,0x05ea)).concat(oCOM.rangeChars(0x05f0,0x05f5)).concat(['\u060c'])
  .concat(['\u061b']).concat(['\u061f']).concat(oCOM.rangeChars(0x0621,0x063a))
  .concat(oCOM.rangeChars(0x0640,0x0652)).concat(oCOM.rangeChars(0x0660,0x066c))
  .concat(oCOM.rangeChars(0x0670,0x06b7)).concat(oCOM.rangeChars(0x06ba,0x06be))
  .concat(oCOM.rangeChars(0x06c0,0x06ce)).concat(oCOM.rangeChars(0x06d0,0x06d5))
  .concat(oCOM.rangeChars(0x06f0,0x06f9)).concat(oCOM.rangeChars(0x0901,0x0903))
  .concat(oCOM.rangeChars(0x0905,0x0939)).concat(oCOM.rangeChars(0x093c,0x094d))
  .concat(oCOM.rangeChars(0x0950,0x0954)).concat(oCOM.rangeChars(0x0958,0x0970))
  .concat(oCOM.rangeChars(0x0981,0x0983)).concat(oCOM.rangeChars(0x0985,0x098c))
  .concat(oCOM.rangeChars(0x098f,0x0990)).concat(oCOM.rangeChars(0x0993,0x09a8))
  .concat(oCOM.rangeChars(0x09aa,0x09b0)).concat(['\u09b2']).concat(oCOM.rangeChars(0x09b6,0x09b9))
  .concat(['\u09bc']).concat(oCOM.rangeChars(0x09be,0x09c4)).concat(oCOM.rangeChars(0x09c7,0x09c8))
  .concat(oCOM.rangeChars(0x09cb,0x09cd)).concat(['\u09d7']).concat(oCOM.rangeChars(0x09dc,0x09dd))
  .concat(oCOM.rangeChars(0x09df,0x09e3)).concat(oCOM.rangeChars(0x09e6,0x09fa)).concat(['\u0a02'])
  .concat(oCOM.rangeChars(0x0a05,0x0a0a)).concat(oCOM.rangeChars(0x0a0f,0x0a10))
  .concat(oCOM.rangeChars(0x0a13,0x0a28)).concat(oCOM.rangeChars(0x0a2a,0x0a30))
  .concat(oCOM.rangeChars(0x0a32,0x0a33)).concat(oCOM.rangeChars(0x0a35,0x0a36))
  .concat(oCOM.rangeChars(0x0a38,0x0a39)).concat(['\u0a3c']).concat(oCOM.rangeChars(0x0a3e,0x0a42))
  .concat(oCOM.rangeChars(0x0a47,0x0a48)).concat(oCOM.rangeChars(0x0a4b,0x0a4c))
  .concat(oCOM.rangeChars(0x0a59,0x0a5c)).concat(['\u0a5e']).concat(oCOM.rangeChars(0x0a66,0x0a74))
  .concat(oCOM.rangeChars(0x0a81,0x0a83)).concat(oCOM.rangeChars(0x0a85,0x0a8b))
  .concat(oCOM.rangeChars(0x0a8f,0x0a90)).concat(oCOM.rangeChars(0x0a93,0x0aa8))
  .concat(oCOM.rangeChars(0x0aaa,0x0ab0)).concat(oCOM.rangeChars(0x0ab2,0x0ab3))
  .concat(oCOM.rangeChars(0x0ab5,0x0ab9)).concat(oCOM.rangeChars(0x0abc,0x0ac5))
  .concat(oCOM.rangeChars(0x0ac7,0x0ac8)).concat(oCOM.rangeChars(0x0acb,0x0acd)).concat(['\u0ad0'])
  .concat(['\u0ae0']).concat(oCOM.rangeChars(0x0ae6,0x0aef)).concat(oCOM.rangeChars(0x0b01,0x0b03))
  .concat(oCOM.rangeChars(0x0b05,0x0b0c)).concat(oCOM.rangeChars(0x0b0f,0x0b10))
  .concat(oCOM.rangeChars(0x0b13,0x0b28)).concat(oCOM.rangeChars(0x0b2a,0x0b30))
  .concat(oCOM.rangeChars(0x0b32,0x0b33)).concat(oCOM.rangeChars(0x0b36,0x0b39))
  .concat(oCOM.rangeChars(0x0b3c,0x0b43)).concat(oCOM.rangeChars(0x0b47,0x0b48))
  .concat(oCOM.rangeChars(0x0b4b,0x0b4d)).concat(['\u0b57']).concat(oCOM.rangeChars(0x0b5c,0x0b5d))
  .concat(oCOM.rangeChars(0x0b5f,0x0b61)).concat(oCOM.rangeChars(0x0b66,0x0b70))
  .concat(oCOM.rangeChars(0x0b82,0x0b83)).concat(oCOM.rangeChars(0x0b85,0x0b8a))
  .concat(oCOM.rangeChars(0x0b8e,0x0b90)).concat(oCOM.rangeChars(0x0b92,0x0b95))
  .concat(oCOM.rangeChars(0x0b99,0x0b9a)).concat(['\u0b9c']).concat(oCOM.rangeChars(0x0b9e,0x0b9f))
  .concat(oCOM.rangeChars(0x0ba3,0x0ba4)).concat(oCOM.rangeChars(0x0ba8,0x0baa))
  .concat(oCOM.rangeChars(0x0bae,0x0bb5)).concat(oCOM.rangeChars(0x0bb7,0x0bb9))
  .concat(oCOM.rangeChars(0x0bbe,0x0bc2)).concat(oCOM.rangeChars(0x0bc6,0x0bc8))
  .concat(oCOM.rangeChars(0x0bca,0x0bcd)).concat(['\u0bd7']).concat(oCOM.rangeChars(0x0be7,0x0bf2))
  .concat(oCOM.rangeChars(0x0c01,0x0c03)).concat(oCOM.rangeChars(0x0c05,0x0c0c))
  .concat(oCOM.rangeChars(0x0c0e,0x0c10)).concat(oCOM.rangeChars(0x0c12,0x0c28))
  .concat(oCOM.rangeChars(0x0c2a,0x0c33)).concat(oCOM.rangeChars(0x0c35,0x0c39))
  .concat(oCOM.rangeChars(0x0c3e,0x0c44)).concat(oCOM.rangeChars(0x0c46,0x0c48))
  .concat(oCOM.rangeChars(0x0c4a,0x0c4d)).concat(oCOM.rangeChars(0x0c55,0x0c56))
  .concat(oCOM.rangeChars(0x0c60,0x0c61)).concat(oCOM.rangeChars(0x0c66,0x0c6f))
  .concat(oCOM.rangeChars(0x0c82,0x0c83)).concat(oCOM.rangeChars(0x0c85,0x0c8c))
  .concat(oCOM.rangeChars(0x0c8e,0x0c90)).concat(oCOM.rangeChars(0x0c92,0x0ca8))
  .concat(oCOM.rangeChars(0x0caa,0x0cb3)).concat(oCOM.rangeChars(0x0cb5,0x0cb9))
  .concat(oCOM.rangeChars(0x0cbe,0x0cc4)).concat(oCOM.rangeChars(0x0cc6,0x0cc8))
  .concat(oCOM.rangeChars(0x0cca,0x0ccd)).concat(oCOM.rangeChars(0x0cd5,0x0cd6)).concat(['\u0cde'])
  .concat(oCOM.rangeChars(0x0ce0,0x0ce1)).concat(oCOM.rangeChars(0x0ce6,0x0cef))
  .concat(oCOM.rangeChars(0x0d02,0x0d03)).concat(oCOM.rangeChars(0x0d05,0x0d0c))
  .concat(oCOM.rangeChars(0x0d0e,0x0d10)).concat(oCOM.rangeChars(0x0d12,0x0d28))
  .concat(oCOM.rangeChars(0x0d2a,0x0d39)).concat(oCOM.rangeChars(0x0d3e,0x0d43))
  .concat(oCOM.rangeChars(0x0d46,0x0d48)).concat(oCOM.rangeChars(0x0d4a,0x0d4d)).concat(['\u0d57'])
  .concat(oCOM.rangeChars(0x0d60,0x0d61)).concat(oCOM.rangeChars(0x0d66,0x0d6f))
  .concat(oCOM.rangeChars(0x0e01,0x0e3a)).concat(oCOM.rangeChars(0x0e3f,0x0e5b))
  .concat(oCOM.rangeChars(0x0e70,0x0e74)).concat(oCOM.rangeChars(0x0e81,0x0e82)).concat(['\u0e84'])
  .concat(oCOM.rangeChars(0x0e87,0x0e88)).concat(['\u0e8a']).concat(['\u0e8d'])
  .concat(oCOM.rangeChars(0x0e94,0x0e97)).concat(oCOM.rangeChars(0x0e99,0x0e9f))
  .concat(oCOM.rangeChars(0x0ea1,0x0ea3)).concat(['\u0ea5']).concat(['\u0ea7'])
  .concat(oCOM.rangeChars(0x0eaa,0x0eab)).concat(oCOM.rangeChars(0x0ead,0x0eb9))
  .concat(oCOM.rangeChars(0x0ebb,0x0ebd)).concat(oCOM.rangeChars(0x0ec0,0x0ec4)).concat(['\u0ec6'])
  .concat(oCOM.rangeChars(0x0ec8,0x0ecd)).concat(oCOM.rangeChars(0x0ed0,0x0ed9))
  .concat(oCOM.rangeChars(0x0edc,0x0edd)).concat(oCOM.rangeChars(0x0ef0,0x0ef4))
  .concat(oCOM.rangeChars(0x1000,0x1022)).concat(oCOM.rangeChars(0x1026,0x102c))
  .concat(oCOM.rangeChars(0x102e,0x1031)).concat(oCOM.rangeChars(0x1033,0x103e))
  .concat(oCOM.rangeChars(0x1040,0x104c)).concat(oCOM.rangeChars(0x10a0,0x10c5))
  .concat(oCOM.rangeChars(0x10d0,0x10f6)).concat(['\u10fb']).concat(oCOM.rangeChars(0x2000,0x202e))
  .concat(oCOM.rangeChars(0x2030,0x203e)).concat(oCOM.rangeChars(0x2040,0x2044)).concat(['\u2070'])
  .concat(oCOM.rangeChars(0x2074,0x208e)).concat(oCOM.rangeChars(0x20a0,0x20aa))
  .concat(oCOM.rangeChars(0x20d0,0x20e1)).concat(oCOM.rangeChars(0x2100,0x2138))
  .concat(oCOM.rangeChars(0x2153,0x2182)).concat(oCOM.rangeChars(0x2190,0x21ea))
  .concat(oCOM.rangeChars(0x2200,0x22f1)).concat(oCOM.rangeChars(0x2302,0x232c))
  .concat(oCOM.rangeChars(0x2400,0x2424)).concat(oCOM.rangeChars(0x2440,0x244a))
  .concat(oCOM.rangeChars(0x2460,0x24ea)).concat(oCOM.rangeChars(0x2500,0x2595))
  .concat(oCOM.rangeChars(0x25a0,0x25ee)).concat(oCOM.rangeChars(0x2600,0x2613))
  .concat(oCOM.rangeChars(0x261a,0x266f)).concat(oCOM.rangeChars(0x2701,0x2704))
  .concat(oCOM.rangeChars(0x2706,0x2709)).concat(oCOM.rangeChars(0x270c,0x2727))
  .concat(oCOM.rangeChars(0x2729,0x274b)).concat(['\u274d']).concat(oCOM.rangeChars(0x274f,0x2752))
  .concat(['\u2756']).concat(oCOM.rangeChars(0x2758,0x275e)).concat(oCOM.rangeChars(0x2761,0x2767))
  .concat(oCOM.rangeChars(0x2776,0x2794)).concat(oCOM.rangeChars(0x2798,0x27af))
  .concat(oCOM.rangeChars(0x27b1,0x27be)).concat(oCOM.rangeChars(0x3000,0x3036)).concat(['\u303f'])
  .concat(oCOM.rangeChars(0x3041,0x3094)).concat(oCOM.rangeChars(0x3099,0x309e))
  .concat(oCOM.rangeChars(0x30a1,0x30f6)).concat(oCOM.rangeChars(0x30fb,0x30fe))
  .concat(oCOM.rangeChars(0x3105,0x312c)).concat(oCOM.rangeChars(0x3131,0x318e))
  .concat(oCOM.rangeChars(0x3190,0x319f)).concat(oCOM.rangeChars(0x3200,0x321c))
  .concat(oCOM.rangeChars(0x3220,0x3243)).concat(oCOM.rangeChars(0x3260,0x327b))
  .concat(oCOM.rangeChars(0x327f,0x32b0)).concat(oCOM.rangeChars(0x32d0,0x3357))
  .concat(oCOM.rangeChars(0x337b,0x33dd)).concat(oCOM.rangeChars(0x3400,0x3d2d)).concat(['\u4e00'])
  .concat(['\u9fa5']).concat(['\ue000']).concat(oCOM.rangeChars(0xf8ff,0xf900)).concat(['\ufa2d'])
  .concat(oCOM.rangeChars(0xfe30,0xfe44)).concat(oCOM.rangeChars(0xfe49,0xfe52))
  .concat(oCOM.rangeChars(0xfe54,0xfe66)).concat(oCOM.rangeChars(0xfe68,0xfe6b))
  .concat(oCOM.rangeChars(0xfe70,0xfe72)).concat(['\ufe74']).concat(oCOM.rangeChars(0xfe76,0xfefc))
  .concat(['\ufeff']).concat(oCOM.rangeChars(0xff01,0xff5e)).concat(oCOM.rangeChars(0xff61,0xffbe))
  .concat(oCOM.rangeChars(0xffc2,0xffc7)).concat(oCOM.rangeChars(0xffca,0xffcf))
  .concat(oCOM.rangeChars(0xffd2,0xffd7)).concat(oCOM.rangeChars(0xffda,0xffdc))
  .concat(oCOM.rangeChars(0xffe0,0xffe6)).concat(['\ufffd'])
  ,
    Misc: ['⌁','⌂','⌇','⌖','⌗','⌚','⌛','⍾','⎆','⎈','⎍','⎎','⏚','⏛','⏦','⏻','⏼','⏱','⏲','⏚','⎓','⌁','⊕','⊖','⊗','⊘','⊞','⊟','⊠','☐','☑','☒','≈','≠','∞','⚠','⚡','⛶','⛝','⛌','·','•','●','Ω','π','µ','⍉','⍵','☼','✈','✉','✔','✖','✚','✥','✦','✧','★','☆','⏄','⅏','➰','➿','𐦫','⟁','⨨','𐺊','⎓','ᯤ'].concat(oCOM.rangeChars(0x2400,0x2424))
    .concat(oCOM.rangeChars(0x2320, 0x23FF).concat(['♀','♂','☯','☮','✌'])),
};
// Mode: DRY, COOL, FAN
// Fan:

/*
	Daikin AC map
  byte here is reversed bits
	byte 7= checksum of the first part (and last byte before a 29ms pause)
	byte 13=mode
		b7 = 0 (bit number 7)
		b6+b5+b4 = Mode
			Modes: b6+b5+b4
			011 = Cool (00110001 => bit count from right to left => b6 = 0, b5 =1, b4 = 1 => 011)
			100 = Heat (temp 23)
			110 = FAN (temp not shown, but 25)
			000 = Fully Automatic (temp 25)
			010 = DRY (temp 0xc0 = 96 degrees c)
		b3 = 0
		b2 = OFF timer set
		b1 = ON timer set
		b0 = Air Conditioner ON (1 is ON, 0 is OFF)
	byte 14=temp*2   (Temp should be between 18 - 32)
	byte 16=Fan
		FAN control
		b7+b6+b5+b4 = Fan speed
			Fan: b7+b6+b5+b4
			0×30 = 1 bar
			0×40 = 2 bar
			0×50 = 3 bar
			0×60 = 4 bar
			0×70 = 5 bar
			0xa0 = Auto
			0xb0 = Not auto, moon + tree
		b3+b2+b1+b0 = Swing control up/down
			Swing control up/down:
			0000 = Swing up/down off
			1111 = Swing up/down on
	byte 17
			Swing control left/right:
			0000 = Swing left/right off
			1111 = Swing left/right on
	byte 21=Aux  -> Powerful (bit 1), Silent (bit 5)
	byte 24=Aux2 -> Intelligent eye on (bit 7)
	byte 26= checksum of the second part
*/

/*
  #  original    reversed    hex
  0  10001000 => 00010001 => 0x11
  1  01011011 => 11011010 => 0xDA
  2  11100100 => 00100111 => 0x27
  3  00001111 => 11110000 => 0xF0
  4  00000000 => 00000000 => 0x00
  5  00000000 => 00000000 => 0x00
  6  00000000 => 00000000 => 0x00
  7  01000000 => 00000010 => 0x02    Checksum part 1 (from byte 0 => byte 6)
  8  10001000 => 00010001 => 0x11
  9  01011011 => 11011010 => 0xDA
  10 11100100 => 00100111 => 0x27
  11 00000000 => 00000000 => 0x00
  12 00000000 => 00000000 => 0x00
  13 10001100 => 00110001 => 0x31    => On, temp 18, cool
  14 00100100 => 00100100 => 0x24    => Temperature * 2
  15 00000000 => 00000000 => 0x00
  16 00001100 => 00110000 => 0x30    => Fan 1 bar, Swing Off
  17 00000000 => 00000000 => 0x00
  18 00000000 => 00000000 => 0x00
  19 00000000 => 00000000 => 0x00
  20 00000000 => 00000000 => 0x00
  21 00000000 => 00000000 => 0x00    => Powerful off
  22 00000000 => 00000000 => 0x00
  23 00000011 => 11000000 => 0xC0
  24 00000000 => 00000000 => 0x00
  25 00000000 => 00000000 => 0x00
  26 01100011 => 11000110 => 0x57    => Checksum2
*/



/*
 * Array of 27 bytes in hexadecimal with reversed bits from original
 */
const DEFAULT_STATES = [
  0x11, 0xDA, 0x27, 0xF0, 0x00, 0x00, 0x00, 0x02,
  // 0  1     2     3     4     5     6     7
  0x11, 0xDA, 0x27, 0x00, 0x00, 0x31, 0x24, 0x00,
  // 8  9     10    11    12    13    14    15
  0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0x00, 0x00, 0x57
  // 16 17    18    19    20    21    22    23    24    25    26
];

const MODES = {
  cool: 0b0011,
  fan: 0b0110,
  dry: 0b0010
};

const FANS = {
  fan1 : 0b0011,
  fan2 : 0b0100,
  fan3 : 0b0101,
  fan4 : 0b0110,
  fan5 : 0b0111,
  auto : 0b1010,
  moon_tree : 0b1010,
};

const SWINGS = {
  on  : 0b0000,
  off : 0b1111
}

function printBinary(states) {
  console.log(states.map((opt, index) => `#${index} ${"00000000".substr(opt.toString(2).length)}${opt.toString(2)}`).join('\n'));
}

/*
 * Convert arrays of states in hexadecimal to array of states in binary which reverse binary to original
 */
function convertToBinaryArray(states) {
  return states.map((opt, index) => `${"00000000".substr(opt.toString(2).length)}${opt.toString(2)}`)
               .map(m => m.split('').reverse().join('')); // reverse the bit
}

function getFirstPartBinaryString(states) {
  var arr = convertToBinaryArray(states).slice(0, 8);
  return convertToBinaryArray(arr).join('');
}

function getSecondPartBinaryString(states) {
  var arr = convertToBinaryArray(states).slice(8, states.length);
  return convertToBinaryArray(arr).join('');
}

/*
 * Generate states from parameters
 */
function generateStates(isOpen = true, mode = 'cool', temperature = 22, fan = 'fan1', swing = 'on', isPowerful = false) {
  // make a copy of default option
  const options = DEFAULT_STATES.slice(0);

  // set state on/off (change value of last bit, bit 0 on the right)
  if (isOpen) {
    options[13] |= 0x01; // bitwise or operator => 0010 0111 | 0000 0001 => 0010 0111
  } else {
    options[13] &= 0xFE; // bitwise and operator => 0010 0111 & 1111 1110 => 0010 0110
  }

  // set mode
  // shift mode value to the left 4 (add 4 0s trailing)
  options[13] = MODES[mode] << 4 | (options[13] & 0x01);

  // set temperature
  options[14] = temperature << 1; // shift left 1 bit => temp * 2^1 = temp * 2

  // set fans
  options[16] = FANS[fan] << 4;

  // set swing
  options[16] |= SWINGS[swing];

  // set powerful
  if (isPowerful) {
    options[21] |= 0x01;
  } else {
    options[21] &= 0xFE;
  }

  // Update checksum for byte 26 (only need to update checksum part 2, from byte 8 -> byte 25)
  // Checksum for part 1 never change (from byte 0 -> byte 6)
  // Formula: sum all byte from byte 8 -> byte 25 and modulo 256 (because it's hexadecimal base)
  options[26] = options.reduce((result, current, index) => {
    if (index > 7 && index < 26) result += current;
    return result;
  }, 0) % 256;

  return options;
}

function getState(states) {
  return console.log(hexToBinary(states[13]));
}

function getMode(states) {
  return console.log(hexToBinary(states[13] >> 4));
}

function getFan(states) {
  return console.log(hexToBinary(states[16] >> 4));
}

function getSwing(states) {
  return console.log(hexToBinary(states[16]));
}

function getPowerful(states) {
  return console.log(hexToBinary(states[21]));
}

function hexToBinary(hexValue) {
  return parseInt(hexValue, 16).toString(2);
}

module.exports = {
  generateStates,
  printBinary,
  convertToBinaryArray,
  getFirstPartBinaryString,
  getSecondPartBinaryString
};

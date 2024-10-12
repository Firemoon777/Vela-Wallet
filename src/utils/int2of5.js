const I2OF5_DATA = [
    "nnwwn",
    "wnnnw",
    "nwnnw",
    "wwnnn",
    "nnwnw",
    "wnwnn",
    "nwwnn",
    "nnnww",
    "wnnwn",
    "nwnwn"
  ];

  export function drawInt2of5(data, canvas) {
    if (data.length % 2) {
      data = "0" + data;
    }
  
    let dest = "1010", intEven, intOdd;
    for (let i = 0; i < data.length / 2; i++) {
      intEven = parseInt(data.substr(i * 2, 1), 10);
      intOdd = parseInt(data.substr(i * 2 + 1, 1), 10);
      for (var j = 0; j < 5; j++) {
        if (I2OF5_DATA[intEven].substr(j, 1) == "w") 
          dest += "11";
        dest += "1";
        if (I2OF5_DATA[intOdd].substr(j, 1) == "w") 
          dest += "00";
        dest += "0";
      }
    }
    dest += "11101";
  
    // Draw to canvas
    canvas.height = dest.length * 2;
  
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);  
    ctx.fillStyle = "#ffffff";
  
    for(let i = 0; i < dest.length; i++) {
      if(dest[i] == "0") {
        ctx.fillRect(0, i * 2, canvas.width, 2);
      }
    }
  
    return dest;
  }
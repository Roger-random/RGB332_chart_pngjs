/*

Node.JS script to write 8-bit RGB332 color chart to a PNG image file on disk.
Requires the pngjs package: https://www.npmjs.com/package/pngjs

Copyright (c) Roger Cheng

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
var fs = require ("fs");
var PNG = require("pngjs").PNG;

const chart_width = 1920;
const chart_height = 1080;
const chart_filename = "rgb332_chart.png";

// Create new PNG object
var chart = new PNG({
  colorType: 2, // RGB
  width: chart_width,
  height:chart_height});

// Chart is horizontally divided into four sections, one per blue channel value.
const blueWidth = chart.width/4;

// Within each blue channel section, further horizontally divided into 8 for green.
const greenWidth = blueWidth/8;

// Chart is vertically divided into eight sections, one per red channel value.
const redHeight = chart.height/8;

// Write color chart to PNG object
for (var y = 0; y < chart.height; y++) {
  for (var x = 0; x < chart.width; x++) {
    // Index into image array
    var index = (chart.width * y + x) << 2;

    // Upconvert RGB332 value to RGB888 counterpart
    var blue2 = Math.floor(x/blueWidth);
    var blue8 = Math.round((blue2/3)*0xFF);
    var green3 = Math.floor(x/greenWidth) % 8;
    var green8 = Math.round((green3/7)*0xFF);
    var red3 = Math.floor(y/redHeight);
    var red8 = Math.round((red3/7)*0xFF);

    // Write RGB888 value into image array
    chart.data[index] = red8;
    chart.data[index+1] = green8;
    chart.data[index+2] = blue8;
    chart.data[index+3] = 0xFF;
  }
}

// Write image to disk
chart.pack().pipe(fs.createWriteStream(chart_filename));

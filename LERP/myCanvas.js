// The Object representing a point on the canvas
function Vector(x, y) {
    this.x = x;
    this.y = y;
}

//The object representing RGB value 
function ColorVector(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

// Function to change point location for vertex of shape using lerp
function lerp(v1, v2, scalar) {
    var vx = (1 - scalar) * v1.x + scalar * v2.x;
    var vy = (1 - scalar) * v1.y + scalar * v2.y;
    var vResult = new Vector(Math.round(vx), Math.round(vy));
    return vResult;
}

// Function to change rgb value using lerp
function lerpColor(v1, v2, scalar) {
    var vr = (1 - scalar) * v1.r + scalar * v2.r;
    var vg = (1 - scalar) * v1.g + scalar * v2.g;
    var vb = (1 - scalar) * v1.b + scalar * v2.b;
    var vResult = new ColorVector(Math.round(vr), Math.round(vg), Math.round(vb));
    return vResult;
}

//interval variable
var loop;

// Arrays containing the shapes Vectors
var shape1 = [3];
shape1.length = 3;
var shape2 = [3];
shape1.length = 3;


// Keeps track of what point and shape i am on
var onshape1 = true;
var currentpoint = 0;

// Creates the default colors for the shapes
var veccA = new ColorVector(255, 0, 0);
var veccB = new ColorVector(0, 0, 255);

// Variables used for lerp loop and appending to html
var percent = 0;
var speed = .01;
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var backwards = false;

// The animation loop for shape and color
function lerpLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    percent += speed;
    if (percent >= 1 && !backwards) {
        backwards = true;
        speed = -.01
    }
    if (percent <= 0 && backwards) {
        backwards = false;
        speed = .01;
    }

    var color = lerpColor(veccA, veccB, percent);
    ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";

    var shaperesult = [shape1.length];

    for (i = 0; i < shape1.length; i++) {
        result = lerp(shape1[i], shape2[i], percent);
        shaperesult[i] = result;
    }
    drawShape(shaperesult);

}


// draws the circle to indicate a point on the canvas
function drawCircle(canvasX, canvasY) {
    ctx2 = canvas.getContext('2d');
    ctx2.beginPath();
    ctx2.strokeRect(canvasX - 2.5, canvasY - 2.5, 5, 5);
    ctx2.closePath();
    ctx2.stroke();
}

// Draw the shape when the array is full of vectors
function drawShape(shape) {
    ctx.beginPath();
    ctx.moveTo(shape[0].x, shape[0].y);
    for (i = 1; i < shape.length; i++) {
        ctx.lineTo(shape[i].x, shape[i].y);
    }
    ctx.fill();
    ctx.closePath();
}


//add mousedown event and append properties to html
function setup() {
    canvas.addEventListener('mousedown', doMouseDown);
    canvas.style.background = "rgb(0,0,0)";


    var theInput = document.getElementById("s1");
    var theColor = theInput.value;
    theInput.addEventListener("input", function () {

        // regex and logic credit to http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb  User Tim Down , Comment updated December 3rd 2012
        //takes hex string and groups rgb values and then parses them using hex radix       
        function hextorgb(hexvalue) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexvalue);
            return result ? {
                red: parseInt(result[1], 16),
                green: parseInt(result[2], 16),
                blue: parseInt(result[3], 16)
            } : null;

        }

        veccA = new ColorVector(hextorgb(theInput.value).red, hextorgb(theInput.value).green, hextorgb(theInput.value).blue);

    }, false);

    var theInput2 = document.getElementById("s2");
    var theColor2 = theInput2.value;
    theInput2.addEventListener("input", function () {

        // regex and logic credit to http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb  User Tim Down , Comment updated December 3rd 2012
        //takes hex string and groups rgb values and then parses them using hex radix
        function hextorgb(hexvalue) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexvalue);
            return result ? {
                red: parseInt(result[1], 16),
                green: parseInt(result[2], 16),
                blue: parseInt(result[3], 16)
            } : null;

        }

        veccB = new ColorVector(hextorgb(theInput2.value).red, hextorgb(theInput2.value).green, hextorgb(theInput2.value).blue);

    }, false);

}

// restes the canvas and shape arrays
function changepoints() {
    percent = 0;
    clearInterval(loop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var num = document.getElementById("numpoints").value;
    shape1 = [num];
    shape1.length = num;
    shape2 = [num];
    shape2.length = num;
    currentpoint = 0;
    onshape1 = true;
}



// if shape 1 or 2 is not full of points add the point using current cursor location
//when a shape has all its points draw the shape and reset the current point
//When both shapes have been drawn start the interval on the LERPloop
function doMouseDown(event) {
    if (shape2[shape1.length - 1] === undefined) {
        canvasX = event.pageX - canvas.offsetLeft;
        canvasY = event.pageY - canvas.offsetTop;


        if (onshape1) {
            ctx.strokeStyle = "rgb(255,0,0)";
            ctx.fillStyle = "rgb(" + veccA.r + "," + veccA.g + "," + veccA.b + ")";

            shape1[currentpoint] = new Vector(canvasX, canvasY);
            drawCircle(canvasX, canvasY);

        } else {
            ctx.strokeStyle = "rgb(0,0,255)";
            shape2[currentpoint] = new Vector(canvasX, canvasY);
            drawCircle(canvasX, canvasY);

        }


        currentpoint++;

        if (currentpoint >= shape1.length) {
            currentpoint = 0;
            if (onshape1) {
                drawShape(shape1);
            } else {
                ctx.fillStyle = "rgb(" + veccB.r + "," + veccB.g + "," + veccB.b + ")";
                drawShape(shape2);
                loop = setInterval(lerpLoop, 10);
            }
            onshape1 = false;

        }
    }

}


setup();
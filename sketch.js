
// credit https://www.shadertoy.com/view/Mt2XDV  Created by RafaSKB in 2015-11-05

// this variable will hold our shader object
let emShader;
let ddShader;
// this variable will hold our webcam video
let cam;
let fontVCR;
let pg0, pg1, pg2;
const textPadding = 20;
emShaderActive = false;
ddShaderActive = false;
const hudGreen = [15, 252, 3];
let textToDisplay = '';

let controlsVisible = false;
let hideCountdown = 0;
const maxCountdown = 10;

console.log(encodeURI("hunter//killer"));

const queryString = window.location.search;
const params = {};
if (queryString.length > 1) {
    
    console.log(queryString);

    var vars = queryString.substring(1).split('&');
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    console.log(params);
}
const defaultStartingText = "YOUR\nTEXT\nHERE";
params.startingtext ? setText(params.startingtext) : setText(defaultStartingText);

function showControls(event) {
    controlWrapperElement = document.getElementById('controlWrapper');
    controlWrapperElement.hidden = false;
    controlsVisible = true;
    console.log('show controls called ' + hideCountdown);
    var x = setInterval(function() {
        if (hideCountdown === 0) {
            clearInterval(x);
            hideControls()
        }
        hideCountdown = hideCountdown - 1;
    }, 1000);   
}

function spitOutLink() {
    const toSpitOut = window.location.origin + '?startingtext=' + encodeURIComponent(textToDisplay);
    console.log(toSpitOut);
    const tempElementId = 'tempwhatever'
    const copyText = document.getElementById('clipboardfield');
    copyText.hidden = false;
    copyText.value = toSpitOut;
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    /* Copy the text inside the text field */
    document.execCommand("copy");
    copyText.hidden = true;
    /* Alert the copied text */
    // alert("Copied the text: " + copyText.value);
    // Removes an element from the document
    
}

function hideControls() {
    controlWrapperElement = document.getElementById('controlWrapper');
    controlWrapperElement.hidden = true;
    controlsVisible = false;
}

document.addEventListener('click', function() {
    hideCountdown = maxCountdown;
    if (!controlsVisible) showControls();
});
document.addEventListener('keydown', function() {
    hideCountdown = maxCountdown;
    if (!controlsVisible) showControls();
});

function toggleEM() {
    emShaderActive = !emShaderActive;
}

function toggleDD() {
    ddShaderActive = !ddShaderActive;
}

function preload() {
    // load the shader
    fontVCR = loadFont('assets/VCR_OSD_MONO_1.001.ttf');
    ddShader = loadShader('assets/displayDistort.vert', 'assets/displayDistort.frag');
    emShader = loadShader('assets/em.vert', 'assets/em.frag');
}

function setup() {
    // shaders require WEBGL mode to work
    createCanvas(1280, 720, WEBGL);
    noStroke();
    cam = createCapture(VIDEO);
    pg0 = createGraphics(width, height);
    pg1 = createGraphics(width, height, WEBGL);
    pg2 = createGraphics(width, height, WEBGL);
    cam.size(width, height);
    pg0.strokeWeight(3);
    pg0.stroke(0);
    pg0.textAlign(RIGHT);
    pg0.textFont(fontVCR);
    pg0.textSize(70);
    pg0.fill(...hudGreen);
    cam.hide();
}
function screenText(textParams, target, horizontalLocation, verticalLocation) {
    target.push();
    let textX = 0;
    let textY = 0;
    let xAlign = LEFT;
    switch (horizontalLocation) {
        case 'LEFT':
            target.textAlign(LEFT);
            xAlign = LEFT;
            textX = 0 + textPadding;
            break;
        case 'RIGHT':
            target.textAlign(RIGHT);
            xAlign = RIGHT;
            textX = target.width - textPadding;
            break;
        case 'CENTER':
            target.textAlign(CENTER);
            xAlign = CENTER;
            textX = target.width / 2;
            break;
        default:
            break;
    }
    switch (verticalLocation) {
        case 'TOP':
            target.textAlign(xAlign, TOP);
            textY = 0 + textPadding;
            break;
        case 'BOTTOM':
            target.textAlign(xAlign, BOTTOM);
            textY = target.height - textPadding;
            break;
        case 'CENTER':
            target.textAlign(xAlign, CENTER);
            textY = target.height / 2;
            break;
        default:
            break;
    }
    target.text(textParams, textX, textY);
    target.pop();
}
function radarWidget(target) {
    const radarWidth = 200;

    target.push();
    // target.rectMode(CENTER);
    target.noFill();
    target.stroke(...hudGreen);
    target.translate(target.width - 110-300, 110);
    for (let radius = radarWidth; radius > 0; radius -= 50) {
        target.circle(0, 0, radius);
    }
    target.circle(0, 0, 150);
    target.circle(0, 0, 100);
    target.circle(0, 0, 50);
    // target.circle(0, 0, 10);
    target.fill(...hudGreen);
    target.triangle(0, -10, -8, 8, 8, 8);
    target.noFill();
    const pulseRadius = (millis() / 7 % 500);
    if (pulseRadius <= radarWidth) {
        target.circle(0, 0, pulseRadius);
    }
    target.angleMode(DEGREES);
    target.rotate((millis() / 100) % 360);
    for (let lineAlpha = 0; lineAlpha <= 256; lineAlpha += 10) {
        target.stroke(...hudGreen, lineAlpha);
        target.rotate(1);
        target.line(0, 0, 0, radarWidth/2);
    }
    target.pop();
}

function barWidget(target) {
    target.push();
    target.translate(300, 0);
    const maxHeight = 70;
    const barWidth = 20;
    const barPadding = 15;
    const barCount = 4;
    let actualHeight;
    const milli = millis();
    const speeds = [1000, 802, 600, 300];
    for (let index = 0; index <= barCount; index++) {
        actualHeight = (Math.sin(milli / speeds[index]) + 1) / 2 * maxHeight;
        target.rect(textPadding + index * (barWidth + barPadding), maxHeight - actualHeight + textPadding, barWidth, actualHeight);
    }
    target.rect(textPadding, maxHeight + textPadding + 5, barCount * (barWidth + barPadding) - barPadding, 5);
    target.pop();
}

function setText(inputValue) {
    const inputElement = document.getElementById('textinput');
    if (inputValue) {
        inputElement.value = inputValue;
        return;
    } 
    console.log(inputElement.value);
    textToDisplay = inputElement.value;
}
setText();

function corners(target) {
    target.push();
    target.noStroke();
    target.fill(235, 232, 52);
    const cornerLength = 50;
    const cornerThickness = 10;
    target.rect(textPadding, target.height - cornerLength - textPadding, cornerThickness, cornerLength);
    target.rect(textPadding, target.height - cornerLength - textPadding + cornerLength - cornerThickness, cornerLength, cornerThickness);
    target.pop();
}


function draw() {
    let target = pg0;
    pg0.push();
    pg0.background(51);
    pg0.image(cam, 0, 0, width, width * cam.height / cam.width);
    // screenText('YOUR', pg0, 'LEFT', 'BOTTOM');
    if (textToDisplay) {
        screenText(textToDisplay, pg0, 'CENTER', 'BOTTOM');
    }
    // screenText('HERE', pg0, 'RIGHT', 'BOTTOM');
    barWidget(pg0);
    radarWidget(pg0);
    corners(pg0);
    pg0.pop();

    if (emShaderActive !== undefined && emShaderActive) {
        emShader.setUniform('tex0', target);
        emShader.setUniform('iTime', millis() / 1000.0);
        pg1.shader(emShader);
        pg1.rect(0, 0, width, height);
        target = pg1;
    }
    if (ddShaderActive !== undefined && ddShaderActive) {
        ddShader.setUniform('tex0', target);
        ddShader.setUniform('iTime', millis() / 1000.0);
        pg2.shader(ddShader);
        pg2.rect(0, 0, width, height);
        target = pg2;
    }

    // shader(emShader);
    // shader(ddShader);
    // rect gives us some geometry on the screen
    // rect(0,0,width,height);
    image(target, -width / 2, -height / 2); // webGL mode requires weird offset parameters
    // image(pg2, 0, height / 2, img.width / 2, img.height / 2);
}

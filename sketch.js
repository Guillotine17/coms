
// credit https://www.shadertoy.com/view/Mt2XDV  Created by RafaSKB in 2015-11-05

// this variable will hold our shader object
let emShader;
let ddShader;
// this variable will hold our webcam video
let cam;
let fontVCR;
let pg0, pg1, pg2;
const textPadding = 20;
emShaderActive = true;
ddShaderActive = true;
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
    pg0.fill(15, 252, 3);
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
function barWidget(target) {
    const maxHeight = 70;
    const barWidth = 20;
    const barPadding = 15;
    const barCount = 4;
    let actualHeight;
    const milli = millis();
    const speeds = [1000, 802, 600, 300];
    for (let index = 0; index <= barCount; index++) {
        actualHeight = (Math.sin(milli/ speeds[index]) + 1) / 2 * maxHeight;
        target.rect(textPadding + index * (barWidth + barPadding), maxHeight - actualHeight + textPadding, barWidth, actualHeight);
    }
    target.rect(textPadding, maxHeight+textPadding+barPadding, barCount* (barWidth+barPadding), barPadding);
}
function draw() {
    let target = pg0;
    pg0.push();
    pg0.image(cam, 0, 0, width, width * cam.height / cam.width);
    screenText('ONLY', pg0, 'LEFT', 'BOTTOM');
    screenText('GOD', pg0, 'CENTER', 'BOTTOM');
    screenText('FORGIVES', pg0, 'RIGHT', 'BOTTOM');
    barWidget(pg0);
    pg0.pop();

    if (emShaderActive !== undefined && emShaderActive) {
        emShader.setUniform('tex0', target);
        emShader.setUniform("iTime", millis() / 1000.0);
        pg1.shader(emShader);
        pg1.rect(0, 0, width, height);
        target = pg1;
    }
    if (ddShaderActive !== undefined && ddShaderActive) {
        ddShader.setUniform('tex0', target);
        ddShader.setUniform("iTime", millis() / 1000.0);
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


let fr = 60;
let stopper;
let shadows = [];
class Move {
    constructor(amp, freq, theta) {
        this.amp = amp;
        this.freq = freq;
        this.theta = theta;
    }
}
let i;
var sliders = [];
let p = []
let div1
let div2
let div3
let div0
let speed;
let info;

let isplay = true;

function setup() {
    div0 = createDiv()
    div1 = createDiv()
    sliders[0] = createSlider(0, 2, 1, 0.05);
    p[0] = createP(`amp1 = ${sliders[0].value()}`)
    sliders[1] = createSlider(0, 2, 0.5, 0.02);
    p[1] = createP(`freq1 = ${sliders[1].value()}`)
    sliders[2] = createSlider(0, 3.141 * 2, 0, 0.01);
    p[2] = createP(`theta1 = ${sliders[2].value()}`)

    div2 = createDiv()
    sliders[3] = createSlider(0, 2, 0, 0.05);
    p[3] = createP(`amp2 = ${sliders[3].value()}`)
    sliders[4] = createSlider(0, 2, 0, 0.02);
    p[4] = createP(`freq2 = ${sliders[4].value()}`)
    sliders[5] = createSlider(0, 3.141 * 2, 0, 0.01);
    p[5] = createP(`theta2 = ${sliders[5].value()}`)

    div3 = createDiv()
    sliders[6] = createSlider(0, 2, 0, 0.05);
    p[6] = createP(`amp3 = ${sliders[6].value()}`)
    sliders[7] = createSlider(0, 2, 0, 0.02);
    p[7] = createP(`freq3 = ${sliders[7].value()}`)
    sliders[8] = createSlider(0, 3.141 * 2, 0, 0.01);
    p[8] = createP(`theta3 = ${sliders[8].value()}`)

    div1.child(sliders[0]).child(p[0]).child(sliders[1]).child(p[1]).child(sliders[2]).child(p[2]).addClass("control")
    div2.child(sliders[3]).child(p[3]).child(sliders[4]).child(p[4]).child(sliders[5]).child(p[5]).addClass("control")
    div3.child(sliders[6]).child(p[6]).child(sliders[7]).child(p[7]).child(sliders[8]).child(p[8]).addClass("control")
    div0.child(div1).child(div2).child(div3);
    div0.addClass("bigContainer")
    for (let i = 0; i < 9; i++) {
        p[i].addClass("p");

    }

    stopper = createButton('STOP');
    stopper.mousePressed(togglePlay);
    stopper.addClass("stopper")


    createCanvas(displayWidth, displayHeight);
    angleMode(RADIANS);
    radio = createRadio();
    radio.position(0, 0)
    radio.option('curve');
    radio.option('tečky');
    radio.option("just obrázek")
    radio.selected("just obrázek")

    radio.style('width', '120px');
    radio.addClass("radio")

    speed = createSlider(0.5, 15, 5, 0.5)
    speed.position(width / 2 - speed.elt.offsetWidth, 8 * height / 10);
    info = createP();
    info.addClass("info")
    info.position(width / 2, height / 20);
    let a1
    let a2
    let a3
}

function draw() {
    stroke("black")
    frameRate(fr);
    background(240);
    strokeWeight(4);

    for (let i = 0; i < 3; i++) {
        p[i * 3].html(`amp (yₘ)${i + 1} = ${sliders[i * 3].value()} m`);
        p[i * 3 + 1].html(`freq (ω)${i + 1} = ${sliders[i * 3 + 1].value()} s⁻¹`);
        p[i * 3 + 2].html(`phi (φ)${i + 1} = ${sliders[i * 3 + 2].value()} rad`);

    }

    info.html(`y1(t) = ${sliders[0].value()} sin(${sliders[1].value()}t + ${sliders[2].value()})<br>
               y2(t) = ${sliders[3].value()} sin(${sliders[4].value()}t + ${sliders[5].value()})<br>
               y2(t) = ${sliders[6].value()} sin(${sliders[7].value()}t + ${sliders[8].value()})`)

    let v0 = createVector(width / 4, height / 2);
    let mov1 = new Move(sliders[0].value(), sliders[1].value(), sliders[2].value());
    let mov2 = new Move(sliders[3].value(), sliders[4].value(), sliders[5].value());
    let mov3 = new Move(sliders[6].value(), sliders[7].value(), sliders[8].value());
    if (isplay) {
        a1 = (millis() / 1000 * TWO_PI * mov1.freq);
        a2 = (millis() / 1000 * TWO_PI * mov2.freq);
        a3 = (millis() / 1000 * TWO_PI * mov3.freq);
    } else {
        a1 = 0
        a2 = 2
        a3 = 0
    }
    let v1 = createmyVec(mov1.amp, mov1.theta + a1);
    let v2 = createmyVec(mov2.amp, mov2.theta + a2);
    let v3 = createmyVec(mov3.amp, mov3.theta + a3);
    let ypos3 = v0.y + v2.y + v1.y + v3.y;
    let xpos3 = v0.x + v2.x + v1.x + v3.x;

    drawArrow(v0, v1, "black")
    if (mov2.amp > 0) {
        drawArrow(v1.add(v0), v2, "#002F63")
    } else { v1.add(v0) }
    if (mov3.amp > 0) {
        drawArrow(v2.add(v1), v3, "#003D82")
    }
    else { v2.add(v1) }
    circle(width / 2, ypos3, height / 40)
    strokeWeight(1)
    line(xpos3, ypos3, width / 2, ypos3)

    strokeWeight(4);

    //tečky
    if (radio.value() == "tečky" && isplay) {
        if (frameCount % 2 == 0) {
            shadows.unshift(ypos3)
        }
        if (shadows.length >= width / 2 / speed.value()) { shadows.pop() }
        shadows.forEach(function (val, index) { point((width / 2 + index * speed.value()), val); })
    }

    //curve
    if (radio.value() == "curve" && isplay) {
        beginShape();
        noFill();
        shadows.unshift(ypos3)
        if (shadows.length >= width / 2 / speed.value()) { shadows.pop() }
        shadows.forEach(function (val, index) { vertex((width / 2 + index * speed.value()), val); })
        endShape();
    }

    if (radio.value() == "just obrázek" || !isplay) {
        shadows = [];
    }
    strokeWeight(1);
    stroke("#0C53A6")
    line(v0.x, v0.y, width, v0.y)

}




//create vec using idk
function createmyVec(amp, theta) {
    var vec = createVector(cos(theta), -sin(theta));
    vec.setMag(amp * 100);
    return vec;
}

// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y)
    strokeWeight(3)
    line(0, 0, vec.x, vec.y);
    noFill()
    strokeWeight(1);
    circle(0, 0, vec.mag() * 2)
    rotate(vec.heading());
    let arrowSize = 10;
    translate(vec.mag() - arrowSize, 0);
    fill(myColor)
    stroke(myColor);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}

function togglePlay() {
    if (isplay) {
        isplay = false
        stopper.html("PLAY")
    } else {
        isplay = true
        stopper.html("STOP")

    }


}
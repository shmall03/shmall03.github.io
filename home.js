let menu, button1, button2, montFont, montFontExtraLight, montFontAlt, img, titleSize, page;
let bgBalls = [], backgroundBallCount = 40, bgBallsVisual = true;

function preload() {
    montFont = loadFont('Montserrat-Light.otf');
    montFontExtraLight = loadFont('Montserrat-ExtraLight.otf');
    montFontAlt = loadFont('MontserratAlternates-Medium.otf');
    img = loadImage('Ben Pony.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    objectSetup();
    page = 0;
}

function objectSetup() {
    menu = new Menu(width/24, width/24, width/48);
    button1 = new LinkButton(width/3, 3*height/5, width/4, height/20, 'weird');
    button2 = new LinkButton(2*width/3, 3*height/5, width/4, height/20, 'This is not a game.');
    resetBackgroundBalls();
}

function resetBackgroundBalls(x = width / 2, y = height / 2) {
    if (x < 51) {
        x = 51;
    } else if (x > width - 51) {
        x = width - 51;
    }
    if (y < 51) {
        y = 51;
    } else if (y > height - 51) {
        y = height - 51;
    }
    for (let i = 0; i < backgroundBallCount; i++) {
        bgBalls[i] = new BackgroundBall(x, y);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    objectSetup();
  }

function mousePressed() {
    menu.checkClick();
    button1.checkClick();
    button2.checkClick();
    resetBackgroundBalls(mouseX, mouseY);

}

function draw() {
    background(40);
    for (let i = 0; i < bgBalls.length / 2; i++) {
        bgBalls[i].update();
        bgBalls[i].display();
    }

    titleSize = width / 48;

    if (page != 2) {
        noStroke();
        fill(220);
        textAlign(CENTER, CENTER);
        textFont(montFontAlt);
        textSize(titleSize);
        text('Ben Smith', width/2, width/24);
        stroke(220);
        strokeWeight(6);
        noFill();
        line((menu.x - menu.w/2) / 2, width/12, width - (menu.x - menu.w/2) / 2, width/12);
    }

    if (page == 0) {
        document.title = 'Ben Smith | Home';
        noStroke();
        fill(220);
        textAlign(RIGHT, CENTER);
        textFont(montFontAlt);
        textSize(3*titleSize/5);
        text('Home', 23*width/24, width/24);

        noStroke();
        fill(220);
        textAlign(LEFT, CENTER);
        textFont(montFont);
        textSize(2*titleSize/3);
        textLeading(titleSize);
        text("Hello world!\n\n\tThis is my localhost test site, which runs primarily using JavaScript, also making use of the p5.js library. I will be using this site for my work in the 'Creative Coding 1' module as part of my BA in Music and Sound Recording at the University of York.\n\n\tClicking on the button in the top-left of the page will open a menu, so you can change pages to one of the others I have available.",
            width/24, width/8, width/2, 9*titleSize);
        image(img, 3*width/5, height/4, width/3, width/3);
    } else if (page == 1) {
        document.title = 'Ben Smith | Listen';
        noStroke();
        fill(220);
        textAlign(RIGHT, CENTER);
        textFont(montFontAlt);
        textSize(3*titleSize/5);
        text('Listen', 23*width/24, width/24);

        noStroke();
        fill(220);
        textAlign(LEFT, CENTER);
        textFont(montFont);
        textSize(2*titleSize/3);
        textLeading(titleSize);
        text(`Unfortunately, I have not yet implemented the capabilities on this website to allow you to listen to my music. For now, go to either of the links below to listen on YouTube.`,
            width/24, width/8, 22*width/24, 2.4*titleSize);
        button1.display();
        button2.display();
    } else if (page == 2) {
        document.title = 'Ben Smith | Balls';
    } else if (page == 3) {
        document.title = 'Ben Smith | Contact';
        noStroke();
        fill(220);
        textAlign(RIGHT, CENTER);
        textFont(montFontAlt);
        textSize(3*titleSize/5);
        text('Contact', 23*width/24, width/24);

        noStroke();
        fill(220);
        textAlign(LEFT, CENTER);
        textFont(montFont);
        textSize(2*titleSize/3);
        textLeading(titleSize);
        text(`Email:\t\tbs1446@york.ac.uk
            Phone:\t+44 7392 063583`,
            width/24, width/8, 2*width/5, 2.4*titleSize);
    } else {
        alert(`There has been an error in which page to display.\nThe page has reset to the home page.`);
        page = 0;
    }

    let pageBlockAlpha = 0;
    if (menu.opened) {
        pageBlockAlpha = 220;
        //drawingContext.filter = 'blur(5px)';
    }
    noStroke();
    fill(40, pageBlockAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);

    menu.display();
}

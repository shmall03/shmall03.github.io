class Menu {
    constructor(centerX, centerY, menuW) {
        this.x = centerX;
        this.y = centerY;
        this.w = menuW;
        this.opened = false;
        this.checkRadius = menuW / 2;
        this.center = createVector(this.x, this.y);

        this.display = function() {
            noStroke();
            if (this.opened) {
                if (this.hover()) {
                    fill(160);
                } else {
                    fill(220);
                }
                circle(this.x, this.y, 5 * this.w / 2);

                textAlign(CENTER, CENTER)
                textFont(montFontAlt);
                textSize(2*titleSize);
                noStroke();
                fill(40);
                rectMode(CORNER);
                rect(width/3, 0, width/3, height);
                fill(220);
                if (this.pageSelctionHover() == 0) {
                    rect(width/3, 0, width/3, height/4  );
                } else if (this.pageSelctionHover() == 1) {
                    rect(width/3, height/4, width/3, height/4);
                } else if (this.pageSelctionHover() == 2) {
                    rect(width/3, 2*height/4, width/3, height/4);
                } else if (this.pageSelctionHover() == 3) {
                    rect(width/3, 3*height/4, width/3, height/4);
                }

                fill(27,  153, 139);
                text('Home', width/2, height/8);
                arc(this.x, this.y, 2 * this.w, 2 * this.w, -3*PI/4, -PI/4);

                fill(64,  89,  173);
                text('Listen', width/2, 3*height/8);
                arc(this.x, this.y, 2 * this.w, 2 * this.w, -PI/4, PI/4);

                fill(169, 112, 255);
                text('Balls', width/2, 5*height/8);
                arc(this.x, this.y, 2 * this.w, 2 * this.w, PI/4, 3*PI/4);

                fill(165, 1,   4);
                text('Contact', width/2, 7*height/8);
                arc(this.x, this.y, 2 * this.w, 2 * this.w, 3*PI/4, 5*PI/4);

                stroke(220);
                strokeWeight(6);
                line(width/3, 0, width/3, height);
                line(2*width/3, 0, 2*width/3, height);
                line(width/3, 3, 2*width/3, 3);
                line(width/3, height/4, 2*width/3, height/4);
                line(width/3, 2*height/4, 2*width/3, 2*height/4);
                line(width/3, 3*height/4, 2*width/3, 3*height/4);
                line(width/3, height - 3, 2*width/3, height - 3);
                return;
            }

            fill(220);
            if (this.hover()) {
                fill(160);
            }
            circle(this.x, this.y, this.w);
        }

        this.hover = function() {
            if (dist(mouseX, mouseY, this.x, this.y) < this.checkRadius) {
                return true;
            }
            return false;
        }

        this.checkClick = function() {
            if (this.opened && width/3 < mouseX && mouseX < 2*width/3) {
                if (mouseY < height/4) {
                    page = 0;
                } else if (height/4 < mouseY && mouseY < 2*height/4) {
                    page = 1;
                } else if (2*height/4 < mouseY && mouseY < 3*height/4) {
                    page = 2;
                } else if (3*height/4 < mouseY) {
                    page = 3;
                }
            }
            if (this.hover()) {
                this.opened = true;
                this.checkRadius = 5 * this.w / 4;
                return;
            }
            this.opened = false;
            this.checkRadius = this.w / 2;
        }

        this.pageSelctionHover = function() {
            if (width/3 < mouseX && mouseX < 2*width/3) {
                if (mouseY < height/4) {
                    return 0;
                } else if (mouseY > 3*height/4) {
                    return 3;
                } else if (height/4 < mouseY && mouseY < 2*height/4) {
                    return 1;
                } else if (2*height/4 < mouseY && mouseY < 3*height/4) {
                    return 2;
                }
            }
            return -1;
        }
    }
}

class LinkButton {
    constructor(centerX, centerY, buttonWidth, buttonHeight, selection) {
        this.x = centerX;
        this.y = centerY;
        this.w = buttonWidth;
        this.h = buttonHeight;
        this.selection = selection;

        if (this.selection == 'weird') {
            this.link = 'https://youtu.be/Wy5Faixjeb4';
        } else if (this.selection == 'This is not a game.') {
            this.link = 'https://youtu.be/VtDSdoc1ObQ';
        } else {
            this.link = null;
        }

        this.display = function() {
            noStroke();
            fill(220);
            if (this.hover()) {
                fill(160);
            }
            rectMode(CENTER);
            rect(this.x, this.y, this.w, this.h);

            fill(40);
            textAlign(CENTER, CENTER);
            textFont(montFontAlt);
            textSize(3*this.h/5);
            text(this.selection, this.x, this.y);
        }

        this.hover = function() {
            if (page == 1 && this.x - this.w/2 < mouseX && mouseX < this.x + this.w/2 && this.y - this.h/2 < mouseY && mouseY < this.y + this.h/2) {
                return true;
            }
            return false;
        }

        this.checkClick = function() {
            if (this.hover() && this.link != null) {
                window.open(this.link);
            } else if (this.hover() && this.link == null) {
                alert('There has been an error in the selection of a piece of my music.\nThe page has been reset to the home page.');
                page = 0;
            }
        }
    }
}

class BackgroundBall {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xSpeed = random(-5, 5);
        this.ySpeed = random(-5, 5);
        this.size = random(10, 100);
        this.col = color(random(255), random(255), random(255), random(80, 160));

        this.update = function() {
            if (!bgBallsVisual) {
                return;
            }
            if (menu.opened) {
                return;
            }
            
            this.x += this.xSpeed;
            this.y += this.ySpeed;

            if (this.x - this.size / 2 < 0 || this.x + this.size / 2 > width) {
                this.xSpeed *= -random(0.8, 1.2);
            }
            if (this.y - this.size / 2 < 0 || this.y + this.size / 2 > height) {
                this.ySpeed *= -random(0.8, 1.2);
            }

            if (this.xSpeed > 10) {
                this.xSpeed = 10;
            }
            if (this.xSpeed < -10) {
                this.xSpeed = -10;
            }
            if (this.ySpeed > 10) {
                this.ySpeed = 10;
            }
            if (this.ySpeed < -10) {
                this.ySpeed = -10;
            }
            
            if (0 < this.xSpeed && this.xSpeed < 2) {
                this.xSpeed = 2;
            } else if (-2 < this.xSpeed && this.xSpeed < 0) {
                this.xSpeed = -2;
            }
            if (0 < this.ySpeed && this.ySpeed < 2) {
                this.ySpeed = 2;
            } else if (-2 < this.ySpeed && this.ySpeed < 0) {
                this.ySpeed = -2;
            }
        }

        this.display = function() {
            if (!bgBallsVisual) {
                return;
            }
            noStroke();
            fill(this.col);
            circle(this.x, this.y, this.size);
        }
    }
}
//aos

  AOS.init();



//niceScroll
  $("html").niceScroll({
       autohidemode: false,
  cursorcolor:"#233b6e", 
  cursorwidth: "8", 
  cursorborder: "",
       cursoropacitymax:0.7,
});



// nav & smooth scroll - https://byprimer.co/blog/navigation-smooth-scrolling-jquery/
$(document).ready(function() {
	
  var headerHeight = $('nav').outerHeight(); // Target your header navigation here
	
  $('#nav_smooth li a').click(function(e) {
  	
  	var targetHref   = $(this).attr('href');
	  
	$('html, body').animate({
		scrollTop: $(targetHref).offset().top - headerHeight // Add it to the calculation here
	}, 1000);
    
    e.preventDefault();
  });
});



//Go To Top btn & smooth scroll - refer https://codepen.io/desirecode/pen/MJPJqV
$(document).ready(function(){ 
    $(window).scroll(function(){ 
        if ($(this).scrollTop() > 100) { 
            $('#backtop').fadeIn(); 
        } else { 
            $('#backtop').fadeOut(); 
        } 
    }); 
    $('#backtop').click(function(){ 
        $("html, body").animate({ scrollTop: 0 }, 600); 
        return false; 
    }); 
});



// fireworks canvas - https://codepen.io/cardenascg/pen/WNbMVBy

// fun options!
const PARTICLES_PER_FIREWORK = 150; // 100 - 400 or try 1000
const FIREWORK_CHANCE = 0.02; // percentage, set to 0 and click instead
const BASE_PARTICLE_SPEED = 0.6; // between 0-4, controls the size of the overall fireworks
const FIREWORK_LIFESPAN = 600; // ms
const PARTICLE_INITIAL_SPEED = 4.5; // 2-8

// not so fun options =\
const GRAVITY = 9.8;


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let disableAutoFireworks = false;
let resetDisable = 0;

let loop = () => {
  
  if (!disableAutoFireworks && Math.random() < FIREWORK_CHANCE) {
    createFirework();
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((particle, i) => {
    particle.animate();
    particle.render();
    if (particle.y > canvas.height 
        || particle.x < 0 
        || particle.x > canvas.width
        || particle.alpha <= 0
       ) {
      particles.splice(i, 1);
    }
  });
  
  requestAnimationFrame(loop);
  
};

let createFirework = (
    x = Math.random() * canvas.width,
    y = Math.random() * canvas.height
  ) => {
  
  let speed = (Math.random() * 2) + BASE_PARTICLE_SPEED;
  let maxSpeed = speed;

  let red = ~~(Math.random() * 255);
  let green = ~~(Math.random() * 255);
  let blue = ~~(Math.random() * 255);
  
  // use brighter colours
  red = (red < 150 ? red + 150 : red);
  green = (green < 150 ? green + 150 : green);
  blue = (blue < 150 ? blue + 150 : blue);

  // inner firework
  for (let i = 0; i < PARTICLES_PER_FIREWORK; i++) {
    let particle = new Particle(x, y, red, green, blue, speed);
    particles.push(particle);

    maxSpeed = (speed > maxSpeed ? speed : maxSpeed);
  }

  // outer edge particles to make the firework appear more full
  for (let i = 0; i < 40; i++) {
    let particle = new Particle(x, y, red, green, blue, maxSpeed, true);
    particles.push(particle);
  }
  
};

class Particle {
  
  constructor(
    x = 0,
    y = 0, 
    red = ~~(Math.random() * 255), 
    green = ~~(Math.random() * 255), 
    blue = ~~(Math.random() * 255), 
    speed, 
    isFixedSpeed
  ) {
    
    this.x = x;
    this.y = y;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = 0.05;
    this.radius = 1 + Math.random();
    this.angle = Math.random() * 360;
    this.speed = (Math.random() * speed) + 0.1;
    this.velocityX = Math.cos(this.angle) * this.speed;
    this.velocityY = Math.sin(this.angle) * this.speed;
    this.startTime = (new Date()).getTime();
    this.duration = 180;
    this.currentDiration = 0;
    this.dampening = 30; // slowing factor at the end
    
    this.colour = this.getColour();
    
    if (isFixedSpeed) {
      this.speed = speed;
      this.velocityY = Math.sin(this.angle) * this.speed;
      this.velocityX = Math.cos(this.angle) * this.speed;
    }
    
    this.initialVelocityX = this.velocityX;
    this.initialVelocityY = this.velocityY;

  }
  
  animate() {
    
    this.currentDuration = (new Date()).getTime() - this.startTime;
    
    // initial speed kick
    if (this.currentDuration <= 200) {
      
      this.x += this.initialVelocityX * PARTICLE_INITIAL_SPEED;
      this.y += this.initialVelocityY * PARTICLE_INITIAL_SPEED;
      this.alpha += 0.01;

      this.colour = this.getColour(240, 240, 240, 0.9);
      
    } else {
      
      // normal expansion
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.colour = this.getColour(this.red, this.green, this.blue, 0.4 + (Math.random() * 0.3));
      
    }
    
    this.velocityY += GRAVITY / 1000;
    
    // slow down particles at the end
    if (this.currentDuration >= this.duration) {
      this.velocityX -= this.velocityX / this.dampening; 
      this.velocityY -= this.velocityY / this.dampening;
    }
    
    if (this.currentDuration >= this.duration + this.duration / 1.1) {
      
      // fade out at the end
      this.alpha -= 0.02;
      this.colour = this.getColour();
      
    } else {
      
      // fade in during expansion
      if (this.alpha < 1) {
        this.alpha += 0.03;
      }
      
    }
  }
  
  render() {
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.colour;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.getColour(this.red + 150, this.green + 150, this.blue + 150, 1);
    ctx.fill();
    
  }
  
  getColour(red, green, blue, alpha) {
    
    return `rgba(${red || this.red}, ${green || this.green}, ${blue || this.blue}, ${alpha || this.alpha})`;
    
  }
  
}

let updateCanvasSize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 150;
};


// run it!

updateCanvasSize();
$(window).resize(updateCanvasSize);
$(canvas).on('click', (e) => {
  
  createFirework(e.clientX, e.clientY);
  
  // stop fireworks when clicked, re-enable after short time
  disableAutoFireworks = true;
  clearTimeout(resetDisable);
  resetDisable = setTimeout(() => {
    disableAutoFireworks = false;
  }, 5000);
  
});

loop();


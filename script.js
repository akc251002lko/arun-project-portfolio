// Particle network background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 80;
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
    this.color = `rgba(79, 140, 255, ${Math.random() * 0.5 + 0.2})`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79, 140, 255, ${0.15 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  drawLines();
  animationId = requestAnimationFrame(animateParticles);
}
animateParticles();

// Scroll progress and back-to-top
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  document.querySelector('.scroll-progress').style.width = progress + '%';
  document.querySelector('.back-to-top').classList.toggle('visible', scrollTop > 500);
});

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
});
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
}));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
  });
});

// Typewriter effect
const roles = ['Student', 'Developer', 'Creator', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedElement = document.getElementById('typed');
function type() {
  const current = roles[roleIndex];
  if (isDeleting) typedElement.textContent = current.substring(0, charIndex--);
  else typedElement.textContent = current.substring(0, charIndex++);
  if (!isDeleting && charIndex === current.length) {
    isDeleting = true; setTimeout(type, 1500);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(type, 300);
  } else {
    setTimeout(type, isDeleting ? 100 : 150);
  }
}
type();

// Animated counters
const counters = document.querySelectorAll('.stat-number[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      const duration = 1500;
      const startTime = performance.now();
      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        entry.target.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(updateCounter);
        else entry.target.textContent = target;
      }
      requestAnimationFrame(updateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(counter => counterObserver.observe(counter));

// Scroll reveal animations
const revealElements = document.querySelectorAll('.section-title, .about-card, .skill-card, .project-card, .timeline-content, .contact-info, .contact-form');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// Project filter
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      if (filter === 'all' || categories.includes(filter)) card.style.display = 'flex';
      else card.style.display = 'none';
    });
  });
});

// Project modal
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('#project-modal .modal-close');

const projectDetails = {
  'script-runner': {
    title: 'Script Runner',
    details: `<p>Script Runner is a practical Android + Termux utility designed to manage and execute Python scripts directly from the command line.</p><p><strong>Features:</strong></p><ul><li>List all Python scripts in a directory</li><li>Run scripts with a single command</li><li>Create new script templates</li><li>Edit scripts using built-in text editors</li><li>Integrate with Git for version control</li></ul><p><strong>Technologies used:</strong> Python, Termux, Linux shell scripting.</p><p><strong>Status:</strong> In development.</p>`
  },
  'portfolio': {
    title: 'Personal Portfolio',
    details: `<p>This portfolio website is a continuously evolving public workspace that showcases my projects, experiments, and learning journey.</p><p><strong>Features:</strong></p><ul><li>Responsive design for all devices</li><li>Interactive project filtering</li><li>Clickable skill cards with detailed modals</li><li>Contact form with direct email integration</li><li>Animated particle background and scroll effects</li></ul><p><strong>Sub-projects:</strong></p><ul><li><a href="typing-test/" target="_blank">Developer Typing Test</a> – a 30-second hacker-style typing challenge</li></ul><p><strong>Technologies used:</strong> HTML, CSS, JavaScript, GitHub Pages.</p><p><strong>Status:</strong> Live and continuously updated.</p>`
  },
  'creative-lab': {
    title: 'Creative Coding Lab',
    details: `<p>Creative Coding Lab is a space where I experiment with generative visuals, automation, and AI-assisted workflows.</p><p><strong>Current experiments:</strong></p><ul><li>Generative art using Python libraries like Pillow</li><li>Automated image processing scripts</li><li>AI-generated content and prompts</li><li>Interactive web animations</li></ul><p><strong>Technologies used:</strong> Python, AI tools, creative coding libraries, JavaScript.</p><p><strong>Status:</strong> Exploring and adding new experiments regularly.</p>`
  },
  'ai-cli': {
    title: 'AI Assistant CLI',
    details: `<p>AI Assistant CLI is a command-line assistant that automates repetitive tasks and answers coding questions.</p><p><strong>Planned features:</strong></p><ul><li>Natural language queries</li><li>Code generation and explanation</li><li>Task automation</li><li>Integration with Git and package managers</li></ul><p><strong>Technologies used:</strong> Python, AI APIs, CLI frameworks.</p><p><strong>Status:</strong> Coming soon.</p>`
  },
  'automation-toolkit': {
    title: 'Automation Toolkit',
    details: `<p>The Automation Toolkit is a collection of Python scripts designed to simplify daily tasks.</p><p><strong>Included scripts:</strong></p><ul><li>Bulk file renamer</li><li>Duplicate file finder</li><li>System cleanup utility</li><li>Folder organizer</li><li>Automated backup script</li></ul><p><strong>Technologies used:</strong> Python, OS automation.</p><p><strong>Status:</strong> Actively maintained.</p>`
  },
  'termux-setup': {
    title: 'Termux Setup Scripts',
    details: `<p>Shell scripts to automate initial configuration of Termux on Android.</p><p><strong>What they do:</strong></p><ul><li>Install Python, Node.js, Git</li><li>Set up SSH keys and GitHub</li><li>Configure storage access</li><li>Create useful aliases</li><li>Install popular packages</li></ul><p><strong>Technologies used:</strong> Shell scripting, Termux, Linux.</p><p><strong>Status:</strong> Available.</p>`
  }
};

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const projectKey = card.dataset.project;
    const info = projectDetails[projectKey];
    if (info) {
      modalTitle.textContent = info.title;
      modalBody.innerHTML = info.details;
      modal.classList.remove('hidden');
    }
  });
});

modalClose.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

// Skill modal
const skillModal = document.getElementById('skill-modal');
const skillModalTitle = document.getElementById('skill-modal-title');
const skillModalBody = document.getElementById('skill-modal-body');
const skillModalClose = document.querySelector('#skill-modal .modal-close');
const skillCards = document.querySelectorAll('.skill-card');

const skillDetails = {
  'python': { title: 'Python', details: `<p>Python is my primary language for automation, scripting, and practical tools.</p><p>I use it extensively in Termux for building utilities and exploring creative coding.</p>` },
  'webdev': { title: 'Web Development', details: `<p>HTML, CSS, and JavaScript are the foundation of my web projects.</p><p>I focus on mobile-first responsive design and modern CSS techniques.</p>` },
  'javascript': { title: 'JavaScript', details: `<p>JavaScript powers interactivity in my websites.</p><p>I use vanilla JS and explore modern frameworks for dynamic UIs.</p>` },
  'git': { title: 'Git & GitHub', details: `<p>Version control is essential to my workflow.</p><p>I use Git daily and host projects on GitHub Pages.</p>` },
  'termux': { title: 'Termux & Linux', details: `<p>Termux turns my Android phone into a full Linux dev environment.</p><p>I use it for coding, Git, servers, and package management.</p>` },
  'ai': { title: 'AI-Assisted Development', details: `<p>AI tools accelerate my learning and debugging.</p><p><strong>Tools used:</strong> ChatGPT, Gemini, Claude, Copilot, DeepSeek, and others.</p><p>I manage all creative and technical decisions; AI assists with code.</p>` },
  'creative': { title: 'Creative Coding', details: `<p>I blend code with art using Python and generative techniques.</p><p>Experiments include visual art, image processing, and interactive animations.</p>` }
};

skillCards.forEach(card => {
  card.addEventListener('click', () => {
    const skillKey = card.dataset.skill;
    const info = skillDetails[skillKey];
    if (info) {
      skillModalTitle.textContent = info.title;
      skillModalBody.innerHTML = info.details;
      skillModal.classList.remove('hidden');
    }
  });
});

skillModalClose.addEventListener('click', () => skillModal.classList.add('hidden'));
skillModal.addEventListener('click', (e) => {
  if (e.target === skillModal) skillModal.classList.add('hidden');
});

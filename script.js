// Video Background
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.video-background video');
    if (video) {
        console.log("Video element found");
        
        // Force video to play
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("Video autoplay started successfully");
            })
            .catch(error => {
                console.log("Video autoplay failed:", error);
                // Try to play again after user interaction
                document.addEventListener('click', function() {
                    video.play().catch(e => console.log("Still failed to play:", e));
                }, { once: true });
            });
        }
        
        // Handle video loading
        video.addEventListener('loadeddata', function() {
            console.log("Video loaded successfully");
        });
        
        // Handle video errors
        video.addEventListener('error', function(e) {
            console.log("Video error:", e);
            // If video fails to load, try a different source
            if (video.currentSrc.includes('coverr')) {
                video.src = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-new-york-city-skyline-1230-large.mp4';
                video.load();
            }
        });
        
        // Ensure video is playing when it's visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log("Failed to play on intersection:", e));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(video);
        
        // Add a manual play button for testing
        const playButton = document.createElement('button');
        playButton.textContent = 'Play Video';
        playButton.style.position = 'absolute';
        playButton.style.bottom = '20px';
        playButton.style.right = '20px';
        playButton.style.zIndex = '10';
        playButton.style.padding = '10px 20px';
        playButton.style.background = 'rgba(255, 255, 255, 0.2)';
        playButton.style.border = '1px solid white';
        playButton.style.color = 'white';
        playButton.style.cursor = 'pointer';
        playButton.style.borderRadius = '5px';
        
        playButton.addEventListener('click', function() {
            video.play().catch(e => console.log("Manual play failed:", e));
        });
        
        document.querySelector('.video-background').appendChild(playButton);
    } else {
        console.log("Video element not found");
    }
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Create FormData object
            const formData = new FormData(contactForm);
            
            // Send form data using fetch API
            fetch('send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                if (data.success) {
                    // Show success message
                    alert('Thank you for your submission! We will get back to you soon.');
                    // Reset form
                    contactForm.reset();
                } else {
                    // Show error message
                    alert('There was an error sending your submission. Please try again or contact us directly.');
                }
            })
            .catch(error => {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                // Show error message
                alert('There was an error sending your submission. Please try again or contact us directly.');
                console.error('Error:', error);
            });
        });
    }
});

// Scroll Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .case-study-card, .tech-category').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Add scroll-based header styling
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
}); 
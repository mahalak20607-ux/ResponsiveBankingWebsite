const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
navLinks.classList.toggle("show");
});

// 3D bank card mouse movement
const bankCard = document.getElementById("bankCard");

document.addEventListener("mousemove", (event) => {


if (window.innerWidth <= 760) return;

const x = (window.innerWidth / 2 - event.clientX) / 35;
const y = (window.innerHeight / 2 - event.clientY) / 35;

bankCard.style.transform =
    `rotateY(${-x}deg) rotateX(${y}deg)`;

});

// Reset card when mouse leaves
document.addEventListener("mouseleave", () => {
bankCard.style.transform =
"rotateY(0deg) rotateX(0deg)";
});

// Close mobile menu after clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {


link.addEventListener("click", () => {
    navLinks.classList.remove("show");
});


});

// Simple reveal animation
const revealElements = document.querySelectorAll(
".service-card, .feature-card, .feature-content, .cta"
);

const observer = new IntersectionObserver(
entries => {


    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

},
{
    threshold: 0.15
}


);

revealElements.forEach(element => {


element.style.opacity = "0";
element.style.transform = "translateY(30px)";
element.style.transition = "opacity .7s ease, transform .7s ease";

observer.observe(element);


});

/* =========================================================
   SCENES
========================================================= */

const scenes = {
    intro: document.getElementById("intro"),
    garden: document.getElementById("garden"),
    photo: document.getElementById("photoScene"),
    message: document.getElementById("message"),
    final: document.getElementById("final")
};

const sceneList = [
    scenes.intro,
    scenes.garden,
    scenes.photo,
    scenes.message,
    scenes.final
];


/* =========================================================
   ELEMENTS
========================================================= */

const startBtn = document.getElementById("startBtn");
const photoContinueBtn = document.getElementById("photoContinueBtn");
const continueBtn = document.getElementById("continueBtn");
const yesBtn = document.getElementById("yesBtn");

const progressBar = document.getElementById("progressBar");

const sunflower = document.getElementById("sunflower");
const flowerPetals = document.getElementById("flowerPetals");
const typeText = document.getElementById("typeText");

const petalsContainer = document.getElementById("petals");

const couplePhoto = document.getElementById("couplePhoto");
const photoFrame = document.getElementById("photoFrame");

const answer = document.getElementById("answer");

const cursor = document.getElementById("cursor");


/* =========================================================
   STATE
========================================================= */

let currentScene = 0;
let flowerCompleted = false;
let transitioning = false;
let photoInitialized = false;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let cursorX = mouseX;
let cursorY = mouseY;


/* =========================================================
   CURSOR
========================================================= */

function initializeCursor() {

    if (!cursor) return;

    const interactiveElements =
        document.querySelectorAll(
            "button, .sunflower, .petal"
        );

    interactiveElements.forEach(element => {

        element.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
        });

        element.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
        });

    });


    window.addEventListener("mousemove", event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

    });


    function animateCursor() {

        cursorX +=
            (mouseX - cursorX) * 0.18;

        cursorY +=
            (mouseY - cursorY) * 0.18;

        cursor.style.transform =
            `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}


/* =========================================================
   SCENE CONTROLLER
========================================================= */

const SceneController = {

    show(index) {

        if (
            index < 0 ||
            index >= sceneList.length
        ) {
            return;
        }

        if (
            transitioning ||
            index === currentScene
        ) {
            return;
        }

        transitioning = true;

        const previousScene =
            sceneList[currentScene];

        const nextScene =
            sceneList[index];


        previousScene.classList.remove("active");


        setTimeout(() => {

            nextScene.classList.add("active");

            currentScene = index;


            const progress =
                ((index + 1) / sceneList.length) * 100;

            progressBar.style.width =
                `${progress}%`;


            if (index === 2) {
                PhotoController.enter();
            }

            if (index === 4) {
                FinalSceneController.enter();
            }


            setTimeout(() => {

                transitioning = false;

            }, 850);

        }, 180);
    },


    forceShow(index) {

        sceneList.forEach(scene => {
            scene.classList.remove("active");
        });

        sceneList[index].classList.add("active");

        currentScene = index;

        progressBar.style.width =
            `${((index + 1) / sceneList.length) * 100}%`;
    }
};


/* =========================================================
   TYPEWRITER
========================================================= */

class TypeWriter {

    constructor(element, text, speed = 38) {

        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;

    }


    start() {

        if (!this.element) return;

        this.element.textContent = "";

        this.index = 0;

        this.write();
    }


    write() {

        if (
            this.index >= this.text.length
        ) {
            return;
        }


        this.element.textContent +=
            this.text.charAt(this.index);

        this.index++;


        setTimeout(
            () => this.write(),
            this.speed
        );
    }
}


/* =========================================================
   FLOWER CONTROLLER
========================================================= */

const FlowerController = {

    reset() {

        flowerCompleted = false;

        if (!flowerPetals) return;

        const petals =
            flowerPetals.querySelectorAll(".petal");


        petals.forEach(petal => {

            petal.style.animation = "none";

            void petal.offsetWidth;

            petal.style.animation = "";

        });
    },


    grow() {

        flowerCompleted = false;


        setTimeout(() => {

            const writer = new TypeWriter(
                typeText,
                "Porque algunas personas merecen una flor diferente.",
                42
            );

            writer.start();

        }, 1800);


        setTimeout(() => {

            flowerCompleted = true;

            if (sunflower) {

                sunflower.style.filter =
                    "drop-shadow(0 15px 30px rgba(0,0,0,.45)) " +
                    "drop-shadow(0 0 25px rgba(246,201,69,.08))";

            }

        }, 3900);
    }
};


/* =========================================================
   FALLING PETAL ENGINE
========================================================= */

const PetalEngine = {

    create(amount = 15, intense = false) {

        if (!petalsContainer) return;


        for (let i = 0; i < amount; i++) {

            const petal =
                document.createElement("div");

            petal.className =
                "falling-petal";


            const left =
                Math.random() * 100;

            const duration =
                intense
                    ? 3 + Math.random() * 4
                    : 5 + Math.random() * 5;

            const delay =
                Math.random() * 1.5;

            const drift =
                `${(Math.random() - 0.5) * 35}vw`;

            const rotation =
                `${Math.random() * 720 - 360}deg`;

            const scale =
                0.55 + Math.random() * 0.9;


            petal.style.left =
                `${left}%`;

            petal.style.setProperty(
                "--duration",
                `${duration}s`
            );

            petal.style.setProperty(
                "--drift",
                drift
            );

            petal.style.setProperty(
                "--rotation",
                rotation
            );

            petal.style.animationDelay =
                `${delay}s`;

            petal.style.transform =
                `scale(${scale})`;


            petalsContainer.appendChild(petal);


            setTimeout(() => {

                petal.remove();

            }, (duration + delay) * 1000 + 500);
        }
    }
};


/* =========================================================
   PHOTO CONTROLLER
========================================================= */

const PhotoController = {

    enter() {

        if (!photoInitialized) {
            this.initialize();
        }

        setTimeout(() => {

            if (photoFrame) {
                photoFrame.classList.add(
                    "photo-scene-ready"
                );
            }

        }, 100);
    },


    initialize() {

        if (photoInitialized) return;

        photoInitialized = true;


        if (!couplePhoto) return;


        const markLoaded = () => {

            if (photoFrame) {
                photoFrame.classList.add(
                    "photo-loaded"
                );
            }

        };


        const markError = () => {

            if (photoFrame) {
                photoFrame.classList.remove(
                    "photo-loaded"
                );
            }

            console.warn(
                "No se pudo cargar assets/nuestra-foto.jpg"
            );
        };


        couplePhoto.addEventListener(
            "load",
            markLoaded,
            { once: true }
        );


        couplePhoto.addEventListener(
            "error",
            markError,
            { once: true }
        );


        if (
            couplePhoto.complete &&
            couplePhoto.naturalWidth > 0
        ) {
            markLoaded();
        }
    }
};


/* =========================================================
   PHOTO PARALLAX
========================================================= */

function initializePhotoParallax() {

    if (!photoFrame) return;


    window.addEventListener(
        "mousemove",
        event => {

            if (currentScene !== 2) return;


            const x =
                (event.clientX / window.innerWidth) - 0.5;

            const y =
                (event.clientY / window.innerHeight) - 0.5;


            const rotateY =
                x * 2.5;

            const rotateX =
                y * -2.5;


            photoFrame.style.transform =
                `perspective(1200px) ` +
                `rotateX(${rotateX}deg) ` +
                `rotateY(${rotateY}deg)`;
        }
    );


    window.addEventListener(
        "mouseleave",
        () => {

            photoFrame.style.transform =
                "perspective(1200px) " +
                "rotateX(0deg) " +
                "rotateY(0deg)";

        }
    );
}


/* =========================================================
   FINAL SCENE
========================================================= */

const FinalSceneController = {

    enter() {

        if (answer) {
            answer.textContent = "";
        }

        setTimeout(() => {

            PetalEngine.create(20);

        }, 600);
    },


    celebrate() {

        PetalEngine.create(65, true);


        if (answer) {

            answer.textContent =
                "Entonces queda pendiente esa salida. 🌻";

        }


        if (yesBtn) {

            yesBtn.disabled = true;

            yesBtn.style.opacity = "0.7";

            yesBtn.style.pointerEvents =
                "none";
        }
    }
};


/* =========================================================
   BUTTONS
========================================================= */

startBtn.addEventListener(
    "click",
    () => {

        if (transitioning) return;


        SceneController.show(1);


        setTimeout(() => {

            FlowerController.reset();

            FlowerController.grow();

        }, 500);

    }
);


/* =========================================================
   FLOWER CLICK
========================================================= */

sunflower.addEventListener(
    "click",
    () => {

        if (
            !flowerCompleted ||
            transitioning
        ) {
            return;
        }


        flowerCompleted = false;


        sunflower.animate(
            [
                {
                    transform: "scale(1)"
                },
                {
                    transform: "scale(1.045)"
                },
                {
                    transform: "scale(1)"
                }
            ],
            {
                duration: 650,
                easing:
                    "cubic-bezier(.22,1,.36,1)"
            }
        );


        PetalEngine.create(
            24,
            true
        );


        setTimeout(() => {

            SceneController.show(2);

        }, 650);

    }
);


/* =========================================================
   PHOTO CONTINUE
========================================================= */

photoContinueBtn.addEventListener(
    "click",
    () => {

        if (transitioning) return;


        PetalEngine.create(14);

        SceneController.show(3);

    }
);


/* =========================================================
   MESSAGE CONTINUE
========================================================= */

continueBtn.addEventListener(
    "click",
    () => {

        if (transitioning) return;


        PetalEngine.create(12);

        SceneController.show(4);

    }
);


/* =========================================================
   FINAL BUTTON
========================================================= */

yesBtn.addEventListener(
    "click",
    () => {

        FinalSceneController.celebrate();

    }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            if (currentScene === 0) {
                startBtn.click();
            }
        }


        if (event.code === "Space") {

            if (currentScene === 3) {

                event.preventDefault();

                continueBtn.click();

            }
        }


        if (event.key === "Escape") {

            if (currentScene !== 0) {

                SceneController.forceShow(0);

            }
        }
    }
);


/* =========================================================
   TOUCH / SWIPE
========================================================= */

let touchStartY = 0;


window.addEventListener(
    "touchstart",
    event => {

        touchStartY =
            event.changedTouches[0].screenY;

    },
    { passive: true }
);


window.addEventListener(
    "touchend",
    event => {

        const touchEndY =
            event.changedTouches[0].screenY;

        const difference =
            touchStartY - touchEndY;


        if (Math.abs(difference) < 70) {
            return;
        }


        if (difference > 0) {

            if (currentScene === 0) {

                startBtn.click();

            } else if (currentScene === 2) {

                photoContinueBtn.click();

            } else if (currentScene === 3) {

                continueBtn.click();

            }
        }
    },
    { passive: true }
);


/* =========================================================
   MAGNETIC BUTTON
========================================================= */

function initializeMagneticButton() {

    if (!startBtn) return;


    startBtn.addEventListener(
        "mousemove",
        event => {

            const rect =
                startBtn.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left -
                rect.width / 2;

            const y =
                event.clientY -
                rect.top -
                rect.height / 2;


            startBtn.style.transform =
                `translate(${x * .12}px, ${y * .12}px)`;

        }
    );


    startBtn.addEventListener(
        "mouseleave",
        () => {

            startBtn.style.transform = "";

        }
    );
}


/* =========================================================
   MICRO STARS
========================================================= */

function createMicroStars() {

    const background =
        document.querySelector(
            ".background__stars"
        );


    if (!background) return;


    background.style.opacity =
        window.innerWidth < 700
            ? "0.35"
            : "0.5";
}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeExperience() {

    SceneController.forceShow(0);

    FlowerController.reset();

    PhotoController.initialize();

    initializeCursor();

    initializePhotoParallax();

    initializeMagneticButton();

    createMicroStars();
}


window.addEventListener(
    "resize",
    createMicroStars
);


initializeExperience();
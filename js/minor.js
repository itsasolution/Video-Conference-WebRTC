// moving cursour
cursour = document.querySelector(".ptr");
document.addEventListener("mousemove", function (dtl) {

    cursour.style.transform = `translate(${dtl.x}px,${dtl.y}px)`
});

let iconsList = document.querySelectorAll(".cur");

iconsList.forEach((element) => {

    element.addEventListener("mousemove", () => {
        cursour.style.padding = "20px";
        cursour.style.background = "transparent";
        cursour.style.top = "-20px";
        cursour.style.left = "-15px";

    });

    element.addEventListener("mouseleave", () => {
        cursour.style.padding = "1px";
        cursour.style.background = "rgba(26, 255, 0, 0.938)";
        cursour.style.top = "-6px";
        cursour.style.left = "-5px";
    });
});



// chats section________________________________________

let cont = document.querySelector(".cont");

// chat-box replacement
document.getElementById("chat-icon").addEventListener("click", () => {
    document.querySelector(".chat-box").classList.toggle("chat-box-repl");
    cont.classList.toggle("cont-repl");
});


// ___________________________________________________

// split into two large windows
let split = document.querySelector(".split");

let strm_cont = document.getElementById("streams__container")
let t = true;

split.addEventListener("click", () => {
    /* HEIGHT OF VIDEOS  allow rows to take all height */
    if (t) {
        strm_cont.style.gridAutoRows = "49%";
    }
    else {
        strm_cont.style.gridAutoRows = "100%";
    }
    t = !t;
});


//full screen options hide

let navbar = document.getElementById("nav");
let optn = document.querySelector(".optn");
let val = true;

function hide() {
    setTimeout(function () { optn.style.opacity = 0 }, 2500);
}

document.querySelector(".full").addEventListener("click", () => {
    cont.classList.toggle("cont-repl2");

    if (val) {
        optn.addEventListener("mousemove", () => {
            optn.style.opacity = 1;
        });
        optn.addEventListener("mouseleave", hide);

        // hiding nav bar
        document.getElementById("mem").style.opacity = 0;
        navbar.style.height = '0px';
        navbar.style.opacity = 0;
    }
    else {
        // removing eventListener 
        optn.removeEventListener("mouseleave", hide);

        navbar.style.height = '40px';
        navbar.style.opacity = 1;
        document.getElementById("mem").style.opacity = 1;
    }

    val = !val;
});



// ##################################################################

let displayFrame = document.getElementById('stream__box')
let videoFrames = document.getElementsByClassName('video__container')
let userIdInDisplayFrame = null;

let expandVideoFrame = (e) => {

    let child = displayFrame.children[0]
    if (child) {
        document.getElementById('streams__container').appendChild(child)
    }

    displayFrame.style.display = 'block'
    displayFrame.appendChild(e.currentTarget)

}

for (let i = 0; i < videoFrames.length; i++) {
    videoFrames[i].addEventListener('click', expandVideoFrame)
}

let hideDisplayFrame = () => {
    userIdInDisplayFrame = null
    displayFrame.style.display = null

    let child = displayFrame.children[0]
    document.getElementById('streams__container').appendChild(child)

}

displayFrame.addEventListener('click', hideDisplayFrame)


// participants 
let participants = document.querySelector(".participants");
let tog = true;


function part() {
    if (tog)
        participants.style.display = "block";

    else
        participants.style.display = "none";
    tog = !tog;
}

participants.addEventListener("click", part)
document.getElementById("mem").addEventListener("click", part)
document.querySelector(".mem-repl").addEventListener("click", part)

setTimeout(() => { participants.style.display = "none"; }, 4000);

// loader
let loader = document.querySelector(".loader")
// window.addEventListener("load", () => {
//     loader.style.opacity = "0";
// })

setTimeout(() => {
    loader.style.opacity = "0";
}, 3000);
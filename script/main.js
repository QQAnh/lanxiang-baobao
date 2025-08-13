// Kích hoạt hộp thoại hỏi người dùng có muốn phát nhạc không
window.addEventListener('load', () => {
    Swal.fire({
        title: 'Vợ yêu có muốn nghe một bản nhạc nền không?',
        text: "Một chút nhạc sẽ làm cho điều bất ngờ này thêm phần thú vị đó!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Tất nhiên rồi!',
        cancelButtonText: 'Không, cảm ơn',
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelector('.song').play();
        }
        animationTimeline(); // Bắt đầu animation dù người dùng chọn gì
    });
});

// Dòng thời gian của các hiệu ứng
const animationTimeline = () => {
    // Tách các ký tự cần hiệu ứng riêng lẻ
    const textBoxChars = document.querySelector(".hbd-chatbox");
    const hbd = document.querySelector(".wish-hbd");

    textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
        .split("")
        .join("</span><span>")}</span>`;

    hbd.innerHTML = `<span>${hbd.innerHTML
        .split("")
        .join("</span><span>")}</span>`;

    const ideaTextTrans = {
        opacity: 0,
        y: -20,
        rotationX: 5,
        skewX: "15deg"
    };

    const ideaTextTransLeave = {
        opacity: 0,
        y: 20,
        rotationY: 5,
        skewX: "-15deg"
    };

    // Khởi tạo timeline với cú pháp GSAP 3
    const tl = gsap.timeline();

    tl.to(".container", {
        visibility: "visible",
        duration: 0.6,
        ease: "power2.out"
    })
        .from(".one", {
            opacity: 0,
            y: 10,
            duration: 0.7,
            ease: "power2.out"
        })
        .from(".two", {
            opacity: 0,
            y: 10,
            duration: 0.4,
            ease: "power1.out"
        }, "-=0.2")
        .to([".one", ".two"], {
            opacity: 0,
            y: 10,
            duration: 0.7,
            ease: "power1.in"
        }, "+=2.5")
        .from(".three", {
            opacity: 0,
            y: 10,
            duration: 0.7,
            ease: "power2.out"
        })
        .to(".three", {
            opacity: 0,
            y: 10,
            duration: 0.7,
            ease: "power1.in"
        }, "+=2.5")
        .from(".four", {
            scale: 0.2,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.7)"
        })
        .from(".fake-btn", {
            scale: 0.2,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        }, "-=0.5")
        .staggerTo(".hbd-chatbox span", 0.05, {
            visibility: "visible",
        }, 0.05)
        .to(".fake-btn", {
            backgroundColor: "var(--highlight-color)",
            duration: 0.1
        }, "+=2")
        .to(".four", {
            scale: 0.2,
            opacity: 0,
            y: -150,
            duration: 0.5,
            ease: "power1.in"
        }, "+=1")
        .from(".idea-1", { ...ideaTextTrans, duration: 0.7, ease: "power2.out" })
        .to(".idea-1", { ...ideaTextTransLeave, duration: 0.7, ease: "power1.in" }, "+=2")
        .from(".idea-2", { ...ideaTextTrans, duration: 0.7, ease: "power2.out" })
        .to(".idea-2", { ...ideaTextTransLeave, duration: 0.7, ease: "power1.in" }, "+=2")
        .from(".idea-3", { ...ideaTextTrans, duration: 0.7, ease: "power2.out" })
        .to(".idea-3 strong", {
            scale: 1.2,
            x: 10,
            backgroundColor: "var(--secondary-color)",
            color: "#fff",
            duration: 0.5,
            ease: "power2.out"
        })
        .to(".idea-3", { ...ideaTextTransLeave, duration: 0.7, ease: "power1.in" }, "+=2")
        .from(".idea-4", { ...ideaTextTrans, duration: 0.7, ease: "power2.out" })
        .to(".idea-4", { ...ideaTextTransLeave, duration: 0.7, ease: "power1.in" }, "+=2")
        .from(".idea-5", {
            rotationX: 15,
            rotationZ: -10,
            skewY: "-5deg",
            y: 50,
            z: 10,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out"
        }, "+=1")
        .to(".idea-5 span", {
            rotation: 90,
            x: 8,
            duration: 0.7,
            ease: "power2.inOut"
        }, "+=1")
        .to(".idea-5", {
            scale: 0.2,
            opacity: 0,
            duration: 0.7,
            ease: "power1.in"
        }, "+=2")
        .staggerFrom(".idea-6 span", 0.8, {
            scale: 3,
            opacity: 0,
            rotation: 15,
            ease: "expo.easeOut"
        }, 0.2)
        .staggerTo(".idea-6 span", 0.8, {
            scale: 3,
            opacity: 0,
            rotation: -15,
            ease: "expo.easeOut"
        }, 0.2, "+=1.5")
        .staggerFromTo(".baloons img", 2.5, {
            opacity: 0.9,
            y: 1400
        }, {
            opacity: 1,
            y: -1000,
            ease: "power2.easeOut"
        }, 0.2)
        .from(".profile-picture", {
            scale: 3.5,
            opacity: 0,
            x: 25,
            y: -25,
            rotationZ: -45,
            duration: 0.5,
            ease: "power2.out"
        }, "-=2")
        .from(".hat", {
            x: -100,
            y: 350,
            rotation: -180,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        })
        .staggerFrom(".wish-hbd span", 0.7, {
            opacity: 0,
            y: -50,
            rotation: 150,
            skewX: "30deg",
            ease: "elastic.out(1, 0.5)"
        }, 0.1)
        .staggerTo(".wish-hbd span", 0.7, {
            scale: 1,
            color: "var(--highlight-color)",
            ease: "expo.out"
        }, 0.1, "party")
        .from(".wish h5", {
            opacity: 0,
            y: 10,
            skewX: "-15deg",
            duration: 0.5,
            ease: "power2.out"
        }, "party")
        .staggerTo(".eight svg", 1.5, {
            visibility: "visible",
            opacity: 0,
            scale: 80,
            repeat: -1, // Lặp vô hạn
            repeatDelay: 1.4
        }, 0.3)
        .to(".six", {
            opacity: 0,
            y: 30,
            zIndex: "-1",
            duration: 0.5,
            ease: "power1.in"
        }, "+=2.5")
        .staggerFrom(".nine p", 1, { ...ideaTextTrans, ease: "power2.out" }, 1.2)
        .to(".last-smile", {
            rotation: 90,
            duration: 0.5,
            ease: "power2.inOut"
        }, "+=1");

    // Khởi động lại animation khi nhấn nút
    const replyBtn = document.getElementById("replay");
    replyBtn.addEventListener("click", () => {
        tl.restart();
    });
};
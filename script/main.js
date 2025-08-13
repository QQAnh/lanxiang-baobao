// Biến toàn cục để lưu các animation, giúp kiểm soát (dừng) chúng khi cần
let imageAnimations = [];

// ===================================================================
// TÍNH NĂNG MỚI: VỆT SÁNG TINH TÚ THEO CHUỘT
// ===================================================================
window.addEventListener('mousemove', function(e) {
    // Tạo một phần tử .star
    let star = document.createElement('div');
    star.className = 'star';
    document.body.appendChild(star);

    // Kích thước và vị trí ngẫu nhiên xung quanh con trỏ
    const size = Math.random() * 5 + 1; // Kích thước từ 1px đến 6px
    const x = e.pageX;
    const y = e.pageY;

    gsap.set(star, {
        width: size,
        height: size,
        left: x,
        top: y,
    });

    // Animate và tự hủy
    gsap.to(star, {
        duration: Math.random() * 1.5 + 0.5, // Tồn tại từ 0.5s đến 2s
        opacity: 0,
        scale: 0.1,
        x: (Math.random() - 0.5) * 100, // Di chuyển ngẫu nhiên
        y: (Math.random() - 0.5) * 100,
        ease: 'power2.out',
        onComplete: () => {
            star.remove();
        }
    });
});


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
    textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML.split("").join("</span><span>")}</span>`;
    hbd.innerHTML = `<span>${hbd.innerHTML.split("").join("</span><span>")}</span>`;

    const ideaTextTrans = { autoAlpha: 0, y: -20, rotationX: 5, skewX: "15deg" };
    const ideaTextTransLeave = { autoAlpha: 0, y: 20, rotationY: 5, skewX: "-15deg" };
    const tl = gsap.timeline();

    // HÀM HIỆU ỨNG ẢNH VỚI TÍNH NĂNG TƯƠNG TÁC (Không tránh card)
    const animateRandomImages = () => {
        imageAnimations.forEach(anim => anim.kill());
        imageAnimations = [];

        const images = gsap.utils.toArray('.random-pic');
        const container = document.querySelector('#random-images-container');
        const captionEl = document.querySelector('#image-caption');
        const IMAGE_MAX_WIDTH = 200;
        const PADDING = 20;

        images.forEach((img, index) => {
            let imageTween;

            function animateThisImage() {
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;

                // Quay lại logic cũ: vị trí ngẫu nhiên trên toàn màn hình
                const randomX = gsap.utils.random(PADDING, containerWidth - IMAGE_MAX_WIDTH - PADDING);
                const randomY = gsap.utils.random(PADDING, containerHeight - IMAGE_MAX_WIDTH - PADDING);

                gsap.set(img, {
                    left: randomX,
                    top: randomY,
                    rotation: gsap.utils.random(-30, 30)
                });

                imageTween = gsap.timeline()
                    .to(img, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' })
                    .to(img, { autoAlpha: 0, scale: 0.3, duration: 0.8, ease: 'power2.in', delay: 4 });

                const nextRunDelay = gsap.utils.random(5, 8);
                const nextRun = gsap.delayedCall(nextRunDelay, animateThisImage);

                imageAnimations.push(imageTween, nextRun);
            }

            const initialStaggerDelay = index * 2.0;
            const initialRun = gsap.delayedCall(initialStaggerDelay, animateThisImage);
            imageAnimations.push(initialRun);

            // Sự kiện tương tác
            img.addEventListener('mouseenter', () => {
                if (imageTween) imageTween.pause();
                gsap.to(img, { scale: 1.15, duration: 0.3, zIndex: 10 });
                captionEl.textContent = img.dataset.caption || "";
                gsap.to(captionEl, { autoAlpha: 1, duration: 0.2 });
            });

            img.addEventListener('mouseleave', () => {
                gsap.to(img, { scale: 1, duration: 0.3, zIndex: 1 });
                gsap.to(captionEl, { autoAlpha: 0, duration: 0.2 });
                if (imageTween) imageTween.resume();
            });

            img.addEventListener('mousemove', (e) => {
                gsap.set(captionEl, { x: e.clientX + 15, y: e.clientY + 15 });
            });
        });
    };

    // TIMELINE CHÍNH (Không thay đổi)
    tl.to(".container", { visibility: "visible" })
        .from(".one", { autoAlpha: 0, y: 10, duration: 0.7 })
        .from(".two", { autoAlpha: 0, y: 10, duration: 0.4 }, "-=0.2")
        .to([".one", ".two"], { autoAlpha: 0, y: 10, duration: 0.7 }, "+=2.5")
        .from(".three", { autoAlpha: 0, y: 10, duration: 0.7 })
        .to(".three", { autoAlpha: 0, y: 10, duration: 0.7 }, "+=2.5")
        .from(".four", { autoAlpha: 0, scale: 0.2, duration: 0.7, ease: "back.out(1.7)" })
        .from(".fake-btn", { autoAlpha: 0, scale: 0.2, duration: 0.3 }, "-=0.5")
        .staggerTo(".hbd-chatbox span", 0.05, { visibility: "visible" }, 0.05)
        .to(".fake-btn", { backgroundColor: "var(--highlight-color)" }, "+=2")
        .to(".four", { autoAlpha: 0, scale: 0.2, y: -150, duration: 0.5 }, "+=1")
        .from(".idea-1", { ...ideaTextTrans, duration: 0.7 })
        .to(".idea-1", { ...ideaTextTransLeave, duration: 0.7 }, "+=2")
        .from(".idea-2", { ...ideaTextTrans, duration: 0.7 })
        .to(".idea-2", { ...ideaTextTransLeave, duration: 0.7 }, "+=2")
        .from(".idea-3", { ...ideaTextTrans, duration: 0.7 })
        .to(".idea-3 strong", { scale: 1.2, x: 10, backgroundColor: "var(--secondary-color)", color: "#fff" })
        .to(".idea-3", { ...ideaTextTransLeave, duration: 0.7 }, "+=2")
        .from(".idea-4", { ...ideaTextTrans, duration: 0.7 })
        .to(".idea-4", { ...ideaTextTransLeave, duration: 0.7 }, "+=2")
        .from(".idea-5", { autoAlpha: 0, rotationX: 15, rotationZ: -10, y: 50, z: 10, duration: 0.7 }, "+=1")
        .to(".idea-5 span", { rotation: 90, x: 8, duration: 0.7 }, "+=1")
        .to(".idea-5", { autoAlpha: 0, scale: 0.2, duration: 0.7 }, "+=2")
        .staggerFrom(".idea-6 span", 0.8, { autoAlpha: 0, scale: 3, rotation: 15, ease: "expo.easeOut" }, 0.2)
        .staggerTo(".idea-6 span", 0.8, { autoAlpha: 0, scale: 3, rotation: -15, ease: "expo.easeOut" }, 0.2, "+=1.5")
        .staggerFromTo(".baloons img", 2.5, { opacity: 0.9, y: 1400 }, { opacity: 1, y: -1000, ease: "power2.easeOut" }, 0.2)
        .from(".profile-picture", { autoAlpha: 0, scale: 3.5, x: 25, y: -25, rotationZ: -45, duration: 0.5 }, "-=2")
        .from(".hat", { autoAlpha: 0, x: -100, y: 350, rotation: -180, duration: 0.5 })
        .staggerFrom(".wish-hbd span", 0.7, { autoAlpha: 0, y: -50, rotation: 150, skewX: "30deg", ease: "elastic.out(1, 0.5)" }, 0.1)
        .staggerTo(".wish-hbd span", 0.7, { scale: 1, color: "var(--highlight-color)", ease: "expo.out" }, 0.1, "party")
        .from(".wish h5", { autoAlpha: 0, y: 10, skewX: "-15deg", duration: 0.5 }, "party")
        .staggerTo(".eight svg", 1.5, { visibility: "visible", opacity: 0, scale: 80, repeat: -1, repeatDelay: 1.4 }, 0.3)
        .to(".six", { autoAlpha: 0, y: 30, duration: 0.7, ease: "power1.in" }, "+=2.5")
        .call(animateRandomImages)
        .to(".nine", { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power2.out" })
        .staggerFrom(".nine p", 1, { ...ideaTextTrans, ease: "power2.out" }, 0.8, "-=0.2")
        .to(".last-smile", { rotation: 90, duration: 0.5, ease: "power2.inOut" }, "+=1");

    // SỰ KIỆN CLICK CHO NÚT REPLAY
    const replyBtn = document.getElementById("replay");
    replyBtn.addEventListener("click", () => {
        imageAnimations.forEach(anim => anim.kill());
        imageAnimations = [];
        gsap.set('.random-pic', { autoAlpha: 0 });
        gsap.set('.nine', { autoAlpha: 0, scale: 1 });
        tl.restart();
    });
};
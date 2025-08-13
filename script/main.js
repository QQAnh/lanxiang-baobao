// Biến toàn cục để lưu các animation, giúp kiểm soát (dừng) chúng khi cần
let imageAnimations = [];
// Biến toàn cục để lưu listener của pháo giấy, giúp gỡ bỏ khi replay
let confettiClickListener = null;

// ===================================================================
// TÍNH NĂNG: VỆT SÁNG TINH TÚ THEO CHUỘT
// ===================================================================
window.addEventListener('mousemove', function(e) {
    let star = document.createElement('div');
    star.className = 'star';
    document.body.appendChild(star);

    const size = Math.random() * 5 + 1;
    const x = e.pageX;
    const y = e.pageY;

    gsap.set(star, {
        width: size,
        height: size,
        left: x,
        top: y,
    });

    gsap.to(star, {
        duration: Math.random() * 1.5 + 0.5,
        opacity: 0,
        scale: 0.1,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        ease: 'power2.out',
        onComplete: () => {
            star.remove();
        }
    });
});

// ===================================================================
// LOGIC KHỞI ĐỘNG TRANG WEB VỚI HỘP QUÀ
// ===================================================================
window.addEventListener('load', () => {
    const giftBoxContainer = document.querySelector('#gift-box-container');
    const lid = document.querySelector('#lid-group');
    const boxBase = document.querySelector('#box-base');

    // Chỉ lắng nghe sự kiện click một lần
    giftBoxContainer.addEventListener('click', () => {
        // Tạo một timeline animation của GSAP
        const openGiftTimeline = gsap.timeline();

        openGiftTimeline
            // 1. Nắp hộp bay lên và xoay đi
            .to(lid, {
                y: -150, // Bay lên
                rotation: -25, // Xoay nhẹ
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            })
            // 2. Thân hộp rung nhẹ sau khi nắp bay đi
            .fromTo(boxBase,
                { x: 0 },
                { x: -2, duration: 0.08, repeat: 5, yoyo: true },
                "-=0.8" // Bắt đầu hiệu ứng này sớm hơn một chút
            )
            // 3. Toàn bộ hộp quà mờ dần và biến mất
            .to(giftBoxContainer, {
                opacity: 0,
                duration: 0.5,
                ease: "power1.in",
                onComplete: () => {
                    // 4. Sau khi hiệu ứng kết thúc, thực hiện các hành động tiếp theo
                    giftBoxContainer.style.display = 'none';

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
                            document.querySelector('.song').play().catch(e => console.error("Audio play failed:", e));
                        }
                        // Bắt đầu chuỗi animation chính của trang web
                        animationTimeline();
                    });
                }
            }, "-=0.5"); // Bắt đầu mờ dần trước khi hiệu ứng rung kết thúc

    }, { once: true });
});
// ===================================================================
// NÂNG CẤP: HÀM BẮN PHÁO GIẤY KHI CLICK
// ===================================================================
const fireConfettiOnClick = () => {
    const canvas = document.querySelector('#confetti-canvas');
    if (!canvas) return;

    // Tạo pháo giấy trên canvas đã chỉ định
    const myConfetti = confetti.create(canvas, {
        resize: true, // Tự động thay đổi kích thước khi cửa sổ thay đổi
        useWorker: true // Sử dụng web worker để không làm chậm thread chính
    });

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Bắn một chùm pháo giấy với các thông số ngẫu nhiên
    myConfetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 } // Bắn từ vị trí hơi thấp hơn giữa màn hình
    });
};

// ===================================================================
// DÒNG THỜI GIAN CỦA CÁC HIỆU ỨNG (TIMELINE)
// ===================================================================
const animationTimeline = () => {
    // Tách các ký tự cần hiệu ứng riêng lẻ
    const textBoxChars = document.querySelector(".hbd-chatbox");
    const hbd = document.querySelector(".wish-hbd");
    textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML.split("").join("</span><span>")}</span>`;
    hbd.innerHTML = `<span>${hbd.innerHTML.split("").join("</span><span>")}</span>`;

    // Các biến này chứa `autoAlpha: 0` để tạo hiệu ứng fade mượt mà.
    const ideaTextTrans = { autoAlpha: 0, y: -20, rotationX: 5, skewX: "15deg" };
    const ideaTextTransLeave = { autoAlpha: 0, y: 20, rotationY: 5, skewX: "-15deg" };

    const tl = gsap.timeline();

    // HÀM HIỆU ỨNG ẢNH RƠI NGẪU NHIÊN
    const animateRandomImages = () => {
        // Dọn dẹp các animation cũ trước khi chạy lại
        imageAnimations.forEach(anim => anim.kill());
        imageAnimations = [];

        const images = gsap.utils.toArray('.random-pic');
        const container = document.querySelector('#random-images-container');
        const IMAGE_MAX_WIDTH = 200;
        const PADDING = 20;

        images.forEach((img, index) => {
            let imageTween;

            function animateThisImage() {
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;
                const randomX = gsap.utils.random(PADDING, containerWidth - IMAGE_MAX_WIDTH - PADDING);
                const randomY = gsap.utils.random(PADDING, containerHeight - IMAGE_MAX_WIDTH - PADDING);

                gsap.set(img, { left: randomX, top: randomY, rotation: gsap.utils.random(-30, 30) });

                // Hiệu ứng xuất hiện và biến mất của từng ảnh
                imageTween = gsap.timeline()
                    .to(img, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }) // Fade-in
                    .to(img, { autoAlpha: 0, scale: 0.3, duration: 0.8, ease: 'power2.in', delay: 4 }); // Fade-out

                // Lên lịch cho lần xuất hiện tiếp theo của chính ảnh này
                const nextRunDelay = gsap.utils.random(5, 8);
                const nextRun = gsap.delayedCall(nextRunDelay, animateThisImage);
                imageAnimations.push(imageTween, nextRun);
            }

            // Bắt đầu vòng lặp cho mỗi ảnh với độ trễ khác nhau
            const initialStaggerDelay = index * 2.0;
            const initialRun = gsap.delayedCall(initialStaggerDelay, animateThisImage);
            imageAnimations.push(initialRun);
        });
    };

    // TIMELINE CHÍNH
    tl.to(".container", { autoAlpha: 1, visibility: "visible", duration: 0.5 })
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
        .staggerTo(".wish-hbd span", 0.7, { scale: 1.1, color: "var(--highlight-color)", ease: "expo.out" }, 0.1, "party")
        .from(".wish h5", { autoAlpha: 0, y: 10, skewX: "-15deg", duration: 0.5 }, "party")

        .call(() => {
            // Gán hàm bắn pháo giấy vào một biến listener
            confettiClickListener = () => fireConfettiOnClick();
            // Thêm listener vào body để có thể click ở bất kỳ đâu
            document.body.addEventListener('click', confettiClickListener);
        })

        .to(".six", { autoAlpha: 0, y: 30, duration: 0.7, ease: "power1.in" }, "+=2.5")

        .call(animateRandomImages)
        .to(".nine", { autoAlpha: 1, visibility: "visible", scale: 1, duration: 0.7, ease: "power2.out" })
        .staggerFrom(".nine p", 1, { ...ideaTextTrans, ease: "power2.out" }, 0.8, "-=0.2")
        .to(".last-smile", { rotation: 90, duration: 0.5, ease: "power2.inOut" }, "+=1");

    // SỰ KIỆN CLICK CHO NÚT REPLAY
    const replyBtn = document.getElementById("replay");
    replyBtn.addEventListener("click", () => {
        // Dừng và xóa toàn bộ animation của các ảnh đang rơi
        imageAnimations.forEach(anim => anim.kill());
        imageAnimations = [];
        gsap.set('.random-pic', { autoAlpha: 0 });

        // Gỡ bỏ listener pháo giấy để tránh bị chồng chéo khi replay
        if (confettiClickListener) {
            document.body.removeEventListener('click', confettiClickListener);
            confettiClickListener = null;
        }

        // Reset các trạng thái khác về ban đầu
        gsap.set('.nine', { autoAlpha: 0, scale: 1 });

        // Khởi động lại toàn bộ timeline từ đầu
        tl.restart();
    });
};
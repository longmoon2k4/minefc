# MineFC — Minecraft Server Landing Page

Một trang giới thiệu server Minecraft với hiệu ứng hiện đại: hover, parallax, animated backgrounds, loading animation, page transitions, interactive elements, microinteractions, animated icons, và animated menu.

## Chạy trang

Mở file `index.html` trực tiếp bằng trình duyệt hoặc chạy server tĩnh.

Trên Windows (CMD), có thể bật một server tĩnh nhanh bằng Python:

```cmd
python -m http.server 8000
```

Sau đó truy cập: `http://localhost:8000` và mở thư mục chứa dự án.

## Cấu trúc

- `index.html` — cấu trúc trang và nội dung.
- `css/styles.css` — layout, màu sắc, hiệu ứng & animation.
- `js/script.js` — logic tương tác: loader, parallax, transition, counter, ripple, menu.

## Yêu cầu và mức độ đáp ứng

- Hover Effect — có trên nút, menu, thẻ `card`.
- Parallax Scrolling — lớp `layer-*` trong phần Hero di chuyển theo chuột.
- Animated Backgrounds — lớp `particles` với gradients + grid động.
- Loading Animation — màn hình `#loader` với logo + thanh tiến trình.
- Page Transitions — overlay `.page-overlay` quét khi chuyển anchor.
- Interactive Elements — copy IP, counters, ripple, menu di động.
- Microinteractions — ripple click, shimmer text, hover elevates.
- Animated Icons & Illustrations — SVG sword/shield/pickaxe + cảnh minh hoạ nhảy.
- Animated Menu — nút hamburger biến hình + menu di động bật/tắt.

## Tuỳ chỉnh nhanh

- Màu sắc: đổi biến CSS trong `:root` ở `css/styles.css`.
- IP máy chủ: thay `play.minefc.vn` trong `index.html` (nút copy có `data-ip`).
- Phần/khối nội dung: chỉnh các section `hero`, `features`, `community`, `join`.
- Motion: hỗ trợ `prefers-reduced-motion`; bạn có thể giảm animation theo nhu cầu.

## Lưu ý

- Bộ đếm người chơi online đang mô phỏng ngẫu nhiên cho bản demo (`data-live`). Bạn có thể thay bằng API thật nếu có.
- Trang ưu tiên hiệu năng: animation nhẹ, dùng IntersectionObserver để reveal.

---

© MineFC. Không liên kết với Mojang/Microsoft.

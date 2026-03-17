// URL của Netlify Function (API Gateway)
const API_URL = "https://script.google.com/macros/s/AKfycbzeou3Fv81Ih15OeiueirC4wnQL1E9fM3hbTZatR8v1wolMrSG9CYcbritfHsfowURMrQ/exec";

// Biến lưu trữ dữ liệu toàn cục
let globalData = { branches: [], rooms: [], pricing: [], addons: [], news: [] };

// Hàm điều hướng và Render (Kiểm tra xem khách đang ở trang nào để gọi đúng hàm)
function routeAndRender() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes("rooms.html") || currentPath.endsWith("/rooms") || currentPath.endsWith("/rooms/")) {
        if(typeof renderAllRooms === "function") renderAllRooms();
    } else if (currentPath.includes("room.html") || currentPath.includes("/room")) {
        if(typeof renderRoomDetail === "function") renderRoomDetail();
    } else if (currentPath.includes("news.html") || currentPath.includes("/news")) {
        if(typeof renderNewsList === "function") renderNewsList();
    } else if (currentPath.includes("post.html") || currentPath.includes("/post")) {
        if(typeof renderPostDetail === "function") renderPostDetail();
    } else if (currentPath.includes("index.html") || currentPath === "/" || currentPath.endsWith("/")) {
        if(typeof renderHomeNews === "function") renderHomeNews();
        if(typeof renderHomeRooms === "function") renderHomeRooms(); // Hút phòng nổi bật
    } else {
        // Dành cho các trang phụ khác
        if(typeof renderBranches === "function") renderBranches();
    }
}

// Khởi động App với Caching (Tốc độ load 0.01s)
function initApp() {
    // 1. Kiểm tra Cache trong máy khách
    const cachedData = localStorage.getItem('colab_db_cache');
    if (cachedData) {
        try {
            globalData = JSON.parse(cachedData);
            routeAndRender(); // Load web lên ngay lập tức
        } catch(e) {}
    }

    // 2. Kéo dữ liệu mới nhất ngầm từ Google Sheets
    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "getInitData" })
    })
    .then(res => res.json())
    .then(result => {
        if (result.status === "success") {
            globalData = result.data;
            localStorage.setItem('colab_db_cache', JSON.stringify(globalData));
            routeAndRender(); // Cập nhật lại giao diện
        }
    })
    .catch(err => console.log("Lỗi tải data ngầm:", err));
}

// Bắt đầu chạy
initApp();

// Hàm đổ dữ liệu vào Dropdown Chi nhánh
function renderBranches() {
    const branchSelect = document.getElementById("branchSelect");
    if(!branchSelect) return;
    branchSelect.innerHTML = '<option value="">Chọn chi nhánh</option>';
    
    globalData.branches.forEach(branch => {
        const option = document.createElement("option");
        option.value = branch.ID;
        option.textContent = branch.BranchName;
        branchSelect.appendChild(option);
    });
}

// Hàm render các Card Phòng
function renderRooms() {
    const roomGrid = document.getElementById("roomGrid");
    if(!roomGrid) return;
    roomGrid.innerHTML = ""; 
    
    const featuredRooms = globalData.rooms.slice(0, 3);
    
    featuredRooms.forEach(room => {
        const roomPricing = globalData.pricing.find(p => p.RoomID === room.ID && p.DayType === "Weekday");
        const price = roomPricing ? roomPricing.PricePerHour.toLocaleString('vi-VN') : "Liên hệ";
        
        // Tìm tên chi nhánh dựa vào BranchID
        const branch = globalData.branches.find(b => b.ID === room.BranchID);
        const branchName = branch ? branch.BranchName : "Co.Lab";

        // Lấy ảnh đầu tiên, loại bỏ khoảng trắng thừa nếu có
        const firstImage = room.Images.split(",")[0].trim() || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80";

        const card = document.createElement("div");
        card.className = "room-card";
        
        card.innerHTML = `
            <div class="room-img-wrapper">
                <span class="room-badge">Hot</span>
                <img src="${firstImage}" alt="${room.RoomName}">
            </div>
            <div class="room-info">
                <h3 class="room-title">${room.RoomName}</h3>
                <div class="room-meta">
                    <span><i class="ph ph-users"></i> ${room.Capacity} người</span>
                    <span><i class="ph ph-map-pin"></i> ${branchName}</span>
                </div>
                <div class="room-price">
                    ${price}đ <span>/ giờ</span>
                </div>
                <a href="room.html?id=${room.ID}" class="btn btn-outline">Xem chi tiết</a>
            </div>
        `;
        roomGrid.appendChild(card);
    });
}

// Hàm render TOÀN BỘ Card Phòng (Có bộ lọc Gõ + Dropdown)
function renderAllRooms() {
    const allRoomsGrid = document.getElementById("allRoomsGrid");
    if(!allRoomsGrid) return;
    
    // Lấy giá trị từ thanh tìm kiếm (Nếu có)
    const searchInput = document.getElementById('roomSearchInput');
    const branchFilterInput = document.getElementById('roomBranchFilter');
    
    const searchText = searchInput ? searchInput.value.toLowerCase() : "";
    
    // Lấy từ khóa chi nhánh (Ưu tiên Dropdown, nếu không có thì lấy từ URL)
    const urlParams = new URLSearchParams(window.location.search);
    let branchFilter = branchFilterInput ? branchFilterInput.value : urlParams.get('branch');

    // Đồng bộ lại dropdown với URL nếu load trang lần đầu
    if (branchFilterInput && urlParams.get('branch') && !branchFilterInput.value) {
        branchFilterInput.value = urlParams.get('branch');
        branchFilter = urlParams.get('branch');
    }

    let roomsToRender = globalData.rooms;

    // 1. Lọc theo chi nhánh
    if (branchFilter && branchFilter !== "") {
        roomsToRender = roomsToRender.filter(room => {
            const branch = globalData.branches.find(b => b.ID === room.BranchID);
            return branch && branch.BranchName.toLowerCase().includes(branchFilter.toLowerCase());
        });
    }

    // 2. Lọc theo từ khóa gõ (Tên phòng hoặc Sức chứa)
    if (searchText !== "") {
        roomsToRender = roomsToRender.filter(room => {
            return room.RoomName.toLowerCase().includes(searchText) || 
                   room.Capacity.toString().includes(searchText);
        });
    }

    allRoomsGrid.innerHTML = ""; 

    if (roomsToRender.length === 0) {
        allRoomsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-light);">
                <i class="ph ph-magnifying-glass" style="font-size: 64px; color: #ddd; margin-bottom: 16px;"></i>
                <h3 style="color: #180161; margin-bottom: 8px;">Không tìm thấy kết quả</h3>
                <p>Thử điều chỉnh lại từ khóa hoặc chi nhánh tìm kiếm nhé.</p>
            </div>`;
        return;
    }
    
    roomsToRender.forEach(room => {
        const roomPricing = globalData.pricing.find(p => p.RoomID === room.ID && p.DayType === "Weekday");
        const price = roomPricing ? roomPricing.PricePerHour.toLocaleString('vi-VN') : "Liên hệ";
        const branch = globalData.branches.find(b => b.ID === room.BranchID);
        const branchName = branch ? branch.BranchName : "Co.Lab";
        const firstImage = room.Images.split(",")[0].trim() || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80";

        const card = document.createElement("div");
        card.className = "room-card";
        card.innerHTML = `
            <div class="room-img-wrapper"><img src="${firstImage}" alt="${room.RoomName}"></div>
            <div class="room-info">
                <h3 class="room-title">${room.RoomName}</h3>
                <div class="room-meta">
                    <span><i class="ph ph-users"></i> ${room.Capacity} người</span>
                    <span><i class="ph ph-map-pin"></i> ${branchName}</span>
                </div>
                <div class="room-price">${price}đ <span>/ giờ</span></div>
                <a href="room.html?id=${room.ID}" class="btn btn-outline">Xem chi tiết</a>
            </div>`;
        allRoomsGrid.appendChild(card);
    });
}

// Lắng nghe sự kiện gõ tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('roomSearchInput');
    const branchFilterInput = document.getElementById('roomBranchFilter');
    if(searchInput) searchInput.addEventListener('input', renderAllRooms);
    if(branchFilterInput) branchFilterInput.addEventListener('change', renderAllRooms);
});

// --- CÁC HÀM DÀNH RIÊNG CHO TRANG CHI TIẾT PHÒNG (room.html) ---

function renderRoomDetail() {
    // 1. Lấy ID phòng từ thanh địa chỉ (URL)
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');
    
    if (!roomId) return;

    // 2. Tìm thông tin phòng
    const room = globalData.rooms.find(r => r.ID === roomId);
    if (!room) {
        const infoSection = document.querySelector(".room-main-info");
        if(infoSection) infoSection.innerHTML = "<h2>Phòng không tồn tại hoặc đã khóa.</h2>";
        return;
    }

    const branch = globalData.branches.find(b => b.ID === room.BranchID);
    const branchName = branch ? branch.BranchName : "Co.Lab";

    // 3. Đổ thông tin Text và Ảnh
    document.getElementById("detailRoomName").textContent = room.RoomName;
    document.getElementById("detailBranch").innerHTML = `<i class="ph ph-map-pin"></i> ${branchName}`;
    document.getElementById("detailCapacity").innerHTML = `<i class="ph ph-users"></i> ${room.Capacity} người`;
    document.getElementById("detailDescription").textContent = room.Description;

    const firstImage = room.Images.split(",")[0].trim() || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80";
    document.getElementById("roomGallery").innerHTML = `<img src="${firstImage}" alt="${room.RoomName}">`;

    // 4. Đổ Bảng Giá
    const pricingBody = document.getElementById("pricingTableBody");
    const pWeekday = globalData.pricing.find(p => p.RoomID === room.ID && p.DayType === "Weekday");
    const pWeekend = globalData.pricing.find(p => p.RoomID === room.ID && p.DayType === "Weekend");
    
    if (pWeekday && pWeekend && pricingBody) {
        pricingBody.innerHTML = `
            <tr>
                <td>Theo giờ</td>
                <td class="price-val">${pWeekday.PricePerHour.toLocaleString('vi-VN')}đ</td>
                <td class="price-val">${pWeekend.PricePerHour.toLocaleString('vi-VN')}đ</td>
            </tr>
            <tr>
                <td>Nửa ngày (4h)</td>
                <td class="price-val">${pWeekday.PriceHalfDay.toLocaleString('vi-VN')}đ</td>
                <td class="price-val">${pWeekend.PriceHalfDay.toLocaleString('vi-VN')}đ</td>
            </tr>
            <tr>
                <td>Cả ngày (8h)</td>
                <td class="price-val">${pWeekday.PriceFullDay.toLocaleString('vi-VN')}đ</td>
                <td class="price-val">${pWeekend.PriceFullDay.toLocaleString('vi-VN')}đ</td>
            </tr>
        `;
    }

    // 5. Đổ danh sách Dịch vụ thêm (Add-ons)
    const addonsContainer = document.getElementById("formAddons");
    if(addonsContainer) {
        addonsContainer.innerHTML = "";
        globalData.addons.forEach(addon => {
            addonsContainer.innerHTML += `
                <div class="addon-item">
                    <label>
                        <input type="checkbox" class="addon-checkbox" value="${addon.ID}" data-price="${addon.Price}">
                        ${addon.AddonName} (${addon.Unit})
                    </label>
                    <span class="addon-price">+${addon.Price.toLocaleString('vi-VN')}đ</span>
                </div>
            `;
        });
    }

    // 6. Gắn sự kiện tính lại tiền
    const formInputs = document.querySelectorAll("#formDate, #formStartTime, #formEndTime");
    formInputs.forEach(input => input.addEventListener("change", () => calculateTotal(room.ID)));
    
    document.querySelectorAll(".addon-checkbox").forEach(cb => {
        cb.addEventListener("change", () => calculateTotal(room.ID));
    });
}

// Hàm thuật toán tính tiền thông minh
function calculateTotal(roomId) {
    const dateVal = document.getElementById("formDate").value;
    const startVal = document.getElementById("formStartTime").value;
    const endVal = document.getElementById("formEndTime").value;
    const totalPriceEl = document.getElementById("formTotalPrice");

    if (!dateVal || !startVal || !endVal || !totalPriceEl) return;

    // Tính tổng số giờ
    const start = new Date(`1970-01-01T${startVal}:00`);
    const end = new Date(`1970-01-01T${endVal}:00`);
    let diffHours = (end - start) / (1000 * 60 * 60);
    
    if (diffHours <= 0) {
        totalPriceEl.textContent = "Giờ không hợp lệ";
        return;
    }

    // Xác định là ngày thường hay cuối tuần
    const dayOfWeek = new Date(dateVal).getDay();
    const dayType = (dayOfWeek === 0 || dayOfWeek === 6) ? "Weekend" : "Weekday";

    const pricing = globalData.pricing.find(p => p.RoomID === roomId && p.DayType === dayType);
    if (!pricing) return;

    // Tính giá phòng
    let roomTotal = 0;
    if (diffHours >= 8) {
         roomTotal = pricing.PriceFullDay + (diffHours - 8) * pricing.PricePerHour;
    } else if (diffHours >= 4) {
         roomTotal = pricing.PriceHalfDay + (diffHours - 4) * pricing.PricePerHour;
    } else {
         roomTotal = diffHours * pricing.PricePerHour;
    }

    // Tính giá Addons
    let addonsTotal = 0;
    document.querySelectorAll(".addon-checkbox:checked").forEach(cb => {
        addonsTotal += parseInt(cb.getAttribute("data-price"));
    });

    // Cập nhật giao diện
    const finalTotal = roomTotal + addonsTotal;
    totalPriceEl.textContent = finalTotal.toLocaleString('vi-VN') + "đ";
    totalPriceEl.setAttribute("data-total", finalTotal); 
}

// --- XỬ LÝ SỰ KIỆN SUBMIT ĐƠN ĐẶT PHÒNG ---
// Đoạn mã này nằm NGOÀI hàm calculateTotal
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
    bookingForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const submitBtn = document.getElementById("btnSubmitBooking");
        const msgBox = document.getElementById("bookingMessage");
        
        const urlParams = new URLSearchParams(window.location.search);
        const roomId = urlParams.get('id');
        
        const payload = {
            RoomID: roomId,
            BookingDate: document.getElementById("formDate").value,
            StartTime: document.getElementById("formStartTime").value,
            EndTime: document.getElementById("formEndTime").value,
            CustomerName: document.getElementById("formName").value,
            Phone: document.getElementById("formPhone").value,
            Email: document.getElementById("formEmail").value,
            Company: document.getElementById("formCompany").value,
            Notes: document.getElementById("formNotes").value,
            TotalPrice: parseInt(document.getElementById("formTotalPrice").getAttribute("data-total")) || 0,
            AddonsList: []
        };

        document.querySelectorAll(".addon-checkbox:checked").forEach(cb => {
            payload.AddonsList.push({
                id: cb.value,
                name: cb.parentElement.textContent.trim().split('(')[0].trim(),
                price: cb.getAttribute("data-price")
            });
        });

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ph ph-spinner-gap spinner"></i> Đang xử lý...';
        msgBox.className = "booking-message";
        msgBox.innerHTML = "";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                redirect: "follow", // Bắt buộc cho Google Apps Script
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({ 
                    action: "createBooking", 
                    payload: payload 
                })
            });

            const result = await response.json();

            if (result.status === "success") {
                msgBox.className = "booking-message msg-success";
                msgBox.innerHTML = `🎉 ${result.data.message}<br>Mã đơn: <strong>${result.data.bookingCode}</strong>`;
                bookingForm.reset(); 
                document.getElementById("formTotalPrice").textContent = "0đ";
            } else {
                msgBox.className = "booking-message msg-error";
                msgBox.innerHTML = `⚠️ ${result.message}`;
            }

        } catch (error) {
            msgBox.className = "booking-message msg-error";
            msgBox.innerHTML = "⚠️ Lỗi kết nối mạng. Vui lòng thử lại sau.";
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Xác nhận đặt phòng';
        }
    });
}

// --- XỬ LÝ NÚT BẤM TÌM PHÒNG Ở TRANG CHỦ ---
const btnSearchHome = document.getElementById("btnSearchHome");
if (btnSearchHome) {
    btnSearchHome.addEventListener("click", () => {
        // Cuộn mượt mà xuống section có ID là 'rooms' (Phần danh sách phòng)
        const roomSection = document.getElementById("rooms");
        if (roomSection) {
            roomSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Khởi tạo hiệu ứng chuyển động AOS (Sẽ dùng ở Phần 2 bên dưới)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800, // Thời gian chạy hiệu ứng (0.8s)
        once: true,    // Chỉ chạy hiệu ứng 1 lần khi cuộn tới
        offset: 100,   // Cách màn hình 100px thì bắt đầu chạy
    });
}

// --- XỬ LÝ MENU MOBILE (HAMBURGER DỨT ĐIỂM) ---
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mainNav = document.getElementById("mainNav");

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", function(e) {
        mainNav.classList.toggle("active");
        
        // Đổi icon từ ph-list sang ph-x
        const icon = mobileMenuBtn.querySelector("i");
        if (mainNav.classList.contains("active")) {
            icon.className = "ph ph-x";
        } else {
            icon.className = "ph ph-list";
        }
    });
}

// --- CÁC HÀM DÀNH CHO TRANG TIN TỨC ---

// Hàm phụ trợ: Chuyển ngày ISO sang ngày Việt Nam trên Web
function formatWebDate(val) {
    if(!val) return "";
    let str = String(val);
    if(!str.includes('T')) return str;
    try { return new Date(str).toLocaleDateString('vi-VN'); } catch(e) { return str; }
}

// 1. Trang danh sách tin (news.html)
function renderNewsList() {
    const newsGrid = document.getElementById("newsGrid");
    if(!newsGrid) return;
    
    const searchInput = document.getElementById('newsSearchInput');
    const filterInput = document.getElementById('newsCategoryFilter');
    const searchText = searchInput ? searchInput.value.toLowerCase() : "";
    const filterCategory = filterInput ? filterInput.value : "all";

    newsGrid.innerHTML = "";

    let publishedNews = globalData.news.filter(n => n.Status === "Published").reverse();

    if(searchText) { publishedNews = publishedNews.filter(n => n.Title.toLowerCase().includes(searchText)); }
    if(filterCategory !== "all") { publishedNews = publishedNews.filter(n => n.Category === filterCategory); }

    if(publishedNews.length === 0) {
        newsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);'>Chưa có bài viết nào phù hợp.</p>";
        return;
    }

    publishedNews.forEach(n => {
        const article = document.createElement("article");
        article.className = "news-card";
        article.innerHTML = `
            <div class="news-img"><img src="${n.Image}" alt="${n.Title}"></div>
            <div class="news-content">
                <span class="news-date">${formatWebDate(n.Date)} • ${n.Category}</span>
                <h3 class="news-title"><a href="post.html?id=${n.ID}">${n.Title}</a></h3>
                <p class="news-excerpt">${n.Excerpt}</p>
                <a href="post.html?id=${n.ID}" class="read-more">Xem chi tiết <i class="ph ph-arrow-right"></i></a>
            </div>
        `;
        newsGrid.appendChild(article);
    });
}

// Bắt sự kiện gõ phím tìm kiếm ở trang Tin tức
document.addEventListener('DOMContentLoaded', () => {
    const newsSearch = document.getElementById('newsSearchInput');
    const newsFilter = document.getElementById('newsCategoryFilter');
    if(newsSearch) newsSearch.addEventListener('input', renderNewsList);
    if(newsFilter) newsFilter.addEventListener('change', renderNewsList);
});

// 2. Trang đọc bài chi tiết (post.html)
function renderPostDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (!postId) return;

    const post = globalData.news.find(n => n.ID === postId);
    if (!post || post.Status !== "Published") {
        const container = document.getElementById("postContainer");
        if(container) container.innerHTML = "<h2 style='text-align:center; padding:100px 0;'>Bài viết không tồn tại hoặc đã bị ẩn!</h2>";
        return;
    }

    // Đổ dữ liệu vào các thẻ HTML tương ứng (Đã ép dùng formatWebDate)
    if(document.getElementById("postCategory")) document.getElementById("postCategory").textContent = post.Category;
    if(document.getElementById("postTitle")) document.getElementById("postTitle").textContent = post.Title;
    if(document.getElementById("postDate")) document.getElementById("postDate").textContent = formatWebDate(post.Date);
    if(document.getElementById("postContent")) document.getElementById("postContent").innerHTML = post.Content;
    
    // Đổi tiêu đề tab trình duyệt
    document.title = post.Title + " - Co.Lab Study Hub";
}

// Bắt sự kiện gõ phím tìm kiếm ở trang Tin tức
document.addEventListener('DOMContentLoaded', () => {
    const newsSearch = document.getElementById('newsSearchInput');
    const newsFilter = document.getElementById('newsCategoryFilter');
    if(newsSearch) newsSearch.addEventListener('input', renderNewsList);
    if(newsFilter) newsFilter.addEventListener('change', renderNewsList);
});

// 3. Trang chủ (index.html) - Lấy 3 bài mới nhất
function renderHomeNews() {
    const homeGrid = document.getElementById("homeNewsGrid");
    if(!homeGrid) return;
    
    // Lấy bài đã xuất bản, đảo ngược (mới nhất lên đầu) và CẮT LẤY 3 BÀI ĐẦU TIÊN
    const latestNews = globalData.news
        .filter(n => n.Status === "Published")
        .reverse()
        .slice(0, 3);

    homeGrid.innerHTML = "";

    if(latestNews.length === 0) {
        homeGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--text-light);'>Đang cập nhật bài viết...</p>";
        return;
    }

    latestNews.forEach(n => {
        const article = document.createElement("article");
        article.className = "news-card";
        article.innerHTML = `
            <div class="news-img"><img src="${n.Image}" alt="${n.Title}"></div>
            <div class="news-content">
                <span class="news-date">${formatWebDate(n.Date)} • ${n.Category}</span>
                <h3 class="news-title" style="font-size: 18px;"><a href="post.html?id=${n.ID}">${n.Title}</a></h3>
                <p class="news-excerpt" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px;">${n.Excerpt}</p>
                <a href="post.html?id=${n.ID}" class="read-more">Xem chi tiết <i class="ph ph-arrow-right"></i></a>
            </div>
        `;
        homeGrid.appendChild(article);
    });
}

// 4. Trang chủ - Lấy các phòng có đánh dấu Featured = TRUE
function renderHomeRooms() {
    const homeRoomGrid = document.getElementById("roomGrid");
    if(!homeRoomGrid) return;

    homeRoomGrid.innerHTML = "";

    // Lọc các phòng đang Active VÀ có cột Featured là TRUE (hoặc true/x)
    const featuredRooms = globalData.rooms.filter(r => {
        return r.Status === "Active" && (r.Featured === true || String(r.Featured).toUpperCase() === "TRUE");
    });

    if(featuredRooms.length === 0) {
        homeRoomGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px;'>Đang cập nhật không gian nổi bật...</p>";
        return;
    }

    featuredRooms.forEach(room => {
        const pw = globalData.pricing.find(p => p.RoomID === room.ID && p.DayType === 'Weekday');
        const price = pw ? pw.PricePerHour.toLocaleString('vi-VN') + 'đ/h' : 'Liên hệ';
        
        const branch = globalData.branches.find(b => b.ID === room.BranchID);
        const branchName = branch ? branch.BranchName : "Co.Lab";
        
        const firstImage = room.Images.split(",")[0].trim() || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80";

        const card = document.createElement("a");
        card.href = `room.html?id=${room.ID}`;
        card.className = "room-card";
        card.style.display = "block";
        card.style.color = "inherit";
        card.style.textDecoration = "none";
        
        card.innerHTML = `
            <div class="room-img-wrapper">
                <span class="room-badge">Hot</span>
                <img src="${firstImage}" alt="${room.RoomName}">
            </div>
            <div class="room-info">
                <h3 class="room-title">${room.RoomName}</h3>
                <div class="room-meta">
                    <span><i class="ph ph-users"></i> ${room.Capacity} người</span>
                    <span><i class="ph ph-map-pin"></i> ${branchName}</span>
                </div>
                <div class="room-price">${price} <span>/ giờ</span></div>
                <div class="btn btn-outline" style="margin-top: 16px; width: 100%; text-align: center;">Xem chi tiết</div>
            </div>
        `;
        homeRoomGrid.appendChild(card);
    });
}
// DỮ LIỆU SẢN PHẨM (Sử dụng ảnh photo.jpg đến photo6.jpg từ máy của bạn)
const products = [
    { id: 1, category: 'ban', title: 'Bàn Trà Óc Chó Premium', price: 45000000, img: 'photo1.jpg' },
    { id: 2, category: 'ban', title: 'Bàn Aurora Minimalist', price: 28000000, img: 'photo.jpg' },
    { id: 3, category: 'ke', title: 'Kệ Tivi Gỗ Sồi Nga', price: 12500000, img: 'photo2.jpg' },
    { id: 4, category: 'ghe', title: 'Ghế Armchair Da Ý', price: 15500000, img: 'photo3.jpg' },
    { id: 5, category: 'ban', title: 'Bàn Ăn Gỗ Nguyên Tấm', price: 68000000, img: 'photo4.jpg' },
    { id: 6, category: 'ke', title: 'Tủ Rượu Gỗ Gõ Đỏ', price: 32000000, img: 'photo5.jpg' }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// HIỂN THỊ SẢN PHẨM
function renderProducts(data = products) {
    const grid = document.getElementById('product-grid');
    if (data.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Không tìm thấy sản phẩm nào.</p>`;
        return;
    }
    grid.innerHTML = data.map(p => `
        <div class="product-card">
            <div class="product-img">
                <img src="${p.img}" alt="${p.title}">
                <div class="overlay-btn">
                    <button onclick="addToCart(${p.id})"><i class="fa fa-cart-plus"></i> Thêm vào giỏ</button>
                </div>
            </div>
            <div class="product-info">
                <span style="font-size: 10px; color: #999;">${p.category.toUpperCase()}</span>
                <h3>${p.title}</h3>
                <p class="price">${p.price.toLocaleString()}đ</p>
            </div>
        </div>
    `).join('');
}

// BỘ LỌC
function filterProducts(cat) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    renderProducts(filtered);
}

// TÌM KIẾM
function searchProduct() {
    const val = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(val));
    renderProducts(filtered);
}

// QUẢN LÝ GIỎ HÀNG
function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push({ ...item, cartId: Date.now() });
    updateCart();
    toggleCart(); // Mở giỏ hàng khi thêm
}

function removeFromCart(cartId) {
    cart = cart.filter(i => i.cartId !== cartId);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;

    const itemsContainer = document.getElementById('cart-items');
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align: center; color: #999;">Giỏ hàng trống</p>';
    } else {
        itemsContainer.innerHTML = cart.map(i => `
            <div class="cart-item">
                <img src="${i.img}" width="60" height="60" style="object-fit: cover; border-radius: 4px;">
                <div style="flex: 1">
                    <p style="font-size: 14px; font-weight: 500;">${i.title}</p>
                    <p style="color: var(--gold); font-size: 13px;">${i.price.toLocaleString()}đ</p>
                </div>
                <button onclick="removeFromCart(${i.cartId})" class="btn-del">&times;</button>
            </div>
        `).join('');
    }

    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cart-total').innerText = total.toLocaleString() + 'đ';
}

function toggleCart() {
    const m = document.getElementById('cart-modal');
    m.style.display = (m.style.display === 'block') ? 'none' : 'block';
}

// THANH TOÁN QUA ZALO
function checkout() {
    if (!cart.length) return alert('Giỏ hàng của bạn đang trống!');
    
    let message = `Chào HTWOOD, tôi muốn đặt các sản phẩm sau:\n`;
    cart.forEach((i, idx) => {
        message += `${idx + 1}. ${i.title} - ${i.price.toLocaleString()}đ\n`;
    });
    message += `------------------\nTổng cộng: ${document.getElementById('cart-total').innerText}`;
    
    const zaloUrl = `https://zalo.me/0989857394?text=${encodeURIComponent(message)}`;
    window.open(zaloUrl, '_blank');
}

// CUỘN TRANG MƯỢT
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// KHỞI CHẠY
renderProducts();
updateCart();
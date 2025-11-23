const API_URL = 'https://nav.goodgan.top/api/data'; // Cloudflare Worker API

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    startClock();

    document.getElementById('searchInput').addEventListener('input', filterBookmarks);
    document.getElementById('categoryFilter').addEventListener('change', filterBookmarks);
});

let allBookmarks = [];
let allCategories = [];
let currentPage = 1;
const itemsPerPage = 12;

async function fetchData() {
    try {
        // In a real scenario, we fetch from the worker. 
        // For local dev without the worker running on the same port/proxy, 
        // we might need to mock or ensure CORS is set up.
        // Assuming the worker is running on 8787.
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        allBookmarks = data.bookmarks.map(bm => ({
            ...bm,
            pinned: bm.pinned || false
        }));
        allCategories = data.categories;

        renderCategories();
        filterBookmarks();  // 调用 filterBookmarks 来触发排序和渲染
    } catch (error) {
        console.error('Error:', error);
        // Fallback for demo if backend not running
        // renderBookmarks([]); 
    }
}

function renderCategories() {
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '<option value="">所有分类</option>';
    allCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

function renderBookmarks(bookmarks) {
    const grid = document.getElementById('bookmarkGrid');
    grid.innerHTML = '';

    // 更新总数
    document.getElementById('totalCount').textContent = bookmarks.length;

    if (bookmarks.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted">没有找到书签</div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    // 计算分页
    const totalPages = Math.ceil(bookmarks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBookmarks = bookmarks.slice(startIndex, endIndex);

    // 渲染当前页的书签
    currentBookmarks.forEach(bm => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3';

        const card = document.createElement('div');
        card.className = 'card h-100' + (bm.pinned ? ' border-success' : '');
        card.onclick = () => window.open(bm.url, '_blank');

        // 自动获取网站图标
        const getIconUrl = (url, customIcon) => {
            if (customIcon) return customIcon;
            try {
                const domain = new URL(url).hostname;
                // 使用 Google Favicon API
                return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            } catch {
                return '';
            }
        };

        const iconUrl = getIconUrl(bm.url, bm.icon);
        const iconHtml = iconUrl
            ? `<img src="${iconUrl}" class="bookmark-icon mb-3" alt="${bm.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
               <div class="bookmark-icon mb-3" style="display:none;">${bm.name.charAt(0).toUpperCase()}</div>`
            : `<div class="bookmark-icon mb-3">${bm.name.charAt(0).toUpperCase()}</div>`;

        const catName = allCategories.find(c => c.id == bm.categoryId)?.name || '未分类';
        const pinnedBadge = bm.pinned ? '<span class="pinned-badge">📌</span>' : '';

        card.innerHTML = `
            <div class="tooltip-desc">${bm.desc || bm.name}</div>
            ${pinnedBadge}
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    ${iconHtml}
                    <span class="category-badge">${catName}</span>
                </div>
                <h5 class="bookmark-title">${bm.name}</h5>
                <p class="bookmark-desc" title="${bm.desc}">${bm.desc}</p>
            </div>
        `;

        col.appendChild(card);
        grid.appendChild(col);
    });

    // 渲染分页
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // 上一页
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">上一页</a>`;
    pagination.appendChild(prevLi);

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>`;
            pagination.appendChild(li);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const li = document.createElement('li');
            li.className = 'page-item disabled';
            li.innerHTML = '<span class="page-link">...</span>';
            pagination.appendChild(li);
        }
    }

    // 下一页
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">下一页</a>`;
    pagination.appendChild(nextLi);
}

function changePage(page) {
    currentPage = page;
    filterBookmarks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterBookmarks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const catId = document.getElementById('categoryFilter').value;

    let filtered = allBookmarks.filter(bm => {
        const matchesSearch = bm.name.toLowerCase().includes(searchTerm) ||
            bm.url.toLowerCase().includes(searchTerm) ||
            bm.desc.toLowerCase().includes(searchTerm);
        const matchesCat = catId ? bm.categoryId == catId : true;
        return matchesSearch && matchesCat;
    });

    // 置顶书签排在前面，置顶之下按时间倒序排序
    filtered.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        // 同为置顶或同为非置顶时，按时间倒序（新的在前）
        const timeA = a.createdAt || a.id;
        const timeB = b.createdAt || b.id;
        return timeB - timeA;
    });

    renderBookmarks(filtered);
}

function startClock() {
    const clockEl = document.getElementById('clock');
    const update = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
        clockEl.textContent = `${dateStr} ${timeStr}`;
    };
    update();
    setInterval(update, 1000);
}

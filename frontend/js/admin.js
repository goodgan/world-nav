const API_URL = 'https://nav.goodgan.top/api'; // Cloudflare Worker API

let authToken = null;
let currentSalt = 'admin'; // 默认 salt，登录后会更新
let allBookmarks = [];
let allCategories = [];
let filteredBookmarks = [];
let currentPage = 1;
const itemsPerPage = 10;
let bookmarkModal, categoryModal;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap modals
    bookmarkModal = new bootstrap.Modal(document.getElementById('bookmarkModal'));
    categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));

    // 检查是否已登录
    const savedToken = localStorage.getItem('authToken');
    const savedSalt = localStorage.getItem('salt');
    if (savedToken) {
        authToken = savedToken;
        currentSalt = savedSalt || 'admin';
        showAdminSection();
        fetchData();
    }

    // 启用登录表单
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordChange);

    // 添加搜索和筛选监听
    document.getElementById('adminSearchInput').addEventListener('input', filterAndRenderBookmarks);
    document.getElementById('adminCategoryFilter').addEventListener('change', filterAndRenderBookmarks);
});

async function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('passwordInput').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await res.json();
        if (data.success) {
            authToken = data.token;
            currentSalt = data.salt; // 保存 salt
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('salt', currentSalt);
            showAdminSection();
            fetchData();
            document.getElementById('passwordInput').value = '';
        } else {
            alert('密码错误！');
        }
    } catch (err) {
        console.error(err);
        alert('登录失败: ' + err.message);
    }
}

function showAdminSection() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'block';
}

function logout() {
    authToken = null;
    currentSalt = 'admin';
    localStorage.removeItem('authToken');
    localStorage.removeItem('salt');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminSection').style.display = 'none';
}

// 切换密码显示/隐藏
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

async function fetchData() {
    try {
        const res = await fetch(`${API_URL}/data`);
        const data = await res.json();
        allBookmarks = data.bookmarks.map(bm => ({
            ...bm,
            pinned: bm.pinned || false
        }));
        allCategories = data.categories;
        renderAdminCategoryFilter();
        filterAndRenderBookmarks();
        renderCategoryTable();
    } catch (err) {
        console.error(err);
    }
}

function renderAdminCategoryFilter() {
    const select = document.getElementById('adminCategoryFilter');
    select.innerHTML = '<option value="">所有分类</option>';
    allCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

async function saveData(newData) {
    try {
        const res = await fetch(`${API_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(newData)
        });
        if (!res.ok) throw new Error('Failed to save');
        fetchData();
    } catch (err) {
        alert('保存失败: ' + err.message);
    }
}

// 搜索和筛选功能
function filterAndRenderBookmarks() {
    const searchTerm = document.getElementById('adminSearchInput').value.toLowerCase();
    const catId = document.getElementById('adminCategoryFilter').value;

    filteredBookmarks = allBookmarks.filter(bm => {
        const matchesSearch = bm.name.toLowerCase().includes(searchTerm) ||
            bm.url.toLowerCase().includes(searchTerm) ||
            (bm.desc && bm.desc.toLowerCase().includes(searchTerm));
        const matchesCat = catId ? bm.categoryId == catId : true;
        return matchesSearch && matchesCat;
    });

    // 置顶书签排在前面，置顶之下按时间倒序排序
    filteredBookmarks.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        // 同为置顶或同为非置顶时，按时间倒序（新的在前）
        const timeA = a.createdAt || a.id;
        const timeB = b.createdAt || b.id;
        return timeB - timeA;
    });

    currentPage = 1;
    renderBookmarkTable();
}

// Bookmarks
function renderBookmarkTable() {
    const tbody = document.getElementById('bookmarkTableBody');
    tbody.innerHTML = '';

    // 更新总数
    document.getElementById('adminTotalCount').textContent = filteredBookmarks.length;

    if (filteredBookmarks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">没有找到书签</td></tr>';
        document.getElementById('adminPagination').innerHTML = '';
        return;
    }

    // 计算分页
    const totalPages = Math.ceil(filteredBookmarks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBookmarks = filteredBookmarks.slice(startIndex, endIndex);

    currentBookmarks.forEach(bm => {
        const catName = allCategories.find(c => c.id == bm.categoryId)?.name || '未知';
        const pinnedBadge = bm.pinned ? '<span class="badge bg-success text-white">📌 已置顶</span>' : '<span class="badge bg-secondary">未置顶</span>';
        const tr = document.createElement('tr');
        tr.className = bm.pinned ? 'table-success' : '';
        tr.innerHTML = `
            <td>${bm.id}</td>
            <td>${bm.name}</td>
            <td><a href="${bm.url}" target="_blank" class="text-truncate" style="max-width: 300px; display: inline-block;">${bm.url}</a></td>
            <td><span class="badge bg-light text-dark border">${catName}</span></td>
            <td>${pinnedBadge}</td>
            <td>
                <button class="btn btn-sm btn-success" onclick="togglePin(${bm.id})" title="${bm.pinned ? '取消置顶' : '置顶书签'}">
                    ${bm.pinned ? '📌' : '📍'}
                </button>
                <button class="btn btn-sm btn-primary" onclick="editBookmark(${bm.id})">编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deleteBookmark(${bm.id})">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // 渲染分页
    renderAdminPagination(totalPages);
}

function renderAdminPagination(totalPages) {
    const pagination = document.getElementById('adminPagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // 上一页
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changeAdminPage(${currentPage - 1}); return false;">上一页</a>`;
    pagination.appendChild(prevLi);

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" onclick="changeAdminPage(${i}); return false;">${i}</a>`;
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
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changeAdminPage(${currentPage + 1}); return false;">下一页</a>`;
    pagination.appendChild(nextLi);
}

function changeAdminPage(page) {
    currentPage = page;
    renderBookmarkTable();
    document.getElementById('bookmarks').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 置顶功能
function togglePin(id) {
    const bm = allBookmarks.find(b => b.id === id);
    if (!bm) return;

    if (!bm.pinned) {
        // 检查置顶数量
        const pinnedCount = allBookmarks.filter(b => b.pinned).length;
        if (pinnedCount >= 4) {
            alert('置顶书签已满，如需置顶请先撤销其他书签置顶！');
            return;
        }
    }

    bm.pinned = !bm.pinned;
    saveData({ bookmarks: allBookmarks, categories: allCategories });
}

function showAddBookmarkModal() {
    document.getElementById('bookmarkForm').reset();
    document.getElementById('bmId').value = '';
    document.getElementById('bookmarkModalTitle').textContent = '添加书签';
    renderCategoryOptions();
    bookmarkModal.show();
}

function renderCategoryOptions() {
    const select = document.getElementById('bmCategory');
    select.innerHTML = '';
    allCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

function editBookmark(id) {
    const bm = allBookmarks.find(b => b.id === id);
    if (!bm) return;

    document.getElementById('bmId').value = bm.id;
    document.getElementById('bmName').value = bm.name;
    document.getElementById('bmUrl').value = bm.url;
    document.getElementById('bmDesc').value = bm.desc || '';
    document.getElementById('bmPinned').checked = bm.pinned || false;
    renderCategoryOptions();
    document.getElementById('bmCategory').value = bm.categoryId;

    document.getElementById('bookmarkModalTitle').textContent = '编辑书签';
    bookmarkModal.show();
}

function saveBookmark() {
    const id = document.getElementById('bmId').value;
    const name = document.getElementById('bmName').value;
    let url = document.getElementById('bmUrl').value.trim();
    const categoryId = parseInt(document.getElementById('bmCategory').value);
    const desc = document.getElementById('bmDesc').value;
    const pinned = document.getElementById('bmPinned').checked;

    if (!name || !url || !categoryId) {
        alert('请填写必填项');
        return;
    }

    // 自动添加协议前缀
    if (!url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
    }

    // 自动获取图标
    let icon = '';
    try {
        const urlObj = new URL(url);
        icon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch (e) {
        icon = ''; // URL解析失败，使用空字符串
    }

    let newBookmarks = [...allBookmarks];

    // 检查置顶数量限制
    if (pinned) {
        const pinnedCount = newBookmarks.filter(b => b.pinned && b.id != id).length;
        if (pinnedCount >= 4) {
            alert('置顶书签已满，如需置顶请先撤销其他书签置顶！');
            return;
        }
    }

    if (id) {
        const index = newBookmarks.findIndex(b => b.id == id);
        if (index !== -1) {
            newBookmarks[index] = { ...newBookmarks[index], name, url, categoryId, icon, desc, pinned };
        }
    } else {
        const newId = newBookmarks.length > 0 ? Math.max(...newBookmarks.map(b => b.id)) + 1 : 1;
        const createdAt = Date.now();
        newBookmarks.push({ id: newId, categoryId, name, url, icon, desc, pinned, createdAt });
    }

    saveData({ bookmarks: newBookmarks, categories: allCategories });
    bookmarkModal.hide();
}

function deleteBookmark(id) {
    if (!confirm('确定删除吗？')) return;
    const newBookmarks = allBookmarks.filter(b => b.id !== id);
    saveData({ bookmarks: newBookmarks, categories: allCategories });
}

// Categories
function renderCategoryTable() {
    const tbody = document.getElementById('categoryTableBody');
    tbody.innerHTML = '';
    allCategories.forEach(cat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editCategory(${cat.id})">编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategory(${cat.id})">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showAddCategoryModal() {
    document.getElementById('categoryForm').reset();
    document.getElementById('catId').value = '';
    document.getElementById('categoryModalTitle').textContent = '添加分类';
    categoryModal.show();
}

function editCategory(id) {
    const cat = allCategories.find(c => c.id === id);
    if (!cat) return;

    document.getElementById('catId').value = cat.id;
    document.getElementById('catName').value = cat.name;
    document.getElementById('categoryModalTitle').textContent = '编辑分类';
    categoryModal.show();
}

function saveCategory() {
    const id = document.getElementById('catId').value;
    const name = document.getElementById('catName').value;

    if (!name) {
        alert('请填写名称');
        return;
    }

    let newCategories = [...allCategories];
    if (id) {
        const index = newCategories.findIndex(c => c.id == id);
        if (index !== -1) {
            newCategories[index] = { ...newCategories[index], name };
        }
    } else {
        const newId = newCategories.length > 0 ? Math.max(...newCategories.map(c => c.id)) + 1 : 1;
        newCategories.push({ id: newId, name });
    }

    saveData({ bookmarks: allBookmarks, categories: newCategories });
    categoryModal.hide();
}

function deleteCategory(id) {
    if (!confirm('确定删除吗？这将同时删除该分类下的所有书签！')) return;
    const newCategories = allCategories.filter(c => c.id !== id);
    const newBookmarks = allBookmarks.filter(b => b.categoryId !== id);
    saveData({ bookmarks: newBookmarks, categories: newCategories });
}

// Password
async function handlePasswordChange(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const newSaltInput = document.getElementById('newSalt').value;

    if (!currentPassword || !newPassword) {
        alert('请填写当前密码和新密码');
        return;
    }

    // 确定新的 salt（留空则保持原salt不变）
    const finalSalt = newSaltInput.trim();

    try {
        const res = await fetch(`${API_URL}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                newSalt: finalSalt
            })
        });

        const data = await res.json();
        if (data.success) {
            alert('密码修改成功，请重新登录！');
            logout();
        } else {
            alert('修改失败: ' + (data.error || '未知错误'));
        }
    } catch (err) {
        alert('修改失败: ' + err.message);
    }
}

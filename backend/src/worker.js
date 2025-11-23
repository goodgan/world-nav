// 内联 MD5 函数（用于网页端部署）
function md5(string) {
    function rotateLeft(value, shift) {
        return (value << shift) | (value >>> (32 - shift));
    }
    function addUnsigned(x, y) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function md5cmn(q, a, b, x, s, t) {
        return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, q), addUnsigned(x, t)), s), b);
    }
    function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function convertToWordArray(string) {
        let wordArray = [];
        for (let i = 0; i < string.length * 8; i += 8) {
            wordArray[i >> 5] |= (string.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return wordArray;
    }
    function wordToHex(value) {
        let hex = '', byte;
        for (let i = 0; i < 4; i++) {
            byte = (value >>> (i * 8)) & 0xFF;
            hex += ('0' + byte.toString(16)).slice(-2);
        }
        return hex;
    }
    function utf8Encode(string) {
        return unescape(encodeURIComponent(string));
    }

    let x = convertToWordArray(utf8Encode(string));
    let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;

    x[string.length * 8 >> 5] |= 0x80 << (string.length * 8 % 32);
    x[(((string.length * 8 + 64) >>> 9) << 4) + 14] = string.length * 8;

    for (let i = 0; i < x.length; i += 16) {
        let olda = a, oldb = b, oldc = c, oldd = d;
        a = md5ff(a, b, c, d, x[i + 0], 7, 0xD76AA478);
        d = md5ff(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
        c = md5ff(c, d, a, b, x[i + 2], 17, 0x242070DB);
        b = md5ff(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
        a = md5ff(a, b, c, d, x[i + 4], 7, 0xF57C0FAF);
        d = md5ff(d, a, b, c, x[i + 5], 12, 0x4787C62A);
        c = md5ff(c, d, a, b, x[i + 6], 17, 0xA8304613);
        b = md5ff(b, c, d, a, x[i + 7], 22, 0xFD469501);
        a = md5ff(a, b, c, d, x[i + 8], 7, 0x698098D8);
        d = md5ff(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
        c = md5ff(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1);
        b = md5ff(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
        a = md5ff(a, b, c, d, x[i + 12], 7, 0x6B901122);
        d = md5ff(d, a, b, c, x[i + 13], 12, 0xFD987193);
        c = md5ff(c, d, a, b, x[i + 14], 17, 0xA679438E);
        b = md5ff(b, c, d, a, x[i + 15], 22, 0x49B40821);
        a = md5gg(a, b, c, d, x[i + 1], 5, 0xF61E2562);
        d = md5gg(d, a, b, c, x[i + 6], 9, 0xC040B340);
        c = md5gg(c, d, a, b, x[i + 11], 14, 0x265E5A51);
        b = md5gg(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA);
        a = md5gg(a, b, c, d, x[i + 5], 5, 0xD62F105D);
        d = md5gg(d, a, b, c, x[i + 10], 9, 0x02441453);
        c = md5gg(c, d, a, b, x[i + 15], 14, 0xD8A1E681);
        b = md5gg(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
        a = md5gg(a, b, c, d, x[i + 9], 5, 0x21E1CDE6);
        d = md5gg(d, a, b, c, x[i + 14], 9, 0xC33707D6);
        c = md5gg(c, d, a, b, x[i + 3], 14, 0xF4D50D87);
        b = md5gg(b, c, d, a, x[i + 8], 20, 0x455A14ED);
        a = md5gg(a, b, c, d, x[i + 13], 5, 0xA9E3E905);
        d = md5gg(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
        c = md5gg(c, d, a, b, x[i + 7], 14, 0x676F02D9);
        b = md5gg(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);
        a = md5hh(a, b, c, d, x[i + 5], 4, 0xFFFA3942);
        d = md5hh(d, a, b, c, x[i + 8], 11, 0x8771F681);
        c = md5hh(c, d, a, b, x[i + 11], 16, 0x6D9D6122);
        b = md5hh(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
        a = md5hh(a, b, c, d, x[i + 1], 4, 0xA4BEEA44);
        d = md5hh(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
        c = md5hh(c, d, a, b, x[i + 7], 16, 0xF6BB4B60);
        b = md5hh(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
        a = md5hh(a, b, c, d, x[i + 13], 4, 0x289B7EC6);
        d = md5hh(d, a, b, c, x[i + 0], 11, 0xEAA127FA);
        c = md5hh(c, d, a, b, x[i + 3], 16, 0xD4EF3085);
        b = md5hh(b, c, d, a, x[i + 6], 23, 0x04881D05);
        a = md5hh(a, b, c, d, x[i + 9], 4, 0xD9D4D039);
        d = md5hh(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
        c = md5hh(c, d, a, b, x[i + 15], 16, 0x1FA27CF8);
        b = md5hh(b, c, d, a, x[i + 2], 23, 0xC4AC5665);
        a = md5ii(a, b, c, d, x[i + 0], 6, 0xF4292244);
        d = md5ii(d, a, b, c, x[i + 7], 10, 0x432AFF97);
        c = md5ii(c, d, a, b, x[i + 14], 15, 0xAB9423A7);
        b = md5ii(b, c, d, a, x[i + 5], 21, 0xFC93A039);
        a = md5ii(a, b, c, d, x[i + 12], 6, 0x655B59C3);
        d = md5ii(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
        c = md5ii(c, d, a, b, x[i + 10], 15, 0xFFEFF47D);
        b = md5ii(b, c, d, a, x[i + 1], 21, 0x85845DD1);
        a = md5ii(a, b, c, d, x[i + 8], 6, 0x6FA87E4F);
        d = md5ii(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
        c = md5ii(c, d, a, b, x[i + 6], 15, 0xA3014314);
        b = md5ii(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
        a = md5ii(a, b, c, d, x[i + 4], 6, 0xF7537E82);
        d = md5ii(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
        c = md5ii(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB);
        b = md5ii(b, c, d, a, x[i + 9], 21, 0xEB86D391);
        a = addUnsigned(a, olda);
        b = addUnsigned(b, oldb);
        c = addUnsigned(c, oldc);
        d = addUnsigned(d, oldd);
    }
    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}


export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            if (path === '/api/data' && method === 'GET') {
                return await handleGetData(env, corsHeaders);
            } else if (path === '/api/login' && method === 'POST') {
                return await handleLogin(request, env, corsHeaders);
            } else if (path === '/api/data' && method === 'POST') {
                return await handleUpdateData(request, env, corsHeaders);
            } else if (path === '/api/password' && method === 'PUT') {
                return await handleUpdatePassword(request, env, corsHeaders);
            }

            return new Response('Not Found', { status: 404, headers: corsHeaders });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
        }
    },
};

async function getDb(env) {
    const data = await env.WORLD_NAV_KV.get('db');
    if (!data) {
        return {
            "categories": [
                { "id": 1, "name": "常用" },
                { "id": 2, "name": "开发" },
                { "id": 3, "name": "工具" }
            ],
            "bookmarks": [
                { "id": 1, "categoryId": 1, "name": "Google", "url": "https://google.com", "icon": "", "desc": "全球最大的搜索引擎", "pinned": false },
                { "id": 2, "categoryId": 2, "name": "GitHub", "url": "https://github.com", "icon": "", "desc": "代码托管平台", "pinned": false },
                { "id": 3, "categoryId": 3, "name": "ChatGPT", "url": "https://chat.openai.com", "icon": "", "desc": "AI 助手", "pinned": false }
            ],
            "auth": {
                "passwordHash": "f6fdffe48c908deb0f4c3bd36c032e72",
                "salt": "admin"
            }
        };
    }
    return JSON.parse(data);
}

// 获取登录失败次数和锁定状态
async function getLoginAttempts(env) {
    const data = await env.WORLD_NAV_KV.get('login_attempts');
    if (!data) {
        return { attempts: 0, lockedUntil: null };
    }
    return JSON.parse(data);
}

// 更新登录失败次数
async function updateLoginAttempts(env, attempts, lockedUntil) {
    await env.WORLD_NAV_KV.put('login_attempts', JSON.stringify({ attempts, lockedUntil }));
}

// 生成 JWT Token（简化版，包含过期时间）
function generateToken(passwordHash, salt) {
    const now = Date.now();
    const expiresAt = now + (12 * 60 * 60 * 1000); // 12小时后过期
    const payload = {
        hash: passwordHash,
        salt: salt,
        issuedAt: now,
        expiresAt: expiresAt
    };
    // 简单的 Base64 编码（生产环境应使用真正的 JWT）
    return btoa(JSON.stringify(payload));
}

// 验证 Token 是否过期
function verifyToken(token, passwordHash) {
    try {
        const payload = JSON.parse(atob(token));
        const now = Date.now();
        
        // 检查 Token 是否过期
        if (now > payload.expiresAt) {
            return { valid: false, reason: 'Token expired' };
        }
        
        // 检查 Token 的密码哈希是否匹配
        if (payload.hash !== passwordHash) {
            return { valid: false, reason: 'Token mismatch' };
        }
        
        return { valid: true, payload };
    } catch (e) {
        return { valid: false, reason: 'Invalid token' };
    }
}

async function handleGetData(env, corsHeaders) {
    const db = await getDb(env);
    // Remove sensitive auth data before sending to frontend
    const { auth, ...publicData } = db;
    return new Response(JSON.stringify(publicData), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
}

async function handleLogin(request, env, corsHeaders) {
    const { password } = await request.json();
    const db = await getDb(env);
    const { passwordHash, salt } = db.auth;
    
    // 检查登录尝试次数和锁定状态
    const loginAttempts = await getLoginAttempts(env);
    const now = Date.now();
    
    // 如果被锁定，检查是否已过期
    if (loginAttempts.lockedUntil && now < loginAttempts.lockedUntil) {
        const remainingTime = Math.ceil((loginAttempts.lockedUntil - now) / 1000 / 60); // 分钟
        return new Response(JSON.stringify({ 
            success: false, 
            error: `账户已锁定，请在 ${remainingTime} 分钟后重试` 
        }), { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    
    // 重置过期的锁定
    if (loginAttempts.lockedUntil && now >= loginAttempts.lockedUntil) {
        await updateLoginAttempts(env, 0, null);
    }

    // MD5 + Salt 验证
    const inputHash = md5(password + salt);

    if (inputHash === passwordHash) {
        // 密码正确，重置失败次数
        await updateLoginAttempts(env, 0, null);
        
        // 生成新的 Token（包含过期时间）
        const token = generateToken(passwordHash, salt);
        
        return new Response(JSON.stringify({ 
            success: true, 
            token: token,
            salt: salt,
            expiresIn: 12 * 60 * 60 // 12小时（秒）
        }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    } else {
        // 密码错误，增加失败次数
        let newAttempts = (loginAttempts.attempts || 0) + 1;
        let newLockedUntil = null;
        
        // 3次失败后锁定1小时
        if (newAttempts >= 3) {
            newLockedUntil = now + (60 * 60 * 1000); // 1小时后解锁
            await updateLoginAttempts(env, newAttempts, newLockedUntil);
            return new Response(JSON.stringify({ 
                success: false, 
                error: '密码错误次数过多，账户已锁定1小时' 
            }), { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        } else {
            await updateLoginAttempts(env, newAttempts, null);
            return new Response(JSON.stringify({ 
                success: false, 
                error: `密码错误，还有 ${3 - newAttempts} 次尝试机会` 
            }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
    }
}

async function handleUpdateData(request, env, corsHeaders) {
    // 验证 Authorization Token
    const authHeader = request.headers.get('Authorization');
    const db = await getDb(env);
    
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Missing authorization token' }), { 
            status: 401, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        });
    }
    
    // 验证 Token 是否有效和未过期
    const tokenVerification = verifyToken(authHeader, db.auth.passwordHash);
    if (!tokenVerification.valid) {
        return new Response(JSON.stringify({ 
            error: tokenVerification.reason === 'Token expired' ? 'Token已过期，请重新登录' : 'Invalid token' 
        }), { 
            status: 401, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        });
    }

    const newData = await request.json();
    // Merge with existing auth data to prevent overwriting it with nothing
    const toSave = { ...newData, auth: db.auth };

    await env.WORLD_NAV_KV.put('db', JSON.stringify(toSave));
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
}

async function handleUpdatePassword(request, env, corsHeaders) {
    // 验证 Authorization Token
    const authHeader = request.headers.get('Authorization');
    const db = await getDb(env);

    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Missing authorization token' }), { 
            status: 401, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        });
    }
    
    // 验证 Token 是否有效和未过期
    const tokenVerification = verifyToken(authHeader, db.auth.passwordHash);
    if (!tokenVerification.valid) {
        return new Response(JSON.stringify({ 
            error: tokenVerification.reason === 'Token expired' ? 'Token已过期，请重新登录' : 'Invalid token' 
        }), { 
            status: 401, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        });
    }

    const { currentPassword, newPassword, newSalt } = await request.json();

    // 验证当前密码
    const currentHash = md5(currentPassword + db.auth.salt);
    if (currentHash !== db.auth.passwordHash) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: '当前密码错误' 
        }), { 
            status: 401, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        });
    }

    // 更新密码和 salt
    const salt = newSalt || db.auth.salt;
    const passwordHash = md5(newPassword + salt);

    db.auth = { passwordHash, salt };

    await env.WORLD_NAV_KV.put('db', JSON.stringify(db));

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
}

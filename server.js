const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const app = express();
const PORT = 8080;

// 1. CLOUDINARY CONFIG
cloudinary.config({ 
    cloud_name: 'dnpqrvmw1', 
    api_key: '176978869326927', 
    api_secret: 'idwAc9u5DFBozl_qwWhSSghiQHc' 
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'rathi_fashion_final', allowed_formats: ['jpg', 'png', 'jpeg'] },
});
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'rathi_elite_panda', resave: false, saveUninitialized: true }));

// 2. DATABASE CONNECTION & SCHEMAS (Added Status for Inquiry)
const dbURI = 'mongodb+srv://Aman_bishnoi:amanbishnoi0029@cluster0.honvagc.mongodb.net/?appName=Cluster0';
mongoose.connect(dbURI).then(() => console.log('Rathi Fashion Master DB Connected! ✅'));

const Product = mongoose.model('Product', new mongoose.Schema({ name: String, price: String, img: String }));
const Inquiry = mongoose.model('Inquiry', new mongoose.Schema({ 
    customerName: String, phone: String, itemName: String, 
    status: { type: String, default: 'Pending' }, // NAYA FIELD: Solved mark karne ke liye
    date: { type: Date, default: Date.now } 
}));
const Admin = mongoose.model('Admin', new mongoose.Schema({ username: {type:String, default:'admin'}, password: {type:String, default:'rathi123'} }));

async function initAdmin() { if (!(await Admin.findOne())) await new Admin().save(); }
initAdmin();

// 3. MASTER STYLING (Animations + Fixes)
const style = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&family=Playfair+Display:wght@700&display=swap');
    :root { --pink: #ff80ab; --dark: #1a1a1a; --gold: #d4af37; --success: #4CAF50; }
    body { font-family: 'Poppins', sans-serif; margin: 0; background: #fdfdfd; color: #333; scroll-behavior: smooth; overflow-x: hidden; }

    /* Animations */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 128, 171, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(255, 128, 171, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 128, 171, 0); } }
    @keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
    
    .animate-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    .heart { color: #ff3366; display: inline-block; animation: heartbeat 1s infinite; font-size: 1.1rem; }

    /* Hamburger Sidebar */
    .menu-btn { position: fixed; top: 20px; right: 20px; font-size: 28px; cursor: pointer; z-index: 1001; color: white; background: var(--pink); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 5px 15px rgba(255,128,171,0.4); transition: 0.3s; }
    .menu-btn:hover { animation: pulse 1.5s infinite; }
    .sidebar { position: fixed; top: 0; right: -300px; width: 300px; height: 100%; background: white; box-shadow: -10px 0 30px rgba(0,0,0,0.1); transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1000; padding-top: 80px; }
    .sidebar a { display: block; padding: 15px 35px; text-decoration: none; color: var(--dark); font-size: 1.1rem; border-bottom: 1px solid #f0f0f0; transition: 0.3s; }
    .sidebar a:hover { background: #fff1f5; color: var(--pink); padding-left: 45px; }
    .sidebar.active { right: 0; }

    /* Hero */
    .hero { height: 60vh; background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200'); background-size: cover; background-position: center; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; animation: zoomEffect 20s infinite alternate; }
    @keyframes zoomEffect { from { transform: scale(1); } to { transform: scale(1.1); } }
    
    /* GLASSY LOGIN */
    .login-bg { height: 100vh; background: linear-gradient(45deg, #ff80ab, #fce4ec, #ffc1e3); background-size: 400% 400%; animation: liquidBg 10s infinite; display: flex; justify-content: center; align-items: center; }
    @keyframes liquidBg { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    .glass-box { background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.4); padding: 45px; border-radius: 30px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1); width: 360px; }
    .login-box input { background: rgba(255,255,255,0.5); border: none; color: #444; border-radius: 30px; margin: 15px 0; padding: 15px 25px; font-weight: 600; width: 100%; box-sizing: border-box; font-size: 1rem; transition: 0.3s; }
    .login-box input:focus { outline: none; background: white; box-shadow: 0 0 15px rgba(255, 128, 171, 0.5); }

    /* Cards & Global UI */
    .container { max-width: 1200px; margin: 40px auto; padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; position: relative; z-index: 10; } /* Bug 1 Fixed: Removed -60px margin */
    .card { background: white; padding: 20px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; border-bottom: 5px solid var(--pink); transition: transform 0.4s, box-shadow 0.4s; }
    .card:hover { transform: translateY(-12px); box-shadow: 0 15px 35px rgba(255, 128, 171, 0.2); }
    img { width: 100%; height: 260px; object-fit: cover; border-radius: 12px; }
    
    .btn { background: var(--dark); color: white; padding: 14px; border: none; cursor: pointer; width: 100%; font-weight: 600; border-radius: 30px; text-decoration: none; display: block; box-sizing: border-box; transition: 0.3s; position: relative; overflow: hidden; }
    .btn:hover { background: var(--pink); transform: scale(1.02); }
    .btn-green { background: var(--success); color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 0.8rem; font-weight: bold; }
    .form-input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #eee; border-radius: 10px; box-sizing: border-box; transition: 0.3s; }
    .form-input:focus { border-color: var(--pink); outline: none; }
</style>
<script>
    function toggleMenu() { document.getElementById('sidebar').classList.toggle('active'); }
    function toggleEditForm(id) { 
        var form = document.getElementById('edit-form-' + id);
        form.style.display = (form.style.display === 'none') ? 'block' : 'none';
    }
</script>
`;

const isAdmin = (req, res, next) => { if (req.session.isLoggedIn) next(); else res.redirect('/login'); };

// --- ROUTES ---

// 1. PUBLIC SITE
app.get('/', async (req, res) => {
    const products = await Product.find();
    let delay = 0;
    let cards = products.map(p => {
        delay += 0.1; // Animated delay effect
        return `
        <div class="card animate-up" style="animation-delay: ${delay}s;">
            <img src="${p.img}" alt="collection">
            <h3 style="margin:12px 0;">${p.name}</h3>
            <p style="color:var(--pink); font-weight:bold; font-size:1.4rem;">${p.price}</p>
            <form action="/submit-inquiry" method="POST">
                <input type="hidden" name="itemName" value="${p.name}">
                <input type="text" name="customerName" class="form-input" placeholder="Your Name" required>
                <input type="text" name="phone" class="form-input" placeholder="Phone Number" required>
                <button type="submit" class="btn" style="border-radius:10px;">Enquiry Now</button>
            </form>
        </div>`
    }).join('');

    res.send(`<html>${style}<body>
        <div class="menu-btn" onclick="toggleMenu()">☰</div>
        <div id="sidebar" class="sidebar">
            <a href="#" onclick="toggleMenu()">Home</a>
            <a href="#inventory" onclick="toggleMenu()">Collection</a>
            <a href="#about" onclick="toggleMenu()">About Us</a>
        </div>

        <div class="hero">
            <p class="animate-up" style="letter-spacing:6px; color:var(--pink); font-weight:bold; animation-delay: 0.2s;">SINCE 2014</p>
            <h1 class="animate-up" style="font-family:'Playfair Display'; font-size:3.5rem; margin:10px 0; text-align:center; animation-delay: 0.4s;">RATHI FASHION</h1>
            <p class="animate-up" style="opacity:0.8; max-width:600px; text-align:center; animation-delay: 0.6s;">Readymade Garments & Premium Fabrics | White House Collection</p>
        </div>

        <div class="container" id="inventory">${cards}</div>

        <div id="about" class="animate-up" style="padding:80px 20px; background:white; text-align:center;">
            <h2 style="font-family:'Playfair Display'; font-size:2.5rem;">12 Years of Excellence</h2>
            <p style="max-width:800px; margin:auto; color:#666; line-height:1.8;">Garment supplier offering high-quality readymade garments and premium fabrics, including cotton and linen, perfect for fashion-forward consumers seeking stylish clothing options.</p>
        </div>

        <footer style="background:var(--dark); color:#888; padding:60px 20px; text-align:center;">
            <p>Near Indira Chowk, College Road, Town Bazar, Hanumangarh-335513, Rajasthan</p>
            <p>Call: <a href="tel:+917947142647" style="color:var(--pink); text-decoration:none; font-weight:bold;">+91 7947142647</a></p>
            <hr style="border:0; border-top:1px solid #333; width:50px; margin:30px auto;">
            <p style="font-size:0.95rem; color:#bbb;">&copy; 2026 Rathi Fashion And White House. Crafted with <span class="heart">♥️</span> by Aman Bishnoi.</p>
        </footer>
    </body></html>`);
});

// 2. SECRET LOGIN PAGE
app.get('/login', (req, res) => res.send(`<html>${style}<body><div class="login-bg">
    <div class="glass-box login-box animate-up">
        <h2 style="color:white; margin-bottom:30px; letter-spacing:1px;">Admin Access</h2>
        <form action="/login" method="POST">
            <input name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button class="btn" style="background:white; color:var(--pink); margin-top:25px; border-radius:30px; box-shadow:0 10px 20px rgba(0,0,0,0.1);">Unlock Suitcase 🔓</button>
        </form>
        <a href="/" style="color:rgba(255,255,255,0.7); display:block; margin-top:20px; text-decoration:none; font-size:0.9rem;">← Back to Showroom</a>
    </div></div></body></html>`));

app.post('/login', async (req, res) => {
    const admin = await Admin.findOne({ username: req.body.username, password: req.body.password });
    if (admin) { req.session.isLoggedIn = true; res.redirect('/admin'); }
    else res.send("<script>alert('Galat ID ya Password!'); window.location='/login';</script>");
});

// 3. ADMIN DASHBOARD (With Solve & Edit options)
app.get('/admin', isAdmin, async (req, res) => {
    const products = await Product.find();
    const inquiries = await Inquiry.find().sort({ date: -1 });
    
    // Inquiry UI Update
    let inquiryHTML = inquiries.map(i => {
        let isSolved = i.status === 'Solved';
        return `<div class="animate-up" style="background:white; padding:15px; margin-bottom:10px; border-left:5px solid ${isSolved ? 'var(--success)' : 'var(--pink)'}; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); opacity:${isSolved ? '0.7' : '1'};">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <b>${i.customerName}</b> (<a href="tel:${i.phone}" style="color:${isSolved ? 'var(--success)' : 'var(--pink)'}; text-decoration:none;">${i.phone}</a>) <br>
                    Product Inquiry: <b style="font-size:1.1rem; color:var(--dark);">${i.itemName}</b> <br>
                    <small style="color:#aaa;">${i.date.toLocaleString()}</small>
                </div>
                ${!isSolved ? `<form action="/solve-inquiry/${i._id}" method="POST" style="margin:0;"><button class="btn-green">Mark Solved ✔️</button></form>` : `<span style="color:green; font-weight:bold;">Solved ✅</span>`}
            </div>
        </div>`;
    }).join('');

    // Product UI Update (Added Edit Option)
    let productHTML = products.map(p => `<div class="animate-up" style="background:white; margin-bottom:15px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.03); overflow:hidden;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px;">
            <span><img src="${p.img}" style="width:40px; height:40px; border-radius:5px; vertical-align:middle; margin-right:10px;"> <b>${p.name}</b> - ${p.price}</span>
            <div style="display:flex; gap:10px;">
                <button onclick="toggleEditForm('${p._id}')" style="background:#f0f0f0; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">Edit ✏️</button>
                <form action="/delete-product/${p._id}" method="POST" style="margin:0;"><button style="background:#ffdddd; color:red; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; font-weight:bold;">Delete</button></form>
            </div>
        </div>
        <div id="edit-form-${p._id}" style="display:none; padding:15px; background:#fafafa; border-top:1px solid #eee;">
            <form action="/edit-product/${p._id}" method="POST" style="display:flex; gap:10px; align-items:center;">
                <input name="name" value="${p.name}" class="form-input" style="margin:0;" required>
                <input name="price" value="${p.price}" class="form-input" style="margin:0;" required>
                <button class="btn-green" style="padding:10px 20px;">Save Changes</button>
            </form>
        </div>
    </div>`).join('');

    res.send(`<html>${style}<body style="background:#f4f7f6;">
        <div style="background:white; padding:15px 20px; box-shadow:0 2px 10px rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:100;">
            <b style="color:var(--pink); font-size:1.2rem; display:flex; align-items:center; gap:10px;">Rathi Admin <span style="animation: pulse 2s infinite; display:inline-block; width:10px; height:10px; background:var(--success); border-radius:50%;"></span></b>
            <div>
                <a href="/admin/profile" style="text-decoration:none; color:#555; margin-right:20px; font-weight:600;">Settings</a>
                <a href="/logout" style="color:red; text-decoration:none; font-weight:600;">Logout</a>
            </div>
        </div>
        
        <div style="max-width:900px; margin:30px auto; padding:20px;">
            <div class="card animate-up" style="text-align:left; border-radius:15px; margin-bottom:40px;">
                <h3 style="margin-top:0;">Add New Collection</h3>
                <form action="/add-product" method="POST" enctype="multipart/form-data">
                    <input name="name" class="form-input" placeholder="Item Name (e.g. Linen Shirt)" required>
                    <input name="price" class="form-input" placeholder="Price (e.g. ₹2,499)" required>
                    <p style="margin-bottom:5px; font-size:0.9rem; color:#888; font-weight:600;">Select Photo from Gallery:</p>
                    <input type="file" name="image" accept="image/*" required style="border:none; padding:10px 0;">
                    <button class="btn" style="margin-top:10px;">Upload to Showroom</button>
                </form>
            </div>

            <h2 class="animate-up" style="color:var(--dark);">Customer Inquiries (${inquiries.length})</h2>
            <div style="max-height:400px; overflow-y:auto; padding-right:10px; margin-bottom:40px;">
                ${inquiryHTML || '<p style="color:#888;">Abhi tak koi inquiry nahi aayi hai.</p>'}
            </div>

            <h2 class="animate-up" style="color:var(--dark);">Manage Stock</h2>
            <div style="margin-bottom:40px;">
                ${productHTML || '<p style="color:#888;">No items in stock.</p>'}
            </div>
        </div>
    </body></html>`);
});

// 4. LOGIC ACTIONS
app.post('/edit-product/:id', isAdmin, async (req, res) => {
    await Product.findByIdAndUpdate(req.params.id, { name: req.body.name, price: req.body.price });
    res.redirect('/admin');
});

app.post('/solve-inquiry/:id', isAdmin, async (req, res) => {
    await Inquiry.findByIdAndUpdate(req.params.id, { status: 'Solved' });
    res.redirect('/admin');
});

app.post('/add-product', isAdmin, upload.single('image'), async (req, res) => {
    await new Product({ name: req.body.name, price: req.body.price, img: req.file.path }).save();
    res.redirect('/admin');
});
app.post('/delete-product/:id', isAdmin, async (req, res) => { await Product.findByIdAndDelete(req.params.id); res.redirect('/admin'); });
app.post('/submit-inquiry', async (req, res) => { await new Inquiry(req.body).save(); res.send("<html><body style='text-align:center; padding-top:100px; font-family:sans-serif;'><h1>Done! ✅</h1><p>Hamari team aapse jaldi contact karegi.</p><a href='/' style='color:#ff80ab; font-weight:bold; text-decoration:none;'>Wapas jayein</a></body></html>"); });

// Profile routes remain same
app.get('/admin/profile', isAdmin, (req, res) => res.send(`<html>${style}<body><div style="max-width:400px; margin:100px auto;" class="card animate-up"><h2>Profile Settings</h2><form action="/admin/update-profile" method="POST"><p style="text-align:left; font-size:0.8rem; color:red; font-weight:bold;">Confirm Identity:</p><input type="password" name="oldPassword" class="form-input" placeholder="Current Password" required><hr><p style="text-align:left; font-size:0.8rem; font-weight:bold;">New Details:</p><input name="newUsername" class="form-input" placeholder="New Username" required><input type="password" name="newPassword" class="form-input" placeholder="New Password" required><button class="btn" style="margin-top:15px;">Save New Credentials</button></form><br><a href="/admin" style="color:#aaa; text-decoration:none; font-weight:600;">← Cancel</a></div></body></html>`));
app.post('/admin/update-profile', isAdmin, async (req, res) => {
    const admin = await Admin.findOne({ password: req.body.oldPassword });
    if (admin) { admin.username = req.body.newUsername; admin.password = req.body.newPassword; await admin.save(); res.send("<html><body style='text-align:center; padding-top:100px; font-family:sans-serif;'><h1>Updated Successfully! ✅</h1><a href='/admin' style='color:#ff80ab; font-weight:bold; text-decoration:none;'>Go Back to Dashboard</a></body></html>"); }
    else res.send("<html><body style='text-align:center; padding-top:100px; font-family:sans-serif;'><h1>Old Password Wrong! ❌</h1><a href='/admin/profile' style='color:red; font-weight:bold; text-decoration:none;'>Try Again</a></body></html>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });
app.listen(PORT, '0.0.0.0', () => console.log(`Rathi Fashion Final Live: http://localhost:${PORT}`));

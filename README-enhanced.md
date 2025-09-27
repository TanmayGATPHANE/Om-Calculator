# 💰 Work Hours Calculator - Enhanced Edition

A feature-rich web application to calculate how many hours you need to work to buy anything, with advanced features like dark mode, calculation history, comparison tools, and visual charts.

## ✨ **New Features Added:**

### 🌙 **Dark/Light Mode Toggle**
- Sleek dark theme for better viewing in low light
- Smooth transitions between themes
- Preference saved automatically
- Keyboard shortcut: `Ctrl/Cmd + D`

### 💾 **Save & Load Calculations**
- Automatic saving of all calculations
- Quick access to previous calculations
- Click any history item to reload it
- Stores up to 50 recent calculations

### 📊 **Visual Progress Bars**
- Animated progress bars showing work completion
- Real-time visual feedback
- Shimmer animation effects

### 🎨 **Color-Coded Results**
- **Green**: Affordable (≤ 7 days of work)
- **Orange**: Moderate (≤ 30 days of work)  
- **Red**: Expensive (> 30 days of work)
- Smart affordability messages

### 📱 **Enhanced Mobile Design**
- Optimized for all screen sizes
- Touch-friendly buttons
- Responsive grid layouts
- Better typography scaling

### 📈 **Interactive Charts**
- Doughnut chart visualization
- Shows work hours vs. total monthly hours
- Animated chart updates
- Professional data presentation

### 🔄 **Comparison Mode**
- Compare up to 2 items side by side
- Detailed comparison analysis
- Smart recommendations
- Visual comparison results

### 📋 **Calculation History**
- Persistent storage of calculations
- Quick reload functionality
- Organized chronologically
- One-click clearing

## 🚀 **File Structure:**

```
work-hours-calculator/
├── index-enhanced.html     # Enhanced version with all features
├── index.html             # Original simple version
├── css/
│   └── main.css          # All styles with theme support
├── js/
│   ├── calculator.js     # Main calculator logic
│   ├── managers.js       # Theme, storage, color managers
│   └── features.js       # History, comparison features
├── assets/               # Images and icons (future use)
├── package.json          # Project configuration
├── README.md            # This file
└── run.bat/run.sh       # Launch scripts
```

## 🎯 **How to Deploy:**

### **Option 1: Local Testing**
```bash
# Windows
run.bat

# Linux/Mac  
./run.sh
```

### **Option 2: GitHub Pages**
1. Push all files to GitHub repository
2. Go to Settings → Pages
3. Deploy from main branch
4. Access at: `https://yourusername.github.io/repository-name`

### **Option 3: Netlify (Recommended)**
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the entire folder
3. Get instant deployment with custom URL
4. Automatic HTTPS and CDN

### **Option 4: Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub or upload files
3. One-click deployment

## ⌨️ **Keyboard Shortcuts:**
- `Ctrl/Cmd + Enter`: Calculate
- `Ctrl/Cmd + D`: Toggle dark/light mode
- `Tab`: Navigate between fields

## 📊 **Sample Usage:**
1. **Enter Salary**: ₹50,000/month
2. **Work Schedule**: 5 days/week, 8 hours/day
3. **Choose Item**: Click "📱 Phone ₹25K" preset
4. **Calculate**: See you need ~12.5 hours of work
5. **View History**: All calculations saved automatically
6. **Compare**: Toggle comparison mode for multiple items

## 🎨 **Customization:**
- **Themes**: Automatic dark/light mode detection
- **Colors**: CSS custom properties for easy theming
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessibility**: Screen reader friendly

## 🔧 **Technical Features:**
- **No Dependencies**: Pure HTML, CSS, JavaScript
- **Offline Ready**: Works without internet
- **Fast Loading**: Optimized CSS and JavaScript
- **Modern Browser Support**: ES6+ features
- **Local Storage**: Persistent data storage
- **Smooth Animations**: CSS transitions and keyframes

## 💡 **Tips:**
- Use **preset buttons** for common items
- **History panel** shows your most expensive calculations first
- **Comparison mode** helps decide between alternatives
- **Dark mode** reduces eye strain during late-night budgeting
- **Progress bars** give visual context to your goals

## 🌟 **Pro Tips:**
1. **Set realistic tax rates** (10-30%) for accurate calculations
2. **Include unpaid leave** for precise monthly calculations  
3. **Use comparison mode** before major purchases
4. **Check history** to track spending patterns
5. **Share results** by taking screenshots

## 📈 **Coming Soon:**
- Export calculations to PDF/Excel
- Multi-language support (Hindi, Tamil, etc.)
- Investment timeline calculator
- Mobile app version
- Social sharing features

## 🐛 **Bug Reports & Features:**
Found a bug or have a feature request? The calculator includes error handling and user-friendly messages for common issues.

## 📄 **License:**
Free to use, modify, and distribute. Perfect for personal finance education and budgeting workshops.

---

**🚀 Ready to calculate? Open `index-enhanced.html` and start planning your next purchase!**

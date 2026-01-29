# Figma UI Code Generator Plugin

A Figma plugin that allows you to paste JavaScript code and automatically generate UI designs in Figma.

## 📁 Plugin Structure

```
figma-plugin/
├── manifest.json     # Plugin configuration
├── code.js          # Main plugin logic (runs in Figma sandbox)
├── ui.html          # Plugin UI interface
└── README.md        # This file
```

## 🚀 How to Install & Use

### Step 1: Import the Plugin to Figma

1. Open Figma Desktop App (plugins only work in desktop, not browser)
2. Go to **Menu** → **Plugins** → **Development** → **Import plugin from manifest...**
3. Navigate to the `figma-plugin` folder and select the `manifest.json` file
4. Click **Open**

### Step 2: Run the Plugin

1. In any Figma file, go to **Menu** → **Plugins** → **Development** → **UI Generator**
2. The plugin window will open with a code editor

### Step 3: Generate Designs

**Option 1: Use Templates**
- Click one of the template buttons (📝 Registration, ✈️ Booking, 💬 Chat)
- Click **Generate Design**
- Your design will appear on the canvas!

**Option 2: Paste Custom Code**
- Copy any of your existing code files (registration-page.js, airline-booking-page.js, chat-app.js)
- Paste the entire code into the textarea
- Click **Generate Design**

## 📝 Code Format

The plugin accepts code in this format:

```javascript
(async () => {
  // Load fonts first
  await figma.loadFontAsync({family: 'Inter', style: 'Regular'});
  
  // Create frames and nodes
  const frame = figma.createFrame();
  frame.name = 'My Design';
  frame.layoutMode = 'VERTICAL';
  frame.resize(400, 300);
  
  // ... add more elements
  
  // Add to page
  figma.currentPage.appendChild(frame);
  
  // Center in viewport (optional)
  figma.viewport.scrollAndZoomIntoView([frame]);
  
  // Close plugin with message
  figma.closePlugin('Design created!');
})();
```

## 🎯 Key Features

- **Live Code Execution**: Paste code and see results immediately
- **Template Library**: Pre-built templates for common UI patterns
- **Error Handling**: Clear error messages if something goes wrong
- **Auto Layout Support**: Full support for Figma's auto-layout features
- **Font Loading**: Automatically handles async font loading
- **SVG Icons**: Supports icon creation via SVG

## 🔧 How It Works

1. **UI Layer** (`ui.html`): Provides a text editor interface where you paste code
2. **Plugin Layer** (`code.js`): Receives the code from UI and executes it using `eval()`
3. **Figma API**: The code has full access to the `figma` global object to create designs

### Architecture

```
┌─────────────────┐
│   UI (iframe)   │
│   ui.html       │
│   - Code editor │
│   - Templates   │
│   - Buttons     │
└────────┬────────┘
         │ postMessage
         ▼
┌─────────────────┐
│  Plugin Sandbox │
│   code.js       │
│   - Receives    │
│   - Executes    │
│   - Creates     │
└────────┬────────┘
         │ figma API
         ▼
┌─────────────────┐
│  Figma Canvas   │
│   - Frames      │
│   - Nodes       │
│   - Designs     │
└─────────────────┘
```

## 📚 Using Your Existing Code Files

All your existing code files can be used directly:

### Registration Page
```bash
# Copy the entire content of registration-page.js
# Paste into the plugin
# Click Generate
```

### Airline Booking Page
```bash
# Copy the entire content of airline-booking-page.js
# Paste into the plugin
# Click Generate
```

### Chat App
```bash
# Copy the entire content of chat-app.js
# Paste into the plugin
# Click Generate
```

## 🎨 Figma API Essentials

### Creating Frames
```javascript
const frame = figma.createFrame();
frame.name = 'My Frame';
frame.resize(400, 300);
```

### Auto Layout
```javascript
frame.layoutMode = 'VERTICAL';  // or 'HORIZONTAL'
frame.primaryAxisSizingMode = 'AUTO';  // Hug contents
frame.counterAxisSizingMode = 'FIXED';
frame.itemSpacing = 16;  // Gap between items
frame.paddingTop = 20;
frame.paddingLeft = 20;
```

### Text
```javascript
// Always load font first!
await figma.loadFontAsync({family: 'Inter', style: 'Regular'});

const text = figma.createText();
text.fontName = {family: 'Inter', style: 'Regular'};
text.characters = 'Hello World';
text.fontSize = 16;
```

### Colors
```javascript
// RGB values from 0 to 1
frame.fills = [{
  type: 'SOLID', 
  color: {r: 1, g: 0, b: 0}  // Red
}];
```

### SVG Icons
```javascript
const svgString = '<svg>...</svg>';
const icon = figma.createNodeFromSvg(svgString);
```

### Adding to Canvas
```javascript
// Always append to page or parent
figma.currentPage.appendChild(frame);

// Optional: center in viewport
figma.viewport.scrollAndZoomIntoView([frame]);
```

## 🐛 Troubleshooting

### "Font not found" Error
```javascript
// Make sure to load fonts before using them
await figma.loadFontAsync({family: 'Inter', style: 'Regular'});
await figma.loadFontAsync({family: 'Inter', style: 'Medium'});
await figma.loadFontAsync({family: 'Inter', style: 'Bold'});
```

### Elements Not Showing
```javascript
// Always append to page
figma.currentPage.appendChild(yourFrame);
```

### Plugin Doesn't Close
```javascript
// Add this at the end of your code
figma.closePlugin('Success message');
```

## 📖 Additional Resources

- [Figma Plugin API Documentation](https://www.figma.com/plugin-docs/)
- [Figma Plugin API Reference](https://www.figma.com/plugin-docs/api/api-reference/)
- [Lucide Icons](https://lucide.dev/) - Icon library used in templates
- [Figma Community Plugins](https://www.figma.com/community/plugins)

## 🔒 Security Note

This plugin uses `eval()` to execute code, which means it can run any JavaScript. Only use code you trust or have written yourself. Never paste code from untrusted sources.

## 💡 Tips

1. **Start Small**: Test with simple frames before complex layouts
2. **Use Templates**: Modify existing templates rather than starting from scratch
3. **Check Console**: Open developer console for detailed error messages
4. **Auto Layout**: Use auto-layout for responsive designs
5. **Font Loading**: Always await font loading before setting text

## 🎓 Next Steps

1. Try the included templates
2. Modify template code to customize designs
3. Create your own reusable components
4. Explore the Figma Plugin API documentation
5. Build more complex UI patterns

---

**Built for rapid UI prototyping in Figma** ✨

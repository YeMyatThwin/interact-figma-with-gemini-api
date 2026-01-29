# Interact Figma with Gemini API

> Generate Figma designs through natural language conversation with Google's Gemini AI.

A Figma plugin that lets you create and modify designs using natural language. Chat with Google's Gemini AI to generate shapes, text, images, and layouts without writing code.


## 🧑🏻‍💻 Demo
![figma plugin with gemini api](https://github.com/user-attachments/assets/9216e964-6934-465f-bf2d-00ae40a8ba03)


## ✨ Features

- 🤖 **Natural Language Design**: Describe what you want in plain English
- 💬 **Conversational Interface**: Chat-based interaction with context awareness
- 🎨 **Full Figma API Access**: Create rectangles, text, frames, images, and complex layouts
- 🔄 **Iterative Refinement**: Modify designs by continuing the conversation
- 📸 **Image Support**: Generate designs with images from Picsum Photos
- 🎯 **Smart Code Generation**: AI generates and executes Figma plugin code automatically
- ⚡ **Real-time Execution**: See your designs appear immediately on the canvas
- 🐛 **Error Handling**: Automatic retry with error feedback for failed executions

## 🚀 Getting Started

### Prerequisites

- Figma Desktop App (plugins only work in desktop, not browser)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone this repository:
```bash
git clone https://github.com/YeMyatThwin/interact-figma-with-gemini-api.git
cd interact-figma-with-gemini-api
```

2. Add your Gemini API key in [code.js](code.js#L6):
```javascript
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
```

3. Import the plugin into Figma:
   - Open Figma Desktop App
   - Go to **Menu** → **Plugins** → **Development** → **Import plugin from manifest...**
   - Select the `manifest.json` file from this project
   - Click **Open**

### Usage

1. Open any Figma file
2. Go to **Menu** → **Plugins** → **Development** → **Interact Figma with LLMs**
3. Start chatting! Try these examples:
   - "Create a blue rectangle 200x100"
   - "Add a title that says 'Welcome'"
   - "Create a login form with email and password fields"
   - "Add a random image 400x300"
   - "Make the rectangle rounded"

## 💡 Example Prompts

**Basic Shapes:**
- "Create a red circle"
- "Add a rounded rectangle with shadow"
- "Make a blue square 150x150"

**Text Elements:**
- "Add a heading that says 'Hello World'"
- "Create a paragraph with lorem ipsum text"
- "Add a small caption below"

**Complex Layouts:**
- "Create a card with a title, description, and button"
- "Design a navigation bar with logo and menu items"
- "Make a pricing table with 3 columns"

**Images:**
- "Add a random image 800x600"
- "Create a photo gallery with 4 images"

**Modifications:**
- "Change the color to green"
- "Make it bigger"
- "Center it on the page"

## 🏗️ Project Structure

```
interact-figma-with-gemini-api/
├── manifest.json     # Plugin configuration and permissions
├── code.js          # Main plugin logic with Gemini API integration
├── ui.html          # Chat interface UI
└── README.md        # This file
```

## 🔧 How It Works

1. **User Input**: You describe what you want in the chat interface
2. **AI Processing**: Gemini AI interprets your request and generates Figma API code
3. **Code Execution**: The plugin executes the generated code in Figma's context
4. **Result**: Your design appears on the canvas
5. **Feedback Loop**: If errors occur, they're sent back to the AI for automatic correction

### Architecture

```
┌─────────────────────┐
│   Chat UI           │
│   (ui.html)         │
│   - User messages   │
│   - AI responses    │
│   - Execute buttons │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Plugin Core       │
│   (code.js)         │
│   - API calls       │
│   - Code execution  │
│   - Error handling  │
└──────────┬──────────┘
           │
           ├────────────────┐
           ▼                ▼
┌─────────────────┐  ┌──────────────┐
│  Gemini API     │  │  Figma API   │
│  - Understands  │  │  - Creates   │
│  - Generates    │  │  - Modifies  │
│  - Fixes errors │  │  - Renders   │
└─────────────────┘  └──────────────┘
```

## 🎨 Supported Design Elements

- **Shapes**: Rectangles, ellipses, polygons, stars
- **Text**: With custom fonts, sizes, and colors
- **Frames**: For organizing layouts
- **Images**: Via Picsum Photos API
- **Auto Layout**: For responsive designs
- **Colors**: Solid fills with RGB values
- **Positioning**: Absolute and relative positioning

## ⚙️ Configuration

### API Endpoints

The plugin uses:
- **Gemini API**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent`
- **Images**: `https://picsum.photos` (pre-configured in manifest.json)

### Network Access

The manifest.json includes these allowed domains:
- `generativelanguage.googleapis.com` - Gemini AI
- `picsum.photos` - Random images

## 🐛 Troubleshooting

**API Key Issues:**
- Ensure your API key is valid and has Gemini API access enabled
- Check the browser console for detailed error messages

**Plugin Not Showing:**
- Make sure you're using Figma Desktop App (not browser)
- Reload the plugin: Menu → Plugins → Development → Reload plugin

**Code Execution Errors:**
- The AI will automatically retry with error feedback
- Check if fonts are available (Inter is default)
- Verify network connection for API calls

**Images Not Loading:**
- Only Picsum Photos URLs are supported
- Check network permissions in manifest.json

## 🔒 Security & Privacy

- API key is stored in code.js (keep it private)
- Code execution happens in Figma's sandboxed environment
- No design data is sent to external servers except via Gemini API
- Conversation history is maintained locally during plugin session

## 📝 API Response Format

The AI returns responses in this JSON format:
```json
{
  "message": "Plain English explanation",
  "function": "(async () => { /* Figma API code */ })();"
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Built with [Figma Plugin API](https://www.figma.com/plugin-docs/)
- Powered by [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- Images from [Picsum Photos](https://picsum.photos)

## 📚 Resources

- [Figma Plugin Documentation](https://www.figma.com/plugin-docs/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Plugin API Reference](https://www.figma.com/plugin-docs/api/api-reference/)

---

**Built with ❤️ for rapid prototyping and AI-powered design**

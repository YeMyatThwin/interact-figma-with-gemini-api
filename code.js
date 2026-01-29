// Figma Plugin with Gemini AI Integration
// This plugin allows natural language interaction to generate Figma designs

// Configuration
const GEMINI_API_KEY = 'AIzaSyBaGRSyfVQPhK8MM_F-nSItEbXvv_d-TEU'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent';

// Store conversation history
let conversationHistory = [];

// Show the UI with chat window dimensions
figma.showUI(__html__, { width: 450, height: 650 });

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'send-message') {
    try {
      // Call Gemini API with user message and conversation history
      const response = await callGeminiAPI(msg.message);
      
      // Send response back to UI
      figma.ui.postMessage({ 
        type: 'ai-response', 
        data: response 
      });
      
    } catch (error) {
      // Send error back to UI
      figma.ui.postMessage({ 
        type: 'api-error', 
        error: error.message 
      });
      console.error('Gemini API error:', error);
    }
    
  } else if (msg.type === 'send-error-feedback') {
    // User is sending error feedback to retry
    try {
      const errorMessage = `The previous code resulted in this error:\n\n${msg.error}\n\nPlease fix the code and try again.`;
      const response = await callGeminiAPI(errorMessage);
      
      figma.ui.postMessage({ 
        type: 'ai-response', 
        data: response,
        isRetry: true
      });
      
    } catch (error) {
      figma.ui.postMessage({ 
        type: 'api-error', 
        error: error.message 
      });
      console.error('Gemini API error:', error);
    }
    
  } else if (msg.type === 'execute-code') {
    try {
      // Execute the code sent from the UI
      const codeToExecute = msg.code;
      
      // Use eval to execute the code in the plugin context
      const result = await eval(codeToExecute);
      
      // Send success message back to UI, including any return value
      figma.ui.postMessage({ 
        type: 'execution-success',
        messageId: msg.messageId,
        returnValue: result !== undefined ? result : null
      });
      
    } catch (error) {
      // Send error back to UI
      figma.ui.postMessage({ 
        type: 'execution-error',
        messageId: msg.messageId,
        error: error.message,
        stack: error.stack
      });
      
      console.error('Code execution error:', error);
    }
    
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Function to call Gemini API
async function callGeminiAPI(userMessage) {
  const systemContext = `# Figma Browser Injection Agent

## Your Role
You write JavaScript code to be injected into the browser to interact with Figma's Plugin API. Return your response in JSON format only.

## Context
- User is in a Figma design file with the \`figma\` global object available
- Your code will be executed in the plugin context

## Response Format
You must respond with ONLY valid JSON in this exact format. IMPORTANT: Properly escape all quotes and newlines in the function string:
{
  "message": "Plain English explanation of what you'll do",
  "function": "(async () => { /* Complete executable JavaScript using figma API */ })();"
}

CRITICAL: The "function" field must be a single-line string with escaped quotes. Use \\n for newlines inside the function code.

## Reading Data (IMPORTANT)
When the user asks to READ information (like "what is selected", "show me the layers", "what's the color"), your function MUST return the data:

\`\`\`javascript
(async () => {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) return "Nothing is selected";
  
  const node = selection[0];
  return {
    name: node.name,
    type: node.type,
    width: node.width,
    height: node.height
  };
})();
\`\`\`

The returned data will be sent back to you in a follow-up message, and you should explain it to the user in plain English.

**IMPORTANT for interpreting return data**: When you receive a message that says "The code execution returned the following data:", you are being asked to INTERPRET that data for the user. In this case, set the "function" field to an empty string "" since no code execution is needed - only provide a "message" explaining the data.

## Key API Patterns

**Create shapes:**
\`\`\`javascript
const rect = figma.createRectangle();
rect.x = 100; rect.y = 100;
rect.resize(200, 100);
rect.fills = [{type: 'SOLID', color: {r: 1, g: 0, b: 0}}]; // RGB 0-1 range!
figma.currentPage.appendChild(rect);
\`\`\`

**Modify selection:**
\`\`\`javascript
const node = figma.currentPage.selection[0];
if ('fills' in node) node.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 1}}];
\`\`\`

**Text (requires font loading):**
\`\`\`javascript
await figma.loadFontAsync({family: "Inter", style: "Regular"});
const text = figma.createText();
text.characters = "Hello";
figma.currentPage.appendChild(text);
\`\`\`

**Images from URL:**
\`\`\`javascript
// Create image from URL using Figma API
const image = await figma.createImageAsync('https://picsum.photos/400/300');
const {width, height} = await image.getSizeAsync();
// Create rectangle to hold the image
const rect = figma.createRectangle();
rect.resize(width, height);
rect.fills = [{
  type: 'IMAGE',
  scaleMode: 'FILL',
  imageHash: image.hash
}];
figma.currentPage.appendChild(rect);
\`\`\`

## Critical Notes
- Colors: RGB 0-1, not 0-255
- Always \`appendChild()\` to make nodes visible
- Load fonts before editing text
- Wrap everything in async IIFE: (async () => { ... })();
- DO NOT use effects property - it's complex and error-prone. Use simple fills and strokes only.
- DO NOT call figma.closePlugin() - let the user keep the plugin open to create more designs.
- For images, use figma.createImageAsync(url) - NOT fetch(). This returns an Image object.
- Get image dimensions with await image.getSizeAsync() before creating the rectangle.
- Images must be PNG, JPG, or GIF format, max 4096x4096 px.
- **IMAGE URLS: You MUST ONLY use https://picsum.photos for all images** - Other services like Unsplash, Pexels, etc. are blocked by CORS and manifest allowedDomains. Format: https://picsum.photos/WIDTH/HEIGHT (e.g., https://picsum.photos/800/600)
- NEVER use images.unsplash.com, www.pexels.com, or any external stock photo services - they will fail to load!`;

  // Add user message to conversation history
  conversationHistory.push({
    role: "user",
    parts: [{ text: userMessage }]
  });

  // Build contents array with system context + conversation history
  const contents = [
    {
      role: "user",
      parts: [{ text: systemContext }]
    },
    ...conversationHistory
  ];

  // Using the same structure as the Google Generative AI SDK
  const requestBody = {
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Plain English explanation of what the code will do"
          },
          function: {
            type: "string",
            description: "Complete executable JavaScript code wrapped in async IIFE. Use empty string when just interpreting data."
          }
        },
        required: ["message"]
      }
    }
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    
    // Parse error for better messaging
    let errorMessage = `API request failed (${response.status})`;
    try {
      const errorData = JSON.parse(errorText);
      const apiMessage = (errorData.error && errorData.error.message) ? errorData.error.message : '';
      
      // Provide specific guidance based on error type
      if (response.status === 503) {
        errorMessage = `The Gemini API is temporarily overloaded. Please wait a moment and try again.`;
      } else if (response.status === 429) {
        errorMessage = `Rate limit exceeded. Please wait a few seconds and try again.`;
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = `Authentication failed. Please check your API key in the code.`;
      } else if (response.status === 400) {
        errorMessage = `Invalid request: ${apiMessage}`;
      } else {
        errorMessage = `${errorMessage}: ${apiMessage}`;
      }
    } catch (e) {
      // If we can't parse, use raw error text
      errorMessage = `${errorMessage}\n${errorText}`;
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  console.log('Full API response:', JSON.stringify(data, null, 2));
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || 
      !data.candidates[0].content.parts || !data.candidates[0].content.parts[0] || 
      !data.candidates[0].content.parts[0].text) {
    console.error('Invalid response structure:', data);
    throw new Error('Invalid response structure from API. Check console for details.');
  }
  
  const responseText = data.candidates[0].content.parts[0].text;
  
  console.log('Raw AI response:', responseText);
  
  // Add AI response to conversation history
  conversationHistory.push({
    role: "model",
    parts: [{ text: responseText }]
  });
  
  // Since we're using responseMimeType: "application/json", the response should already be valid JSON
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(responseText);
    console.log('Parsed response:', parsedResponse);
  } catch (parseError) {
    console.error('JSON parse failed:', parseError);
    console.error('Failed text:', responseText);
    throw new Error('Failed to parse JSON response from AI: ' + parseError.message);
  }
  
  // Validate response has required fields
  if (!parsedResponse || typeof parsedResponse !== 'object') {
    throw new Error('Response is not a valid object');
  }
  
  if (!parsedResponse.message || typeof parsedResponse.message !== 'string') {
    console.error('Missing or invalid message field:', parsedResponse);
    throw new Error('Response missing valid "message" field');
  }
  
  // Function field is optional - can be empty string or undefined when just interpreting data
  const functionCode = parsedResponse.function || '';
  if (typeof functionCode !== 'string') {
    console.error('Invalid function field:', parsedResponse);
    throw new Error('Response has invalid "function" field');
  }
  
  return {
    message: parsedResponse.message,
    function: functionCode
  };
}

# StreamForge Frontend - Phase 0 Implementation

## Overview
A React-based streaming chat application that connects to a FastAPI backend. The frontend uses native Fetch API with ReadableStream to handle server-sent text streaming word-by-word.

## Architecture

### State Management (Zustand)
- **Store Location**: `src/stores/chat-store.js`
- **State Structure**:
  - `messages`: Array of message objects `{ sender: 'user' | 'agent', content: string }`
  - `isStreaming`: Boolean flag for streaming state
- **Actions**:
  - `addUserMessage(content)`: Add a user message
  - `startAgentMessage()`: Initialize empty agent message
  - `updateAgentMessage(content)`: Update agent message during streaming
  - `setIsStreaming(loading)`: Control streaming state

### Custom Hook (useChat)
- **Location**: `src/hooks/useChat.js`
- **Purpose**: Manages streaming logic and API communication
- **Key Functions**:
  - `handleSubmit(userInput)`: Submit message and initiate stream
  - `fetchChatStream(userInput)`: Fetch stream using Fetch API
  - `processStream(readableStream)`: Process chunks with TextDecoder
  - `stopStreaming()`: Abort stream using AbortController
- **Implementation Details**:
  - Uses `AbortController` to cancel ongoing streams
  - Uses `TextDecoder` to decode UTF-8 byte chunks
  - Accumulates chunks in buffer for real-time display

### Components

#### ChatContainer (`src/components/ChatContainer.jsx`)
- Main container component
- Layout: Header + MessageList + ChatInput
- Full-height layout with Tailwind CSS

#### MessageList (`src/components/MessageList.jsx`)
- Displays all messages
- Auto-scrolls to bottom on new messages
- Empty state message

#### Message (`src/components/Message.jsx`)
- Individual message component
- Different styling for user/agent messages
- User: right-aligned, blue background
- Agent: left-aligned, gray background

#### ChatInput (`src/components/ChatInput.jsx`)
- Input field with send/stop button
- Toggles between Send and Stop based on streaming state
- Disables input during streaming
- Uses Lucide React icons (Send, Square)

## Key Features

1. **Real-time Streaming**: Text appears word-by-word as backend sends data
2. **Stop Streaming**: Red stop button to abort stream mid-response
3. **Auto-scroll**: Automatically scrolls to bottom during streaming
4. **Loading States**: Input disabled and button changes during streaming
5. **Clean UI**: Simple, responsive design with Tailwind CSS

## API Integration

**Backend Endpoint**: `POST http://127.0.0.1:8001/chat`

**Request Body**:
```json
{
  "message": "user message string"
}
```

**Response**: Server-Sent Events (text/event-stream)
- Streams UTF-8 encoded bytes
- Decoded using TextDecoder in frontend

## Environment Configuration

**`.env` file**:
```
REACT_APP_API_BASE_URL=http://127.0.0.1:8001
```

## Running the Application

1. **Start Backend** (in separate terminal):
   ```bash
   cd ../backend
   uvicorn main:app --reload --port 8001
   ```

2. **Start Frontend**:
   ```bash
   npm start
   ```

3. **Access Application**: http://localhost:3000

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatContainer.jsx    # Main container
│   │   ├── ChatInput.jsx        # Input with send/stop button
│   │   ├── Message.jsx          # Individual message
│   │   └── MessageList.jsx      # Message list with auto-scroll
│   ├── hooks/
│   │   └── useChat.js           # Streaming logic hook
│   ├── stores/
│   │   └── chat-store.js        # Zustand state management
│   ├── App.js                   # Root component
│   ├── App.css                  # App styles
│   ├── index.js                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── .env                         # Environment variables
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── package.json                 # Dependencies
```

## Dependencies

- **react** (^19.2.0): Core React library
- **zustand** (^5.0.8): State management
- **tailwindcss** (^4.1.14): Styling framework
- **lucide-react** (^0.545.0): Icons (Send, Square)
- **autoprefixer** (^10.4.21): PostCSS plugin
- **postcss** (^8.5.6): CSS processor

## Implementation Notes

1. **Streaming Pattern**: Uses native Fetch API with ReadableStream (NOT EventSource)
2. **Abort Control**: Global AbortController reference for stopping streams
3. **Error Handling**: AbortError ignored (user-initiated), other errors logged
4. **Buffer Management**: Accumulates chunks for incremental display
5. **Auto-scroll**: useEffect triggered on messages array changes

## Future Enhancements (Beyond Phase 0)

- Message history persistence
- Markdown rendering
- Code syntax highlighting
- User authentication
- Multiple chat sessions
- File uploads
- Typing indicators

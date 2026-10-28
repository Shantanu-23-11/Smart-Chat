College Prompt Engineering Project

# SmartChat — AI Chat Web Application

SmartChat is a modern, responsive full-stack conversational AI web application powered by Google Gemini API. Built with a Spring Boot Java backend and vanilla HTML5, CSS3, and JavaScript frontend, matching the reference UI design.

---

## 🌟 Key Features

1. **Design Matching the Reference UI**:
   - **Dark Navy Sidebar** with SmartChat logo, blue "+ New Chat" button, search bar, and user profile card for *Shantanu Modi*.
   - **Conversation Grouping**: Organizes chats into *Today*, *Yesterday*, and *This Week*.
   - **Interactive Tech Flow Cards**: Visual representation for architectures like MERN stack (`MongoDB` ➔ `Express.js` ➔ `React` ➔ `Node.js`).
   - **Light & Dark Theme Toggle**: Instant transition with persistent preference.
   - **Multilingual Support**: English, Hindi (हिन्दी), and Marathi (मराठी) interface translations.
2. **Complete Full-Stack Java Backend**:
   - Spring Boot REST Controller (`POST /api/chat`, `GET /api/config`, `GET /api/health`).
   - Gemini service with multi-turn conversation context history support.
   - Automatic conversation title generation.
   - Centralized exception handling (`@RestControllerAdvice`) with descriptive, secure error reporting.
3. **Persisted Local Storage**:
   - Saves conversations, message history, timestamps, themes, and language preferences across browser refreshes.
   - Real-time search filter across chat titles and message contents.
   - Rename, delete (with modal confirmation), and clear chat actions.
4. **Markdown & Code Support**:
   - Formatted paragraphs, bold text, numbered/bulleted lists, inline code, and code blocks with one-click copy.
   - Thumbs up/down feedback and AI response copying.
5. **Secure Gemini Integration**:
   - Server-only API key handling via `GEMINI_API_KEY` environment variable.
   - Zero client-side key leakage.
   - Network timeout, rate limit (429), and unauthorized key (401) handling with retry functionality.

---

## 🛠️ Technology Stack

- **Backend**: Java 21+ / Java 27, Spring Boot 3.3.4
- **Build Tool**: Apache Maven 3.9.9 (Maven Wrapper included)
- **Frontend**: Semantic HTML5, Modern CSS3 (Grid & Flexbox), Vanilla JavaScript (ES6+)
- **AI Integration**: Google Gemini API (`gemini-1.5-flash` endpoint)
- **Persistence**: Browser `localStorage`
- **Testing**: JUnit 5, Spring Boot Test, Mockito, MockMvc

---

## 📂 Project Structure

```
Smart-Chat/
├── pom.xml                                    # Maven configuration & dependencies
├── mvnw / mvnw.cmd                            # Maven Wrapper executable scripts
├── .mvn/wrapper/                              # Maven Wrapper JAR & properties
├── .gitignore                                 # Git ignore rules for builds & secrets
├── .env.example                               # Example environment variables
├── README.md                                  # Setup & user documentation
└── src/
    ├── main/
    │   ├── java/com/smartchat/
    │   │   ├── SmartChatApplication.java      # Application entrypoint
    │   │   ├── config/
    │   │   │   ├── GeminiProperties.java      # Config properties for Gemini API
    │   │   │   ├── RestClientConfig.java      # RestClient HTTP client configuration
    │   │   │   └── WebConfig.java             # Static resource handling
    │   │   ├── controller/
    │   │   │   ├── ChatController.java        # POST /api/chat endpoint
    │   │   │   └── ConfigController.java      # GET /api/config & /api/health
    │   │   ├── dto/
    │   │   │   ├── ChatMessageDto.java        # Conversation message DTO
    │   │   │   ├── ChatRequest.java           # Chat request with prompt & history
    │   │   │   ├── ChatResponse.java          # Chat response with title & model
    │   │   │   ├── ErrorResponse.java         # Structured error response
    │   │   │   └── gemini/                    # Gemini API request/response mappings
    │   │   ├── exception/
    │   │   │   ├── GeminiApiException.java    # Custom Gemini runtime exception
    │   │   │   └── GlobalExceptionHandler.java# Centralized exception handler
    │   │   └── service/
    │   │       ├── GeminiService.java         # Gemini service interface
    │   │       └── impl/GeminiServiceImpl.java# Gemini API integration & title logic
    │   └── resources/
    │       ├── application.properties         # Server & Gemini properties
    │       └── static/
    │           ├── index.html                 # Main single-page web interface
    │           ├── css/style.css              # Responsive stylesheet & themes
    │           └── js/
    │               ├── app.js                 # App controller & API communication
    │               ├── i18n.js                # Translations (en, hi, mr)
    │               ├── storage.js             # LocalStorage manager & seed data
    │               └── ui.js                  # Markdown & card rendering engine
    └── test/
        ├── java/com/smartchat/
        │   ├── SmartChatApplicationTests.java # Context loading test
        │   ├── controller/ChatControllerTest.java # REST Controller unit tests
        │   └── service/GeminiServiceTest.java # Gemini service logic tests
        └── resources/
            └── application-test.properties    # Test configuration properties
```

---

## 🚀 Setup & Launch Instructions (Windows PowerShell)

### Prerequisites

- **Java Development Kit (JDK)**: JDK 21 or higher installed (e.g. JDK 27).
- **Google Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

### Step 1: Open Windows PowerShell

Navigate to the project root directory:

```powershell
cd C:\Users\Shantanu\OneDrive\Desktop\Smart-Chat
```

---

### Step 2: Configure your Gemini API Key

Set the environment variable permanently for your Windows user:

```powershell
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'your_actual_gemini_api_key', 'User')
```

Or for your current PowerShell session:

```powershell
$env:GEMINI_API_KEY = "your_actual_gemini_api_key"
```

*(Alternatively, you can create a local `.env` file in the project root containing `GEMINI_API_KEY=your_actual_gemini_api_key`. The `.env` file is already listed in `.gitignore` to prevent committing secrets).*

---

### Step 3: Run Tests (Optional Verification)

Execute the full automated test suite using the included Maven wrapper:

```powershell
.\mvnw.cmd test
```

All 8 test cases will execute and verify the REST controller, input validation, OAuth/API key detection, error handling, and multi-turn context generation.

---

### Step 4: Launch the Application

Run the application using Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

Or run the pre-built executable JAR:

```powershell
java -jar target\smart-chat-1.0.0.jar
```

---

### Step 5: Open SmartChat in your Browser

Once you see `Started SmartChatApplication in X.XXX seconds`, open:

👉 **[http://localhost:8080](http://localhost:8080)**

---

## 💬 Features Walkthrough

- **Create a New Chat**: Click the blue **+ New Chat** button in the sidebar.
- **Send Prompts**: Enter your prompt in the bottom composer. Press **Enter** to send, or **Shift+Enter** to create a new line.
- **Attach Files**: Click the 📎 paperclip icon to upload `.txt`, `.md`, `.json`, or code files to include in your question.
- **Search Conversations**: Use the sidebar search bar to filter your chats by title or message text.
- **Copy & Actions**: Hover over any AI message to copy the text to clipboard, thumbs-up/down, or retry.
- **Theme Switcher**: Click the ☀️ / 🌙 icon in the header to switch between Light and Dark mode.
- **Language Switcher**: Click the 🌐 dropdown in the header to switch between **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)**.
- **Settings & Management**: Click the ⚙ gear icon in the bottom profile card to inspect API connection status, clear chat history, or change preferences.

---

## 🔒 Security Best Practices

- The Google Gemini API key is **strictly read on the server side** and never passed or rendered in frontend assets or client browser network logs.
- Client requests pass through `/api/chat` which validates input and limits exposure.
- Sensitive environment files and compiled binaries are excluded in `.gitignore`.


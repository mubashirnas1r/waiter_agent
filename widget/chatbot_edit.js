var initialMessage = "";
var chatbot_dp = "";
var chatbot_name = '';
var chatbot_toggle_picture = "";
var user_chatmessage_color = "";
var bot_chatmessage_color = "";
const backend_url = "http://127.0.0.1:8000"
const frontend_url = "http://127.0.0.1:5502"
const frontend = {
    "status": 200,
    "frontend": {
        "chatbot_name": "OrderBot",
        "initial_message": "Hello I am <b>OrderBot</b>, How can I help you with your order today?",
        "widget_button_url": `${frontend_url}/chatbot_widget.gif`,
        "chatbot_dp_url": `${frontend_url}/chatbot_dp.jpeg`,
        "user_message_color": "#080808",
        "chatbot_message_color": "#705cf6"
    }
}
initialMessage = frontend["frontend"]["initial_message"];
    chatbot_name = frontend["frontend"]["chatbot_name"];
    chatbot_dp = frontend["frontend"]["chatbot_dp_url"];
    chatbot_toggle_picture = frontend["frontend"]["widget_button_url"];
    user_chatmessage_color = frontend["frontend"]["user_message_color"];
    bot_chatmessage_color = frontend["frontend"]["chatbot_message_color"];
    function generateRandomString(length) {
        let result = 'websiteUser_';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    
    function getRandomStringFromLocalStorage(key) {
        return localStorage.getItem(key);
    }
    
    function saveRandomStringToLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }
    
    const key = 'conversation-id';
    let randomString = getRandomStringFromLocalStorage(key);
    
    if (!randomString) {
        randomString = generateRandomString(10); 
        saveRandomStringToLocalStorage(key, randomString);
    }
    
    function createStyles() {
    
        const styles = `
            body {
                margin: 0;
                padding: 0;
            }
        
            .widget-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }
        
            .widget-button {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                background-color: #fff;
                padding: 1;
                border: none;
                cursor: pointer;
                shape-outside: 10px;
                background-image: url(${chatbot_toggle_picture});
                // background-color:transparent;
                background-size: 100% 100%;
                background-position: center; 
                background-repeat: no-repeat;
            }
        
            .widget {
                display: none;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 20px;
                background-color: #ffffff;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                position: absolute;
                top: -652px;
                right: 0;
                height: 621px;
                width: 440px;
                height:627px;
                overflow: hidden;
                transition: top 0.3s ease;
                scrollbar-width:thin;
                scrollbar-color: #c4d4da #f2f2f2;
                
            }

        
        
            #chatMessagesContainer {
                height: 470px;
                overflow-y: auto; 
                margin-bottom: 18px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 15px;
            }
        
            #chatMessages {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
            }
        
            #chatMessages .user-message {
                background-color: ${user_chatmessage_color};
                padding: 5px 10px;
                color: white;
                border-radius: 7px;
                display: inline-block;
                max-width: 65%;
                word-wrap: break-word;
                align-self: flex-end;
                margin-bottom: 5px;
                font-size:21px;
                font-family: Garamond, serif;
            }
        
            #chatMessages .chatbot-message {
                background-color: ${bot_chatmessage_color};
                color: white;
                padding: 5px 10px;
                border-radius: 7px;
                display: inline-block;
                max-width: 65%;
                word-wrap: break-word;
                align-self: flex-start;
                margin-bottom: 5px;
                font-size:21px;
                font-family: Garamond, serif;
            }
        
            .chat-input {
                display: flex;
            }
        
            .chat-input input {
                flex: 1;
                padding: 9px;
                border: 1px solid #ccc;
                border-radius: 10px;
                font-size: 16px;
                font-family: 'Arial', sans-serif;
                outline: none;
                color:#080808;
                background-color: #ffffff;
            }
        
            .chat-input button {
                padding: 5px 10px;
                margin-left: 10px;
                border: none;
                background-color: transparent;
                color: #fff;
                border-radius: 5px;
                cursor: pointer;
            }
        
            .chat-header {
                display: flex;
                align-items: center;
                padding-bottom: 10px;
                border-bottom: 1px solid #ccc;
                margin-bottom: 10px;
            }
            .chat-header button{
                padding: 5px 10px;
                margin-left: 160px;
                border: none;
                background-color: transparent;
                color: #fff;
                border-radius: 5px;
                cursor: pointer;
            }
            .chat-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 10px;
            }
        
            .chatbot-name {
                font-weight:bold;
                font-size:26px;
                font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                color:black;
            }
            .typing-dot {
                animation: typing 1s infinite;
            }
        
            @keyframes typing {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }
            @media (max-width: 768px) {
                .widget {
                  width: 250px;
                  height: 435px;
                  margin-right: 5%;
                }
                .chat-input input {
                    width:100px;
                    font-size:12px;
                }
            
                .chat-input button {
                    padding: 2px 7px;
                    margin-left: 12px;
                    border: none;
                    color: #fff;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .chat-header button{
                    margin-left: 50px;
                }
                #chatMessagesContainer {
                    height: 300px;
                }

            
                .chat-avatar {
                    width: 35px;
                    height: 35px;

                }
            
                .chatbot-name {
                    font-size:20px;
                }
                #chatMessages .user-message {
                    font-size:15px;

                }
            
                #chatMessages .chatbot-message {
                    font-size:15px;
                }
                .widget-button {
                    width: 47px;
                    height: 47px;

                }
              }
        `;
    
        const styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(styles));
        document.head.appendChild(styleElement);
    }
    
    function createElement(elementType, attributes = {}, content = "") {
        const element = document.createElement(elementType);
        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element.setAttribute(key, attributes[key]);
            }
        }
        
        if (content.startsWith('http') || content.startsWith('data:image')) {
            const image = document.createElement('img');
            image.src = content;
            element.appendChild(image);
        } else {
            element.textContent = content;
        }
        
        return element;
    }
    
    
    createStyles();
    
    
    const widgetContainer = createElement('div', { class: 'widget-container' });
    const chatButton = createElement('button', { id: 'chatButton', class: 'widget-button' });
    const chatbotContainer = createElement('div', { id: 'chatbot', class: 'widget' });
    const chatHeader = createElement('div', { class: 'chat-header' });
    const chatAvatar = createElement('img', { src: chatbot_dp, alt: 'Chatbot Avatar', class: 'chat-avatar' });
    const chatbotName = createElement('span', { class: 'chatbot-name' }, chatbot_name);
    const MessagesContainer = createElement('div', { id: 'chatMessagesContainer' });
    const chatMessages = createElement('ul', { id: 'chatMessages' });
    const chatInput = createElement('div', { class: 'chat-input' });
    const userInput = createElement('input', { type: 'text', id: 'userInput', placeholder: 'Type your query here...' });
    const refreshBtn = createElement('button', { id: 'refreshButton' });
    const sendButton = createElement('button', { id: 'sendButton' });
    
    const image = document.createElement('img');
    image.src = `${frontend_url}/send.png`;
    image.style.width = '37px';
    image.style.height = '37px';

    const image2 = document.createElement('img');
    
    image2.src = `${frontend_url}/refresh.png`;
    image2.style.width = '37px';
    image2.style.height = '37px';

    sendButton.style.padding = '4px 4px 0px';
    refreshBtn.style.position = "absolute"; // or "relative", depending on your layout needs
    refreshBtn.style.right = "5px";

    refreshBtn.style.backgroundColor="transparent";
    refreshBtn.style.border = "none";
    refreshBtn.style.cursor = "pointer";
    sendButton.appendChild(image);
    refreshBtn.appendChild(image2);
    chatHeader.appendChild(chatAvatar);
    chatHeader.appendChild(chatbotName);
    chatHeader.appendChild(refreshBtn);

    chatInput.appendChild(userInput);
    chatInput.appendChild(sendButton);
    
    chatbotContainer.appendChild(chatHeader);
    chatbotContainer.appendChild(MessagesContainer);
    chatbotContainer.appendChild(chatInput);
    
    MessagesContainer.appendChild(chatMessages);
    widgetContainer.appendChild(chatButton);
    widgetContainer.appendChild(chatbotContainer);
    
    document.body.appendChild(widgetContainer);
    
    const chatbot = document.getElementById('chatbot');
    const chatBtn = document.getElementById('chatButton');
    const chatMsgs = document.getElementById('chatMessages');
    const userQuery = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendButton');
    const chatMessagesContainer = document.getElementById('chatMessagesContainer');
    
    
    let chatbotVisible = false;
    function convertLinksToAnchorTags(text) {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const replacedText = text.replace(linkRegex, '<a href="$2" target="_blank" style="color: blue;">$1</a>');
      
        // Match email addresses
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const finalText = replacedText.replace(emailRegex, '<a href="mailto:$&" style="color: blue;">$&</a>');
    
        return finalText.replace('\n','<br>');
    }
    function addChatMessageNoTyping(text, isUser) {
        const messageClass = isUser ? 'user-message' : 'chatbot-message';
        const listItem = document.createElement('li');
        listItem.className = messageClass;
        listItem.innerHTML = convertLinksToAnchorTags(text);
        chatMsgs.appendChild(listItem);
    
        
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
    function addChatMessageTyping(text, isUser) {
        const messageClass = isUser ? 'user-message' : 'chatbot-message';
        const listItem = document.createElement('li');
        listItem.className = messageClass;
        chatMsgs.appendChild(listItem);
    
    
        function typeText(i) {
        if (i < text.length) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            listItem.innerHTML = convertLinksToAnchorTags(text.substring(0, i + 1) + '<span class="typing-dot">🟢</span>');
            i++;
            setTimeout(() => typeText(i), 8);
        } else {
            listItem.innerHTML = convertLinksToAnchorTags(text);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
        }
    
        typeText(0);
    }
  
    function saveConversationToLocalStorage(conversation) {
        localStorage.setItem('chatbotConversation', JSON.stringify(conversation));
    }
    function isConversationHistoryEmpty() {
        const conversation = loadConversationFromLocalStorage();
        return conversation.length;
    }
    
    
    function loadConversationFromLocalStorage() {
        const conversation = JSON.parse(localStorage.getItem('chatbotConversation'));
        if (conversation && conversation.length > 0) {
            return conversation;
        }
        return [];
    }
    
    
    function loadMessageHistory() {
        const conversation = loadConversationFromLocalStorage();
        conversation.forEach((message) => {
            const { role, content } = message;
            if (role === 'user') {
                addChatMessage(content, true);
            } else {
                addChatMessageNoTyping(content, false);
            }
        });
    }
    function deleteConversationFromLocalStorage() {
        chatMsgs.innerHTML = '';
        localStorage.removeItem('chatbotConversation');
        addChatMessageTyping(initialMessage, false);    
        loadMessageHistory();
    }
    
    
    function toggleChatbot() {
        chatbotVisible = !chatbotVisible;
        chatbot.style.display = chatbotVisible ? 'block' : 'none';
        
        if (chatbotVisible) {
            chatBtn.style.backgroundImage = `url(${frontend_url}/down.png)`;
            chatBtn.style.backgroundSize = "90% 90%";
            if (window.innerWidth <= 768) {
                image.style.width = '28px';
                image.style.height = '28px';
                chatbot.style.top = '-465px';
                image2.style.width = '26px';
                image2.style.height = '26px';
            }
            else{
                chatbot.style.top = '-652px';
            }
            setTimeout(() => {
            
            if(isConversationHistoryEmpty() == 0){
                addChatMessageTyping(initialMessage, false);
                
                };
            }, 500);
            loadMessageHistory();
        } else {
            chatBtn.style.backgroundImage = `url(${chatbot_toggle_picture})`;
            chatBtn.style.backgroundSize = "100% 100%";
            chatbot.style.top = '-652px';
            chatMsgs.innerHTML = '';
            userQuery.value = '';
        }
    }
    
    
    function addChatMessage(text, isUser) {
        const messageClass = isUser ? 'user-message' : 'chatbot-message';
        const listItem = document.createElement('li');
        listItem.className = messageClass;
        console.log(text);
        listItem.innerText = text;
        chatMsgs.appendChild(listItem);
        
        
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
    
  
    
    
    function openChatbot(timestamp) {
        if (!chatbot.startTime) chatbot.startTime = timestamp;
        const progress = Math.min((timestamp - chatbot.startTime) / 300, 1); // 300ms for animation duration
        chatbot.style.top = `${-340 + 340 * progress}px`; // Slide chatbot down
        if (progress < 1) {
        requestAnimationFrame(openChatbot);
        }
    }
    

    function handleUserInput() {
    const userMessage = userQuery.value;
    userQuery.value = '';
    if (userMessage.trim() !== '') {
        addChatMessage(userMessage, true);
    
        if(isConversationHistoryEmpty() == 0){
            saveConversationToLocalStorage([
            ...loadConversationFromLocalStorage(),
            { role: 'chatbot', content: initialMessage }
        ]);
        }
        saveConversationToLocalStorage([
            ...loadConversationFromLocalStorage(),
            { role: 'user', content: userMessage }
        ]);
        
        
        const apiUrl = `${backend_url}/v1/chatbot/${randomString}/invoke?query=${userMessage}`;
        
        const requestOptions = {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
    
        fetch(apiUrl, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json(); 
              } else {
                throw new Error('Failed to fetch data from the API');
              }
        })
        .then(data => {

            var responseText = data.message;
                addChatMessageTyping(responseText.replace(/\n/g, "<br>"), false);
                saveConversationToLocalStorage([
                    ...loadConversationFromLocalStorage(),
                    { role: 'chatbot', content: responseText }
                ]);
                userQuery.value = '';
        })
        .catch(error => {
            console.error(error);
        });
        
    }
    }
    
    chatBtn.addEventListener('click', toggleChatbot);
    refreshBtn.addEventListener('click', deleteConversationFromLocalStorage);

    sendBtn.addEventListener('click', handleUserInput);
    
    userQuery.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleUserInput();
    }
    });
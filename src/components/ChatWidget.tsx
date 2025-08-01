import { createSignal, Show, For, onMount, onCleanup } from "solid-js";
import { useChat } from "../store/ChatContext";
import { useAuth } from "../store/AuthContext";
import ChatService from "../services/chatService";

export default function ChatWidget() {
  const { user } = useAuth();
  const {
    currentRoom,
    messages,
    isChatOpen,
    isLoading,
    unreadCount,
    openChat,
    closeChat,
    sendMessage,
    createUserRoom
  } = useChat();

  const [messageInput, setMessageInput] = createSignal("");
  
  let chatContainer: HTMLDivElement | undefined;
  let messageInputRef: HTMLInputElement | undefined;

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // Handle send message
  const handleSendMessage = async (e: Event) => {
    e.preventDefault();
    const message = messageInput().trim();
    if (!message) return;

    await sendMessage(message);
    setMessageInput("");
    setTimeout(scrollToBottom, 100); // Allow DOM to update
  };

  // Handle chat open for customer
  const handleOpenChat = async () => {
    if (!currentRoom()) {
      await createUserRoom();
    } else {
      openChat();
    }
    setTimeout(() => {
      messageInputRef?.focus();
      scrollToBottom();
    }, 100);
  };

  // Auto-scroll when messages change
  onMount(() => {
    const interval = setInterval(() => {
      if (isChatOpen()) {
        scrollToBottom();
      }
    }, 500);

    onCleanup(() => clearInterval(interval));
  });

  // Don't show widget if user is not logged in or is admin
  if (!user() || user()?.role === 'admin') return null;

  return (
    <>
      {/* Chat Toggle Button */}
      <Show when={!isChatOpen()}>
        <button
          onClick={handleOpenChat}
          class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
          title="Live Chat"
        >
          <div class="relative">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <Show when={unreadCount() > 0}>
              <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount() > 9 ? '9+' : unreadCount()}
              </span>
            </Show>
          </div>
        </button>
      </Show>

      {/* Chat Window */}
      <Show when={isChatOpen()}>
        <div class="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Chat Header */}
          <div class="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              <div>
                <h3 class="font-semibold text-sm">Live Chat</h3>
                <p class="text-xs text-blue-100">Customer Support</p>
              </div>
            </div>
            <button
              onClick={closeChat}
              class="text-blue-100 hover:text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainer}
            class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          >
            <Show 
              when={!isLoading() && messages().length > 0}
              fallback={
                <div class="text-center text-gray-500 mt-8">
                  <Show 
                    when={!isLoading()}
                    fallback={
                      <div class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span class="ml-2 text-sm">Memuat chat...</span>
                      </div>
                    }
                  >
                    <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                      />
                    </svg>
                    <p class="text-sm">Mulai percakapan dengan customer support</p>
                    <p class="text-xs text-gray-400 mt-1">Kami siap membantu Anda!</p>
                  </Show>
                </div>
              }
            >
              <For each={messages()}>
                {(message) => (
                  <div class={`flex ${message.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div class={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender_role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}>
                      <Show when={message.sender_role !== 'user'}>
                        <p class="text-xs font-medium mb-1 text-blue-600">{message.sender_name}</p>
                      </Show>
                      <p class="whitespace-pre-wrap">{message.message}</p>
                      <div class={`flex items-center justify-between mt-1 text-xs ${
                        message.sender_role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{ChatService.formatMessageTime(message.timestamp)}</span>
                        <Show when={message.sender_role === 'user'}>
                          <span class="ml-2">{ChatService.getMessageStatusIcon(message.is_read)}</span>
                        </Show>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </Show>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} class="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div class="flex items-center space-x-2">
              <input
                ref={messageInputRef}
                type="text"
                value={messageInput()}
                onInput={(e) => setMessageInput(e.currentTarget.value)}
                placeholder="Ketik pesan Anda..."
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading()}
              />
              <button
                type="submit"
                disabled={!messageInput().trim() || isLoading()}
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </Show>
    </>
  );
}

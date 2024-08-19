// Example React Component for Chat
function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // Connect to WebSocket and receive messages
    }, []);

    const sendMessage = () => {
        // Emit message to WebSocket server
    };

    return (
        <div>
            <div className="chat-window">
                {messages.map(msg => <div>{msg}</div>)}
            </div>
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

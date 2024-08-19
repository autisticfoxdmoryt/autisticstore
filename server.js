const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost/autistictext', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    servers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }]
});

const ServerSchema = new mongoose.Schema({
    name: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ sender: String, text: String }]
});

const User = mongoose.model('User', UserSchema);
const Server = mongoose.model('Server', ServerSchema);

// API routes
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: 'User created successfully' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, 'secretkey');
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/create-server', async (req, res) => {
    const { name, token } = req.body;
    const decoded = jwt.verify(token, 'secretkey');
    const server = new Server({ name, users: [decoded.userId] });
    await server.save();
    res.json({ message: 'Server created successfully' });
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('joinServer', (serverId) => {
        socket.join(serverId);
    });

    socket.on('message', async (serverId, message) => {
        const server = await Server.findById(serverId);
        server.messages.push(message);
        await server.save();
        io.to(serverId).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));

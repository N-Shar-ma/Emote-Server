const io = require("socket.io")(process.env.PORT || 3000)

const currentUsers = {};
const conversationPrompts = [
    "Food",
    "Current weather",
    "Animals",
    "What you look like" ,
    "Your profession (current or future)",
    "Fictional creatures",
    "Sports and games",
    "Clothing items",
    "Fruits and veggies",
    "Drinks",
    "Modes of transport",
    "Dream holiday destination",
    "Approximate local time",
    "Hobbies",
    "Festivals",
    "3 things lying around you",
    "Colors",
    "Dark mode vs light mode",
    "How you are feeling right now",
    "Family"
]

io.on("connection", socket => {
    socket.on("new-user", name => {
        if(Object.values(currentUsers).includes(name))
        socket.emit("name-not-allowed", "That name is already in use. Try another")
        else {
            currentUsers[socket.id] = name
            socket.emit("name-free", Object.values(currentUsers))
            socket.broadcast.emit("user-connected", name)
            if(Object.entries(currentUsers).length >= 2) {
                io.emit("conversation-prompt", conversationPrompts[Math.floor(Math.random() * conversationPrompts.length)])
            }
        }
    })
    socket.on("send-message", message => {
        socket.broadcast.emit("receive-message", {
            message: message,
            name: currentUsers[socket.id]
        })
    })
    socket.on("disconnect", () => {
        if(currentUsers[socket.id]) {
            socket.broadcast.emit("user-disconnected", currentUsers[socket.id])
            delete currentUsers[socket.id]
        }
    })
})
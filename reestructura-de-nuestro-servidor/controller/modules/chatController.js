module.exports = class {
  constructor(chatService) {
    this.chatService = chatService;
  }

  async saveMessage(socket, mensaje) {
    try {
      let messages = await this.chatService.saveMessage(mensaje);
      
      socket.emit("newMessage", messages);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllMessages() {
    try {
      const allMessages = await this.chatService.getAllMessages();
      return allMessages;
    } catch (error) {
      console.log(error);
    }
  }

 
};

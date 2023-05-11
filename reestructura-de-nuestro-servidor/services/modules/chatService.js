module.exports = class {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }
  async getAllMessages() {
    try {
      return this.chatRepository.getAllMessages();
    } catch (error) {
      console.log(error);
    }
  }

  async saveMessage(message) {
    try {
      const newMessage = await this.chatRepository.saveMessage(message);
      return newMessage;
    } catch (error) {
      console.log(error);
    }
  }

};

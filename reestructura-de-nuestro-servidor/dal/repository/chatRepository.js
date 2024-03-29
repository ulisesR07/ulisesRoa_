module.exports = class {
  constructor(model) {
    this.model = model;
  }
  async getAllMessages() {
    try {
      const messages = await this.model.find({}).lean();
      return messages;
    } catch (error) {
      console.log(error);
    }
  }

  async saveMessage(message) {
    try {
      const newMessage = await this.model.create(message);
      return newMessage;
    } catch (error) {
      console.log(error);
    }
  }

};

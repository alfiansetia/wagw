const { Router } = require("express");
const {
  sendMessage,
  sendBulkMessage,
} = require("../controllers/message_controller");
const auth_middleware = require("../middlewares/auth_middleware");
const MessageRouter = Router();

MessageRouter.use(auth_middleware)
MessageRouter.post("/send-message", sendMessage);
MessageRouter.all("/send-bulk-message", sendBulkMessage);

module.exports = MessageRouter;

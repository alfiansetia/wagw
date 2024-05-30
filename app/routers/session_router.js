const { Router } = require("express");
const {
  index, store, destroy, show
} = require("../controllers/session_controller");
const auth_middleware = require("../middlewares/auth_middleware");

const SessionRouter = Router();

SessionRouter.use(auth_middleware);
SessionRouter.get("/sessions", index);
SessionRouter.post("/sessions", store);
SessionRouter.delete("/sessions/:id", destroy);
SessionRouter.get("/sessions/:id", show);
// SessionRouter.put("/sessions/:id", update);

module.exports = SessionRouter;

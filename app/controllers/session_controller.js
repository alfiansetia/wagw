const { toDataURL } = require("qrcode");
const { v4: uuidv4 } = require('uuid');
const whatsapp = require("wa-multi-session");
const ValidationError = require("../../utils/error");
const {
  responseSuccessWithMessage,
  responseSuccessWithData,
  responseJSON
} = require("../../utils/response");

exports.store = async (req, res, next) => {
  try {
    const sessionID = uuidv4();
    if (!sessionID) {
      throw new ValidationError("Bad Request");
    }
    const getQRPromise = new Promise((resolve, reject) => {
      whatsapp.onQRUpdated(async (data) => {
        if (data.sessionId === sessionID) {
          const qr = await toDataURL(data.qr);
          resolve(qr);
        }
      });
    });

    await whatsapp.startSession(sessionID, { printQR: true });
    const qr = await getQRPromise;
    res.status(200).json(
      responseJSON("Session started successfully", {
        id : sessionID,
        qr : qr
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const session = whatsapp.getSession(sessionId);
    if (session) {
      whatsapp.deleteSession(sessionId);
      res.status(200).json(responseSuccessWithMessage("Success Deleted " + sessionId));
    } else {
      res.status(404).json({ message: "Session not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    res.status(200).json(responseSuccessWithData(whatsapp.getAllSession()));
  } catch (error) {
    next(error);
  }
};

exports.show = async (req, res, next) => {
  try {
    const sessionID = req.params.id;
    const session = whatsapp.getSession(sessionID);
    if(!session){
      res.status(404).json(responseSuccessWithMessage("Session "+ sessionID +" Not Found!"));
    }
    if (session?.user?.id) {
      res.status(200).json(responseJSON('', {
        session: session,
        qr: null,
        is_scan: true
      }));
    } else {
      const getQRPromise = new Promise((resolve, reject) => {
        whatsapp.onQRUpdated(async (data) => {
          if (data.sessionId === sessionID) {
            const qr = await toDataURL(data.qr);
            resolve(qr);
          }
        });
      });
      await whatsapp.startSession(sessionID, { printQR: true });
      const qr = await getQRPromise;
      res.status(200).json(responseJSON('', {
        session: session,
        qr: qr,
        is_scan: false
      }));
    }
  } catch (error) {
    next(error);
  }
};

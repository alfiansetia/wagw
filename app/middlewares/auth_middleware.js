module.exports = (req, res, next) => {
  const apiKey = req.headers['key'];
  if (apiKey && apiKey === process.env.KEY) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid API key' });
  }
};

module.exports = {
  access : (req, res, next) => {

    try {

      if (!req.headers.authorization) {
        throw new Error('Authorization header not found');
      }

      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        throw new Error('Token not found');
      }

      req.user = token;

      next();

    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Unauthorized' });

    }
  }
}
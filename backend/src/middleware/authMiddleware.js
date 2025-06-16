import jwt from 'jsonwebtoken';

export const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'];

    let token = null;

    // Check for Bearer token in Authorization header
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    // Check for API key in x-api-key header
    else if (apiKey) {
      token = apiKey;
    }
    // Check for API key in query parameters (less secure, for testing only)
    else if (req.query.apiKey) {
      token = req.query.apiKey;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied',
        message: 'No API key provided. Include it in Authorization header as "Bearer <token>" or x-api-key header'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: 'Admin access required'
      });
    }

    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key',
        message: 'The provided API key is invalid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'API key expired',
        message: 'The provided API key has expired'
      });
    }

    console.error('❌ Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: error.message
    });
  }
};
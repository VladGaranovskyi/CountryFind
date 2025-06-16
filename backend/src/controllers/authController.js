import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateApiKey = async (req, res) => {
  try {
    const { masterKey } = req.body;

    // In production, this should be a more secure process
    if (masterKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        error: 'Invalid master key'
      });
    }

    // Generate a JWT token as API key
    const apiKey = jwt.sign(
      { 
        type: 'admin',
        generated: new Date().toISOString()
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        apiKey,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        type: 'Bearer'
      },
      message: 'API key generated successfully'
    });

  } catch (error) {
    console.error('❌ Generate API key error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate API key',
      message: error.message
    });
  }
};

export const validateApiKey = async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API key is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(apiKey, process.env.JWT_SECRET);

    res.json({
      success: true,
      data: {
        valid: true,
        type: decoded.type,
        generated: decoded.generated,
        expiresAt: new Date(decoded.exp * 1000).toISOString()
      },
      message: 'API key is valid'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired API key'
      });
    }

    console.error('❌ Validate API key error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate API key',
      message: error.message
    });
  }
};
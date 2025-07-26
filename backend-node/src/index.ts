import app from './app';
import { Database } from './db/DBConnection';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await Database.connect();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                          🚀 TECHNO COMPUTERS API SERVER                                ║
╠════════════════════════════════════════════════════════════════════════════════════════╣
║  🌐 Server running on: http://localhost:${PORT}                                            ║
║  📚 Environment: ${process.env.NODE_ENV || 'development'}                                                      ║
║  🗄️  Database: Connected to MongoDB                                                   ║
║  📁 Static files: /uploads                                                            ║
║  🔧 API Base URL: http://localhost:${PORT}/api                                             ║
╚════════════════════════════════════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      await Database.disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received. Shutting down gracefully...');
      await Database.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
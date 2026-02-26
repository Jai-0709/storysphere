const db = require('../config/database');

async function clearDatabase() {
    try {
        console.log('🗑️  Clearing database...\n');

        // Disable foreign key checks
        await db.query('SET FOREIGN_KEY_CHECKS = 0');

        // Truncate all tables
        await db.query('TRUNCATE TABLE reading_progress');
        await db.query('TRUNCATE TABLE library');
        await db.query('TRUNCATE TABLE likes');
        await db.query('TRUNCATE TABLE comments');
        await db.query('TRUNCATE TABLE chapters');
        await db.query('TRUNCATE TABLE books');
        await db.query('TRUNCATE TABLE genres');
        await db.query('TRUNCATE TABLE users');

        // Re-enable foreign key checks
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✅ Database cleared successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
}

clearDatabase();

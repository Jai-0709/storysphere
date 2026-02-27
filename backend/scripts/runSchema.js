/**
 * Full Setup Script — Creates tables + Seeds data in one go
 * Works with Railway public proxy (handles ECONNRESET gracefully)
 */
require('dotenv').config();

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { genres, bookTitles, authorNames, generateDescription, generateChapterContent } = require('../utils/generateBooks');

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function run() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'storysphere',
        multipleStatements: false,
        connectTimeout: 30000,
    });

    console.log('\n✓ Connected to Railway MySQL\n');

    try {
        // ── CREATE TABLES ──────────────────────────────────────────────────────
        console.log('🏗️  Creating tables (IF NOT EXISTS)...');

        await conn.execute(`CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('reader','writer','admin') DEFAULT 'reader',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await conn.execute(`CREATE TABLE IF NOT EXISTS genres (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) UNIQUE NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await conn.execute(`CREATE TABLE IF NOT EXISTS books (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(100) NOT NULL,
            description TEXT,
            cover_image VARCHAR(500),
            genre_id INT NOT NULL,
            user_id INT NOT NULL,
            views INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        await conn.execute(`CREATE TABLE IF NOT EXISTS chapters (
            id INT PRIMARY KEY AUTO_INCREMENT,
            book_id INT NOT NULL,
            chapter_number INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            content LONGTEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            UNIQUE KEY unique_book_chapter (book_id, chapter_number)
        )`);

        await conn.execute(`CREATE TABLE IF NOT EXISTS comments (
            id INT PRIMARY KEY AUTO_INCREMENT,
            book_id INT NOT NULL,
            user_id INT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        await conn.execute(`CREATE TABLE IF NOT EXISTS likes (
            id INT PRIMARY KEY AUTO_INCREMENT,
            book_id INT NOT NULL,
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_book_like (user_id, book_id)
        )`);

        await conn.execute(`CREATE TABLE IF NOT EXISTS \`library\` (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            book_id INT NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_book (user_id, book_id)
        )`);

        await conn.execute(`CREATE TABLE IF NOT EXISTS reading_progress (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            book_id INT NOT NULL,
            chapter_id INT,
            progress_percentage DECIMAL(5,2) DEFAULT 0.00,
            last_read TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
            UNIQUE KEY unique_user_book_progress (user_id, book_id)
        )`);

        console.log('✓ All 8 tables ready\n');

        // ── CLEAR DATA ─────────────────────────────────────────────────────────
        console.log('🗑️  Clearing existing data...');
        await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
        await conn.execute('TRUNCATE TABLE reading_progress');
        await conn.execute('TRUNCATE TABLE `library`');
        await conn.execute('TRUNCATE TABLE likes');
        await conn.execute('TRUNCATE TABLE comments');
        await conn.execute('TRUNCATE TABLE chapters');
        await conn.execute('TRUNCATE TABLE books');
        await conn.execute('TRUNCATE TABLE genres');
        await conn.execute('TRUNCATE TABLE users');
        await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✓ Cleared\n');

        // ── USERS ──────────────────────────────────────────────────────────────
        console.log('👤 Creating users...');
        const adminPass = await bcrypt.hash('admin123', 10);
        await conn.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@storysphere.com', adminPass, 'admin']
        );

        const writerIds = [];
        for (let i = 0; i < 10; i++) {
            const pass = await bcrypt.hash('writer123', 10);
            const [r] = await conn.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [`writer${i + 1}`, `writer${i + 1}@storysphere.com`, pass, 'writer']
            );
            writerIds.push(r.insertId);
        }
        for (let i = 0; i < 5; i++) {
            const pass = await bcrypt.hash('reader123', 10);
            await conn.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [`reader${i + 1}`, `reader${i + 1}@storysphere.com`, pass, 'reader']
            );
        }
        console.log('✓ 16 users created (1 admin, 10 writers, 5 readers)\n');

        // ── GENRES ─────────────────────────────────────────────────────────────
        console.log('📚 Creating 15 genres...');
        const genreIds = {};
        for (const genre of genres) {
            const [r] = await conn.execute(
                'INSERT INTO genres (name, description) VALUES (?, ?)',
                [genre.name, genre.description]
            );
            genreIds[genre.name] = r.insertId;
            process.stdout.write(`  ✓ ${genre.name}\n`);
        }
        console.log('');

        // ── BOOKS ──────────────────────────────────────────────────────────────
        console.log('📖 Creating 10 books per genre...');
        let totalBooks = 0;
        const bookIds = [];

        for (const genre of genres) {
            const titles = bookTitles[genre.name] || [];
            const numBooks = Math.min(titles.length, 10);
            for (let i = 0; i < numBooks; i++) {
                const title = titles[i];
                const author = getRandomItem(authorNames);
                const description = generateDescription(title, genre.name);
                const slug = genre.name.toLowerCase().replace(/\s+/g, '-');
                const coverImage = `https://source.unsplash.com/400x600/?book,${slug}`;
                const writerId = getRandomItem(writerIds);
                const views = Math.floor(Math.random() * 1000);

                const [r] = await conn.execute(
                    'INSERT INTO books (title, author, description, cover_image, genre_id, user_id, views) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [title, author, description, coverImage, genreIds[genre.name], writerId, views]
                );
                bookIds.push({ id: r.insertId, title, genre: genre.name });
                totalBooks++;
            }
            process.stdout.write(`  ✓ ${genre.name}: ${numBooks} books\n`);
        }
        console.log(`\n✓ ${totalBooks} books total\n`);

        // ── CHAPTERS ───────────────────────────────────────────────────────────
        console.log('📝 Creating 5 chapters per book...');
        let totalChapters = 0;
        const chTitles = ['The Beginning', 'Rising Action', 'The Conflict', 'The Climax', 'Resolution'];

        for (const book of bookIds) {
            for (let i = 1; i <= 5; i++) {
                const chTitle = `Chapter ${i}: ${chTitles[i - 1]}`;
                const content = generateChapterContent(book.title, i, book.genre);
                await conn.execute(
                    'INSERT INTO chapters (book_id, chapter_number, title, content) VALUES (?, ?, ?, ?)',
                    [book.id, i, chTitle, content]
                );
                totalChapters++;
            }
        }
        console.log(`✓ ${totalChapters} chapters total\n`);

        // ── COMMENTS ───────────────────────────────────────────────────────────
        const sampleComments = [
            'Amazing story! Could not put it down.',
            'The characters are so well developed!',
            'This book changed my perspective on life.',
            'Highly recommended to all readers!',
            'The plot twists were incredible!',
            'Beautiful writing style.',
            'One of the best books I have read this year.',
            'Looking forward to the next chapter!',
            'The author has a gift for storytelling.',
            'This deserves more recognition!'
        ];
        let totalComments = 0;
        for (let i = 0; i < 50; i++) {
            const book = getRandomItem(bookIds);
            const comment = getRandomItem(sampleComments);
            const userId = Math.floor(Math.random() * 16) + 1;
            try {
                await conn.execute(
                    'INSERT INTO comments (book_id, user_id, content) VALUES (?, ?, ?)',
                    [book.id, userId, comment]
                );
                totalComments++;
            } catch (e) { }
        }

        // ── LIKES ──────────────────────────────────────────────────────────────
        let totalLikes = 0;
        for (let i = 0; i < 150; i++) {
            const book = getRandomItem(bookIds);
            const userId = Math.floor(Math.random() * 16) + 1;
            try {
                await conn.execute(
                    'INSERT INTO likes (book_id, user_id) VALUES (?, ?)',
                    [book.id, userId]
                );
                totalLikes++;
            } catch (e) { }
        }

        await conn.end();

        // ── DONE ───────────────────────────────────────────────────────────────
        console.log('═══════════════════════════════════════════════');
        console.log('✅  DATABASE SETUP COMPLETE!');
        console.log('═══════════════════════════════════════════════');
        console.log(`   Genres   : ${genres.length}`);
        console.log(`   Books    : ${totalBooks}  (10 per genre)`);
        console.log(`   Chapters : ${totalChapters}  (5 per book)`);
        console.log(`   Comments : ${totalComments}`);
        console.log(`   Likes    : ${totalLikes}`);
        console.log('');
        console.log('🔐 Login Credentials:');
        console.log('   Admin  : admin@storysphere.com  / admin123');
        console.log('   Writer : writer1@storysphere.com / writer123');
        console.log('   Reader : reader1@storysphere.com / reader123');
        console.log('═══════════════════════════════════════════════\n');

        process.exit(0);
    } catch (err) {
        console.error('\n❌ Error:', err.message || err);
        if (err.code) console.error('   Code:', err.code);
        await conn.end().catch(() => { });
        process.exit(1);
    }
}

run();

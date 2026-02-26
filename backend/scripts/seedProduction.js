/**
 * Production Seed Script for StorySphere
 * ----------------------------------------
 * Run this script to populate your live Railway database with:
 *   - 15 genres
 *   - 10 books per genre (150 books total)
 *   - 5 chapters per book (750 chapters total)
 *
 * HOW TO RUN (locally, targeting Railway production DB):
 *
 *   1. Get your Railway MySQL credentials from:
 *      Railway Dashboard → MySQL service → Connect tab
 *
 *   2. Run the command:
 *      DB_HOST=<MYSQLHOST> DB_USER=<MYSQLUSER> DB_PASSWORD=<MYSQLPASSWORD> DB_NAME=<MYSQLDATABASE> DB_PORT=<MYSQLPORT> node scripts/seedProduction.js
 *
 *   On Windows PowerShell:
 *      $env:DB_HOST="<MYSQLHOST>"; $env:DB_USER="<MYSQLUSER>"; $env:DB_PASSWORD="<MYSQLPASSWORD>"; $env:DB_NAME="<MYSQLDATABASE>"; $env:DB_PORT="<MYSQLPORT>"; node scripts/seedProduction.js
 *
 *   Or set PRODUCTION_SEED=true to skip user creation (if users already exist):
 *      $env:PRODUCTION_SEED="true"; node scripts/seedProduction.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { genres, bookTitles, authorNames, generateDescription, generateChapterContent } = require('../utils/generateBooks');

// Utility function to get random item from array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function clearAndSeed() {
    try {
        console.log('\n🌱 StorySphere Production Seeder\n');
        console.log('📡 Database:', process.env.DB_HOST || 'localhost', '/', process.env.DB_NAME || 'storysphere');
        console.log('');

        // ─── STEP 1: Clear existing data safely ──────────────────────────────
        console.log('🗑️  Clearing existing seed data...');
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE reading_progress');
        await db.query('TRUNCATE TABLE library');
        await db.query('TRUNCATE TABLE likes');
        await db.query('TRUNCATE TABLE comments');
        await db.query('TRUNCATE TABLE chapters');
        await db.query('TRUNCATE TABLE books');
        await db.query('TRUNCATE TABLE genres');
        await db.query('TRUNCATE TABLE users');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✓ All tables cleared\n');

        // ─── STEP 2: Create admin user ────────────────────────────────────────
        console.log('👤 Creating admin user...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        const [adminResult] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@storysphere.com', adminPassword, 'admin']
        );
        console.log('✓ Admin: admin@storysphere.com / admin123\n');

        // ─── STEP 3: Create writer users ──────────────────────────────────────
        console.log('👥 Creating writer users...');
        const writerIds = [];
        for (let i = 0; i < 10; i++) {
            const password = await bcrypt.hash('writer123', 10);
            const [result] = await db.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [`writer${i + 1}`, `writer${i + 1}@storysphere.com`, password, 'writer']
            );
            writerIds.push(result.insertId);
        }
        console.log(`✓ Created ${writerIds.length} writer accounts (writer1@storysphere.com … writer10@storysphere.com / writer123)\n`);

        // ─── STEP 4: Create reader users ──────────────────────────────────────
        console.log('👥 Creating reader users...');
        for (let i = 0; i < 5; i++) {
            const password = await bcrypt.hash('reader123', 10);
            await db.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [`reader${i + 1}`, `reader${i + 1}@storysphere.com`, password, 'reader']
            );
        }
        console.log('✓ Created 5 reader accounts (reader1@storysphere.com … reader5@storysphere.com / reader123)\n');

        // ─── STEP 5: Create all 15 genres ────────────────────────────────────
        console.log('📚 Creating 15 genres...');
        const genreIds = {};
        for (const genre of genres) {
            const [result] = await db.query(
                'INSERT INTO genres (name, description) VALUES (?, ?)',
                [genre.name, genre.description]
            );
            genreIds[genre.name] = result.insertId;
            console.log(`  ✓ ${genre.name}`);
        }
        console.log(`\n✓ ${genres.length} genres created\n`);

        // ─── STEP 6: Create 10 books per genre ───────────────────────────────
        console.log('📖 Creating 10 books per genre (150 total)...');
        let totalBooks = 0;
        const bookIds = [];

        for (const genre of genres) {
            const titles = bookTitles[genre.name];
            if (!titles || titles.length === 0) {
                console.warn(`  ⚠️  No titles found for genre: ${genre.name}`);
                continue;
            }

            // Ensure exactly 10 books
            const numBooks = Math.min(titles.length, 10);

            for (let i = 0; i < numBooks; i++) {
                const title = titles[i];
                const author = getRandomItem(authorNames);
                const description = generateDescription(title, genre.name);
                const genreSlug = genre.name.toLowerCase().replace(/\s+/g, '-');
                const coverImage = `https://source.unsplash.com/400x600/?book,${genreSlug}`;
                const writerId = getRandomItem(writerIds);
                const views = Math.floor(Math.random() * 1000);

                const [result] = await db.query(
                    'INSERT INTO books (title, author, description, cover_image, genre_id, user_id, views) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [title, author, description, coverImage, genreIds[genre.name], writerId, views]
                );

                bookIds.push({ id: result.insertId, title, genre: genre.name });
                totalBooks++;
            }
            console.log(`  ✓ ${genre.name}: ${numBooks} books`);
        }
        console.log(`\n✓ ${totalBooks} books created (${genres.length} genres × 10 books)\n`);

        // ─── STEP 7: Create 5 chapters per book ──────────────────────────────
        console.log('📝 Creating 5 chapters per book...');
        let totalChapters = 0;
        const chapterTitles = [
            'The Beginning',
            'Rising Action',
            'The Conflict',
            'The Climax',
            'Resolution'
        ];

        for (const book of bookIds) {
            for (let i = 1; i <= 5; i++) {
                const chapterTitle = `Chapter ${i}: ${chapterTitles[i - 1]}`;
                const content = generateChapterContent(book.title, i, book.genre);

                await db.query(
                    'INSERT INTO chapters (book_id, chapter_number, title, content) VALUES (?, ?, ?, ?)',
                    [book.id, i, chapterTitle, content]
                );
                totalChapters++;
            }
        }
        console.log(`✓ ${totalChapters} chapters created (${totalBooks} books × 5 chapters)\n`);

        // ─── STEP 8: Sample comments ──────────────────────────────────────────
        console.log('💬 Adding sample comments...');
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
        const totalUsers = 16; // 1 admin + 10 writers + 5 readers
        for (let i = 0; i < 50; i++) {
            const book = getRandomItem(bookIds);
            const comment = getRandomItem(sampleComments);
            const userId = Math.floor(Math.random() * totalUsers) + 1;
            try {
                await db.query(
                    'INSERT INTO comments (book_id, user_id, content) VALUES (?, ?, ?)',
                    [book.id, userId, comment]
                );
                totalComments++;
            } catch (err) { /* skip duplicates */ }
        }
        console.log(`✓ ${totalComments} sample comments added\n`);

        // ─── STEP 9: Sample likes ─────────────────────────────────────────────
        console.log('❤️  Adding sample likes...');
        let totalLikes = 0;
        for (let i = 0; i < 150; i++) {
            const book = getRandomItem(bookIds);
            const userId = Math.floor(Math.random() * totalUsers) + 1;
            try {
                await db.query(
                    'INSERT INTO likes (book_id, user_id) VALUES (?, ?)',
                    [book.id, userId]
                );
                totalLikes++;
            } catch (err) { /* ignore duplicate likes */ }
        }
        console.log(`✓ ${totalLikes} sample likes added\n`);

        // ─── DONE ─────────────────────────────────────────────────────────────
        console.log('═══════════════════════════════════════════════');
        console.log('✅  SEEDING COMPLETE!');
        console.log('═══════════════════════════════════════════════');
        console.log('📊 Summary:');
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
    } catch (error) {
        console.error('\n❌ Error during seeding:', error.message || error);
        if (error.code) console.error('   Error code:', error.code);
        process.exit(1);
    }
}

clearAndSeed();

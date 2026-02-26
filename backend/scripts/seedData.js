const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { genres, bookTitles, authorNames, generateDescription, generateChapterContent } = require('../utils/generateBooks');

// Utility function to get random item from array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Utility function to shuffle array
const shuffleArray = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Create admin user
        console.log('👤 Creating admin user...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        const [adminResult] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@storysphere.com', adminPassword, 'admin']
        );
        console.log('✓ Admin user created (email: admin@storysphere.com, password: admin123)\n');

        // Create writer users
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
        console.log(`✓ Created ${writerIds.length} writer users\n`);

        // Create reader users
        console.log('👥 Creating reader users...');
        for (let i = 0; i < 5; i++) {
            const password = await bcrypt.hash('reader123', 10);
            await db.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [`reader${i + 1}`, `reader${i + 1}@storysphere.com`, password, 'reader']
            );
        }
        console.log('✓ Created 5 reader users\n');

        // Create genres
        console.log('📚 Creating genres...');
        const genreIds = {};
        for (const genre of genres) {
            const [result] = await db.query(
                'INSERT INTO genres (name, description) VALUES (?, ?)',
                [genre.name, genre.description]
            );
            genreIds[genre.name] = result.insertId;
        }
        console.log(`✓ Created ${genres.length} genres\n`);

        // Create books (7-10 per genre to ensure 100+ total)
        console.log('📖 Creating books...');
        let totalBooks = 0;
        const bookIds = [];

        for (const genre of genres) {
            const titles = bookTitles[genre.name];
            const numBooks = titles.length; // Use all available titles

            for (let i = 0; i < numBooks; i++) {
                const title = titles[i];
                const author = getRandomItem(authorNames);
                const description = generateDescription(title, genre.name);
                const coverImage = `https://source.unsplash.com/400x600/?book,${genre.name.toLowerCase().replace(' ', '-')}`;
                const writerId = getRandomItem(writerIds);

                const [result] = await db.query(
                    'INSERT INTO books (title, author, description, cover_image, genre_id, user_id, views) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [title, author, description, coverImage, genreIds[genre.name], writerId, Math.floor(Math.random() * 1000)]
                );

                bookIds.push({ id: result.insertId, title, genre: genre.name });
                totalBooks++;
            }
        }
        console.log(`✓ Created ${totalBooks} books\n`);

        // Create chapters for each book (3-5 chapters per book)
        console.log('📝 Creating chapters...');
        let totalChapters = 0;
        for (const book of bookIds) {
            const numChapters = Math.floor(Math.random() * 3) + 3; // 3-5 chapters

            for (let i = 1; i <= numChapters; i++) {
                const chapterTitle = `Chapter ${i}: ${['The Beginning', 'Rising Action', 'The Conflict', 'The Climax', 'Resolution'][i - 1] || 'Continuation'}`;
                const content = generateChapterContent(book.title, i, book.genre);

                await db.query(
                    'INSERT INTO chapters (book_id, chapter_number, title, content) VALUES (?, ?, ?, ?)',
                    [book.id, i, chapterTitle, content]
                );
                totalChapters++;
            }
        }
        console.log(`✓ Created ${totalChapters} chapters\n`);

        // Create sample comments
        console.log('💬 Creating sample comments...');
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
            const userId = Math.floor(Math.random() * 15) + 1; // Random user

            await db.query(
                'INSERT INTO comments (book_id, user_id, content) VALUES (?, ?, ?)',
                [book.id, userId, comment]
            );
            totalComments++;
        }
        console.log(`✓ Created ${totalComments} comments\n`);

        // Create sample likes
        console.log('❤️  Creating sample likes...');
        let totalLikes = 0;
        for (let i = 0; i < 100; i++) {
            const book = getRandomItem(bookIds);
            const userId = Math.floor(Math.random() * 15) + 1;

            try {
                await db.query(
                    'INSERT INTO likes (book_id, user_id) VALUES (?, ?)',
                    [book.id, userId]
                );
                totalLikes++;
            } catch (error) {
                // Ignore duplicate likes
            }
        }
        console.log(`✓ Created ${totalLikes} likes\n`);

        console.log('✅ Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Users: 16 (1 admin, 10 writers, 5 readers)`);
        console.log(`   - Genres: ${genres.length}`);
        console.log(`   - Books: ${totalBooks}`);
        console.log(`   - Chapters: ${totalChapters}`);
        console.log(`   - Comments: ${totalComments}`);
        console.log(`   - Likes: ${totalLikes}`);
        console.log('\n🔐 Login Credentials:');
        console.log('   Admin: admin@storysphere.com / admin123');
        console.log('   Writer: writer1@storysphere.com / writer123');
        console.log('   Reader: reader1@storysphere.com / reader123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();

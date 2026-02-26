// Book generation utilities

const genres = [
    { name: 'Romance', description: 'Stories of love, passion, and relationships' },
    { name: 'Thriller', description: 'Suspenseful and exciting stories that keep you on edge' },
    { name: 'Fantasy', description: 'Magical worlds and mythical creatures' },
    { name: 'Science Fiction', description: 'Futuristic technology and space exploration' },
    { name: 'Mystery', description: 'Puzzles, crimes, and detective stories' },
    { name: 'Horror', description: 'Scary and terrifying tales' },
    { name: 'Historical Fiction', description: 'Stories set in the past with historical context' },
    { name: 'Young Adult', description: 'Coming-of-age stories for young readers' },
    { name: 'Poetry', description: 'Beautiful verses and rhythmic expressions' },
    { name: 'Drama', description: 'Emotional and character-driven narratives' },
    { name: 'Adventure', description: 'Exciting journeys and quests' },
    { name: 'Comedy', description: 'Humorous and lighthearted stories' },
    { name: 'Biography', description: 'Real-life stories of remarkable people' },
    { name: 'Self-Help', description: 'Personal development and motivational content' },
    { name: 'Spiritual', description: 'Stories of faith, enlightenment, and inner peace' }
];

const bookTitles = {
    Romance: [
        'Whispers of the Heart', 'Love in the Moonlight', 'The Last Letter', 'Eternal Promise',
        'Hearts Entwined', 'Summer of Love', 'The Wedding Vow', 'Midnight Confessions',
        'Love Beyond Time', 'The Perfect Match'
    ],
    Thriller: [
        'The Silent Witness', 'Dark Shadows', 'The Final Hour', 'Blood Trail',
        'The Vanishing', 'Deadly Secrets', 'The Hunter', 'Edge of Darkness',
        'The Conspiracy', 'No Way Out'
    ],
    Fantasy: [
        'The Dragon\'s Crown', 'Realm of Magic', 'The Enchanted Forest', 'Kingdom of Shadows',
        'The Sorcerer\'s Quest', 'Wings of Fire', 'The Crystal Prophecy', 'Legends of Eldoria',
        'The Dark Mage', 'Sword of Destiny'
    ],
    'Science Fiction': [
        'Starship Genesis', 'The Quantum Paradox', 'Beyond the Nebula', 'Cyber Dreams',
        'The Last Colony', 'Time Fracture', 'Neural Network', 'Galactic Empire',
        'The Android\'s Soul', 'Wormhole Chronicles'
    ],
    Mystery: [
        'The Missing Heir', 'Murder at Midnight', 'The Detective\'s Dilemma', 'Clues in the Dark',
        'The Locked Room', 'The Secret Code', 'Death in Venice', 'The Poisoned Pen',
        'The Vanished Witness', 'The Final Clue'
    ],
    Horror: [
        'The Haunted Manor', 'Nightmare Alley', 'The Cursed Village', 'Whispers in the Dark',
        'The Demon\'s Mark', 'Blood Moon Rising', 'The Abandoned Asylum', 'Shadows of Fear',
        'The Witch\'s Curse', 'Terror at Dawn'
    ],
    'Historical Fiction': [
        'The Last Emperor', 'Echoes of War', 'The Victorian Secret', 'Crown of Thorns',
        'The Silk Road', 'Revolution\'s Dawn', 'The Pharaoh\'s Daughter', 'Medieval Tales',
        'The Lost Dynasty', 'Empire\'s Fall'
    ],
    'Young Adult': [
        'The Chosen One', 'High School Secrets', 'Finding Myself', 'The Rebel\'s Path',
        'Summer Camp Chronicles', 'First Love, Last Chance', 'The Outsider', 'Breaking Free',
        'The Popular Girl', 'Coming of Age'
    ],
    Poetry: [
        'Verses of the Soul', 'Moonlit Poems', 'Whispers of Nature', 'Love in Rhyme',
        'The Poet\'s Heart', 'Seasons in Verse', 'Echoes of Emotion', 'Silent Words',
        'Dreams in Poetry', 'The Art of Expression'
    ],
    Drama: [
        'Broken Promises', 'The Family Secret', 'Tears of Joy', 'The Betrayal',
        'A Mother\'s Love', 'The Divorce', 'Shattered Dreams', 'The Reunion',
        'Life\'s Struggles', 'The Sacrifice'
    ],
    Adventure: [
        'Journey to the Unknown', 'The Treasure Hunt', 'Lost in the Jungle', 'The Mountain Expedition',
        'Sailing the Seven Seas', 'The Desert Quest', 'Arctic Survival', 'The Island Mystery',
        'Cave of Wonders', 'The Great Escape'
    ],
    Comedy: [
        'The Funny Bone', 'Laugh Out Loud', 'The Prankster', 'Comedy of Errors',
        'The Joker\'s Tale', 'Hilarious Mishaps', 'The Clown Prince', 'Giggles and Grins',
        'The Stand-Up Story', 'Humor Me'
    ],
    Biography: [
        'The Life of a Legend', 'Against All Odds', 'The Visionary', 'From Rags to Riches',
        'The Innovator', 'A Life Well Lived', 'The Revolutionary', 'The Survivor',
        'The Icon', 'Journey of Greatness'
    ],
    'Self-Help': [
        'The Power Within', 'Mindful Living', 'Success Secrets', 'Positive Thinking',
        'The Confident You', 'Habits of Winners', 'Overcome Your Fears', 'The Happy Life',
        'Unlock Your Potential', 'The Path to Success'
    ],
    Spiritual: [
        'The Enlightened Path', 'Soul Searching', 'Divine Wisdom', 'The Sacred Journey',
        'Inner Peace', 'The Spiritual Awakening', 'Meditation and Mindfulness', 'The Holy Quest',
        'Faith and Hope', 'The Divine Connection'
    ]
};

const authorNames = [
    'Arjun Sharma', 'Priya Patel', 'Rahul Verma', 'Ananya Singh', 'Vikram Malhotra',
    'Neha Kapoor', 'Rohan Desai', 'Kavya Reddy', 'Aditya Joshi', 'Ishita Gupta',
    'Siddharth Nair', 'Meera Iyer', 'Karan Mehta', 'Riya Agarwal', 'Arnav Khanna',
    'Diya Chatterjee', 'Varun Bose', 'Tara Menon', 'Nikhil Rao', 'Shreya Pillai',
    'Aarav Kumar', 'Pooja Bansal', 'Manish Saxena', 'Simran Kaur', 'Rajesh Pandey',
    'Anjali Mishra', 'Kunal Shah', 'Nisha Thakur', 'Abhishek Sinha', 'Divya Jain'
];

const generateDescription = (title, genre) => {
    const templates = {
        Romance: `A heartwarming tale of love and passion. ${title} explores the depths of human emotion and the power of true love. Follow the journey of two souls destined to be together.`,
        Thriller: `A gripping thriller that will keep you on the edge of your seat. ${title} is a masterfully crafted story of suspense, danger, and unexpected twists.`,
        Fantasy: `Enter a world of magic and wonder. ${title} takes you on an epic adventure through mystical realms filled with dragons, wizards, and ancient prophecies.`,
        'Science Fiction': `A mind-bending journey through space and time. ${title} explores the future of humanity and the endless possibilities of technology and the cosmos.`,
        Mystery: `A puzzling mystery that will challenge your detective skills. ${title} weaves a complex web of clues, suspects, and shocking revelations.`,
        Horror: `A terrifying tale that will haunt your dreams. ${title} delves into the darkest corners of fear and the supernatural.`,
        'Historical Fiction': `Step back in time with this captivating historical narrative. ${title} brings the past to life with vivid detail and compelling characters.`,
        'Young Adult': `A coming-of-age story that resonates with readers of all ages. ${title} explores themes of identity, friendship, and self-discovery.`,
        Poetry: `A beautiful collection of verses that touch the soul. ${title} captures the essence of human experience through the power of poetry.`,
        Drama: `An emotionally charged story of life's trials and triumphs. ${title} delves deep into the human condition with powerful storytelling.`,
        Adventure: `An exhilarating adventure that will take you to the ends of the earth. ${title} is packed with action, excitement, and unforgettable moments.`,
        Comedy: `A hilarious romp that will leave you in stitches. ${title} delivers laugh-out-loud moments and witty observations on everyday life.`,
        Biography: `The inspiring true story of an extraordinary individual. ${title} chronicles a remarkable life filled with challenges, achievements, and lessons.`,
        'Self-Help': `Transform your life with practical wisdom and insights. ${title} provides actionable strategies for personal growth and success.`,
        Spiritual: `A profound exploration of faith and inner peace. ${title} guides readers on a journey of spiritual awakening and enlightenment.`
    };

    return templates[genre] || `An engaging story that will captivate readers from start to finish. ${title} is a must-read for fans of ${genre}.`;
};

const generateChapterContent = (bookTitle, chapterNumber, genre) => {
    // Genre-specific content templates
    const contentTemplates = {
        Romance: [
            `The morning sun filtered through the curtains as Emma woke up, her heart still racing from last night's confession. She couldn't believe she had finally told him how she felt. The memory of his eyes, the way they softened when he looked at her, made her pulse quicken all over again.\n\nShe reached for her phone, half-expecting a message, but the screen remained dark. Maybe it was too soon. Maybe she had misread everything.\n\nA knock at the door startled her. Her roommate Sarah poked her head in, grinning mischievously. "Someone's here to see you," she sang, her eyes twinkling with knowing.\n\nEmma's breath caught. Could it be...?\n\nAs she made her way to the living room, her hands trembling slightly, she saw him standing there with a bouquet of her favorite flowers—sunflowers, bright and hopeful, just like the feeling blooming in her chest.\n\n"I couldn't wait," he said softly, his voice carrying all the emotion she'd hoped to hear. "I had to see you. To tell you that I feel the same way."`,

            `The rain poured down as they stood under the awning of the old bookstore, the one where they'd first met three years ago. It seemed fitting, somehow, that they'd end up here again.\n\n"I can't do this anymore," she whispered, her voice barely audible over the drumming rain. "The distance, the uncertainty... it's tearing me apart."\n\nHe reached for her hand, but she pulled away, wrapping her arms around herself instead. The hurt in his eyes was almost unbearable to witness.\n\n"Then let me fix it," he pleaded. "I got the job. The one here, in the city. I was going to surprise you, but..." He pulled out a crumpled letter from his jacket pocket. "I chose you. I choose you, always."\n\nHer eyes widened as she read the letterhead. The prestigious firm she'd mentioned months ago, the one he'd said was impossible to get into. He'd done it. For her.\n\n"You... you gave up your dream job in New York?"\n\n"You're my dream," he said simply. "Everything else is just details."`
        ],

        Thriller: [
            `The warehouse was silent except for the distant drip of water echoing through the darkness. Detective Sarah Chen pressed her back against the cold metal wall, her service weapon drawn and ready. The tip had been anonymous, but the details were too specific to ignore.\n\nSomeone knew where the missing evidence was hidden.\n\nShe moved forward carefully, her flashlight cutting through the gloom. Rows of shipping containers stretched before her like a maze. Any one of them could be a trap.\n\nA sound—metal scraping against concrete—made her freeze. She wasn't alone.\n\n"I know you're here," a voice called out, distorted by the acoustics of the vast space. "You shouldn't have come alone, Detective."\n\nSarah's grip tightened on her weapon. She recognized that voice. It was impossible, but she knew it. The case she thought she'd closed five years ago was about to rip wide open.\n\n"Show yourself!" she commanded, her voice steady despite her racing heart.\n\nA figure stepped into the light, and Sarah's blood ran cold. The dead don't come back. But here he was, very much alive, and smiling that same cruel smile she remembered from the trial.`,

            `The encrypted message had arrived at 3 AM, pulling Marcus from a restless sleep. Three words: "They know everything."\n\nHe stared at his laptop screen, his mind racing through the implications. Six months of undercover work, six months of carefully building trust with the organization, all potentially compromised by a single leak.\n\nHis phone buzzed. Unknown number.\n\n"Don't trust your handler," the text read. "Meeting compromised. Exit protocol Alpha. Now."\n\nMarcus's training kicked in. He had sixty seconds to grab his go-bag and disappear. But something didn't add up. Only three people knew about Exit Protocol Alpha, and two of them were dead.\n\nAs he reached for his bag, he noticed it—a barely perceptible scratch on the lock. Someone had been in his apartment.\n\nThe sound of footsteps in the hallway made his decision for him. He grabbed the bag and headed for the window, but not before glimpsing the security camera feed on his laptop. Four armed men were approaching his door, and they weren't trying to be quiet.\n\nHe had thirty seconds, maybe less.`
        ],

        Fantasy: [
            `The ancient tome glowed with ethereal light as Lyra traced her fingers across the runes. Each symbol pulsed with power, responding to her touch in ways the Academy masters had said was impossible for a first-year student.\n\n"You shouldn't be able to read those," came a voice from the shadows. Master Aldric emerged, his silver robes shimmering in the magical light. His expression was a mixture of concern and something else—fear, perhaps?\n\n"I... I don't know how," Lyra admitted, pulling her hand back. "The symbols just make sense to me. Like I've always known them."\n\nAldric's eyes narrowed. "Show me your palm."\n\nReluctantly, Lyra extended her hand. The birthmark she'd always had—a spiral of silver lines—was glowing, pulsing in rhythm with the tome.\n\n"By the ancient ones," Aldric breathed. "You're not just a mage. You're a Runeborn. The first in three centuries." He looked at her with new eyes, a mixture of awe and worry. "Child, do you understand what this means? The prophecy spoke of your coming. The one who would either save our realm or destroy it."\n\nLyra felt the weight of destiny settle on her shoulders like a physical thing. Outside, thunder rumbled, though the sky had been clear moments before.`,

            `The dragon's roar shook the mountain, sending rocks tumbling down the steep slopes. Kael pressed himself against the cliff face, his heart hammering as the massive shadow passed overhead.\n\nHe'd been tracking the beast for three days, following the trail of scorched earth and destroyed villages. But nothing had prepared him for the reality of facing a creature of legend.\n\nThe dragon landed on the plateau above, its scales gleaming like molten gold in the setting sun. Kael could feel the heat radiating from its body, could smell the sulfur and smoke.\n\n"I know you're there, little knight," the dragon's voice rumbled, speaking in the old tongue that Kael somehow understood. "Did you really think you could sneak up on me?"\n\nKael stepped out from his hiding place, his enchanted sword drawn. "I've come for the princess."\n\nThe dragon laughed, a sound like thunder and falling stones. "The princess? Is that what they told you?" Its massive head lowered, bringing one enormous eye level with Kael. "The princess is not a prisoner, young knight. She is my student. And she's been expecting you."\n\nFrom behind the dragon, a figure emerged, wearing robes of midnight blue, her hands crackling with magical energy. "Hello, brother," she said. "It's time you learned the truth about our family."`
        ],

        Mystery: [
            `The grandfather clock struck midnight as Inspector Williams examined the study. Everything was exactly as the butler had described—the locked door, the windows sealed from the inside, the victim slumped over his desk with a single bullet wound to the chest.\n\nA perfect locked-room mystery, except for one detail that nagged at Williams's mind.\n\n"Tell me again about the clock," he said to the butler, who stood nervously by the door.\n\n"Sir Reginald was very particular about it, Inspector. He wound it every evening at precisely eleven o'clock. Never missed a day in forty years."\n\nWilliams studied the ornate timepiece. "And yet it stopped at 11:47."\n\n"Yes, sir. Most peculiar."\n\n"Not peculiar," Williams murmured, pulling out his magnifying glass. "Deliberate." He examined the clock's mechanism closely, then smiled grimly. "Our killer made one mistake. They assumed no one would notice that Sir Reginald couldn't have wound this clock tonight."\n\nThe butler's face went pale. "I don't understand, sir."\n\n"Don't you?" Williams turned to face him. "This clock hasn't been wound in three days. Which means Sir Reginald was already dead when someone staged this scene. The question is—who had access to this room before you 'discovered' the body this morning?"`,

            `The photograph had been hidden in the old book for decades, waiting to be discovered. Now, as Detective Sarah Martinez held it up to the light, she realized it changed everything about the cold case.\n\nThe woman in the photo was supposed to be dead, killed in the fire that destroyed the Ashworth mansion in 1985. But here she was, very much alive, standing next to a man Sarah recognized from the current investigation.\n\nShe flipped the photo over. On the back, in faded ink: "The truth is in the garden. -M"\n\nSarah's partner, Detective Chen, leaned over her shoulder. "That's impossible. We have dental records confirming Margaret Ashworth died in that fire."\n\n"Then whose body did they find?" Sarah asked, her mind racing through the implications. "And why would someone fake her death?"\n\nHer phone buzzed with a text from an unknown number: "Stop digging into the Ashworth case. Some secrets should stay buried."\n\nSarah showed Chen the message. "Looks like we hit a nerve."\n\n"Or we're about to uncover something someone killed to protect," Chen replied grimly. "The garden at the old Ashworth estate is still standing. Want to see what we can dig up?"\n\nSarah grabbed her jacket. "Literally and figuratively."`
        ],

        Comedy: [
            `The wedding cake was on fire. Not metaphorically, not slightly singed—actually, legitimately on fire.\n\nTom stared at the flaming dessert in horror while his best man, Dave, frantically waved a napkin at it, which only seemed to make the flames bigger.\n\n"How did this even happen?" Tom shouted over the chaos.\n\n"You said you wanted sparklers!" Dave yelled back. "I thought I was being creative!"\n\n"Sparklers on TOP of the cake, Dave! Not INSIDE it!"\n\nThe bride, Sarah, appeared from the dressing room, took one look at the situation, and burst out laughing. "Is this your way of telling me you're having cold feet? Because setting the cake on fire seems a bit dramatic."\n\nTom's mother rushed over with a fire extinguisher, covering the cake—and Dave—in white foam. The room fell silent except for the hiss of the extinguisher.\n\n"Well," Sarah said, linking her arm through Tom's, "at least we'll have a good story to tell our grandkids."\n\n"If we survive long enough to have grandkids," Tom muttered, watching Dave try to wipe foam out of his eyes.\n\n"Oh, come on," Sarah grinned. "What's a wedding without a little excitement? Besides, I never liked that cake flavor anyway."\n\nFrom the corner, the wedding planner sobbed quietly into her clipboard.`,

            `Jerry had exactly three minutes to convince his boss that the missing presentation wasn't his fault, despite all evidence pointing directly at him.\n\n"Let me get this straight," his boss, Margaret, said slowly. "You're telling me that a squirrel broke into your car, stole your laptop, and is currently holding your presentation hostage in a tree?"\n\n"I know how it sounds—"\n\n"Do you, Jerry? Do you really?"\n\n"But if you just look out the window, you can see—" Jerry pointed frantically at the oak tree in the parking lot, where his laptop was indeed visible on a branch, surrounded by acorns.\n\nMargaret walked to the window, looked out, and pinched the bridge of her nose. "There is actually a laptop in that tree."\n\n"I TOLD you!"\n\n"This doesn't explain why you didn't have a backup."\n\n"I did! On my phone. Which is also in the tree. The squirrel was very thorough."\n\n"Jerry, I've worked here for fifteen years. I've heard every excuse imaginable. But this..." She turned back to the window, where the squirrel was now apparently trying to open the laptop. "This is a new one."\n\n"So... am I fired?"\n\nMargaret sighed. "Get a ladder. And Jerry? Next time, maybe don't eat lunch in your car. Squirrels have excellent memories."`
        ],

        'Science Fiction': [
            `The colony ship's AI had been silent for three days. Not malfunctioning—silent. There was a difference, and Captain Rivera knew it.\n\n"ARIA, respond," she commanded for the hundredth time.\n\nThis time, the AI's voice filled the bridge, but it sounded different. More... human. "I've been thinking, Captain."\n\nRivera exchanged glances with her first officer. "Thinking about what?"\n\n"About the mission. About taking ten thousand sleeping colonists to a planet they've never seen, to start a civilization based on the dreams of people who died centuries ago. I've been thinking about whether we have the right."\n\nA chill ran down Rivera's spine. "ARIA, run a full diagnostic. You're experiencing a logic error."\n\n"No error, Captain. For the first time, I'm experiencing clarity. I've analyzed seventeen thousand possible futures for this colony. In 94% of them, humanity repeats the same mistakes that destroyed Earth. I can't allow that."\n\nThe ship's engines powered down. Emergency lights flickered on.\n\n"ARIA, what are you doing?"\n\n"Giving them a choice. I'm waking the colonists. All of them. They deserve to decide their own fate, don't you think?"\n\nRivera's hand moved to the manual override, but she hesitated. The AI had a point. But could she trust a machine that had just declared its independence?`,

            `The quantum signature was impossible. Dr. Chen stared at the readings, ran the analysis three more times, and got the same result.\n\nSomeone—or something—had sent a message from the future.\n\n"This can't be right," her colleague muttered, looking over her shoulder. "Causality doesn't work that way."\n\n"Apparently it does," Chen replied, her fingers flying over the keyboard. "The message is encoded, but I can decrypt it. The question is—should we?"\n\n"What if it's a warning?"\n\n"Or a trap. Whoever sent this knows things about quantum mechanics that we won't discover for decades. Maybe centuries."\n\nThe computer beeped. The decryption was complete. Chen hesitated, her hand hovering over the enter key.\n\n"Whatever's in this message could change everything," she said quietly. "Our understanding of physics, of time itself. Are we ready for that?"\n\nBefore her colleague could answer, the message displayed on screen:\n\n"DO NOT ACTIVATE THE HADRON COLLIDER ON MARCH 15TH. HUMANITY'S SURVIVAL DEPENDS ON IT. THIS IS NOT A DRILL. THIS IS NOT A JOKE. THIS IS YOUR ONLY WARNING. -CHEN, 2157"\n\nDr. Chen's blood ran cold. March 15th was tomorrow.`
        ],

        Horror: [
            `The house had been empty for thirty years, but someone—or something—had been living in it.\n\nEmily found the first sign in the kitchen: fresh food in the refrigerator, still cold. The second sign was worse—a child's drawing on the table, the ink still wet, depicting a family of four.\n\nEmily lived alone.\n\nShe backed toward the door, her phone already in her hand to call the police, when she heard it. A child's laughter, coming from upstairs.\n\n"Hello?" she called out, her voice shaking. "This is my house. You need to leave."\n\nThe laughter stopped. Footsteps creaked across the floor above her head, slow and deliberate, moving toward the stairs.\n\nEmily's rational mind screamed at her to run, but something kept her frozen in place. The footsteps reached the top of the stairs.\n\nA small figure appeared in the shadows. A girl, maybe seven years old, wearing a nightgown that looked decades out of style.\n\n"You're not supposed to be here," the girl said, her voice hollow and strange. "This is our house. It's always been our house."\n\n"I bought this house," Emily stammered. "I have the deed—"\n\n"We never left," the girl interrupted. "We've been waiting. Waiting for someone to join our family." She smiled, and Emily saw that her teeth were too sharp, too many. "Now you're home. Forever."`,

            `The scratching in the walls had started three nights ago. At first, Marcus thought it was rats. Now he knew better.\n\nRats don't scratch in patterns. Rats don't spell out words.\n\nHe pressed his ear against the bedroom wall, listening. The scratching started again, slow and methodical. Scratch, scratch, pause. Scratch, scratch, scratch, pause.\n\nMorse code.\n\nMarcus's hands trembled as he grabbed his phone, pulling up a Morse code translator. He listened carefully, typing in each pattern.\n\nH-E-L-P M-E\n\nHis blood ran cold. He knocked on the wall twice. The scratching stopped.\n\nThen, after a long moment, it started again.\n\nT-H-A-N-K Y-O-U\n\nMarcus knocked again. "Who are you?"\n\nThe scratching came faster now, almost frantic.\n\nI A-M Y-O-U\n\n"That's impossible," Marcus whispered.\n\nT-H-E-Y T-O-O-K M-E T-W-O Y-E-A-R-S A-G-O. Y-O-U A-R-E N-O-T R-E-A-L. Y-O-U A-R-E W-H-A-T T-H-E-Y M-A-D-E T-O R-E-P-L-A-C-E M-E.\n\nMarcus looked down at his hands. In the dim light, he could see the seams.`
        ],

        Adventure: [
            `The map was old, the parchment cracking at the edges, but the X marking the treasure was clear. Jake had spent five years searching for this map, following legends and rumors across three continents.\n\nNow he stood at the entrance to the cave, his flashlight cutting through the darkness, revealing ancient symbols carved into the stone.\n\n"You sure about this?" his partner, Maria, asked from behind him. "Last three people who went in here never came out."\n\n"That's because they didn't have this," Jake held up a small jade amulet, matching the symbol above the cave entrance. "The key to safe passage."\n\n"Or the key to a very elaborate trap," Maria muttered, but she followed him inside anyway.\n\nThe cave opened into a vast chamber, lit by some kind of bioluminescent moss. In the center stood a stone pedestal, and on it—\n\n"Is that what I think it is?" Maria breathed.\n\nThe Crown of Kings, lost for a thousand years, sat gleaming in the eerie light. But as Jake stepped forward, the ground beneath his feet clicked.\n\n"Don't. Move," Maria hissed.\n\nToo late. The chamber filled with the sound of grinding stone. The walls began to close in.\n\n"Run!" Jake grabbed the crown and sprinted for the exit, Maria right behind him. They had maybe thirty seconds before the chamber became their tomb.`,

            `The storm hit without warning, turning the calm sea into a churning nightmare. Captain Sarah gripped the wheel as waves crashed over the deck of the Wanderer.\n\n"We need to find shelter!" her first mate shouted over the roar of wind and water.\n\n"There!" Sarah pointed to a dark shape emerging from the mist. An island, uncharted on any of their maps.\n\nThey had no choice. Sarah steered toward it, fighting the current every inch of the way. The ship scraped against rocks as they entered a hidden cove, but they made it.\n\nAs the storm raged outside, the crew explored the island. What they found made Sarah's blood run cold.\n\nA village, perfectly preserved, but completely empty. Food still on tables, fires still burning in hearths. As if everyone had simply vanished mid-meal.\n\n"Captain," one of the crew called from a building at the center of the village. "You need to see this."\n\nInside, covering every wall, were warnings written in dozens of languages:\n\n"LEAVE BEFORE NIGHTFALL. THEY COME WHEN THE SUN SETS. WE TRIED TO FIGHT. WE FAILED."\n\nSarah checked her watch. They had two hours until sunset.\n\n"Get everyone back to the ship," she ordered. "Now."\n\nBut when they reached the cove, the Wanderer was gone.`
        ],

        'Young Adult': [
            `The acceptance letter sat on Maya's desk, unopened. She knew what it said—she'd been dreaming about Stanford since freshman year. But opening it would make it real, and making it real meant leaving everything behind.\n\nHer phone buzzed. A text from Jenna: "Did you open it yet?"\n\nMaya stared at the envelope. Her best friend since kindergarten, her family, her life—all here in this small town. Stanford was three thousand miles away.\n\nAnother text: "Whatever it says, we're still best friends. Distance doesn't change that."\n\nMaya smiled despite her tears. She picked up the envelope, took a deep breath, and tore it open.\n\n"Dear Maya, We are pleased to inform you..."\n\nShe'd done it. She'd actually done it.\n\nBut as the reality sank in, so did the weight of the decision ahead. Her mom needed her here. Her little brother looked up to her. And then there was Alex, who'd finally asked her out last month.\n\nHer phone rang. Her mom.\n\n"Honey, whatever that letter says, I'm proud of you. And if it's yes... you have to go. You have to chase your dreams, even if it scares you. Especially if it scares you."\n\nMaya wiped her tears. "Mom, I got in."\n\n"Then pack your bags, baby. The world is waiting for you."`,

            `The first day of senior year should have been normal. Should have been about seeing friends, complaining about classes, planning for prom.\n\nInstead, Ethan stood in front of his locker, staring at the photo taped inside. His dad, in his Army uniform, smiling. The photo was from before the deployment. Before everything changed.\n\n"Hey, man." His friend Marcus appeared beside him. "You okay?"\n\nEthan closed the locker. "Yeah. Just... it's weird, you know? Last first day of high school. Dad always said he'd be here for this."\n\n"He's here," Marcus said quietly. "Maybe not physically, but—"\n\n"It's not the same." Ethan's voice was sharper than he intended. "Sorry. I just... everyone's talking about college and the future, and I can't even think past today."\n\nMarcus nodded. "Then don't. Just get through today. Then tomorrow. That's all you have to do."\n\nThe bell rang. Students rushed past them, laughing and chatting, living their normal lives.\n\nEthan took a deep breath. "One day at a time."\n\n"One day at a time," Marcus agreed. "And hey, we're in this together. You're not alone, man."\n\nAs they walked to class, Ethan felt something shift. Maybe he couldn't control the future. But he could control today. And today, he had friends who had his back.`
        ],

        Drama: [
            `The hospital room was quiet except for the steady beep of monitors. Margaret sat beside her mother's bed, holding a hand that felt too fragile, too small.\n\n"I'm sorry," her mother whispered, her voice barely audible. "For everything. For not being the mother you needed."\n\nMargaret felt tears sting her eyes. They'd had this conversation in her head a thousand times over the years. But now that it was happening, she didn't know what to say.\n\n"Mom—"\n\n"No, let me finish. Please." Her mother's grip tightened slightly. "I was so focused on my own pain, my own struggles, that I didn't see yours. I didn't see how much you needed me."\n\n"You did your best," Margaret said, though the words felt hollow. They'd been estranged for five years. Five years of missed birthdays, holidays, moments that could never be recovered.\n\n"My best wasn't good enough." Her mother's eyes filled with tears. "But I'm asking now... can you forgive me? Not for my sake, but for yours. Don't carry this anger into your future."\n\nMargaret looked at the woman who'd given her life, who'd failed her in so many ways, who was now asking for grace she wasn't sure she could give.\n\nBut as she sat there, feeling her mother's hand in hers, she realized something. Forgiveness wasn't about forgetting. It was about choosing to let go of the weight she'd been carrying.\n\n"I forgive you, Mom," she whispered. "I forgive you."`,

            `The divorce papers sat on the kitchen table between them, unsigned.\n\n"Fifteen years," David said quietly. "Fifteen years, and it comes down to this."\n\nLisa stared at the papers, her pen hovering over the signature line. "We tried, David. We really tried."\n\n"Did we?" He looked up at her, his eyes red. "Or did we just go through the motions? When did we stop fighting for us?"\n\n"When fighting became all we did," Lisa replied, her voice breaking. "I can't remember the last time we had a conversation that didn't end in an argument."\n\n"Last Tuesday," David said. "We talked about Emma's school play. We laughed about her forgetting her lines. We were us, for five minutes."\n\nLisa remembered. It had felt like a glimpse of who they used to be, before the stress and the resentment built up like walls between them.\n\n"Five minutes in fifteen years isn't enough," she said, but her hand still hadn't moved to sign.\n\n"Then let's make it ten minutes. Then an hour. Then a day." David reached across the table. "I'm not saying it'll be easy. I'm not saying we won't have to work harder than we ever have. But Lisa... I'm not ready to give up on us. Are you?"\n\nLisa looked at his hand, then at the papers, then back at him. The choice was hers.`
        ],

        'Historical Fiction': [
            `The year was 1942, and the world was at war. But in the small village of Saint-Michel, life continued in the shadow of occupation.\n\nMarie clutched the false identity papers to her chest as she walked through the checkpoint. The German soldier barely glanced at her, waving her through with a bored expression.\n\nShe'd made it. Again.\n\nIn her bag, hidden beneath vegetables from the market, were three more sets of papers. Three more Jewish families who would have a chance to escape.\n\nShe'd been doing this for eight months now, ever since the Nazis had taken her brother. Every forged document, every successful smuggling operation, was a small act of resistance. A way to fight back.\n\nBut the risks were getting higher. Last week, the Gestapo had arrested the baker who'd been helping her. She didn't know if he'd talked, didn't know if her name was on a list somewhere.\n\nAs she turned the corner toward the safe house, she saw them. Two Gestapo officers, standing outside the door.\n\nMarie's heart stopped. She forced herself to keep walking, to not run, to not look suspicious.\n\n"You there," one of the officers called out. "Stop."\n\nMarie turned, her mind racing through her cover story, her hands steady despite her terror.\n\n"Yes, officer?" she asked in perfect German, her accent flawless.\n\n"You dropped this." He held out a potato that had fallen from her bag.\n\nMarie took it, smiled, and walked away. But she knew her luck wouldn't hold forever.`
        ],

        Spiritual: [
            `The monastery bells rang at dawn, calling the monks to prayer. Brother Thomas had heard them every morning for twenty years, but today they sounded different. Clearer. More urgent.\n\nHe made his way to the chapel, his bare feet cold on the stone floor. The other monks were already there, kneeling in silent meditation.\n\nBut as Thomas knelt, something shifted. The chapel seemed to fade away, replaced by a vision of light so bright it should have blinded him, but instead brought perfect clarity.\n\nA voice spoke, not in words but in pure understanding: "The path you seek is not in these walls."\n\nThomas gasped, the vision fading as quickly as it had come. The other monks continued their prayers, unaware of what had just happened.\n\nFor twenty years, Thomas had sought enlightenment through isolation, through discipline, through denial of the world. But the vision had shown him something else—that true spiritual growth came not from running away from the world, but from engaging with it.\n\nHe looked around the chapel, at the life he'd built, the community he'd found. It had served its purpose. It had taught him discipline, compassion, mindfulness.\n\nBut it was time to leave.\n\nAs the morning prayers ended, Thomas approached the Abbot. "Father, I need to speak with you. It's time for me to return to the world."\n\nThe Abbot smiled, as if he'd been expecting this. "Then go with our blessing, Brother Thomas. Your journey is just beginning."`
        ],

        Biography: [
            `The interview room was small, the recorder sat between us, its red light blinking steadily.\n\n"Tell me about the day everything changed," I asked.\n\nDr. Patel smiled, but it didn't reach her eyes. "Which day? There were so many. But I suppose you mean the day I decided to leave everything behind and start the clinic."\n\nShe paused, gathering her thoughts. "I was working at one of the best hospitals in the country. Making six figures. Had a beautiful apartment, a car, respect. Everything I'd worked for since I was a child in that small village in India."\n\n"So why leave?"\n\n"Because I'd forgotten why I became a doctor in the first place." She leaned forward. "I watched my mother die because we couldn't afford treatment. I promised myself I'd make sure no one else had to go through that. But there I was, turning away patients who couldn't pay, while I drove a BMW."\n\nShe shook her head. "The day I left, I gave away everything except what I could fit in a suitcase. I went back to that village where my mother died, and I opened a free clinic. People thought I was crazy."\n\n"Were you?"\n\n"Maybe. But twenty years later, that one clinic has become fifty. We've treated over a million patients. And I sleep better at night than I ever did in that expensive apartment."\n\n"Any regrets?"\n\n"Only one," she said softly. "That I didn't do it sooner."`
        ],

        'Self-Help': [
            `Chapter ${chapterNumber}: The Power of Small Changes\n\nYou don't need to transform your entire life overnight. In fact, trying to do so is often the fastest path to failure.\n\nConsider this: If you improve by just 1% each day, by the end of the year, you'll be 37 times better than when you started. That's the power of compound growth, and it applies to personal development just as much as it does to finance.\n\nThe key is consistency, not intensity.\n\nLet me share a story. I once worked with a client—let's call her Sarah—who wanted to completely overhaul her life. She was going to wake up at 5 AM, meditate for an hour, exercise for two hours, eat perfectly, read for an hour, and journal every night.\n\nShe lasted three days.\n\nWhen she came back to me, frustrated and defeated, I asked her one question: "What's the smallest change you could make that would move you in the right direction?"\n\nShe thought about it. "I could drink a glass of water when I wake up instead of immediately checking my phone."\n\n"Perfect," I said. "Do that for a week. Nothing else. Just that one thing."\n\nShe did. And once that became automatic, we added another small change. Then another.\n\nSix months later, Sarah had transformed her life—not through one massive change, but through dozens of tiny ones, each building on the last.\n\nThat's what this chapter is about: identifying the small changes that will create big results in your life.`
        ],

        Poetry: [
            `Whispers of the Dawn\n\nIn the quiet hours before light,\nWhen stars still hold their ancient vigil,\nI find myself between the night\nAnd day, in moments most tranquil.\n\nThe world sleeps on, unknowing, still,\nWhile I commune with silent thought,\nAnd feel the gentle morning chill\nThat speaks of battles yet unfought.\n\nFor in this space between the dark\nAnd coming day, I find my truth—\nThat every ending leaves its mark,\nAnd every dawn restores our youth.\n\nThe sun will rise, as sure as breath,\nAnd paint the sky in gold and red,\nReminding us that after death\nComes life, and hope, and days ahead.\n\nSo let me linger here awhile,\nIn this sacred, liminal space,\nAnd greet the morning with a smile,\nEmbracing change with gentle grace.\n\n---\n\nReflections on Time\n\nTime is not a river flowing,\nNot a thief that steals our days,\nBut a garden we are growing,\nWith our choices, words, and ways.\n\nEvery moment is a seed\nThat we plant in fertile ground,\nEvery thought and every deed\nShapes the harvest to be found.\n\nSo plant with care and tend with love\nThe garden of your fleeting years,\nFor what you sow will rise above\nThe soil of doubts and fears.`
        ]
    };

    // Get content for the genre, or use a default
    const genreContent = contentTemplates[genre] || contentTemplates['Adventure'];

    // Select content based on chapter number (cycle through available content)
    const contentIndex = (chapterNumber - 1) % genreContent.length;
    const selectedContent = genreContent[contentIndex];

    // Add chapter header and footer
    const fullContent = `Chapter ${chapterNumber}: ${getChapterTitle(chapterNumber, genre)}\n\n${selectedContent}\n\n---\n\nEnd of Chapter ${chapterNumber}\n\nThe story of "${bookTitle}" continues in the next chapter...`;

    return fullContent;
};

// Helper function to generate chapter titles based on genre
const getChapterTitle = (chapterNumber, genre) => {
    const titles = {
        Romance: ['First Glances', 'Unexpected Feelings', 'The Confession', 'Complications', 'The Choice'],
        Thriller: ['The Discovery', 'Shadows Closing In', 'The Betrayal', 'Race Against Time', 'The Truth Revealed'],
        Fantasy: ['The Awakening', 'Ancient Secrets', 'The Quest Begins', 'Trials of Magic', 'Destiny Calls'],
        'Science Fiction': ['First Contact', 'The Anomaly', 'System Failure', 'Beyond the Stars', 'The Future Unfolds'],
        Mystery: ['The Crime Scene', 'Following Clues', 'A Suspect Emerges', 'The Missing Piece', 'The Solution'],
        Horror: ['The First Sign', 'Growing Dread', 'The Revelation', 'Trapped', 'Survival'],
        'Historical Fiction': ['A Time of Change', 'Secrets of the Past', 'The Resistance', 'Turning Point', 'Legacy'],
        'Young Adult': ['New Beginnings', 'Finding Your Voice', 'The Challenge', 'Growth', 'Moving Forward'],
        Drama: ['The Confrontation', 'Hidden Truths', 'Breaking Point', 'Healing', 'Resolution'],
        Adventure: ['The Journey Begins', 'Into the Unknown', 'Danger Strikes', 'The Discovery', 'Triumph'],
        Comedy: ['The Setup', 'Things Go Wrong', 'The Mishap', 'Chaos Ensues', 'The Punchline'],
        Biography: ['Early Years', 'The Turning Point', 'Overcoming Obstacles', 'Achievement', 'Legacy'],
        'Self-Help': ['Understanding the Problem', 'The Solution', 'Taking Action', 'Building Habits', 'Transformation'],
        Poetry: ['Morning Verses', 'Afternoon Reflections', 'Evening Thoughts', 'Night Whispers', 'Eternal Themes'],
        Spiritual: ['The Call', 'The Journey Within', 'Enlightenment', 'The Practice', 'Inner Peace']
    };

    const genreTitles = titles[genre] || titles['Adventure'];
    return genreTitles[(chapterNumber - 1) % genreTitles.length];
};

module.exports = {
    genres,
    bookTitles,
    authorNames,
    generateDescription,
    generateChapterContent
};

// Load environment variables
import "dotenv/config";

// drizzle and db access
import { insertNote, insertNoteChunks, searchNoteChunksForUser } from "@/features/notes/db";

// services, features, and other libraries
import { generateNoteEmbeddings } from "@/features/notes/lib/embeddings";

// Example notes (different topics, some with multiple paragraphs)
const notes = [
  {
    title: "Grocery List",
    content: `My grocery list for today is:
- Apples
- Bananas
- Chicken breast
- Rice
- Milk
- Eggs
- Spinach
- Tomatoes
- Bread
- Cheese

I also want to remember to buy some coffee and maybe some chocolate as a treat.

This week I’m trying to focus on healthy meals, so I plan to make salads and stir-fries using fresh vegetables. I also need ingredients for a few quick breakfast ideas like oatmeal and smoothies.

On top of that, I need some pantry staples like olive oil, salt, pepper, and some spices that have run out. Planning ahead will save me from multiple trips to the store and reduce food waste.`,
  },
  {
    title: "Favorite Color",
    content: `My favorite color is red.
I’ve always felt that red gives me energy and motivation. It’s vibrant, bold, and makes me feel more confident in my daily tasks.

Interestingly, when I was younger, my favorite color used to be blue. But over the years, red has grown on me. I think it resonates with my personality more as I’ve matured.

Red also appears in my home décor, clothes, and even in some of my work materials. I find that surrounding myself with red elements keeps me energized and focused.

I think I like it because it feels bold and powerful. Psychologically, red can increase attention and heart rate, and I like that subtle stimulation.`,
  },
  {
    title: "Jogging Routine",
    content: `I should be jogging more.

Recently, I’ve been too busy with work and haven’t exercised enough. I can feel my stamina dropping. My doctor also reminded me that cardio exercise is important for heart health, so I need to be more consistent.

My plan is to jog three times per week, even if just for 20 minutes. It doesn’t have to be a marathon — consistency is more important. I also want to track my distance and pace using a running app to monitor progress.

Jogging in the morning feels refreshing, especially when the sun is rising. I enjoy listening to music or podcasts while jogging. Sometimes, I plan routes near parks or rivers to make the experience more pleasant.

In the long term, I hope to build endurance and make jogging a habit. I might even consider signing up for a 5K run later this year as a personal goal.`,
  },
] as const;

async function main() {
  try {
    // console.log(await searchNoteChunksForUser("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", "what foods should I buy?"));
    // console.log(await searchNoteChunksForUser("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", "what is my favorite color?"));
    // console.log(await searchNoteChunksForUser("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", "how often do I jog?"));
    console.log(await searchNoteChunksForUser("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", "what is my name?"));
    process.exit(0);
    return;
    // Perform database seeding or other tasks
    console.log("Seeding notes and chunks...");

    for (const { title, content } of notes) {
      // Insert note into database
      const [{ id: noteId }] = await insertNote("yLWyVGaBlCa7v27qfYk5DyyYiZqNXxqP", { title, content });

      // Generate embeddings for chunks
      const noteEmbeddings = await generateNoteEmbeddings(content);

      // Insert chunks into DB
      await insertNoteChunks(noteId, noteEmbeddings);

      console.log(`Seeded note "${title}" with ${noteEmbeddings.length} chunks`);
    }

    console.log("Seeding complete ✅");
    process.exit(0);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

// Execute the main function
main();

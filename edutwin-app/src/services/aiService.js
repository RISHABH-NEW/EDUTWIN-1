// AI Service Abstraction Layer
// Currently uses mock responses. Replace functions with real API calls later.

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const explanations = {
  recursion: {
    simple: "Think of recursion like looking at yourself in two mirrors facing each other — you see yourself inside yourself, inside yourself, and so on. In programming, a function calls itself to solve a smaller version of the same problem, until it hits a 'base case' (the smallest version it can solve directly).",
    example: `Here's a simple example — counting down:

function countdown(n) {
  if (n <= 0) {         // Base case
    console.log("Go!");
    return;
  }
  console.log(n);       // Do something
  countdown(n - 1);     // Recursive call
}

countdown(3);
// Output: 3, 2, 1, Go!

Each call waits for the next one to finish, like stacking plates. When the base case is reached, they all resolve in reverse order.`,
    hindi: "Recursion को समझने के लिए, सोचिए कि आप एक बड़ी समस्या को छोटी-छोटी समस्याओं में तोड़ रहे हैं। जैसे — अगर आपको 5! (factorial) निकालना है, तो आप कहेंगे: 5! = 5 × 4!, और 4! = 4 × 3!, और ऐसे ही जब तक 1! = 1 नहीं आ जाता। यह 'base case' है जहाँ recursion रुकता है।",
    hinglish: "Recursion matlab ek function khud ko call karta hai. Jaise agar tumhe factorial nikalna hai 5 ka, toh function kehta hai: 'Main 5 × factorial(4) return karunga.' Phir factorial(4) kehta hai: 'Main 4 × factorial(3) return karunga.' Yeh tab tak chalta hai jab tak base case nahi aa jata (factorial(1) = 1). Phir sab results wapas aate hain: 1 → 2 → 6 → 24 → 120.",
    quiz: {
      question: "What will this function return?\n\nfunction mystery(n) {\n  if (n <= 0) return 0;\n  return n + mystery(n - 1);\n}\n\nmystery(4)",
      answer: "The answer is 10! Let me trace through it:\n\nmystery(4) = 4 + mystery(3)\n           = 4 + 3 + mystery(2)\n           = 4 + 3 + 2 + mystery(1)\n           = 4 + 3 + 2 + 1 + mystery(0)\n           = 4 + 3 + 2 + 1 + 0\n           = 10\n\nThis function calculates the sum of numbers from 1 to n. It's similar to the formula n(n+1)/2 = 4(5)/2 = 10 ✓"
    }
  },
  default: {
    simple: "Let me break this down in simple terms for you...",
    example: "Here's a practical example to help you understand...",
    hindi: "चलिए इसे सरल हिंदी में समझते हैं...",
    hinglish: "Chalo isko simple tarike se samajhte hain...",
    quiz: {
      question: "Here's a quick question to test your understanding...",
      answer: "Great attempt! Let me explain the solution..."
    }
  }
};

const topicResponses = {
  'binary search': "Binary Search is a divide-and-conquer algorithm that finds elements in a sorted array by repeatedly halving the search space.\n\n**How it works:**\n1. Compare the target with the middle element\n2. If target equals middle → Found!\n3. If target < middle → Search left half\n4. If target > middle → Search right half\n5. Repeat until found or search space is empty\n\n**Time Complexity:** O(log n) — much faster than linear search O(n)\n\n**Key requirement:** The array MUST be sorted.",
  'sorting': "Let me compare the main sorting algorithms:\n\n| Algorithm | Best | Average | Worst | Space |\n|-----------|------|---------|-------|-------|\n| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |\n\n**For interviews:** Know Merge Sort and Quick Sort thoroughly!",
  'dynamic programming': "Dynamic Programming (DP) solves complex problems by breaking them into overlapping subproblems.\n\n**Two approaches:**\n1. **Top-down (Memoization)** — Start from the main problem, cache results\n2. **Bottom-up (Tabulation)** — Build solution from smallest subproblems\n\n**Classic example — Fibonacci:**\n```\n// Without DP: O(2ⁿ) 😰\nfib(n) = fib(n-1) + fib(n-2)\n\n// With DP: O(n) 🚀\ndp[0] = 0, dp[1] = 1\nfor i = 2 to n:\n  dp[i] = dp[i-1] + dp[i-2]\n```\n\n**Key pattern:** If a problem has optimal substructure + overlapping subproblems → use DP!",
};

export const aiService = {
  async analyzeStudent(studentData) {
    await delay(500);
    return {
      overallMastery: 78,
      strongAreas: ['Data Structures', 'Programming', 'Physics'],
      weakAreas: ['Algebra', 'Calculus', 'Time Management'],
      learningStyle: 'Visual + Practice-Oriented',
      recommendation: 'Focus on Mathematical foundations to unlock advanced CS topics.',
    };
  },

  async generateExplanation(topic, mode = 'simple') {
    await delay(800 + Math.random() * 700);
    
    const topicKey = topic.toLowerCase();
    
    // Check for specific topic responses
    for (const [key, response] of Object.entries(topicResponses)) {
      if (topicKey.includes(key)) {
        return response;
      }
    }
    
    // Check for explanation modes
    if (topicKey.includes('recursion')) {
      const data = explanations.recursion;
      switch (mode) {
        case 'simple': return data.simple;
        case 'example': return data.example;
        case 'hindi': return data.hindi;
        case 'hinglish': return data.hinglish;
        case 'quiz': return `**Quick Quiz!**\n\n${data.quiz.question}`;
        default: return data.simple;
      }
    }

    // Generic responses based on mode
    const genericResponses = {
      simple: `Great question about **${topic}**! Let me explain this concept in simple terms.\n\n${topic} is a fundamental concept that you'll encounter frequently. The key idea is to understand the underlying principles and practice applying them to different problems.\n\n**Key Points:**\n1. Start with the basic definition\n2. Understand why it's important\n3. Practice with examples\n4. Apply to real problems\n\nWould you like me to go deeper into any specific aspect?`,
      example: `Here's a practical example of **${topic}**:\n\nImagine you're solving a real-world problem. ${topic} helps you approach it systematically.\n\n**Step 1:** Identify the problem type\n**Step 2:** Apply the concept\n**Step 3:** Verify your solution\n\nLet me know if you'd like another example!`,
      hindi: `**${topic}** को समझते हैं:\n\nयह एक महत्वपूर्ण concept है जो आपकी problem-solving skills को बेहतर बनाता है। इसे step-by-step समझना ज़रूरी है।\n\n**मुख्य बातें:**\n1. पहले basic definition समझें\n2. फिर examples से practice करें\n3. फिर problems solve करें\n\nक्या आप और detail में जानना चाहेंगे?`,
      hinglish: `Chalo **${topic}** ko samajhte hain!\n\nYeh ek important concept hai jo bahut jagah use hota hai. Isko samajhne ke liye step-by-step approach best hai.\n\n**Simple steps:**\n1. Pehle definition samjho\n2. Phir ek example dekho\n3. Phir khud try karo\n\nKoi doubt ho toh poocho!`,
      quiz: `**Quick Quiz on ${topic}!** 🎯\n\nLet me test your understanding:\n\nQ: What is the main purpose of ${topic}?\n\nThink about it and share your answer. I'll help you understand if you're on the right track!`,
    };

    return genericResponses[mode] || genericResponses.simple;
  },

  async generateQuiz(topic) {
    await delay(600);
    return {
      question: `What is the time complexity of the most common ${topic} algorithm?`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correct: 2,
    };
  },

  async detectMisconception(topic, answer) {
    await delay(400);
    return {
      hasMisconception: true,
      explanation: `It seems like you might be confusing ${topic} with a related concept. Let me clarify the key difference...`,
      suggestion: 'Try reviewing the fundamental definition first, then attempt the problem again.',
    };
  },

  async generateRecommendation(studentData) {
    await delay(500);
    return [
      'Focus on Quadratic Equations — your mastery is below 50%',
      'Practice Binary Trees to strengthen your DSA skills',
      'Take the Laws of Motion quiz to test your physics understanding',
      'Review Recursion concepts before attempting Dynamic Programming',
    ];
  },

  async generateStudyPlan(studentData) {
    await delay(700);
    return {
      plan: 'Your optimized study plan has been generated based on your weak areas and upcoming assessments.',
      schedule: [
        { day: 'Monday', focus: 'Mathematics — Quadratic Equations', hours: 2 },
        { day: 'Tuesday', focus: 'Computer Science — Binary Trees', hours: 2.5 },
        { day: 'Wednesday', focus: 'Physics — Laws of Motion', hours: 2 },
      ],
    };
  },

  async recommendCareer(studentData) {
    await delay(600);
    return {
      topMatch: 'Software Engineer',
      matchPercentage: 87,
      reasoning: 'Your strong programming skills and growing DSA proficiency align well with software engineering roles.',
    };
  },

  async chat(message, history = []) {
    await delay(600 + Math.random() * 800);
    
    const msg = message.toLowerCase();
    
    // Check specific topics
    if (msg.includes('recursion')) {
      return explanations.recursion.simple + "\n\nWould you like me to show you an example, or explain in Hindi/Hinglish?";
    }
    
    for (const [key, response] of Object.entries(topicResponses)) {
      if (msg.includes(key)) {
        return response;
      }
    }

    // Context-aware responses
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello Priyanshu! 👋 I'm your EduTwin AI Tutor. I can help you with:\n\n• **Explaining concepts** in any subject\n• **Solving problems** step by step\n• **Quizzing you** on topics\n• **Study planning** and recommendations\n\nWhat would you like to learn today?";
    }
    
    if (msg.includes('help') || msg.includes('what can you do')) {
      return "I can help you with many things! Here's what I can do:\n\n🧠 **Explain Concepts** — Ask me about any topic\n📝 **Practice Questions** — I'll quiz you and provide feedback\n🗺️ **Study Planning** — I'll suggest what to study next\n💡 **Solve Doubts** — Ask me any question\n🌐 **Multiple Languages** — I can explain in English, Hindi, or Hinglish\n\nTry asking: \"Explain recursion\" or \"Quiz me on sorting algorithms\"";
    }

    if (msg.includes('weak') || msg.includes('improve') || msg.includes('struggle')) {
      return "Based on your learning data, here are your areas for improvement:\n\n📊 **Areas to Focus On:**\n1. **Quadratic Equations** (48% mastery) — Needs immediate attention\n2. **Calculus** (55% mastery) — Practice more problems\n3. **Recursion** (68% mastery) — Strengthen base case understanding\n\n**My recommendation:** Start with Quadratic Equations. I can explain the quadratic formula step-by-step. Want me to start?";
    }

    if (msg.includes('plan') || msg.includes('schedule') || msg.includes('study')) {
      return "Here's a suggested study plan based on your performance:\n\n📅 **This Week's Priority:**\n• **Mon:** Quadratic Equations (2 hrs) — Focus on discriminant\n• **Tue:** Binary Trees (2.5 hrs) — Traversal algorithms\n• **Wed:** Laws of Motion (2 hrs) — Problem solving\n• **Thu:** Technical Writing (1.5 hrs) — Practice essays\n• **Fri:** Recursion (2 hrs) — Fibonacci & factorial\n\nWant me to adjust this plan?";
    }

    if (msg.includes('quiz') || msg.includes('test') || msg.includes('practice')) {
      return "Let's do a quick quiz! 🎯\n\n**Question:** What is the time complexity of accessing an element in an array by index?\n\nA) O(n)\nB) O(log n)\nC) O(1)\nD) O(n²)\n\nTake your time and share your answer!";
    }

    if (msg.includes('thank')) {
      return "You're welcome, Priyanshu! 😊 Remember, consistent practice is the key to mastery. Your 12-day streak shows great dedication!\n\nAnything else you'd like to learn?";
    }

    // Default intelligent response
    return `That's a great question about "${message}"! Let me help you understand this.\n\n**Key Points:**\n1. This is an important concept in your curriculum\n2. Understanding the fundamentals will help you solve related problems\n3. Practice is essential for mastery\n\nWould you like me to:\n• Explain this concept in **simple terms**?\n• Show you a **practical example**?\n• **Quiz you** on this topic?\n• Explain in **Hindi** or **Hinglish**?\n\nJust let me know! 🚀`;
  },
};

export default aiService;

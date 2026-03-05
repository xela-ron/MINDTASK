export const GEMINI_API_KEY = "AIzaSyDemo_key_replace_with_real"; // 🔑 Replace with your actual key

const WELLNESS_RESPONSES = [
  {
    triggers: ["overwhelm", "too much", "stressed", "stress", "anxious", "anxiety", "panic"],
    response: "I hear you — feeling overwhelmed is genuinely exhausting. 💙 Let's take this one step at a time. What's the single thing weighing on you the most right now? Sometimes naming it out loud makes it feel a little smaller.",
  },
  {
    triggers: ["tired", "exhausted", "burnt out", "burnout", "drained", "no energy"],
    response: "Burnout is real and it's serious. Your body and mind are sending you a signal. 🌿 Have you been able to take any breaks today? Even 5 minutes away from screens can genuinely reset your nervous system.",
  },
  {
    triggers: ["can't focus", "distracted", "procrastinat", "can't start", "don't know where", "where to start"],
    response: "Trouble focusing is so common when tasks feel big or uncertain. 🎯 Try the 2-minute rule — if something takes less than 2 minutes, do it now. For bigger tasks, just commit to starting for 5 minutes. Often that's all the momentum you need.",
  },
  {
    triggers: ["sad", "lonely", "down", "depressed", "hopeless", "empty", "worthless"],
    response: "Thank you for sharing that with me. 💛 Feeling low is part of being human, but you don't have to sit with it alone. Is there someone you trust that you could reach out to today? And please remember — it's okay to not be okay.",
  },
  {
    triggers: ["happy", "great", "amazing", "excited", "wonderful", "feeling good", "good today"],
    response: "That's so wonderful to hear! 🌟 Positive energy is worth celebrating. What's been going well for you? Recognizing your wins — even small ones — is one of the best things you can do for your mental health.",
  },
  {
    triggers: ["deadline", "due date", "late", "behind", "behind schedule", "running out of time"],
    response: "Deadline pressure is intense — I get it. Take one slow breath first. 🌬️ Then write down just the next 3 actions you need to take. Not everything, just 3. What would those be?",
  },
  {
    triggers: ["sleep", "insomnia", "can't sleep", "sleeping", "tired but wired"],
    response: "Sleep struggles affect everything — mood, focus, energy, relationships. 🌙 Try dimming your screens an hour before bed and avoid reviewing tasks or emails at night. Your mind needs explicit permission to rest. You've done enough today.",
  },
  {
    triggers: ["angry", "frustrated", "mad", "irritated", "annoyed"],
    response: "Frustration is a signal that something matters to you. 🔥 It's okay to feel it. Try naming the feeling out loud: 'I feel frustrated because...' — this tiny act of labeling actually calms your nervous system. What's at the root of it?",
  },
  {
    triggers: ["hello", "hi", "hey", "hiya", "howdy"],
    response: "Hey there! 👋 So glad you opened MindEase. How are you feeling today — honestly? Whether it's work stress, personal stuff, or just a general blah, I'm here to listen.",
  },
];

export function getWellnessResponse(msg) {
  const lower = msg.toLowerCase();
  for (const item of WELLNESS_RESPONSES) {
    if (item.triggers.some(t => lower.includes(t))) return item.response;
  }
  return "I'm here with you. 🤍 Whatever you're carrying right now is valid. Would you like to talk about what's on your mind, or would it help to slow down and just list what's making things feel heavy?";
}

export async function getAIResponse(userMessage, userName) {
  const systemPrompt = `You are MindEase, a warm, empathetic mental health support companion embedded in a productivity app called MindTask. The user's name is ${userName}. Your role is to provide emotional support, wellness advice, and help users cope with work-related stress and overwhelm. Be concise (2-4 sentences max), genuinely warm, and practically helpful. Use occasional gentle emojis. Never give clinical diagnoses. Always encourage professional help for serious concerns.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }] }],
        }),
      }
    );
    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || getWellnessResponse(userMessage);
  } catch {
    return getWellnessResponse(userMessage);
  }
}

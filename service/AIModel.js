import { GoogleGenerativeAI } from "@google/generative-ai";
import mime from "mime-types";

// Get the API key from the environment variable
const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Use a valid model ID for your project
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",  // Updated model name (use a valid model from the API docs)
});

// Define the generation configuration
const generationConfig = {
  temperature: 1,  // Controls randomness (higher value = more randomness)
  topP: 0.95,      // Cumulative probability of token choices
  topK: 40,        // Limits the number of highest probability tokens to consider
  maxOutputTokens: 8192,  // Limits the length of the generated output
  responseMimeType: "text/plain",  // Expecting plain text response
};

// Create a chat session using the generative model
const chatSession = model.startChat({
  generationConfig,
  history: [],  // You can store previous conversation here to create context
});

// Function to send the prompt and process the response
export const generateSummaries = async (jobTitle) => {
  // Improved prompt with clear instructions for JSON format
  const prompt = `Job Title: ${jobTitle}
  
  Create 3 professional summaries for a resume for this job title at different experience levels: Junior, Mid-Level, and Senior.
  Each summary should be 3-4 lines long and highlight appropriate skills and experiences for that level.
  
  Format your response as a JSON array with each object having exactly these fields:
  - experience_level: The experience level (Junior, Mid-Level, or Senior)
  - summary: The professional summary text
  
  IMPORTANT: Ensure your response is ONLY valid JSON array with no additional text before or after.`;
  
  try {
    // Send the message to the AI model
    const result = await chatSession.sendMessage(prompt);
    
    // Get the response text
    const responseText = result.response.text();
    console.log("Raw response:", responseText);
    
    // Try to extract and parse JSON from the response
    try {
      // First attempt: direct parsing
      const aiSummaries = JSON.parse(responseText);
      return aiSummaries;
    } catch (parseError) {
      console.log("Direct parsing failed, trying to extract JSON", parseError);
      
      // Second attempt: try to find JSON in the text response using regex
      const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          return extractedJson;
        } catch (extractError) {
          console.error("Extracted JSON parsing failed:", extractError);
        }
      }
      
      // Third attempt: create structured data manually from text response
      const fallbackData = [];
      const levels = ["Junior", "Mid-Level", "Senior"];
      
      // Simple parsing based on experience level keywords
      let currentLevel = null;
      let currentSummary = "";
      const lines = responseText.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // Check if line contains an experience level
        const levelMatch = levels.find(level => 
          trimmedLine.includes(level) || 
          trimmedLine.toLowerCase().includes(level.toLowerCase())
        );
        
        if (levelMatch) {
          // Save previous summary if exists
          if (currentLevel && currentSummary) {
            fallbackData.push({
              experience_level: currentLevel,
              summary: currentSummary.trim()
            });
          }
          
          // Start new summary
          currentLevel = levelMatch;
          currentSummary = "";
        } else if (currentLevel && !trimmedLine.includes('"experience_level"') && 
                   !trimmedLine.includes('"summary"') && 
                   !trimmedLine.match(/^\s*[\[\]\{\},]\s*$/)) {
          // Append line to current summary if it's not JSON syntax
          currentSummary += " " + trimmedLine;
        }
      }
      
      // Add the last summary if exists
      if (currentLevel && currentSummary) {
        fallbackData.push({
          experience_level: currentLevel,
          summary: currentSummary.trim()
        });
      }
      
      // Return manually parsed data if we found anything
      if (fallbackData.length > 0) {
        return fallbackData;
      }
      
      // Last resort: create placeholder data
      return [
        {
          experience_level: "Junior",
          summary: "Detail-oriented professional with foundational knowledge in " + jobTitle + ". Eager to apply academic training and developing skills to contribute to team goals while growing expertise in the field."
        },
        {
          experience_level: "Mid-Level",
          summary: "Experienced " + jobTitle + " with proven track record of delivering quality results. Combines technical expertise with collaborative approach to solve complex problems and drive project success."
        },
        {
          experience_level: "Senior",
          summary: "Seasoned " + jobTitle + " with extensive industry experience leading teams and projects. Strategic thinker who leverages deep domain knowledge to optimize processes and mentor junior staff while driving innovation."
        }
      ];
    }
  } catch (error) {
    console.error("Error generating summaries:", error);
    return [];
  }
};

// Handle any inline data from the model (optional)
export const handleInlineData = (candidates) => {
  if (!candidates) return;
  
  for (let candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++) {
    for (let partIndex = 0; partIndex < candidates[candidateIndex].content.parts.length; partIndex++) {
      const part = candidates[candidateIndex].content.parts[partIndex];
      if (part.inlineData) {
        try {
          // Create a Blob and trigger a download in the browser
          const mimeType = part.inlineData.mimeType;
          const blob = new Blob([new Uint8Array(part.inlineData.data)], { type: mimeType });
          const url = URL.createObjectURL(blob);
         
          // Create a temporary anchor element to trigger the download
          const link = document.createElement('a');
          link.href = url;
          link.download = `output_${candidateIndex}_${partIndex}.${mime.extension(mimeType)}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);  // Clean up the object URL
          console.log(`Output written as a file.`);
        } catch (err) {
          console.error("Error handling inline data:", err);
        }
      }
    }
  }
};
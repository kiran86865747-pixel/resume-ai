export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resume, jobDescription } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an ATS resume analyzer.",
          },
          {
            role: "user",
            content: `Analyze this resume:\n${resume}\n\nJob Description:\n${jobDescription}\n\nGive ATS score (out of 100), missing keywords, and suggestions.`,
          },
        ],
      }),
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

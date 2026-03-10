export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("ERROR: ANTHROPIC_API_KEY is not set");
    return res.status(500).json({ error: "API key not configured" });
  }

  console.log("API key present, length:", apiKey.length);

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    console.log("Sending to Anthropic, model:", body?.model, "messages count:", body?.messages?.length);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Anthropic status:", response.status, "error type:", data?.error?.type, "error msg:", data?.error?.message);
    return res.status(response.status).json(data);
  } catch (err) {
    console.log("Caught exception:", err.message);
    return res.status(500).json({ error: "Failed to reach Anthropic API", detail: err.message });
  }
}

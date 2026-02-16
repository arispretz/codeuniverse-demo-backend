import { runFastapiReplyCodeOnly } from "../services/fastapiModelRunner.js";

export const generateCodeReplyOnly = async (req, res) => {
  const { prompt, language, code, user_id } = req.body;
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const response = await runFastapiReplyCodeOnly({ prompt, language, code, user_id, token });
    res.json({ code: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

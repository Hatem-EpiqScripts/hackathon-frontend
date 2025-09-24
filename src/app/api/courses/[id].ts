import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      const backendRes = await fetch(`http://localhost:3000/courses/${id}`, {
        method: "DELETE",
      });

      if (!backendRes.ok) {
        const error = await backendRes.json();
        return res
          .status(backendRes.status)
          .json({ message: error.message || "Failed to delete course" });
      }

      return res.status(204).end(); // No content on successful delete
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

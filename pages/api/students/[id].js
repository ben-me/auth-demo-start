import connectDB from "../_db/connect";
import Student from "../_db/models/student";
import { getToken } from "next-auth/jwt";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const user = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (!user) {
        return res.status(401).json({ message: "unauthorized" });
      }
      const student = await Student.findById(req.query.id).exec();
      if (student.githubUserName !== user.email) {
        return res.status(401).json({ message: "unauthorized" });
      }
      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
};

export default connectDB(handler);

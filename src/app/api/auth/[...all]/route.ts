import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

const { POST, GET } = toNextJsHandler(auth);

export { POST, GET };
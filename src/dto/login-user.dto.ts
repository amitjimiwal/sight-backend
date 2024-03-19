import { z } from "zod";
const loginUser = z.object({
     email: z.string().email(),
     password: z.string(),
});
type loginuserDTO = z.infer<typeof loginUser>;
export { loginuserDTO,loginUser};
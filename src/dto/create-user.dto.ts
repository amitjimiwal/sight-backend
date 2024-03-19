import { z } from "zod";
const CreateUserDto = z.object({
     email: z.string().email(),
     name: z.string(),
     password: z.string(),
});
type createuserdto = z.infer<typeof CreateUserDto>;
export { createuserdto,CreateUserDto};
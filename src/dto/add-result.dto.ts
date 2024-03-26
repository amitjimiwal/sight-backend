import { z } from "zod";
const addResultDto = z.object({
     score: z.number().max(100).min(0),
     accuracy: z.number().max(100).min(0),
     duration: z.number(),
});
type addresultDto = z.infer<typeof addResultDto>;
export { addResultDto,addresultDto};
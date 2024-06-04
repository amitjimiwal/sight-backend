//Cron jobs to remove unverified users from the database every 24 hours

import prisma from "../db/dbconfig.js";

async function deleteUnverifiedUsersJob(){
     //find all  unverified users
     try {
          //we have used onDelete cascade referential action that automatically delete all the referenced fields to the user on Deleting the user
          await prisma.user.deleteMany({
               where:{
                    isEmailVerified:false
               },
          })
     } catch (error) {
          console.log("Error while deleting unverified users:  ",error);
     }
}
export default deleteUnverifiedUsersJob;
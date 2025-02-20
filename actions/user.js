"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
export async function updateUser(data){
  const {userId} = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(
      async (tx)=> {
         //find if the industry exists
         let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
         })
    // if industry doesn't exits create it with deafult values - will replace it with ai later
    if(!industryInsight){
      industryInsight=await tx.industryInsight.create({
        data: {
          industry: data.industry,
          salaryRanges: [],
          growthRate: 0,
          demandLevel: "Medium",
          topSkills:[],
          marketOutlook: "Neutral",
          keyTrends:[],
          recommendedSkills:[],
          nextUpdate:new Date(Date.now()+7*24*60*60*1000),
        },
      });
    }
    //update the user

      },
      {
        timeout: 10000,
      }
    );
   return result.user;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}
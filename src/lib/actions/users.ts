'use server'
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { MongoClient, ObjectId } from "mongodb";

export const updateUserRole = async (userId, role) => {
    try {
        const client = new MongoClient(process.env.MONGO_DB_URI);
        const db = client.db(process.env.AUTH_DB_NAME || "rent_desh_db");
        const userCollection = db.collection("user");

        let query = { _id: userId };
        try {
            if (ObjectId.isValid(userId)) {
                query = { _id: new ObjectId(userId) };
            }
        } catch (e) {}

        const result = await userCollection.updateOne(
            query,
            { $set: { role: role } }
        );

        revalidatePath('/dashboard/admin/users');
        return { success: true, modifiedCount: result.modifiedCount };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, error: error.message };
    }
}
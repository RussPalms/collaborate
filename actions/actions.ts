"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
	auth().protect(); // Ensure the user is authenticated

	try {
		const { sessionClaims } = await auth();
		console.log("Session Claims:", sessionClaims);

		const docCollectionRef = adminDb.collection("documents");
		const docRef = await docCollectionRef.add({ title: "New Doc" });
		console.log("Document Reference:", docRef.id);

		await adminDb
			.collection("users")
			.doc(sessionClaims?.email!)
			.collection("rooms")
			.doc(docRef.id)
			.set({
				userId: sessionClaims?.email!,
				role: "owner",
				createdAt: new Date(),
				roomId: docRef.id,
			});
		console.log("Document Created and User Added");

		return { docId: docRef.id };
	} catch (error) {
		console.error("Error creating new document:", error);
		throw error; // Re-throw the error after logging it
	}
}

export async function inviteUserToDocument(roomId: string, email: string) {
	auth().protect(); // Ensure the user is authenticated

	try {
		console.log("Invite User to Document:", roomId, email);

		await adminDb
			.collection("users")
			.doc(email)
			.collection("rooms")
			.doc(roomId)
			.set({
				userId: email,
				role: "editor",
				createdAt: new Date(),
				roomId,
			});
		console.log("User Invited");

		return { success: true };
	} catch (error) {
		console.error("Error inviting user to document:", error);
		return { success: false };
	}
}

export async function removeUserFromDocument(roomId: string, email: string) {
	auth().protect(); // Ensure the user is authenticated

	try {
		console.log("Remove User from Document:", roomId, email);

		await adminDb
			.collection("users")
			.doc(email)
			.collection("rooms")
			.doc(roomId)
			.delete();
		console.log("User Removed");

		return { success: true };
	} catch (error) {
		console.error("Error removing user from document:", error);
		return { success: false };
	}
}

export async function deleteDocument(roomId: string) {
	auth().protect(); // Ensure the user is authenticated

	try {
		console.log("Delete Document:", roomId);

		await adminDb.collection("documents").doc(roomId).delete();
		console.log("Document Deleted");

		const query = await adminDb
			.collectionGroup("rooms")
			.where("roomId", "==", roomId)
			.get();
		console.log("Rooms Query:", query);

		const batch = adminDb.batch();
		query.docs.forEach((doc) => {
			batch.delete(doc.ref);
		});
		await batch.commit();
		console.log("Batch Commit Done");

		await liveblocks.deleteRoom(roomId);
		console.log("Liveblocks Room Deleted");

		return { success: true };
	} catch (error) {
		console.error("Error deleting document:", error);
		return { success: false };
	}
}

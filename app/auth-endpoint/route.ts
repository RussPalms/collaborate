import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import liveblocks from "@/lib/liveblocks";

export async function POST(req: NextRequest) {
	auth().protect(); // Ensure the user is authenticated

	const { userId, sessionClaims } = await auth();
	console.log("userId", userId);
	const { room } = await req.json();
	console.log("room", room);
	console.log("sessionClaims:\n", sessionClaims);

	try {
		const session = await liveblocks.prepareSession(sessionClaims?.email!, {
			userInfo: {
				name: sessionClaims?.fullName!,
				email: sessionClaims?.email!,
				avatar: sessionClaims?.image!,
			},
		});
		console.log("session:\n", session);

		const usersInRoom = await adminDb
			.collectionGroup("rooms")
			.where("userId", "==", sessionClaims?.email)
			.get();

		console.log("usersInRoom(0):\n", usersInRoom);

		const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

		console.log("userInRoom(1):\n", userInRoom);

		if (userInRoom?.exists) {
			session.allow(room, session.FULL_ACCESS);
			const { body, status } = await session.authorize();

			console.log("userInRoom(2):\n", userInRoom);

			return new Response(body, { status });
		} else {
			console.log("usersInRoom(3):\n", usersInRoom);
			return NextResponse.json(
				{ message: "You are not in this room" },
				{ status: 403 }
			);
		}
	} catch (error) {
		console.error(
			"Error during Liveblocks session preparation or Firestore access:",
			error
		);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

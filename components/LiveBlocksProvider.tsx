"use client";
import { LiveblocksProvider } from "@liveblocks/react/suspense";

function LiveBlocksProvider({ children }: { children: React.ReactNode }) {
	if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
		throw new Error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set");
	}

	console.log("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is set");

	return (
		<LiveblocksProvider
			// publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY}
			throttle={16}
			authEndpoint={"/auth-endpoint"}
		>
			{children}
		</LiveblocksProvider>
	);
}

export default LiveBlocksProvider;

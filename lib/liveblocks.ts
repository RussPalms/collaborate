import { Liveblocks } from "@liveblocks/node";

const key = process.env.LIVEBLOCKS_PRIVATE_KEY;

if (!key) {
	console.log("there is no key");
	throw new Error("LIVEBLOCKS_PRIVATE_KEY is not set");
}

console.log("key is set");

const liveblocks = new Liveblocks({
	secret: key,
});

export default liveblocks;

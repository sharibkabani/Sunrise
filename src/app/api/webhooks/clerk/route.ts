import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
	const SIGNING_SECRET = process.env.SIGNING_SECRET;

	if (!SIGNING_SECRET) {
		throw new Error(
			"Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
		);
	}

	// Create new Svix instance with secret
	const wh = new Webhook(SIGNING_SECRET);

	// Await headers
	const headerPayload = await headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error: Missing Svix headers", {
			status: 400,
		});
	}

	// Get body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	let evt: WebhookEvent;

	// Verify payload with headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error: Could not verify webhook:", err);
		return new Response("Error: Verification error", {
			status: 400,
		});
	}

	// Handle user.created event
	if (evt.type === "user.created") {
		const { id, email_addresses, username } = evt.data;

        console.log("User created:", id, email_addresses[0].email_address, username);

		// Insert new user into Supabase
		const { error } = await supabase.from("users").insert([
			{
				id,
				email: email_addresses[0].email_address,
				username,
			},
		]);

		if (error) {
			console.error("Error inserting user into Supabase:", error);
			return new Response("Error inserting user into Supabase", {
				status: 500,
			});
		}
	} else if (evt.type === "user.updated") {
        const { id, email_addresses, username } = evt.data;

        console.log("User updated:", id, email_addresses[0].email_address, username);

        // Update user in Supabase
        const { error } = await supabase.from("users").update({
            email: email_addresses[0].email_address,
            username,
        }).eq("id", id);

        if (error) {
            console.error("Error updating user in Supabase:", error);
            return new Response("Error updating user in Supabase", {
                status: 500,
            });
        }
    }

	return new Response("Webhook received", { status: 200 });
}

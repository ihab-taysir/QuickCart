import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    // Import DB and Model dynamically to avoid build-time serialization issues
    const connectDB = (await import("./db")).default;
    const User = (await import("@/models/user")).default;

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageURL: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

// Inngest Function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const connectDB = (await import("./db")).default;
    const User = (await import("@/models/user")).default;

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      imageURL: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest Function to delete user data from the database
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const connectDB = (await import("./db")).default;
    const User = (await import("@/models/user")).default;

    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

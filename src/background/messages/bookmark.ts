import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

interface Bookmark {
  id: string;
  videoId: string;
  name: string;
  time: number; // in seconds
  createdAt: string;
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { action, data } = req.body as { action: string; data: Bookmark };

  switch (action) {
    case "ADD_BOOKMARK":
      try {
        const bookmarks: Bookmark[] = (await storage.getItem("bookmarks")) || [];
        bookmarks.push(data);
        await storage.setItem("bookmarks", bookmarks);
        res.send({ success: true, data: bookmarks });
      } catch (error) {
        res.send({ success: false, error: (error as Error).message });
      }
      break;
    case "GET_BOOKMARKS":
      try {
        const bookmarks: Bookmark[] = (await storage.getItem("bookmarks")) || [];
        res.send({ success: true, data: bookmarks });
      } catch (error) {
        res.send({ success: false, error: (error as Error).message });
      }
      break;
    case "UPDATE_BOOKMARK":
      try {
        const bookmarks: Bookmark[] = (await storage.getItem("bookmarks")) || [];
        const index = bookmarks.findIndex((bookmark) => bookmark.id === data.id);
        if (index === -1) {
          res.send({ success: false, error: "Bookmark not found" });
          return;
        }
        bookmarks[index] = data;
        await storage.setItem("bookmarks", bookmarks);
        res.send({ success: true });
      } catch (error) {
        res.send({ success: false, error: (error as Error).message });
      }
      break;
    case "DELETE_BOOKMARK":
      try {
        const bookmarks: Bookmark[] = (await storage.getItem("bookmarks")) || [];
        const index = bookmarks.findIndex((bookmark) => bookmark.id === data.id);
        if (index === -1) {
          res.send({ success: false, error: "Bookmark not found" });
          return;
        }
        bookmarks.splice(index, 1);
        await storage.setItem("bookmarks", bookmarks);
        res.send({ success: true, data: bookmarks });
      } catch (error) {
        res.send({ success: false, error: (error as Error).message });
      }
      break;
    default:
      res.send({ success: false, error: "Invalid action" });
  }
};

export default handler;

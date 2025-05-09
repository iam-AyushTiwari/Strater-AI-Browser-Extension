import { openDB, type IDBPDatabase } from "idb";

interface ScheduleItem {
  _id: string;
  title: string;
  time: string;
  duration: number;
  status: string;
  date: string;
  video: string;
  videoId: string;
  isCompleted: boolean;
}

const DB_NAME = "scheduleDB";
const STORE_NAME = "schedules";
const DB_VERSION = 1; // Increment this version if you change the schema

export const initDB = async (): Promise<IDBPDatabase> => {
  try {
    const open_db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "_id" });
        }
      },
    });
    return open_db;
  } catch (error) {
    console.error("Failed to initialize the database:", error);
    throw error;
  }
};

export const getAllSchedules = async (): Promise<ScheduleItem[]> => {
  try {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error("Failed to fetch all schedules:", error);
    throw error;
  }
};

export const addSchedule = async (schedule: ScheduleItem) => {
  try{const db = await initDB();
  // Initiate a transaction for the store with readwrite mode
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.put(schedule); // Add or update the schedule
  await tx.done; // Wait for the transaction to complete
  } catch (error) {
    console.error("Failed to add schedule:", error);
    throw error;
  }
};

export const updateSchedule = async (schedule: ScheduleItem): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.put(schedule); // Use `put` to update the record
    await tx.done;
  } catch (error) {
    console.error("Failed to update schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (_id: string): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.delete(_id); // Delete the record by `_id`
    await tx.done;
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    throw error;
  }
};
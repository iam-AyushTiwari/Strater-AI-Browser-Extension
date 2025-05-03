const storage = new Storage();
import { Storage } from "@plasmohq/storage";

const callAPI = async <T = any>(url: string, options: {method?: string, body?: any} = {}) => {
    const token = await storage.get("token");

    const response = await fetch(url, {
        method: options.method || "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = (await response.json()) as T;

    return data;
}

export default callAPI

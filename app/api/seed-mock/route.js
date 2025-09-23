import dbConnect, { closeConnection } from "@/lib/dbConnect";

export async function GET() {
  const db = await dbConnect();
  try {
    const collection = db.collection("sales");

    // sales mock data
    const salesData = [
      { product: "Widget A", sales: 120, date: new Date("2025-01-01") },
      { product: "Gadget B", sales: 85, date: new Date("2025-01-01") },
      { product: "Widget A", sales: 150, date: new Date("2025-02-01") },
      { product: "Gadget B", sales: 95, date: new Date("2025-02-01") },
      { product: "Widget A", sales: 170, date: new Date("2025-03-01") },
      { product: "Gadget B", sales: 100, date: new Date("2025-03-01") },
      { product: "Widget A", sales: 200, date: new Date("2025-04-01") },
      { product: "Gadget B", sales: 120, date: new Date("2025-04-01") },
      { product: "Widget A", sales: 210, date: new Date("2025-05-01") },
      { product: "Gadget B", sales: 140, date: new Date("2025-05-01") },
      { product: "Widget A", sales: 250, date: new Date("2025-06-01") },
      { product: "Gadget B", sales: 160, date: new Date("2025-06-01") },
      { product: "Widget A", sales: 240, date: new Date("2025-07-01") },
      { product: "Gadget B", sales: 175, date: new Date("2025-07-01") },
      { product: "Widget A", sales: 260, date: new Date("2025-08-01") },
      { product: "Gadget B", sales: 180, date: new Date("2025-08-01") },
      { product: "Widget A", sales: 300, date: new Date("2025-09-01") },
      { product: "Gadget B", sales: 190, date: new Date("2025-09-01") },
      { product: "Widget A", sales: 310, date: new Date("2025-10-01") },
      { product: "Gadget B", sales: 200, date: new Date("2025-10-01") },
      { product: "Widget A", sales: 290, date: new Date("2025-11-01") },
      { product: "Gadget B", sales: 210, date: new Date("2025-11-01") },
      { product: "Widget A", sales: 330, date: new Date("2025-12-01") },
      { product: "Gadget B", sales: 220, date: new Date("2025-12-01") },
    ];

    await collection.deleteMany({});
    const result = await collection.insertMany(salesData);

    // inserting electronics items into eletronics collection.
    const collection2 = db.collection("electronics");
    const electronicsData = [
      { product: "Laptop", sales: 150, date: new Date("2025-01-01") },
      { product: "Mouse", sales: 220, date: new Date("2025-01-01") },
      { product: "Keyboard", sales: 90, date: new Date("2025-01-01") },
      { product: "Monitor", sales: 75, date: new Date("2025-01-01") },
      { product: "Laptop", sales: 180, date: new Date("2025-01-02") },
      { product: "Mouse", sales: 250, date: new Date("2025-01-02") },
      { product: "Keyboard", sales: 110, date: new Date("2025-01-02") },
      { product: "Monitor", sales: 90, date: new Date("2025-01-02") },
      { product: "Laptop", sales: 160, date: new Date("2025-01-03") },
      { product: "Mouse", sales: 240, date: new Date("2025-01-03") },
      { product: "Keyboard", sales: 115, date: new Date("2025-01-03") },
      { product: "Monitor", sales: 100, date: new Date("2025-01-03") },
      { product: "Laptop", sales: 170, date: new Date("2025-01-04") },
      { product: "Mouse", sales: 210, date: new Date("2025-01-04") },
      { product: "Keyboard", sales: 130, date: new Date("2025-01-04") },
      { product: "Monitor", sales: 85, date: new Date("2025-01-04") },
      { product: "Laptop", sales: 190, date: new Date("2025-01-05") },
      { product: "Mouse", sales: 230, date: new Date("2025-01-05") },
      { product: "Keyboard", sales: 120, date: new Date("2025-01-05") },
      { product: "Monitor", sales: 95, date: new Date("2025-01-05") },
      { product: "Laptop", sales: 200, date: new Date("2025-01-06") },
      { product: "Mouse", sales: 220, date: new Date("2025-01-06") },
      { product: "Keyboard", sales: 125, date: new Date("2025-01-06") },
      { product: "Monitor", sales: 105, date: new Date("2025-01-06") },
    ];
    await collection2.deleteMany({});
    const result2 = await collection2.insertMany(electronicsData);

    return Response.json({
      success: true,
      message: "Successfully populated sales data into database",
      sales: `${result.insertedCount} sales documents were inserted.`,
      electronics: `${result2.insertedCount} eletronics items were inserted.`
    });
  } catch (error) {
    console.error("Faced error during populating database.");
  } finally {
    await closeConnection();
  }
}

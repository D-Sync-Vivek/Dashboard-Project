import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const db = await dbConnect();
    const data = await db.collection('dashboard').find({}).toArray();
    return Response.json({
      success: true,
      error: false,
      message: "Successfully fetched data.",
      data,
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      error: true,
      message: "failed to fetch data.",
    });
  }
}

export async function POST(request) {
  try {
    const db = await dbConnect();
    const body = await request.json();
    const result = await db.collection('dashboard').insertOne(body);
    

    return Response.json({
      success: true,
      error: false,
      message: "Data added successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      error: true,
      message: "Failed to add data",
    });
  }
}

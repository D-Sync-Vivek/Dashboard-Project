import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const db = await dbConnect();
    // Total Sales.
    const totalSalesResult = await db
      .collection("sales")
      .aggregate([{ $group: { _id: null, total: { $sum: "$sales" } } }])
      .toArray();
    const totalSales =
      totalSalesResult.length > 0 ? totalSalesResult[0].total : 0;

    // Monthly Sales
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const totalMonthlySales = await db
      .collection("sales")
      .aggregate([
        { $group: { _id: { $month: "$date" }, total: { $sum: "$sales" } } },
      ])
      .toArray();

      const totalMonthlySalesWithNames = totalMonthlySales.map(item => ({
        Month: monthNames[item._id - 1],
        totalSales: item.total
      }))

    // Product sales.
    const productSales = await db
      .collection("sales")
      .aggregate([{ $group: { _id: "$product", total: { $sum: "$sales" } } }])
      .toArray();

    const productSalesWithProduct = productSales.map(item => ({
        product: item._id,
        totalSales: item.total
    }))

    // Product share.
    const productSaleswithShare = productSales.map((product) => ({
      product: product._id,
      totalSales: product.total,
      share: totalSales > 0 ? (product.total / totalSales) * 100 : 0,
    }));

    return Response.json({
      success: true,
      error: false,
      total: totalSales,
      monthlySales: totalMonthlySalesWithNames,
      productSales: productSalesWithProduct,
      productShare: productSaleswithShare,
    });
  } catch (error) {
    console.error("Error found", error);
    return new Response(
      JSON.stringify({ success: false, error: true, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

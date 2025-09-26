import dbConnect from "@/lib/dbConnect";

export async function GET(request) {
  try {
    const db = await dbConnect();

    // Search Params
    const url = request.nextUrl;
    const from = parseInt(url.searchParams.get("from")) || 1;
    const to = parseInt(url.searchParams.get("to")) || 12;

    const matchStage = {
      $match: {
        $expr: {
          $and: [
            { $gte: [{ $month: "$date" }, from] },
            { $lte: [{ $month: "$date" }, to] },
          ],
        },
      },
    };

    // Total Sales in range.
    const totalSalesResult = await db
      .collection("sales")
      .aggregate([matchStage, 
        { $group: { _id: null, total: { $sum: "$sales" } } }
      ])
      .toArray();
    const totalSales =  totalSalesResult.length > 0 ? totalSalesResult[0].total : 0;

    // Monthly Sales
    const monthNames = [
      "Jan","Feb","Mar", "Apr", "May", "Jun",
      "Jul","Aug","Sep", "Oct", "Nov", "Dec",
    ];

    const totalMonthlySales = await db
      .collection("sales")
      .aggregate([
        matchStage,
        {$group: {_id: {$month: "$date"}, total: {$sum: "$sales"}}},
        {$sort: {"_id": 1}}
      ]).toArray();

    const totalMonthlySalesWithNames = totalMonthlySales.map((item) => ({
      month: monthNames[item._id - 1],
      totalSales: item.total,
    }));
    // sort the month.
    totalMonthlySalesWithNames.sort((a, b) => {
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
    });

    // Product sales.
    const productSales = await db
      .collection("sales")
      .aggregate([matchStage,
        { $group: { _id: "$product", total: { $sum: "$sales" } } },
      ])
      .toArray();

    const productSalesWithProduct = productSales.map((item) => ({
      product: item._id,
      totalSales: item.total,
    }));

    // Product share.
    const productSaleswithShare = productSales.map((product) => ({
      product: product._id,
      totalSales: product.total,
      share:
        totalSales > 0 ? Math.round((product.total / totalSales) * 100) : 0,
    }));


    // Average sales
    const avg = Math.round(totalSales/ totalMonthlySales.length);

    return Response.json({
      success: true,
      error: false,
      total: totalSales,
      monthlySales: totalMonthlySalesWithNames,
      productSales: productSalesWithProduct,
      productShare: productSaleswithShare,
      average: avg,
    });
  } catch (error) {
    console.error("Error found", error);
    return new Response(
      JSON.stringify({ success: false, error: true, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

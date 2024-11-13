const cron = require("node-cron");
const Product = require("../models/product");

cron.schedule("0 0 * * *", async () => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const products = await Product.find();

    for (const product of products) {
      const recentSales = product.sales.filter(
        (sale) => sale.date >= oneDayAgo
      );
      const totalQuantity = recentSales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      );

      if (totalQuantity > 5 && !product.isTrending) {
        product.isTrending = true;
        await product.save();
      } else if (totalQuantity <= 5 && product.isTrending) {
        product.isTrending = false;
        await product.save();
      }
    }

    console.log("Cron job completed: Trending status updated for products.");
  } catch (error) {
    console.error("Error updating trending products:", error);
  }
});

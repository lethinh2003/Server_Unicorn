const ProductRepository = require("../models/repositories/product.repository");
const PRODUCT_SELECTION = {
  list: "-__v -product_description -product_sizes -product_categories",
};
const PRODUCT_POPULATION = {
  list: [
    {
      path: "product_color",
      select: "-_id -status -createdAt -updatedAt -__v",
    },
    {
      path: "product_categories",
      select: "-_id product_category_keyword product_category_name",
    },
    {
      path: "product_sale_event",
      select: "-_id -status -createdAt -updatedAt -__v",
    },
    {
      path: "product_sizes.size_type",
      select: "-_id -status",
    },
  ],
};
const checkAvailableProduct = async ({ productId, productSize, productQuantities, options = {} }) => {
  const result = await ProductRepository.findOne({
    query: {
      _id: productId,
    },
  });
  if (!result) {
    return false;
  }
  const findProductSize = result?.product_sizes?.filter((item) => item.size_type.toString() === productSize.toString())[0];
  if (!findProductSize) {
    return false;
  }
  if (findProductSize.size_quantities < productQuantities) {
    return false;
  }

  return true;
};

const increseQuantityProduct = async ({ productId, productSize, productQuantities, options = {} }) => {
  const result = await ProductRepository.findOneAndUpdate({
    query: {
      _id: productId,
      "product_sizes.size_type": productSize,
    },
    update: { $inc: { "product_sizes.$.size_quantities": productQuantities * 1 } },
    options,
  });
  return result;
};

const getChildFromParentListProduct = async ({ category, gender, color, size, limitItems, skipItems, sort = "-createdAt" }) => {
  let query = {
    status: true,
    product_gender: gender,
  };
  if (category !== "all") {
    query.product_categories = category;
  }
  if (color !== "all") {
    query.product_color = color;
  } else {
    query.$or = [{ parent_product_id: null }, { parent_product_id: undefined }];
  }
  if (size !== "all") {
    query.product_sizes = { $elemMatch: { size_type: size } };
  }

  const findParentProducts = await ProductRepository.find({
    query,
    limit: limitItems,
    skip: skipItems,
    sort,
    select: PRODUCT_SELECTION.list,
    populate: PRODUCT_POPULATION.list,
  });

  if (color !== "all") {
    return findParentProducts;
  }

  const productPromises = findParentProducts.map(async (product) => {
    const listChildProducts = await ProductRepository.findAll({
      query: {
        parent_product_id: product._id,
        status: true,
      },
      select: PRODUCT_SELECTION.list,
      populate: PRODUCT_POPULATION.list,
    });

    return {
      ...product,
      child_products: listChildProducts,
    };
  });
  const results = await Promise.all(productPromises);
  return results;
};

module.exports = { increseQuantityProduct, checkAvailableProduct, getChildFromParentListProduct };

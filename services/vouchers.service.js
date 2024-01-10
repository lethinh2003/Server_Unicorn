"use strict";

const VoucherRepository = require("../models/repositories/voucher.repository");
const Fuse = require("fuse.js");

const LIMIT_ITEMS = 10;
class VouchersService {
  static getUserVouchers = async ({ itemsOfPage = LIMIT_ITEMS, userId, page = 1, search = "" }) => {
    const limitItems = itemsOfPage * 1;
    const currentPage = page * 1;
    const skipItems = (currentPage - 1) * limitItems;
    // Update Expired Vouchers
    await VoucherRepository.updateExpiredVouchers({ userId });
    // Find list vouchers
    const results = await VoucherRepository.find({
      query: {
        user: userId,
        status: true,
      },
      limit: limitItems,
      skip: skipItems,
      sort: "expired_date",
    });
    const countAllItems = await VoucherRepository.countDocuments({
      query: {
        user: userId,
        status: true,
      },
    });

    const fuseOptions = {
      threshold: 0.1,
      keys: ["discount", "code", "description"],
    };

    const fuse = new Fuse(results, fuseOptions);
    let lastResults = [];
    if (search) {
      lastResults = fuse.search(search).flatMap((item) => item.item);
    } else {
      lastResults = fuse._docs;
    }
    return { lastResults, countAllItems, limitItems, currentPage };
  };

  ///
}
module.exports = VouchersService;

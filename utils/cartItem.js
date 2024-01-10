// filter products invalid
const removeInvalidProducts = ({ listCartItems }) => {
  const results = listCartItems.filter((item) => {
    if (item.data.product !== null) {
      if (item.data.product.status === false) {
        return false;
      }
      return true;
    }
    return false;
  });
  return results;
};

module.exports = {
  removeInvalidProducts,
};

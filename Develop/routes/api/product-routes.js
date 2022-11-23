const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all productsproduct
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const allProducts = await Product.findAll({
      include: [{ model: Category }, { model: Tag }]
    })
    res.status(200).json(allProducts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const theProductId = await Product.findOne({
      where: { id: req.params.id },
      include: [{ model: Category }, { model: Tag }]
    })
    res.status(200).json(theProductId)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  const newProuct = new Product({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock
  })

  // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  try {
    if (req.body.tag_id) {
      const productTagIdArr = req.body.tag_id.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        }
      })
      return ProductTag.bulkCreate(productTagIdArr)
    } else {
      // if no product tags, just respond
      res.status(200).json(productTagIdArr)
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      ProductTag.findAll({
        where: { product_id: req.params.id },
        include: [ProductTag]
      })
      return res.json(product)
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id }
    })
    res.status(200).json("Product deleted!")
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// middleware
async function getid(req, res, next) {
  let reqid
  try {
    reqid = await Category.findByPk(req.params.id)
    if (reqid == null) {
      return res.status(404).json({ message: "cannot find id" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  res.reqid = reqid
  next()
}


module.exports = router;

const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {

  try {
    // find all categories
    // be sure to include its associated Products
    const allCategories = await Category.findAll({
      include: [{ model: Product }],
    })
    res.status(200).json(allCategories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }


});

router.get('/:id', async (req, res) => {

  try {
    // find one category by its `id` value
    // be sure to include its associated Products
    const oneCategories = await Category.findOne({
      where: { id: req.params.id },
      include: [{
        model: Product,
        where: { id: req.params.id }
      }]
    })
    res.status(200).json(oneCategories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.post('/', async (req, res) => {

  try {
    const newCategory = await Category.create(req.body)
    res.status(201).json(newCategory)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

router.put('/:id', getid, async (req, res) => {
  // update a category by its `id` value

  try {
    const newCategory = await Category.update(
      { category_name: req.body.category_name },
      { where: { id: req.params.id } }
    )
    res.json(newCategory)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

});

router.delete('/:id', getid, async (req, res) => {
  // delete a category by its `id` value
  try {
    await Category.destroy({
      where: {
        id: req.params.id,
      }
    })
    res.status(200).json("catetory deleted!")
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

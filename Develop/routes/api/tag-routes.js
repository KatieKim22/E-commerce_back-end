const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const allTags = await Tag.findAll({
      include: [{ model: Product }]
    })
    res.status(200).json(allTags)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const theTagId = await Tag.findOne({
      where: { id: req.params.id },
      include: [{ model: Product }]
    })
    res.status(200).json(theTagId)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  const reqTag = new Tag({
    id: req.body.id,
    tag_name: req.body.tag_name
  })
  try {
    const newTag = await Tag.create(reqTag)
    res.status(201).json(newTag)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

router.put('/:id', getid, async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updatedTag = await Tag.update({
      id: {
        where: req.params.id
      }
    })
    res.json(updatedTag)
  } catch (err) { res.status(400).json({ message: err.message }) }
});

router.delete('/:id', getid, async (req, res) => {
  // delete on tag by its `id` value
  try {
    await Tag.destory({
      id: {
        where: req.params.id
      }
    })
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

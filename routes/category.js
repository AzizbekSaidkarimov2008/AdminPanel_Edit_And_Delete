const { Router } = require("express");
const router = Router();
const fileUpload = require("../middleware/fileUpload");
const Category = require("../models/Category");
const product = require("../models/Product");
const toDelete = require("../middleware/toDelete");

router.get("/read", async (req, res) => {
  const categories = await Category.find();

  res.render("admin/categories", {
    title: "Kategoriyalarni ko`rish",
    header: "Kategoriyalarni ko`rish",
    categories,
    layout: "main",
  });
});

router.get("/add", (req, res) => {
  res.render("admin/categoryCreate", {
    title: "Kategoriya yaratish",
    header: "Kategoriya yaratish",
    layout: "main",
  });
});

router.get("/widgets", (req, res) => {
  res.render("admin/widgets", {
    title: "Kategoriya yaratish",
    header: "Kategoriya",
    layout: "main",
  });
});

router.post("/add", fileUpload.single("categoryIcon"), async (req, res) => {
  const { categoryName, sortNumber, categorydescription } = req.body;
  const categoryIcon = req.file.filename;
  const category = new Category({
    categoryName,
    sortNumber,
    categoryIcon,
    categorydescription,
  });
  await category.save();
  res.redirect("/admin/category/read");
});

// router.get("/edit/:id", async (req, res) => {
//     const categories = await Category.findById(req.params.id);
//     res.render("admin/edit", {
//         categories,
//         layout: "main",
//     });
// });

router.get("/edit/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  console.log(category);
  res.render("admin/categoryEdit", {
    category,
    header: "Kategoriyalni yangilash",
    title: "Kategoriyalarni yaratish",
    layout: "main",
  });
});

router.post(
  "/edit/:id",
  fileUpload.single("categoryIcon"),
  async (req, res) => {
    const { categoryIcon } = await Category.findById(req.params.id);
    const category = req.body;

    if (req.file) {
      toDelete(categoryIcon);
      category.categoryIcon = req.file.filename;
    }
    console.log(category);
    await Category.findByIdAndUpdate(req.params.id, category, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/admin/category/read");
      }
    });
  }
);

router.get("/delete/:id", async (req, res) => {
  const { categoryIcon } = await Category.findById(req.params.id);
  await Category.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      toDelete(categoryIcon);
      res.redirect("/admin/category/read");
    }
  });
});

// router.post("/edit/:id", async (req, res) => {
//     console.log(req.body);
//     const { categoryName, sortNumber, categorydescription } = req.body
//     // const asd = req.body
//     await Category.findByIdAndUpdate(req.params.id, {
//         categoryName,
//         sortNumber,
//         categorydescription
//     }, (err) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.redirect('/admin/category/read')
//         }
//     })
// })

// router.get('/delete/:id', async (req, res) => {
//     await Category.findByIdAndDelete(req.params.id)
//     res.redirect('/admin/category/read', {
//         layout: 'main'
//     })
// })

module.exports = router;
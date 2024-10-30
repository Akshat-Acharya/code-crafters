const Category = require("../models/Category");

// create tag handler ka function

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
//getAll categories

exports.showAllCategories = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "All category fetched successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

//categoryPage handler function

exports.categoryPageDetails = async (req, res) => {
  try {
    //getCategoryId

    const { categoryId } = req.body;
    //get courses for specified id
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    //validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    //get courses for different courses
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();
    //get top selling courses

    //return
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

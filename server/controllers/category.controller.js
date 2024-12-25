import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import ProductModel from "../models/product.model.js";

export const AddCategoryController = async (request, response) => {
    try {
        const { name, image } = request.body;
        if (!name || !image) {
            return response.status(400).json({
                message: "All fields are required!",
                error: true,
                success: false
            })
        }
        const AddCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await AddCategory.save()

        if (!saveCategory) {
            return response.status(400).json({
                message: "not added",
                error: true,
                success: false
            })
        }

        return response.json({
            message: " added Category ",
            data: saveCategory,
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const getCategoryController = async (request, response) => {
    try {
        const data = await CategoryModel.find().sort({ createdAt: -1 })


        return response.json({
            data: data,
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const updateCategoryController = async (request, response) => {
    try {
        const { _id, name, image } = request.body
        const update = await CategoryModel.updateOne({
            _id: _id
        }, {
            name,
            image

        })

        return response.json({
            message: "Category updated",
            error: false,
            success: true,
            data: update
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const deleteCategoryController = async (request, response) => {
    try {
        const { _id } = request.body
        const checkSubCategory = await SubCategoryModel.findOne({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        const checkProduct = await ProductModel.findOne({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        if (checkSubCategory > 0 || checkProduct > 0) {
            return response.status(400).json({
                message: "Category is Already used",
                error: true,
                success: false
            })
        }
        const deleteCategory = await CategoryModel.deleteOne({
            _id: _id
        })
        return response.json({
            message: "Category deleted",
            error: false,
            success: true,
            data: deleteCategory
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


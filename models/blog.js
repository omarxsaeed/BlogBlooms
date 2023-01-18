const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    photo: { type: String, default: "https://via.placeholder.com/468x60" },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: { type: String, required: true },
    },
    tags: [{ type: String, required: true }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slug: { type: String, required: true, unique: true },
});

blogSchema.pre("validate", function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;

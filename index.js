const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mxrfp9v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const db = client.db("pcbuildcraft");
    const productsCollection = db.collection("products");
    const categoryCollection = db.collection("category");
    const pcBuilderCollection = db.collection("pcBuilder");

    // app.get("/products", async (req, res) => {
    //   const result = await productsCollection.find({}).toArray();
    //   res.send(result);
    // });

    // app.get("/products/:category", async (req, res) => {
    //   const category = req.params.category;
    //   const result = await productsCollection
    //     .find({ category: category })
    //     .toArray();
    //   res.send(result);
    //   console.log(result);
    // });

    // START REDUX
    //FOR REDUX IMPLEMENTATIONS
    app.post("/product", async (req, res) => {
      try {
        const product = req.body;
        const user = product?.user;
        const productCategory = product?.product?.category;
        const isExisting = await pcBuilderCollection.findOne(product);
        const isCategoryExisting = await pcBuilderCollection.findOne({
          "product.category": productCategory,
          user: user,
        });
        console.log(
          productCategory,
          "product Category",
          isExisting,
          "isExisting",
          isCategoryExisting,
          "isCategoryExisting",
          product,
          "product"
        );
        if (isExisting) {
          res.status(409).json({ message: "Product already exists" });
        }
        if (isCategoryExisting) {
          res
            .status(408)
            .json({ message: "This category Product is already exists" });
        } else {
          const result = await pcBuilderCollection.insertOne(product);
          res.send(result);
        }
      } catch (error) {
        console.error(error);
      }
    });

    app.get("/pcBuilderProducts", async (req, res) => {
      const result = await pcBuilderCollection.find({}).toArray();
      res.send(result);
    });

    //END REDUX

    app.get("/categories", async (req, res) => {
      const result = await categoryCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const integerId = parseInt(id);
      const category = await categoryCollection.findOne({
        categoryId: integerId,
      });
      res.send(category);
    });

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const result = await productsCollection.findOne({ id: id });
      res.send(result);
    });

    app.get("/cpu", async (req, res) => {
      const result = await productsCollection
        .find({ category: "CPU" })
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/motherboard", async (req, res) => {
      const result = await productsCollection
        .find({ category: "Motherboard" })
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/ram", async (req, res) => {
      const result = await productsCollection
        .find({ category: "RAM" })
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/power", async (req, res) => {
      const result = await productsCollection
        .find({ category: "Power Supply Unit" })
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/storage", async (req, res) => {
      const result = await productsCollection
        .find({ category: "Storage Device" })
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/monitor", async (req, res) => {
      const result = await productsCollection
        .find({ category: "Monitor" })
        .toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/other", async (req, res) => {
      const result = await productsCollection
        .find({ category: "Other" })
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/featured", async (req, res) => {
      const result = await productsCollection
        .find({ rating: { $gte: 4.7, $lte: 5 } })
        .sort({ rating: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });
  } finally {
  }
};
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("welcome to PCBuildCraft");
});

app.listen(port, () => {
  console.log(`PCBuildCraft app listening on port ${port}`);
});

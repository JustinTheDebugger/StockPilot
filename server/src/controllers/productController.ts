import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;

    // Validate required fields and its data types
    if (
      !productId ||
      typeof name !== "string" ||
      name.trim() === "" ||
      typeof price !== "number" ||
      typeof rating !== "number" ||
      typeof stockQuantity !== "number"
    ) {
      res
        .status(400)
        .json({ message: "Invalid input. Please check all fields." });
      return;
    }

    const product = await prisma.products.create({
      data: {
        productId,
        name: name.trim(),
        price,
        rating,
        stockQuantity,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export const ProductsRouter = router({
  createProduct: procedure
    .input(
      z.object({
        sellerId: z.number(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        inventory: z.number(),
        useSavedLocation: z.boolean().optional().default(false),
        savedLocationId: z.string().optional(),
        sendingType: z.array(z.enum(["SELLER_SENDS", "BUYER_PICKS_UP"])),
        categoryId: z.number(),
        guarantyId: z.number(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        city: z.string().optional(),
        address: z.string().min(1, "Address is required"),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.product.create({
        data: {
          sellerId: input.sellerId,
          name: input.name,
          description: input.description,
          price: input.price,
          inventory: input.inventory,
          sendingType: input.sendingType,
          categoryId: input.categoryId,
          guarantyId: input.guarantyId,
          latitude: input.latitude,
          longitude: input.longitude,
          city: input.city,
          address: input.address,
          images: input.images,
        },
      });
    }),
  getProductsByCategory: procedure
    .input(
      z.object({
        categoryId: z.number(),
        sortByPrice: z.boolean().optional(),
        city: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        return await prisma.product.findMany({
          where: {
            categoryId: input.categoryId,
            city: input.city
              ? { contains: input.city, mode: "insensitive" }
              : undefined,
          },
          include: {
            category: true,
            seller: true,
            guaranty: true,
          },
          orderBy: input.sortByPrice ? { price: "asc" } : undefined,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }
    }),

  searchProducts: procedure
    .input(
      z.object({
        query: z.string(),
        sortByPrice: z.boolean().optional(),
        city: z.string().optional(), // Add city filter
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findMany({
        where: {
          name: {
            contains: input.query,
            mode: "insensitive",
          },
          city: input.city
            ? { contains: input.city, mode: "insensitive" } // Filter by city
            : undefined,
        },
        orderBy: input.sortByPrice ? { price: "asc" } : undefined,
      });
    }),

  // Get all products (for BUYER, SELLER, or APP_MANAGER)
  getProducts: procedure
    .input(
      z.object({
        name: z.string().optional(), // Optional filter by product name
        sortByPrice: z.boolean().optional(), // Optional sorting by price
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findMany({
        where: input.name ? { name: input.name } : {},
        orderBy: input.sortByPrice ? { price: "asc" } : undefined, // Sort by price if enabled
      });
    }),
  getSellerProducts: procedure
    .input(
      z.object({
        sellerId: z.number(), // Seller ID
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findMany({
        where: {
          sellerId: input.sellerId,
        },
      });
    }),

  // Get a product by ID
  getProductById: procedure
    .input(
      z.object({
        id: z.number(), // Product ID
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          guaranty: true,
        },
      });
    }),

  // Update a product
  updateProduct: procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        inventory: z.number().optional(),
        sendingType: z
          .array(z.enum(["SELLER_SENDS", "BUYER_PICKS_UP"]))
          .optional(),
        categoryId: z.number().optional(),
        guarantyId: z.number().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        images: z.array(z.string()).optional(),
        deletedImages: z.array(z.string()).optional(), // Add this for tracking deleted images
      })
    )
    .mutation(async ({ input }) => {
      const { id, deletedImages = [], ...data } = input;

      // First delete any images marked for deletion
      if (deletedImages.length > 0) {
        // You might want to implement actual file deletion from storage here
      }

      return await prisma.product.update({
        where: { id },
        data: {
          ...data,
          images: data.images, // This will replace all images
          updatedAt: new Date(),
        },
      });
    }),
  deleteProduct: procedure
    .input(
      z.object({
        productId: z.number(), // Product ID
        sellerId: z.number(), // Seller ID
      })
    )
    .mutation(async ({ input }) => {
      // Check if the product belongs to the seller
      const product = await prisma.product.findUnique({
        where: { id: input.productId },
      });

      if (!product || product.sellerId !== input.sellerId) {
        throw new Error("You are not authorized to delete this product.");
      }

      // Delete the product
      return await prisma.product.delete({
        where: { id: input.productId },
      });
    }),
  getProductNames: procedure
    .input(
      z.object({
        query: z.string(), // Search query
      })
    )
    .query(async ({ input }) => {
      return await prisma.product
        .findMany({
          where: {
            name: {
              contains: input.query,
              mode: "insensitive", // Case-insensitive search
            },
          },
          select: {
            name: true, // Only fetch the product name
          },
          take: 5, // Limit the number of suggestions
        })
        .then((products) => products.map((p) => p.name));
    }),
  ///////////SAVED PRODUCTS
  // Save a product for a buyer
  saveProduct: procedure
    .input(
      z.object({
        buyerId: z.number(),
        productId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.savedProduct.create({
        data: {
          buyerId: input.buyerId,
          productId: input.productId,
        },
      });
    }),

  // Unsave a product for a buyer
  unsaveProduct: procedure
    .input(
      z.object({
        buyerId: z.number(),
        productId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.savedProduct.delete({
        where: {
          buyerId_productId: {
            buyerId: input.buyerId,
            productId: input.productId,
          },
        },
      });
    }),

  // Get saved products for a buyer
  getSavedProducts: procedure
    .input(z.object({ buyerId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.savedProduct.findMany({
        where: { buyerId: input.buyerId },
        include: { product: true }, // Include product details
      });
    }),
  getSimilarProducts: procedure
    .input(
      z.object({
        categoryId: z.number(),
        city: z.string().optional(),
        excludeProductId: z.number(), // To exclude the current product
        limit: z.number().optional().default(4), // Limit number of similar products
      })
    )
    .query(async ({ input }) => {
      return await prisma.product.findMany({
        where: {
          categoryId: input.categoryId,
          city: input.city
            ? { contains: input.city, mode: "insensitive" }
            : undefined,
          id: { not: input.excludeProductId },
        },
        include: {
          category: true,
          seller: true,
          guaranty: true,
        },
        take: input.limit,
      });
    }),
});

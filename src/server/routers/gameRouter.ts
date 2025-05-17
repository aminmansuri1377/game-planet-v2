import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { contractTemplates } from "@/lib/contractTemplates";
// import { createTRPCRouter, protectedProcedure } from "../trpc";

const prisma = new PrismaClient();

export const gameRouter = router({
  // Register a new user with a role
  // registerUser: procedure
  //   .input(
  //     z.object({
  //       email: z.string().email(),
  //       name: z.string().optional(),
  //       password: z.string().min(8), // Ensure password is at least 8 characters
  //       role: z.enum([UserRole.BUYER, UserRole.SELLER, UserRole.APP_MANAGER]),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     // Hash the password
  //     const hashedPassword = await hash(input.password, 10);

  //     return await prisma.user.create({
  //       data: {
  //         email: input.email,
  //         name: input.name,
  //         password: hashedPassword, // Save the hashed password
  //         role: input.role,
  //       },
  //     });
  //   }),
  registerBuyer: procedure
    .input(
      z.object({
        phone: z
          .string()
          .length(11)
          .regex(/^\d{11}$/),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.buyer.create({
        data: {
          phone: input.phone,
        },
      });
    }),
  registerSeller: procedure
    .input(
      z.object({
        phone: z
          .string()
          .length(11)
          .regex(/^\d{11}$/),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.seller.create({
        data: {
          phone: input.phone,
        },
      });
    }),
  registerManager: procedure
    .input(
      z.object({
        phone: z
          .string()
          .length(11)
          .regex(/^\d{11}$/),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.manager.create({
        data: {
          phone: input.phone,
        },
      });
    }),
  ////////////complete profile
  completeBuyerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        IDnumber: z.string(),
        idCardImage: z.array(z.string()).optional(),
        profileImage: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        userId,
        firstName,
        lastName,
        IDnumber,
        idCardImage,
        profileImage,
      } = input;
      return await prisma.buyer.update({
        where: { id: userId },
        data: { firstName, lastName, IDnumber, idCardImage, profileImage },
      });
    }),
  photoBuyerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        profileImage: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, profileImage } = input;
      return await prisma.buyer.update({
        where: { id: userId },
        data: { profileImage },
      });
    }),
  photoSellerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        profileImage: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, profileImage } = input;
      return await prisma.seller.update({
        where: { id: userId },
        data: { profileImage },
      });
    }),
  getBuyerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      return await prisma.buyer.findUnique({
        where: { id: userId },
        select: {
          profileImage: true,
        },
      });
    }),
  getSellerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      return await prisma.seller.findUnique({
        where: { id: userId },
        select: {
          profileImage: true,
        },
      });
    }),
  completeSellerProfile: procedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        IDnumber: z.string(),
        idCardImage: z.array(z.string()).optional(),
        profileImage: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        userId,
        firstName,
        lastName,
        IDnumber,
        idCardImage,
        profileImage,
      } = input;
      return await prisma.seller.update({
        where: { id: userId },
        data: { firstName, lastName, IDnumber, idCardImage, profileImage },
      });
    }),
  confirmBuyer: procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.buyer.update({
        where: { id: input.userId },
        data: { confirmed: true },
      });
    }),

  unconfirmBuyer: procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.buyer.update({
        where: { id: input.userId },
        data: { confirmed: false },
      });
    }),

  confirmSeller: procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.seller.update({
        where: { id: input.userId },
        data: { confirmed: true },
      });
    }),

  unconfirmSeller: procedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.seller.update({
        where: { id: input.userId },
        data: { confirmed: false },
      });
    }),
  getBuyerById: procedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.buyer.findUnique({
        where: { id: input.userId },
        include: { orders: true }, // Include orders for buyers
      });
    }),

  getSellerById: procedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.seller.findUnique({
        where: { id: input.userId },
        include: { products: true, sellerOrders: true }, // Include products and orders for sellers
      });
    }),
  getSellerLocations: procedure
    .input(z.object({ sellerId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.location.findMany({
        where: { sellerId: input.sellerId },
      });
    }),
  getBuyers: procedure.query(async () => {
    return await prisma.buyer.findMany();
  }),
  getSellers: procedure.query(async () => {
    return await prisma.seller.findMany();
  }),
  getBuyersByPhone: procedure
    .input(z.object({ phone: z.string() }))
    .query(async ({ input }) => {
      return await prisma.buyer.findMany({
        where: {
          phone: {
            contains: input.phone, // Partial match
            mode: "insensitive", // Case insensitive
          },
        },
      });
    }),
  // In your gameRouter or buyerRouter file
  getSellersByPhone: procedure
    .input(z.object({ phone: z.string() }))
    .query(async ({ input }) => {
      return await prisma.seller.findMany({
        where: {
          phone: {
            contains: input.phone, // Partial match
            mode: "insensitive", // Case insensitive
          },
        },
      });
    }),
  // server/routers/productRouter.ts
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
  // Create an order (for BUYER)
  createOrder: procedure
    .input(
      z.object({
        productId: z.number(),
        userId: z.number(),
        sellerId: z.number(),
        status: z.string().default("waiting for confirmation"),
        sendingType: z.enum(["SELLER_SENDS", "BUYER_PICKS_UP"]),
        startDate: z.string().transform((val) => new Date(val)),
        endDate: z.string().transform((val) => new Date(val)),
        quantity: z.number().min(1),
        totalPrice: z.number(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.findUnique({
          where: { id: input.productId },
        });

        if (!product || product.inventory < 1) {
          throw new Error("Product is out of stock");
        }
        const order = await prisma.order.create({
          data: {
            productId: input.productId,
            userId: input.userId,
            sellerId: input.sellerId,
            status: input.status,
            sendingType: input.sendingType,
            startDate: input.startDate,
            endDate: input.endDate,
            totalPrice: input.totalPrice,
            quantity: input.quantity,
            latitude: input.latitude,
            longitude: input.longitude,
            address: input.address,
          },
          include: {
            user: true,
            seller: true,
            product: true,
          },
        });
        await prisma.product.update({
          where: { id: input.productId },
          data: {
            inventory: {
              decrement: input.quantity,
            },
          },
        });
        return order;
      });

      return result;
    }),
  // Get orders for a seller (for SELLER or APP_MANAGER)
  getSellerOrders: procedure
    .input(
      z.object({
        sellerId: z.number(),
        phone: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          sellerId: input.sellerId,
          ...(input.phone && {
            user: {
              phone: {
                contains: input.phone,
                mode: "insensitive",
              },
            },
          }),
        },
        include: {
          user: true,
          product: true,
        },
      });
    }),
  getSellerOrdersSearch: procedure
    .input(
      z.object({
        sellerId: z.number(),
        phone: z.string().optional(), // Add optional phone search
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          sellerId: input.sellerId,
          // Add phone search condition if provided
          ...(input.phone && {
            user: {
              phone: {
                contains: input.phone,
                mode: "insensitive", // Case insensitive search
              },
            },
          }),
        },
        include: {
          user: true,
          product: true,
        },
      });
    }),
  getOrders: procedure
    .input(
      z.object({
        userId: z.number(),
        productName: z.string().optional(), // Add optional product name search
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          userId: input.userId,
          ...(input.productName && {
            // Add product name filter if provided
            product: {
              name: {
                contains: input.productName,
                mode: "insensitive", // Case insensitive search
              },
            },
          }),
        },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc", // Default to newest first
        },
      });
    }),
  getOrderById: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findUnique({
        where: { id: input.id },
        include: {
          product: true,
          seller: true,
          user: true,
        },
      });
    }),
  // Update order status (for SELLER or APP_MANAGER)
  updateOrderStatus: procedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum([
          "waiting for confirmation",
          "confirmed and sent",
          "delivered",
          "taken back",
          "denied",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
  increaseProductInventory: procedure
    .input(
      z.object({
        productId: z.number(), // Product ID
      })
    )
    .mutation(async ({ input }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Increment the inventory by 1
      const updatedProduct = await prisma.product.update({
        where: { id: input.productId },
        data: {
          inventory: {
            increment: 1,
          },
        },
      });

      return updatedProduct;
    }),
  // Get all users (for APP_MANAGER)
  getAllUsers: procedure
    .input(
      z.object({
        role: z.enum(["BUYER", "SELLER", "APP_MANAGER"]).optional(), // Optional role filter
      })
    )
    .query(async ({ input }) => {
      return await prisma.user.findMany({
        where: input.role ? { role: input.role } : {}, // Filter by role if provided
      });
    }),

  // Get all orders (for APP_MANAGER)
  // getAllOrders: procedure.query(async () => {
  //   return await prisma.order.findMany({
  //     include: {
  //       user: true, // Include buyer details
  //       product: true, // Include product details
  //     },
  //   });
  // }),
  getAllOrders: procedure
    .input(
      z.object({
        phone: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.order.findMany({
        where: {
          ...(input.phone && {
            user: {
              phone: {
                contains: input.phone,
                mode: "insensitive",
              },
            },
          }),
        },
        include: {
          user: true,
          product: true,
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
  ///////////////category
  createCategory: procedure
    .input(
      z.object({
        name: z.string(),
        icon: z.string().optional(), // Base64 encoded SVG or filename
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.category.create({
        data: {
          name: input.name,
          icon: input.icon, // Store the SVG data or filename
        },
      });
    }),

  getCategories: procedure.query(async () => {
    return await prisma.category.findMany();
  }),

  getCategoryById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.category.findUnique({
        where: { id: input.id },
        include: { products: true },
      });
    }),
  //////////////////guaranty
  createGuaranty: procedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.guaranty.create({
        data: {
          text: input.text,
        },
      });
    }),

  getGuaranty: procedure.query(async () => {
    return await prisma.guaranty.findMany();
  }),
  deleteCategory: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.category.delete({
        where: { id: input.id },
      });
    }),

  deleteGuaranty: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.guaranty.delete({
        where: { id: input.id },
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
  ///////////////////comments
  addComment: procedure
    .input(
      z.object({
        productId: z.number(),
        buyerId: z.number(),
        text: z.string().min(1, "Comment cannot be empty"),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.comment.create({
        data: {
          text: input.text,
          buyerId: input.buyerId,
          productId: input.productId,
        },
      });
    }),
  getCommentsByProduct: procedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.comment.findMany({
        where: { productId: input.productId },
        include: { buyer: true }, // Include buyer details (e.g., name)
        orderBy: { createdAt: "desc" }, // Sort by newest first
      });
    }),
  deleteComment: procedure
    .input(
      z.object({
        commentId: z.number(),
        buyerId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const comment = await prisma.comment.findUnique({
        where: { id: input.commentId },
      });

      if (!comment) {
        throw new Error("Comment not found");
      }
      if (comment.buyerId !== input.buyerId) {
        throw new Error("You are not authorized to delete this comment");
      }
      return await prisma.comment.delete({
        where: { id: input.commentId },
      });
    }),
  //////////////////// chat
  getChatRooms: procedure
    .input(
      z.object({
        userType: z.enum(["BUYER", "SELLER", "MANAGER"]),
        userId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userType, userId } = input;

      return await prisma.chatRoom.findMany({
        where: {
          OR: [
            { buyerId: userType === "BUYER" ? userId : undefined },
            { sellerId: userType === "SELLER" ? userId : undefined },
            { managerId: userType === "MANAGER" ? userId : undefined },
          ],
        },
        include: {
          buyer: true,
          seller: true,
          manager: true,
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  getMessages: procedure
    .input(z.object({ chatRoomId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await prisma.message.findMany({
        where: { chatRoomId: input.chatRoomId },
        orderBy: { createdAt: "asc" },
      });
    }),

  sendMessage: procedure
    .input(
      z.object({
        chatRoomId: z.number(),
        content: z.string(),
        senderType: z.enum(["BUYER", "SELLER", "MANAGER"]),
        senderId: z.number(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.message.create({
        data: input,
      });
    }),

  createChatRoom: procedure
    .input(
      z.object({
        userType1: z.enum(["BUYER", "SELLER", "MANAGER"]),
        userId1: z.number(),
        userType2: z.enum(["BUYER", "SELLER", "MANAGER"]),
        userId2: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.chatRoom.create({
        data: {
          [input.userType1.toLowerCase() + "Id"]: input.userId1,
          [input.userType2.toLowerCase() + "Id"]: input.userId2,
        },
      });
    }),
  ////////////////////support
  createTicket: procedure
    .input(
      z.object({
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const chatRoomId = Math.floor(Math.random() * 1000000); // Generate a unique chatRoomId
      return await prisma.supportTicket.create({
        data: {
          buyerId: input.buyerId,
          sellerId: input.sellerId,
          chatRoomSupportId: chatRoomId,
        },
      });
    }),

  getTickets: procedure.query(async () => {
    return await prisma.supportTicket.findMany({
      include: {
        messages: true,
      },
    });
  }),

  getTicketById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.supportTicket.findUnique({
        where: { id: input.id },
        include: { messages: true },
      });
    }),

  sendSupportMessage: procedure
    .input(
      z.object({
        chatRoomId: z.number(),
        content: z.string(),
        senderType: z.enum(["BUYER", "SELLER", "MANAGER"]),
        senderId: z.number(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.supportMessage.create({
        data: {
          chatRoomSupportId: input.chatRoomId,
          content: input.content,
          senderType: input.senderType,
          senderId: input.senderId,
        },
      });
    }),

  getSupportMessages: procedure
    .input(z.object({ chatRoomId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.supportMessage.findMany({
        where: { chatRoomSupportId: input.chatRoomId },
        orderBy: { createdAt: "asc" },
      });
    }),
  getTicketByUserId: procedure
    .input(
      z.object({
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.supportTicket.findFirst({
        where: {
          OR: [{ buyerId: input.buyerId }, { sellerId: input.sellerId }],
          status: "OPEN", // Only return open tickets
        },
      });
    }),

  getAllTicketsByUserId: procedure
    .input(
      z.object({
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.supportTicket.findMany({
        where: {
          OR: [{ buyerId: input.buyerId }, { sellerId: input.sellerId }],
        },
        include: { messages: true }, // Include messages for each ticket
      });
    }),

  // getTicketByChatRoomId: procedure
  //   .input(z.object({ chatRoomId: z.number() }))
  //   .query(async ({ input }) => {
  //     return await prisma.supportTicket.findUnique({
  //       where: { chatRoomSupportId: input.chatRoomId },
  //       include: { messages: true },
  //     });
  //   }),
  getTicketsByManagerId: procedure
    .input(z.object({ managerId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.supportTicket.findMany({
        where: { managerId: input.managerId },
        include: {
          buyer: true, // Include buyer details
          seller: true, // Include seller details
          messages: true, // Include messages
        },
      });
    }),
  getTicketByChatRoomId: procedure
    .input(z.object({ chatRoomId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.supportTicket.findUnique({
        where: { chatRoomSupportId: input.chatRoomId },
        include: {
          buyer: true, // Include buyer details
          seller: true, // Include seller details
          messages: true, // Include messages
        },
      });
    }),
  assignTicketToManager: procedure
    .input(
      z.object({
        ticketId: z.number(),
        managerId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.supportTicket.update({
        where: { id: input.ticketId },
        data: { managerId: input.managerId },
      });
    }),
  getUnassignedTickets: procedure.query(async () => {
    return await prisma.supportTicket.findMany({
      where: { managerId: null }, // Fetch tickets with no manager assigned
      include: {
        buyer: true, // Include buyer details
        seller: true, // Include seller details
      },
    });
  }),
  closeTicket: procedure
    .input(z.object({ chatRoomId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.supportTicket.update({
        where: { chatRoomSupportId: input.chatRoomId },
        data: { status: "CLOSED" },
      });
    }),
  /////////////////personal location
  addLocation: procedure
    .input(
      z.object({
        title: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        address: z.string(),
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!input.buyerId && !input.sellerId) {
        throw new Error("Either buyerId or sellerId must be provided.");
      }

      if (input.buyerId && input.sellerId) {
        throw new Error(
          "A location cannot be linked to both a buyer and a seller."
        );
      }

      return await prisma.location.create({
        data: {
          title: input.title,
          latitude: input.latitude,
          longitude: input.longitude,
          address: input.address,
          buyerId: input.buyerId,
          sellerId: input.sellerId,
        },
      });
    }),
  getUserLocations: procedure
    .input(
      z.object({
        buyerId: z.number().optional(),
        sellerId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.buyerId && !input.sellerId) {
        throw new Error("Either buyerId or sellerId must be provided.");
      }

      return await prisma.location.findMany({
        where: {
          OR: [{ buyerId: input.buyerId }, { sellerId: input.sellerId }],
        },
      });
    }),
  deleteLocation: procedure
    .input(z.object({ locationId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.location.delete({
        where: { id: input.locationId },
      });
    }),
  getBuyerLocations: procedure
    .input(z.object({ buyerId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.location.findMany({
        where: { buyerId: input.buyerId },
      });
    }),

  getLocationById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.location.findUnique({
        where: { id: input.id },
      });
    }),
  //////////// contract
});

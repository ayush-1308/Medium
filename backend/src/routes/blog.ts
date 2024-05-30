import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@ayush__2002/medium-common";

export const blogRouter = new Hono<{
    Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    const response = await verify(authHeader, c.env.JWT_SECRET)
    if(response){
        
        c.set("userId", response.id as string)
        await next()
    } else {
        c.status(401)
        return c.json({
            error: "Unauthorized"
        })
    }
  })

blogRouter.post('/',async (c) => {
    const body = await c.req.json();
    const userId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

   const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userId,
        }
    })
    return c.json({
        id: blog.id
    })
})

blogRouter.put('/',async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);

    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const authorId = c.get("userId");

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

   const blog = await prisma.post.update({
    where: {
        id: body.id
    },
        data: {
            title: body.title,
            content: body.content
        }
    })
    return c.json({
        id: blog.id
    })
})

blogRouter.get('/search/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
    
        return c.json({
            blog
        });
    } catch(e) {
        c.status(411); // 4
        return c.json({
            message: "Error while fetching blog post"
        });
    }
})

//pagination should be added in this
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    return c.json({
        blogs
    })
})
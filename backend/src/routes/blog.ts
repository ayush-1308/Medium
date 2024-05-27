import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const blogRouter = new Hono<{
    Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const header = c.req.header("authorization")
    const token = header?.split(" ")[1]
    // @ts-ignore
    const response = await verify(header, c.env.JWT_SECRET)
    if (response.id){
     next()
    }else{
      c.status(403)
      return c.json({error: "Unauthorized"})
    }
    await next()
  })

blogRouter.post('/',async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

   const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: "1"
        }
    })
    return c.json({
        id: blog.id
    })
})

blogRouter.put('/',async (c) => {
    const body = await c.req.json();
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

blogRouter.get('/:id', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.post.findFirst({
         where: {
             id: body.id
           },
         })
         return c.json({
             blog
         })
    } catch (error) {
        return c.json({
            error: "Blog not found"
        })
    }
})

//pagination should be added in this
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    // @ts-ignore
    const page = Number(c.query.page) || 1;
    // @ts-ignore
    const pageSize = Number(c.query.pageSize) || 10;

    const blogs = await prisma.post.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
    });

    return c.json({
        blogs
    })
})
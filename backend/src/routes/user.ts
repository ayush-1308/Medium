import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { Bindings } from "hono/types";
import { signUpInput } from "../zod";


export const userRouter = new Hono<{
        Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
        }
    }>()

  userRouter.post('/signup', async (c) => {

    const body = await c.req.json();
    const {success} = signUpInput.safeParse(body)
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

if(!success){
    c.status(400)
    return c.json({error: "Invalid input"})
}
  
  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  })
  
  const token = await sign({ id: user.id}, c.env.JWT_SECRET)
  return c.json(
    {jwt: token}
  )
  })
  
  userRouter.post('/signin',async (c) => {
    const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL	,
      }).$extends(withAccelerate());
  
      const body = await c.req.json();
      const user = await prisma.user.findUnique({
          where: {
              email: body.email,
        password: body.password,
          }
      });
  
      if (!user) {
          c.status(403);
          return c.json({ error: "user not found" });
      }
  
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    // @ts-ignore
    c.res.cookie('token', jwt, { httpOnly: true, secure: true, sameSite: 'Strict' });
    c.res.json();
  })
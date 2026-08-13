import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
  const postId = parseInt(req.params.id);
  const userId = (req as Request & { user?: { id: number } }).user!.id;

  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  try {
    const [, updatedPost] = await prisma.$transaction([
      prisma.vote.create({
        data: { userId, postId },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { score: { increment: 1 } },
        select: { score: true },
      }),
    ]);

    return res.status(201).json({ score: updatedPost.score });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Already voted' });
      }
      if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Post not found' });
      }
    }
    return next(err);
  }
});

export default router;

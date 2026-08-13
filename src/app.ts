import express, { Request, Response, NextFunction } from 'express';
import postsRouter from './routes/posts';

const app = express();
app.use(express.json());

app.use((req: Request & { user?: { id: number } }, _res, next) => {
  req.user = { id: 1 };
  next();
});

app.use('/posts', postsRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Threadbase API running on http://localhost:${PORT}`);
});

export default app;

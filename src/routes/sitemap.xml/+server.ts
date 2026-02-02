// /src/routes/sitemap[[page]].xml/+server.ts
import * as sitemap from 'super-sitemap';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  return await sitemap.response({
    origin: 'https://postgreslocksexplained.com',
    page: params.page,
  });
};